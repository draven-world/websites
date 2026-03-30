import Medusa from '@medusajs/medusa-js'
import { dummyProducts } from './dummy-products'
import { getSanityProducts, getSanityProduct } from './sanity'

export const medusa = new Medusa({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_URL || 'http://localhost:9000',
  maxRetries: 0,
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getProducts(): Promise<any[]> {
  // 1. Try Sanity first
  const sanityProducts = await getSanityProducts()
  if (sanityProducts.length > 0) return sanityProducts

  // 2. Try Medusa
  try {
    const { products } = await medusa.products.list({
      limit: 20,
      expand: 'variants,images,collection',
    })
    if (products.length > 0) return products
  } catch {
    // fall through to dummy data
  }

  // 3. Fallback to dummy products
  return dummyProducts
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getProduct(handle: string): Promise<any | null> {
  // 1. Try Sanity first
  const sanityProduct = await getSanityProduct(handle)
  if (sanityProduct) return sanityProduct

  // 2. Try Medusa
  try {
    const { products } = await medusa.products.list({
      handle,
      expand: 'variants,variants.prices,images,collection',
    })
    if (products.length > 0) return products[0]
  } catch {
    // fall through to dummy data
  }

  // 3. Fallback to dummy product
  const dummy = dummyProducts.find((p) => p.handle === handle)
  if (!dummy) return null
  return {
    ...dummy,
    subtitle: null,
    description: `Produk streetwear premium dari Draven. Kualitas terjamin, desain urban yang timeless.`,
    images: dummy.thumbnail ? [{ id: 'img-1', url: dummy.thumbnail }] : [],
    options: [{ id: 'opt-1', title: 'Ukuran', values: [{ id: 'val-s', value: 'S' }, { id: 'val-m', value: 'M' }, { id: 'val-l', value: 'L' }, { id: 'val-xl', value: 'XL' }] }],
    variants: dummy.variants.map((v) => ({
      ...v,
      title: 'One Size',
      inventory_quantity: v.inventory_quantity,
      options: [{ value: 'M' }],
    })),
    weight: 300,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createCart(): Promise<any> {
  const { cart } = await medusa.carts.create()
  return cart
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getCart(cartId: string): Promise<any> {
  const { cart } = await medusa.carts.retrieve(cartId)
  return cart
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function addToCart(cartId: string, variantId: string, quantity: number = 1): Promise<any> {
  const { cart } = await medusa.carts.lineItems.create(cartId, {
    variant_id: variantId,
    quantity,
  })
  return cart
}
