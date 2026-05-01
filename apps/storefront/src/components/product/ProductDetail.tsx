'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { useCart } from '@/providers/cart-provider'
import { useToast } from '@/providers/toast-provider'
import { formatRupiah } from '@/lib/utils'
import VariantSelector from './VariantSelector'
import SanityContent from '@/components/sanity/SanityContent'
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
  const [selectedVariant, setSelectedVariant] = useState<Variant>(product.variants[0])
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)
  const [mobileIndex, setMobileIndex] = useState(0)
  const mobileGalleryRef = useRef<HTMLDivElement | null>(null)
  const { addItem } = useCart()
  const { toast } = useToast()

  const price = selectedVariant?.prices?.find((p) => p.currency_code === 'idr')
  const priceAmount = price?.amount ?? 0
  const variantQty = selectedVariant?.inventory_quantity ?? 0
  const inStock = variantQty > 0
  const lowStock = inStock && variantQty <= 5
  const allSoldOut = product.variants.every((v) => (v.inventory_quantity ?? 0) <= 0)

  const images =
    product.images?.length > 0
      ? product.images
      : product.thumbnail
        ? [{ id: 'thumb', url: product.thumbnail }]
        : []

  useEffect(() => {
    const el = mobileGalleryRef.current
    if (!el) return
    function onScroll() {
      if (!el) return
      const idx = Math.round(el.scrollLeft / el.clientWidth)
      setMobileIndex(idx)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  function getVariantLabel(): string {
    if (!selectedVariant) return 'Default'
    const parts = selectedVariant.options
      ?.map((o) => o.value)
      .filter((v) => v && v !== 'ALL')
    if (parts && parts.length > 0) return parts.join(' / ')
    return selectedVariant.title || 'Default'
  }

  const handleAddToCart = useCallback(() => {
    if (!selectedVariant || !inStock) return
    setAdding(true)
    addItem({
      id: selectedVariant.id,
      productId: product.id,
      title: product.title,
      handle: product.handle,
      variant: getVariantLabel(),
      thumbnail: product.thumbnail,
      price: priceAmount,
    })
    setAdded(true)
    toast('Added to bag')
    setTimeout(() => setAdded(false), 5000)
    setAdding(false)
  }, [selectedVariant, inStock, addItem, product, priceAmount, toast])

  const category = product.collection?.title

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12">
      {/* Gallery */}
      <div className="lg:col-span-7">
        {/* Mobile: horizontal snap carousel */}
        <div className="lg:hidden">
          {images.length > 0 ? (
            <>
              <div
                ref={mobileGalleryRef}
                className="flex snap-x snap-mandatory overflow-x-auto"
                style={{ scrollSnapType: 'x mandatory' }}
              >
                {images.map((img, i) => (
                  <div
                    key={img.id}
                    className="relative aspect-[3/4] w-full flex-shrink-0 snap-center bg-brand-100"
                  >
                    <Image
                      src={img.url}
                      alt={product.title}
                      fill
                      className="object-cover"
                      priority={i === 0}
                      placeholder="blur"
                      blurDataURL={BLUR_DATA}
                      sizes="100vw"
                    />
                  </div>
                ))}
              </div>
              {images.length > 1 && (
                <div className="mt-3 flex justify-center gap-2">
                  {images.map((_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 w-1.5 rounded-full transition-colors ${
                        i === mobileIndex ? 'bg-brand-950' : 'bg-brand-200'
                      }`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex aspect-[3/4] items-center justify-center bg-brand-100">
              <span className="text-eyebrow text-brand-300">No Image</span>
            </div>
          )}
        </div>

        {/* Desktop: vertical scroll stack, no thumbs */}
        <div className="hidden lg:block lg:space-y-1">
          {images.length > 0 ? (
            images.map((img, i) => (
              <div key={img.id} className="relative aspect-[3/4] w-full overflow-hidden bg-brand-100">
                <Image
                  src={img.url}
                  alt={product.title}
                  fill
                  className="object-cover"
                  priority={i === 0}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  placeholder="blur"
                  blurDataURL={BLUR_DATA}
                  sizes="(max-width: 1024px) 100vw, 58vw"
                />
              </div>
            ))
          ) : (
            <div className="flex aspect-[3/4] items-center justify-center bg-brand-100">
              <span className="text-eyebrow text-brand-300">No Image</span>
            </div>
          )}
        </div>
      </div>

      {/* Info — sticky on desktop */}
      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-24 lg:self-start lg:pl-8 xl:pl-16 lg:pt-8">
          {category && <p className="text-eyebrow text-brand-400">{category}</p>}
          <h1 className="mt-4 font-serif text-display-sm text-brand-950">{product.title}</h1>
          <p className="mt-4 text-lg text-brand-500">{formatRupiah(priceAmount)}</p>

          {product.subtitle && (
            <p className="mt-4 text-sm leading-relaxed text-brand-500">{product.subtitle}</p>
          )}

          {product.options && product.options.length > 0 && (
            <div className="mt-8">
              <VariantSelector
                options={product.options}
                variants={product.variants}
                selectedVariant={selectedVariant}
                onSelect={setSelectedVariant}
              />
            </div>
          )}

          <div className="mt-6">
            {allSoldOut ? (
              <div className="flex items-center gap-2 rounded bg-red-50 px-4 py-3">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                <span className="text-sm font-medium text-red-700">
                  Stok Habis — Semua varian tidak tersedia
                </span>
              </div>
            ) : !inStock ? (
              <div className="flex items-center gap-2 rounded bg-red-50 px-4 py-3">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                <span className="text-sm text-red-600">
                  Varian ini habis — pilih ukuran/warna lain
                </span>
              </div>
            ) : lowStock ? (
              <div className="flex items-center gap-2 rounded bg-amber-50 px-4 py-3">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <span className="text-sm text-amber-700">Sisa {variantQty} — Hampir habis!</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-sm text-brand-500">Stok tersedia ({variantQty})</span>
              </div>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!inStock || adding || added}
            className={`mt-4 w-full py-4 text-eyebrow transition-all active:scale-[0.98] ${
              added
                ? 'bg-brand-800 text-white'
                : !inStock
                  ? 'cursor-not-allowed bg-brand-100 text-brand-400'
                  : 'bg-brand-950 text-white hover:bg-brand-800'
            }`}
          >
            {adding ? 'Menambahkan...' : added ? 'Ditambahkan ✓' : !inStock ? 'Stok Habis' : 'Tambah ke Tas'}
          </button>

          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1 text-eyebrow text-brand-400">
            <span className="flex items-center gap-1">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              Secure Payment
            </span>
            <span className="flex items-center gap-1">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.746 3.746 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
              </svg>
              100% Original
            </span>
          </div>

          <div className="mt-10 border-t border-brand-100">
            <Accordion label="Description" defaultOpen>
              {product.richDescription && product.richDescription.length > 0 ? (
                <SanityContent content={product.richDescription} />
              ) : product.description ? (
                <p>{product.description}</p>
              ) : (
                <p className="text-brand-400">No description available.</p>
              )}
            </Accordion>
            <Accordion label="Materials & Care">
              <p>Premium fabric, hand-finished. Cold wash, line dry, low iron.</p>
              {product.weight && <p className="mt-2">Weight: {product.weight}g</p>}
            </Accordion>
            <Accordion label="Shipping & Returns">
              <p>JNE REG / YES — pengiriman seluruh Indonesia.</p>
              <p>Free shipping min. Rp 300.000.</p>
              <p>Pengembalian dalam 7 hari dengan tag intact.</p>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  )
}
