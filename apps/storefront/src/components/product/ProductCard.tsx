import Image from 'next/image'
import Link from 'next/link'
import { formatRupiah } from '@/lib/utils'
import PillBadge from '@/components/ui/PillBadge'

const BLUR_DATA =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8+P9/PQAJhAN8xGmFjwAAAABJRU5ErkJggg=='

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
  badge?: string | null
  images?: Array<{ id: string; url: string }>
  variants: Variant[]
}

export default function ProductCard({
  product,
  priority = false,
}: {
  product: Product
  priority?: boolean
}) {
  const price = product.variants[0]?.prices?.find((p) => p.currency_code === 'idr')
  const priceAmount = price?.amount ?? 0
  const allSoldOut = product.variants.every((v) => (v.inventory_quantity ?? 0) <= 0)

  return (
    <Link href={`/products/${product.handle}`} className="group block">
      <div className={`relative aspect-[4/5] overflow-hidden bg-ink-900 ${allSoldOut ? 'opacity-50' : ''}`}>
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            className="object-contain transition-transform duration-[600ms] ease-out group-hover:scale-[1.04]"
            sizes="(max-width: 768px) 50vw, 33vw"
            placeholder="blur"
            blurDataURL={BLUR_DATA}
            priority={priority}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-[0.75rem] uppercase tracking-[0.15em] text-ink-500">No Image</span>
          </div>
        )}
      </div>
      <div className="mt-4 flex flex-col items-center text-center">
        {product.badge && (
          <div className="mb-2"><PillBadge>{product.badge}</PillBadge></div>
        )}
        <h3 className="text-[1.25rem] font-bold uppercase tracking-tighter text-ink-100">
          {product.title}
        </h3>
        <p className="mt-1.5 text-sm font-bold text-ink-100">{formatRupiah(priceAmount)}</p>
        {allSoldOut && (
          <p className="mt-1 text-[0.75rem] uppercase tracking-[0.15em] text-ink-500">SOLD OUT</p>
        )}
      </div>
    </Link>
  )
}
