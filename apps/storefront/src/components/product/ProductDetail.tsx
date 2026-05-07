'use client'

import Image from 'next/image'
import { useState, useCallback } from 'react'
import { formatRupiah } from '@/lib/utils'
import { useCart } from '@/providers/cart-provider'
import { useToast } from '@/providers/toast-provider'
import PillBadge from '@/components/ui/PillBadge'
import Accordion from '@/components/ui/Accordion'

const BLUR_DATA =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8+P9/PQAJhAN8xGmFjwAAAABJRU5ErkJggg=='

type Variant = {
  id: string
  title: string
  inventory_quantity: number
  options: Array<{ value: string }>
  prices: Array<{ amount: number; currency_code: string }>
}

type Product = {
  id: string
  title: string
  subtitle: string | null
  description: string | null
  richDescription?: unknown[] | null
  handle: string
  thumbnail: string | null
  images: Array<{ id: string; url: string }>
  options: Array<{ id: string; title: string; values: Array<{ id: string; value: string }> }>
  variants: Variant[]
  weight: number | null
  collection?: { title?: string | null } | null
}

export default function ProductDetail({ product }: { product: Product }) {
  const { addItem } = useCart()
  const { toast } = useToast()
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)

  const sizeOption = product.options?.find((o) => /size|ukuran/i.test(o.title))
  const sizes = sizeOption?.values?.map((v) => v.value) ?? []

  const images =
    product.images?.length > 0
      ? product.images
      : product.thumbnail
        ? [{ id: 'thumb', url: product.thumbnail }]
        : []

  const matchingVariant =
    product.variants.find((v) => {
      if (!selectedSize) return true
      return v.options?.some((o) => o.value === selectedSize)
    }) ?? product.variants[0]

  const price = matchingVariant?.prices.find((p) => p.currency_code === 'idr')?.amount ?? 0
  const variantSoldOut = (matchingVariant?.inventory_quantity ?? 0) <= 0
  const allSoldOut = product.variants.every((v) => (v.inventory_quantity ?? 0) <= 0)

  function getVariantLabel(): string {
    if (!matchingVariant) return 'Default'
    const parts = matchingVariant.options?.map((o) => o.value).filter((v) => v && v !== 'ALL')
    if (parts && parts.length > 0) return parts.join(' / ')
    return matchingVariant.title || 'Default'
  }

  const handleAdd = useCallback(() => {
    if (!matchingVariant || variantSoldOut || !selectedSize) return
    setAdding(true)
    addItem({
      id: matchingVariant.id,
      productId: product.id,
      title: product.title,
      handle: product.handle,
      variant: getVariantLabel(),
      thumbnail: product.thumbnail,
      price,
    })
    setAdded(true)
    toast('Added to bag')
    setTimeout(() => setAdded(false), 5000)
    setAdding(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchingVariant, variantSoldOut, selectedSize, addItem, product, price, toast])

  const addButtonLabel = allSoldOut
    ? 'SOLD OUT'
    : variantSoldOut
      ? 'SOLD OUT'
      : adding
        ? 'ADDING...'
        : added
          ? 'ADDED ✓'
          : !selectedSize
            ? 'SELECT SIZE'
            : 'ADD TO BAG'

  const addButtonDisabled = allSoldOut || variantSoldOut || adding || added || !selectedSize

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-12 lg:gap-20">
      {/* Image stack */}
      <div className="flex flex-col gap-1">
        {images.length > 0 ? (
          images.map((img, i) => (
            <div key={img.id} className="relative aspect-[4/5] bg-ink-900">
              <Image
                src={img.url}
                alt={product.title}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority={i === 0}
                placeholder="blur"
                blurDataURL={BLUR_DATA}
              />
            </div>
          ))
        ) : (
          <div className="relative aspect-[4/5] bg-ink-900 flex items-center justify-center">
            <span className="text-[0.75rem] uppercase tracking-widest text-ink-500">No Image</span>
          </div>
        )}
      </div>

      {/* Sticky info column */}
      <div className="lg:sticky lg:top-32 lg:self-start flex flex-col gap-6">
        {product.collection?.title && (
          <PillBadge>{product.collection.title}</PillBadge>
        )}

        <h1 className="text-[clamp(1.5rem,3.5vw,2.5rem)] uppercase font-bold tracking-tighter text-ink-100 leading-[1.05]">
          {product.title}
        </h1>

        <p className="text-lg font-bold text-ink-100">{formatRupiah(price)}</p>

        {(product.subtitle || product.description) && (
          <p className="text-sm text-ink-300 leading-relaxed line-clamp-3">
            {product.subtitle ?? product.description}
          </p>
        )}

        {sizes.length > 0 && (
          <div>
            <p className="text-[0.75rem] uppercase tracking-[0.15em] text-ink-300 mb-3">SIZE</p>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => {
                const variantForSize = product.variants.find((v) =>
                  v.options?.some((o) => o.value === size)
                )
                const soldOut = (variantForSize?.inventory_quantity ?? 0) <= 0
                const active = selectedSize === size
                return (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    disabled={soldOut}
                    className={`border px-5 py-2.5 text-sm uppercase font-bold transition-colors ${
                      active
                        ? 'border-accent-lime text-accent-lime'
                        : soldOut
                          ? 'border-ink-700 text-ink-500 line-through cursor-not-allowed'
                          : 'border-ink-700 text-ink-100 hover:border-ink-300'
                    }`}
                  >
                    {size}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <button
          onClick={handleAdd}
          disabled={addButtonDisabled}
          className={`w-full py-4 text-sm font-bold uppercase tracking-widest transition-colors ${
            addButtonDisabled
              ? 'bg-ink-700 text-ink-500 cursor-not-allowed'
              : added
                ? 'bg-ink-700 text-ink-100'
                : 'bg-accent-lime text-ink-950 hover:bg-ink-50'
          }`}
        >
          {addButtonLabel}
        </button>

        <div className="flex flex-col mt-4 border-t border-ink-700">
          <Accordion label="SHIPPING & RETURNS">
            <p className="text-sm text-ink-300 leading-relaxed">
              Shipping handled via JNE / J&amp;T / SiCepat across Indonesia.
              Free returns within 7 days of receipt for unworn items in original packaging.
            </p>
          </Accordion>
          <Accordion label="SIZE GUIDE">
            <p className="text-sm text-ink-300 leading-relaxed">
              See the{' '}
              <a href="/size-guide" className="text-accent-lime underline underline-offset-4">
                size guide
              </a>{' '}
              for chest, length, and sleeve measurements per garment.
            </p>
          </Accordion>
          <Accordion label="MATERIALS">
            <p className="text-sm text-ink-300 leading-relaxed">
              Premium cotton fleece, garment-dyed, pre-shrunk. Made in Indonesia.
              {product.weight ? ` Weight: ${product.weight}g.` : ''}
            </p>
          </Accordion>
        </div>
      </div>
    </div>
  )
}
