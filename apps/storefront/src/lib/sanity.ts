import { createClient, type SanityClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID

function getSanityClient(): SanityClient | null {
  if (!projectId) return null
  return createClient({
    projectId,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
  })
}

const client = getSanityClient()

// Write-enabled client for mutations (create/update orders)
function getSanityWriteClient(): SanityClient | null {
  const token = process.env.SANITY_API_TOKEN
  if (!projectId || !token) return null
  return createClient({
    projectId,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
    token,
  })
}

export function urlFor(source: unknown) {
  if (!client) return { width: () => ({ height: () => ({ url: () => '' }) }) }
  const builder = imageUrlBuilder(client)
  return builder.image(source as Parameters<typeof builder.image>[0])
}

// --- Banner Homepage ---
export async function getBanners(): Promise<unknown[]> {
  if (!client) return []
  return client.fetch(`
    *[_type == "banner" && aktif == true] | order(urutan asc) {
      title,
      image,
      link
    }
  `)
}

// --- Promo ---
export async function getPromos(): Promise<unknown[]> {
  if (!client) return []
  return client.fetch(`
    *[_type == "promo" && tanggalSelesai > now()] | order(tanggalMulai desc) {
      nama,
      deskripsi,
      tanggalMulai,
      tanggalSelesai,
      banner
    }
  `)
}

// --- Announcement Bar ---
export async function getAnnouncement(): Promise<{
  text: string
  link: string | null
  bgColor: string
} | null> {
  if (!client) return null
  const results = await client.fetch(`
    *[_type == "announcement" && aktif == true][0] {
      text,
      link,
      bgColor
    }
  `)
  return results || null
}

// --- Halaman Statis ---
export async function getPage(slug: string): Promise<{
  title: string
  content: unknown[]
  seoDescription: string | null
} | null> {
  if (!client) return null
  return client.fetch(
    `*[_type == "page" && slug.current == $slug][0] {
      title,
      content,
      seoDescription
    }`,
    { slug },
  )
}

export async function getAllPageSlugs(): Promise<string[]> {
  if (!client) return []
  const results = await client.fetch(`
    *[_type == "page"]{ "slug": slug.current }
  `)
  return results.map((r: { slug: string }) => r.slug)
}

// --- FAQ ---
export async function getFaqs(): Promise<
  Array<{ question: string; answer: string; category: string }>
> {
  if (!client) return []
  return client.fetch(`
    *[_type == "faq"] | order(urutan asc) {
      question,
      answer,
      category
    }
  `)
}

// --- Kategori Unggulan ---
export async function getCategoryHighlights(): Promise<unknown[]> {
  if (!client) return []
  return client.fetch(`
    *[_type == "categoryHighlight" && aktif == true] | order(urutan asc) {
      name,
      "slug": slug.current,
      image,
      description
    }
  `)
}

// --- Produk ---
export type SanityProduct = {
  _id: string
  title: string
  handle: string
  shortDescription: string | null
  description: unknown[] | null
  thumbnail: unknown | null
  images: Array<{ _key: string; asset: unknown; alt?: string }> | null
  price: number
  compareAtPrice: number | null
  sizes: string[] | null
  colors: Array<{ name: string; hex: string }> | null
  variantStock: Array<{ size?: string; color?: string; stock: number }> | null
  stock: number
  weight: number
  sku: string | null
  status: string
  featured: boolean
  tags: string[] | null
  badge: string | null
  category: { name: string; slug: string } | null
}

const productFields = `
  _id,
  title,
  "handle": handle.current,
  shortDescription,
  description,
  thumbnail,
  images,
  price,
  compareAtPrice,
  sizes,
  colors,
  variantStock,
  stock,
  weight,
  sku,
  status,
  featured,
  tags,
  badge,
  category->{ name, "slug": slug.current }
`

/**
 * Transform Sanity product into the shape ProductCard/ProductDetail expect
 */
function transformProduct(p: SanityProduct) {
  const thumbnailUrl = p.thumbnail ? urlFor(p.thumbnail).width(600).height(600).url() : null

  // Build images array for ProductDetail
  const galleryImages: Array<{ id: string; url: string }> = []
  if (p.thumbnail) {
    galleryImages.push({ id: 'thumb', url: urlFor(p.thumbnail).width(800).height(800).url() })
  }
  if (p.images) {
    p.images.forEach((img, i) => {
      if (img.asset) {
        galleryImages.push({ id: `img-${i}`, url: urlFor(img).width(800).height(800).url() })
      }
    })
  }

  // Build options from sizes and colors
  const options: Array<{ id: string; title: string; values: Array<{ id: string; value: string }> }> = []
  if (p.sizes && p.sizes.length > 0) {
    options.push({
      id: 'opt-size',
      title: 'Ukuran',
      values: p.sizes.map((s, i) => ({ id: `size-${i}`, value: s })),
    })
  }
  if (p.colors && p.colors.length > 0) {
    options.push({
      id: 'opt-color',
      title: 'Warna',
      values: p.colors.map((c, i) => ({ id: `color-${i}`, value: c.name })),
    })
  }

  // --- Per-variant stock lookup ---
  // If variantStock is filled, use it (strict per-variant).
  // Otherwise fall back to the global stock field.
  const vs = p.variantStock
  const hasVariantStock = vs && vs.length > 0

  function getStock(size?: string, color?: string): number {
    if (!hasVariantStock) return p.stock
    const match = vs!.find((entry) => {
      const sizeOk = size ? entry.size === size : !entry.size
      const colorOk = color ? entry.color === color : !entry.color
      return sizeOk && colorOk
    })
    // Strict: if no matching entry exists, stock = 0
    return match?.stock ?? 0
  }

  // Build variants for each size×color combination
  const hasSizes = p.sizes && p.sizes.length > 0
  const hasColors = p.colors && p.colors.length > 0
  const variants: Array<{
    id: string
    title: string
    inventory_quantity: number
    options: Array<{ value: string }>
    prices: Array<{ currency_code: string; amount: number }>
  }> = []

  if (hasSizes && hasColors) {
    // Size × Color matrix
    for (const size of p.sizes!) {
      for (const color of p.colors!) {
        variants.push({
          id: `${p._id}-${size}-${color.name}`.toLowerCase().replace(/\s+/g, '-'),
          title: `${size} / ${color.name}`,
          inventory_quantity: getStock(size, color.name),
          options: [{ value: size }, { value: color.name }],
          prices: [{ currency_code: 'idr', amount: p.price }],
        })
      }
    }
  } else if (hasSizes) {
    // Size only
    for (const size of p.sizes!) {
      variants.push({
        id: `${p._id}-${size}`.toLowerCase().replace(/\s+/g, '-'),
        title: size,
        inventory_quantity: getStock(size, undefined),
        options: [{ value: size }],
        prices: [{ currency_code: 'idr', amount: p.price }],
      })
    }
  } else if (hasColors) {
    // Color only
    for (const color of p.colors!) {
      variants.push({
        id: `${p._id}-${color.name}`.toLowerCase().replace(/\s+/g, '-'),
        title: color.name,
        inventory_quantity: getStock(undefined, color.name),
        options: [{ value: color.name }],
        prices: [{ currency_code: 'idr', amount: p.price }],
      })
    }
  } else {
    // No variants — single default
    variants.push({
      id: p._id,
      title: 'Default',
      inventory_quantity: p.stock,
      options: [{ value: 'ALL' }],
      prices: [{ currency_code: 'idr', amount: p.price }],
    })
  }

  return {
    id: p._id,
    title: p.title,
    handle: p.handle,
    thumbnail: thumbnailUrl,
    subtitle: p.shortDescription,
    description: p.shortDescription || `Produk streetwear premium dari DRAVEN.`,
    richDescription: p.description, // portable text for rich rendering
    images: galleryImages,
    options,
    variants,
    sizes: p.sizes || [],
    colors: p.colors || [],
    collection: p.category ? { title: p.category.name } : null,
    tags: p.tags || [],
    weight: p.weight,
    compareAtPrice: p.compareAtPrice,
    sku: p.sku,
    status: p.status,
    featured: p.featured,
  }
}

export async function getSanityProducts() {
  if (!client) return []
  try {
    const products: SanityProduct[] = await client.fetch(
      `*[_type == "product" && status == "active"] | order(_createdAt desc) { ${productFields} }`,
    )
    return products.map(transformProduct)
  } catch {
    return []
  }
}

export async function searchSanityProducts(query: string, limit = 6) {
  if (!client || !query.trim()) return []
  try {
    const products: SanityProduct[] = await client.fetch(
      `*[_type == "product" && status == "active" && (title match $q || tags[] match $q)] | order(_createdAt desc) [0...$limit] { ${productFields} }`,
      { q: `${query}*`, limit },
    )
    return products.map(transformProduct)
  } catch {
    return []
  }
}

// --- Store Settings ---
export async function getStoreSettings() {
  if (!client) return null
  return client.fetch(`*[_type == "storeSettings"][0]`)
}

// --- Lookbook ---
export async function getLookbooks() {
  if (!client) return []
  return client.fetch(`
    *[_type == "lookbook" && aktif == true] | order(releaseDate desc) {
      title,
      "slug": slug.current,
      description,
      coverImage,
      releaseDate,
      "productCount": count(products)
    }
  `)
}

export async function getLookbook(slug: string) {
  if (!client) return null
  return client.fetch(
    `*[_type == "lookbook" && slug.current == $slug && aktif == true][0] {
      title,
      "slug": slug.current,
      description,
      coverImage,
      images,
      releaseDate,
      products[]->{ ${productFields} }
    }`,
    { slug },
  )
}

// --- Gallery ---
export type GalleryItem = {
  _id: string
  image: unknown
  caption: string | null
  credit: string | null
  creditUrl: string | null
  tags: string[] | null
  featured: boolean | null
  product: { title: string; handle: string } | null
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  if (!client) return []
  return client.fetch(`
    *[_type == "gallery" && aktif == true] | order(coalesce(urutan, 9999) asc, tanggalUpload desc) {
      _id,
      image,
      caption,
      credit,
      creditUrl,
      tags,
      featured,
      "product": product->{ title, "handle": handle.current }
    }
  `)
}

// --- Testimonial ---
export async function getTestimonials(featured = false) {
  if (!client) return []
  const filter = featured
    ? '*[_type == "testimonial" && aktif == true && featured == true]'
    : '*[_type == "testimonial" && aktif == true]'
  return client.fetch(`
    ${filter} | order(_createdAt desc) {
      customerName,
      city,
      rating,
      text,
      photo,
      source,
      "product": productRef->{ title, "handle": handle.current, thumbnail }
    }
  `)
}

// --- Coupon ---
export async function validateCoupon(code: string) {
  if (!client) return null
  return client.fetch(
    `*[_type == "coupon" && code == $code && aktif == true && startDate <= now() && endDate >= now()][0] {
      code,
      type,
      value,
      maxDiscount,
      minPurchase,
      maxUses,
      usedCount
    }`,
    { code: code.toUpperCase() },
  )
}

// --- Orders (Sanity) ---
export async function getOrdersFromSanity(limit = 50) {
  if (!client) return []
  return client.fetch(
    `*[_type == "order"] | order(_createdAt desc) [0...$limit] {
      orderId,
      status,
      customerName,
      customerPhone,
      customerEmail,
      total,
      shippingCost,
      subtotal,
      shippingAddress,
      shippingCity,
      shippingProvince,
      shippingMethod,
      trackingNumber,
      paymentMethod,
      midtransId,
      paidAt,
      items,
      _createdAt
    }`,
    { limit },
  )
}

export async function getOrderStats() {
  if (!client) return null
  try {
    const [totalOrders, revenue, statusCounts] = await Promise.all([
      client.fetch(`count(*[_type == "order"])`),
      client.fetch(`*[_type == "order" && status in ["paid", "processing", "shipped", "delivered"]] { total }`),
      client.fetch(`{
        "pending": count(*[_type == "order" && status == "pending"]),
        "paid": count(*[_type == "order" && status == "paid"]),
        "processing": count(*[_type == "order" && status == "processing"]),
        "shipped": count(*[_type == "order" && status == "shipped"]),
        "delivered": count(*[_type == "order" && status == "delivered"]),
        "cancelled": count(*[_type == "order" && status == "cancelled"])
      }`),
    ])
    const totalRevenue = (revenue as Array<{ total: number }>).reduce((sum, o) => sum + (o.total || 0), 0)
    return { totalOrders, totalRevenue, statusCounts }
  } catch {
    return null
  }
}

// --- Product Stats ---
export async function getProductStats() {
  if (!client) return null
  try {
    const stats = await client.fetch(`{
      "totalProducts": count(*[_type == "product"]),
      "activeProducts": count(*[_type == "product" && status == "active"]),
      "draftProducts": count(*[_type == "product" && status == "draft"]),
      "outOfStock": count(*[_type == "product" && stock <= 0]),
      "lowStock": count(*[_type == "product" && stock > 0 && stock <= 5]),
      "lowStockItems": *[_type == "product" && stock > 0 && stock <= 10] | order(stock asc) [0...10] {
        title,
        "handle": handle.current,
        stock,
        price,
        thumbnail
      }
    }`)
    return stats
  } catch {
    return null
  }
}

export async function getSanityProduct(handle: string) {
  if (!client) return null
  try {
    const product: SanityProduct | null = await client.fetch(
      `*[_type == "product" && handle.current == $handle && status == "active"][0] { ${productFields} }`,
      { handle },
    )
    if (!product) return null
    return transformProduct(product)
  } catch {
    return null
  }
}

// --- Order Write Operations ---
export type CreateOrderData = {
  orderId: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  items: Array<{
    productTitle: string
    variant: string
    quantity: number
    price: number
    thumbnail?: string | null
  }>
  subtotal: number
  shippingCost: number
  total: number
  shippingAddress: string
  shippingCity: string
  shippingProvince: string
  shippingPostalCode?: string
  shippingDistrict?: string
  shippingMethod: string
}

export async function createOrderInSanity(data: CreateOrderData) {
  const writeClient = getSanityWriteClient()
  if (!writeClient) {
    console.warn('[Sanity] No write client — SANITY_API_TOKEN not configured')
    return null
  }
  try {
    const doc = await writeClient.create({
      _type: 'order',
      orderId: data.orderId,
      status: 'pending',
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail || '',
      items: data.items.map((item) => ({
        _type: 'object',
        _key: `item-${Math.random().toString(36).slice(2, 8)}`,
        productTitle: item.productTitle,
        variant: item.variant,
        quantity: item.quantity,
        price: item.price,
        thumbnail: item.thumbnail || '',
      })),
      subtotal: data.subtotal,
      shippingCost: data.shippingCost,
      discount: 0,
      total: data.total,
      shippingAddress: data.shippingAddress,
      shippingCity: data.shippingCity,
      shippingProvince: data.shippingProvince,
      shippingMethod: data.shippingMethod,
    })
    console.log(`[Sanity] Order created: ${data.orderId}`)
    return doc
  } catch (err) {
    console.error('[Sanity] Failed to create order:', err)
    return null
  }
}

export async function updateOrderStatus(
  orderId: string,
  status: string,
  extra?: { paymentMethod?: string; midtransId?: string; paidAt?: string },
) {
  const writeClient = getSanityWriteClient()
  if (!writeClient) return null
  try {
    // Find the Sanity document by orderId
    const doc = await writeClient.fetch<{ _id: string } | null>(
      `*[_type == "order" && orderId == $orderId][0]{ _id }`,
      { orderId },
    )
    if (!doc) {
      console.warn(`[Sanity] Order not found: ${orderId}`)
      return null
    }
    const patch = writeClient.patch(doc._id).set({ status })
    if (extra?.paymentMethod) patch.set({ paymentMethod: extra.paymentMethod })
    if (extra?.midtransId) patch.set({ midtransId: extra.midtransId })
    if (extra?.paidAt) patch.set({ paidAt: extra.paidAt })
    const result = await patch.commit()
    console.log(`[Sanity] Order ${orderId} updated to ${status}`)
    return result
  } catch (err) {
    console.error('[Sanity] Failed to update order:', err)
    return null
  }
}

// --- Homepage ---
export async function getHomepage() {
  if (!client) return null
  return client.fetch(`*[_type == "homepage"][0]{
    heroVideo,
    "heroImage": heroImage.asset->url,
    "featuredCollection": featuredCollection->{
      _id,
      title,
      "slug": slug.current,
      "products": *[_type == "product" && references(^._id)][0...3]{
        _id,
        title,
        "handle": slug.current,
        "thumbnail": images[0].asset->url,
        badge,
        "price": variants[0].prices[0].amount
      }
    },
    lookbookImages[]{
      "image": image.asset->url,
      caption
    },
    closingStatement
  }`)
}

// --- Size Guide ---
export async function getSizeGuide() {
  if (!client) return null
  return client.fetch(`*[_type == "sizeGuide"][0]{
    intro,
    sections[]{
      garmentType,
      note,
      measurements[]{
        size,
        chest,
        length,
        sleeve
      }
    }
  }`)
}

// --- Terms ---
export async function getTerms() {
  if (!client) return null
  return client.fetch(`*[_type == "terms"][0]{
    title,
    body
  }`)
}
