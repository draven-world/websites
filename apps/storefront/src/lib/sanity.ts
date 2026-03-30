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
  stock: number
  weight: number
  sku: string | null
  status: string
  featured: boolean
  tags: string[] | null
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
  stock,
  weight,
  sku,
  status,
  featured,
  tags,
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

  // Build variant — single variant with the price
  const variants = [
    {
      id: p._id,
      title: p.sizes?.[0] || 'Default',
      inventory_quantity: p.stock,
      options: p.sizes ? [{ value: p.sizes[0] || 'ALL' }] : [{ value: 'ALL' }],
      prices: [{ currency_code: 'idr', amount: p.price }],
    },
  ]

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
