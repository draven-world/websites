import Image from 'next/image'
import Link from 'next/link'
import { formatRupiah } from '@/lib/utils'

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
  images?: Array<{ id: string; url: string }>
  collection?: { title?: string | null } | null
  tags?: Array<{ value: string }>
  variants: Variant[]
}

function deriveCategory(product: Product): string | null {
  if (product.collection?.title) return product.collection.title
  if (product.tags && product.tags.length > 0) return product.tags[0].value
  return null
}

function deriveSizes(variants: Variant[]): Array<{ label: string; soldOut: boolean }> {
  const seen = new Map<string, { label: string; soldOut: boolean }>()
  for (const v of variants) {
    const sizeOpt = v.options?.find((o) => /^(xs|s|m|l|xl|xxl|\d+)$/i.test((o.value || '').trim()))
    if (!sizeOpt) continue
    const label = sizeOpt.value.toUpperCase()
    const soldOut = (v.inventory_quantity ?? 0) <= 0
    const existing = seen.get(label)
    if (!existing || (existing.soldOut && !soldOut)) {
      seen.set(label, { label, soldOut })
    }
  }
  return Array.from(seen.values())
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
  const category = deriveCategory(product)
  const sizes = deriveSizes(product.variants)
  const secondaryImage = product.images?.[1]?.url

  return (
    <Link href={`/products/${product.handle}`} className="group block">
      <div className={`relative aspect-[3/4] overflow-hidden bg-brand-100 ${allSoldOut ? 'grayscale opacity-70' : ''}`}>
        {product.thumbnail ? (
          <>
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 50vw, 25vw"
              placeholder="blur"
              blurDataURL={BLUR_DATA}
              priority={priority}
            />
            {secondaryImage && (
              <Image
                src={secondaryImage}
                alt=""
                fill
                aria-hidden
                className="object-cover opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            )}
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-eyebrow text-brand-300">No Image</span>
          </div>
        )}
        {allSoldOut && (
          <span className="absolute bottom-3 left-3 bg-white px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-brand-950">
            Sold Out
          </span>
        )}
      </div>
      <div className="mt-3">
        {category && (
          <p className="text-[10px] uppercase tracking-[0.2em] text-brand-400 mb-1">{category}</p>
        )}
        <h3 className="text-[13px] font-medium tracking-tight text-brand-950 line-clamp-1">
          {product.title}
        </h3>
        <p className="mt-0.5 text-[13px] text-brand-400">{formatRupiah(priceAmount)}</p>
        {sizes.length > 0 && (
          <div
            className="mt-2 hidden gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100 lg:flex"
            aria-hidden
          >
            {sizes.map((s) => (
              <span
                key={s.label}
                className={`text-[10px] uppercase tracking-[0.15em] ${
                  s.soldOut ? 'text-brand-300 line-through' : 'text-brand-950'
                }`}
              >
                {s.label}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
