'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useCart } from '@/providers/cart-provider'
import { useToast } from '@/providers/toast-provider'
import { formatRupiah } from '@/lib/utils'
import VariantSelector from './VariantSelector'
import SanityContent from '@/components/sanity/SanityContent'

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
}

export default function ProductDetail({ product }: { product: Product }) {
  const [selectedVariant, setSelectedVariant] = useState<Variant>(product.variants[0])
  const [selectedImage, setSelectedImage] = useState(0)
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)
  const [infoOpen, setInfoOpen] = useState(false)
  const { addItem } = useCart()
  const { toast } = useToast()

  const price = selectedVariant?.prices?.find((p) => p.currency_code === 'idr')
  const priceAmount = price?.amount ?? 0
  const inStock = (selectedVariant?.inventory_quantity ?? 0) > 0

  const images = product.images?.length > 0
    ? product.images
    : product.thumbnail
      ? [{ id: 'thumb', url: product.thumbnail }]
      : []

  function handleAddToCart() {
    if (!selectedVariant || !inStock) return
    setAdding(true)
    addItem({
      id: selectedVariant.id,
      productId: product.id,
      title: product.title,
      handle: product.handle,
      variant: selectedVariant.title || 'Default',
      thumbnail: product.thumbnail,
      price: priceAmount,
    })
    setAdded(true)
    toast('Added to bag')
    setTimeout(() => setAdded(false), 3000)
    setAdding(false)
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:gap-20">
      {/* Gallery */}
      <div className="space-y-2">
        {images.length > 0 ? (
          <>
            <div className="relative aspect-[3/4] overflow-hidden bg-brand-100">
              <Image
                src={images[selectedImage].url}
                alt={product.title}
                fill
                className="object-cover"
                priority
              />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(i)}
                    className={`relative aspect-square overflow-hidden bg-brand-100 transition-opacity ${
                      i === selectedImage ? 'opacity-100' : 'opacity-40 hover:opacity-70'
                    }`}
                  >
                    <Image src={img.url} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="flex aspect-[3/4] items-center justify-center bg-brand-100">
            <span className="text-[11px] uppercase tracking-widest text-brand-300">No Image</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col lg:pt-8">
        <h1 className="text-2xl font-medium tracking-tightest text-brand-950 md:text-3xl">
          {product.title}
        </h1>

        <p className="mt-3 text-lg text-brand-400">
          {formatRupiah(priceAmount)}
        </p>

        {product.subtitle && (
          <p className="mt-4 text-sm leading-relaxed text-brand-500">{product.subtitle}</p>
        )}

        {/* Variants */}
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

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={!inStock || adding || added}
          className={`mt-8 w-full py-4 text-[13px] font-medium uppercase tracking-widest transition-all active:scale-[0.98] ${
            added
              ? 'bg-brand-800 text-white'
              : !inStock
                ? 'cursor-not-allowed bg-brand-100 text-brand-400'
                : 'bg-brand-950 text-white hover:bg-brand-800'
          }`}
        >
          {adding ? 'Adding...' : added ? 'Added' : !inStock ? 'Sold Out' : 'Add to Bag'}
        </button>

        {/* Description */}
        {(product.richDescription || product.description) && (
          <div className="mt-10 border-t border-brand-200 pt-6">
            <div className="text-sm leading-relaxed text-brand-500">
              {product.richDescription && product.richDescription.length > 0 ? (
                <SanityContent content={product.richDescription} />
              ) : (
                <p>{product.description}</p>
              )}
            </div>
          </div>
        )}

        {/* Info Accordion */}
        <div className="border-t border-brand-200">
          <button
            onClick={() => setInfoOpen(!infoOpen)}
            className="flex w-full items-center justify-between py-5 text-left"
          >
            <span className="text-[13px] uppercase tracking-widest text-brand-950">Details</span>
            <span className="text-brand-400">{infoOpen ? '−' : '+'}</span>
          </button>
          {infoOpen && (
            <div className="pb-5 text-sm leading-relaxed text-brand-500">
              {product.weight && <p>Weight: {product.weight}g</p>}
              <p>Shipping: JNE REG / YES</p>
              <p>Free shipping min. Rp 300.000</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
