type Product = {
  title: string
  description: string | null
  handle: string
  thumbnail: string | null
  variants: Array<{
    prices: Array<{ amount: number; currency_code: string }>
    inventory_quantity: number
  }>
}

export default function ProductJsonLd({ product }: { product: Product }) {
  const price = product.variants[0]?.prices?.find((p) => p.currency_code === 'idr')
  const inStock = product.variants.some((v) => v.inventory_quantity > 0)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description || undefined,
    image: product.thumbnail || undefined,
    url: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/products/${product.handle}`,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'IDR',
      price: price?.amount || 0,
      availability: inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Draven Store',
      },
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
