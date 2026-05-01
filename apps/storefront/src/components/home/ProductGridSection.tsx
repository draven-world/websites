import Link from 'next/link'
import ProductCard from '@/components/product/ProductCard'

type Variant = {
  id: string
  inventory_quantity?: number
  options?: Array<{ value: string }>
  prices: Array<{ amount: number; currency_code: string }>
}

type Product = {
  id: string
  title: string
  handle: string
  thumbnail: string | null
  images?: Array<{ id: string; url: string }>
  collection?: { title?: string | null } | null
  tags?: Array<{ value: string }>
  variants: Variant[]
}

type Props = {
  eyebrow: string
  title: string
  products: Product[]
  viewAllHref?: string
  viewAllLabel?: string
  /** When true, the first 4 cards get `priority` (above-the-fold) */
  prioritizeFirstRow?: boolean
}

export default function ProductGridSection({
  eyebrow,
  title,
  products,
  viewAllHref = '/products',
  viewAllLabel = 'View all',
  prioritizeFirstRow = false,
}: Props) {
  if (!products || products.length === 0) return null

  return (
    <section className="mx-auto max-w-container px-5 py-20 lg:px-8 lg:py-32">
      <div className="mb-12 flex items-end justify-between">
        <div>
          <p className="text-eyebrow text-brand-400">{eyebrow}</p>
          <h2 className="mt-4 font-serif text-display-sm text-brand-950">{title}</h2>
        </div>
        <Link
          href={viewAllHref}
          className="hidden text-eyebrow text-brand-950 transition-opacity hover:opacity-60 lg:inline-flex lg:items-center lg:gap-2"
        >
          {viewAllLabel}
          <span aria-hidden>→</span>
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-12 lg:grid-cols-4">
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} priority={prioritizeFirstRow && i < 4} />
        ))}
      </div>
      <div className="mt-10 text-center lg:hidden">
        <Link href={viewAllHref} className="text-eyebrow text-brand-950">
          {viewAllLabel} →
        </Link>
      </div>
    </section>
  )
}
