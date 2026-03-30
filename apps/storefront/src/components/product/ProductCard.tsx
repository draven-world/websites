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
      <div className="relative aspect-[3/4] overflow-hidden bg-brand-100">
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-[11px] uppercase tracking-widest text-brand-300">No Image</span>
          </div>
        )}
        {!inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60">
            <span className="text-[11px] uppercase tracking-widest text-brand-950">Sold Out</span>
          </div>
        )}
      </div>
      <div className="mt-3">
        <h3 className="text-[13px] font-medium tracking-tight text-brand-950 line-clamp-1">
          {product.title}
        </h3>
        <p className="mt-0.5 text-[13px] text-brand-400">
          {formatRupiah(priceAmount)}
        </p>
      </div>
    </Link>
  )
}
