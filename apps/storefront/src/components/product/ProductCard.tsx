import Image from 'next/image'
import Link from 'next/link'
import { formatRupiah } from '@/lib/utils'

type Product = {
  id: string
  title: string
  handle: string
  thumbnail: string | null
  variants: Array<{
    id: string
    inventory_quantity?: number
    prices: Array<{ amount: number; currency_code: string }>
  }>
}

export default function ProductCard({ product }: { product: Product }) {
  const price = product.variants[0]?.prices?.find((p) => p.currency_code === 'idr')
  const priceAmount = price?.amount ?? 0
  const inStock = (product.variants[0]?.inventory_quantity ?? 1) > 0

  return (
    <Link href={`/products/${product.handle}`} className="group">
      <div className="relative aspect-square overflow-hidden bg-brand-50">
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-brand-300">
            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {/* Sold Out badge */}
        {!inStock && (
          <>
            <div className="absolute inset-0 bg-white/50" />
            <span className="absolute left-3 top-3 bg-red-600 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white">
              Sold Out
            </span>
          </>
        )}
      </div>
      <div className="mt-3">
        <h3 className="text-[13px] font-semibold uppercase tracking-wide text-brand-900 line-clamp-1">
          {product.title}
        </h3>
        <p className="mt-1 text-sm text-brand-500">{formatRupiah(priceAmount)}</p>
      </div>
    </Link>
  )
}
