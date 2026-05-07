import Link from 'next/link'
import ProductCard from '@/components/product/ProductCard'

type Collection = {
  _id: string
  title: string
  slug: string
  products: Array<{
    _id: string
    title: string
    handle: string
    thumbnail: string | null
    badge?: string | null
    price: number
  }>
}

export default function LatestDrop({ collection }: { collection: Collection | null }) {
  if (!collection || !collection.products?.length) return null
  return (
    <section className="px-8 lg:px-16 py-32 lg:py-40 bg-ink-950">
      <div className="flex items-end justify-between mb-16">
        <p className="text-[0.75rem] uppercase tracking-[0.15em] text-ink-500">
          LATEST DROP / {collection.title.toUpperCase()}
        </p>
        <p className="text-[0.75rem] uppercase tracking-[0.15em] text-ink-500">
          {collection.products.length} PIECES
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 md:gap-x-24 lg:gap-x-32 gap-y-24">
        {collection.products.map((p) => (
          <ProductCard
            key={p._id}
            product={{
              id: p._id,
              title: p.title,
              handle: p.handle,
              thumbnail: p.thumbnail,
              badge: p.badge,
              variants: [{ id: '', prices: [{ amount: p.price, currency_code: 'idr' }] }],
            }}
          />
        ))}
      </div>
      <div className="mt-16 text-center">
        <Link
          href="/products"
          className="text-[0.8125rem] uppercase tracking-[0.18em] text-ink-300 hover:text-accent-lime transition-colors"
        >
          VIEW ALL →
        </Link>
      </div>
    </section>
  )
}
