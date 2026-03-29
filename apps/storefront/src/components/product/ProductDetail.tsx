'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useCart } from '@/providers/cart-provider'
import { useToast } from '@/providers/toast-provider'
import { formatRupiah } from '@/lib/utils'
import VariantSelector from './VariantSelector'

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

  async function handleAddToCart() {
    if (!selectedVariant || !inStock) return
    setAdding(true)
    try {
      await addItem(selectedVariant.id)
      setAdded(true)
      toast('Berhasil ditambahkan ke keranjang!')
      setTimeout(() => setAdded(false), 3000)
    } catch {
      toast('Gagal menambahkan ke keranjang', 'error')
    } finally {
      setAdding(false)
    }
  }

  function handleShare(platform: 'whatsapp' | 'copy') {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    const text = `Cek produk ${product.title} di DRAVEN — ${formatRupiah(priceAmount)}`

    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`, '_blank')
    } else {
      navigator.clipboard.writeText(url)
      toast('Link berhasil disalin!', 'info')
    }
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:gap-14">
      {/* Gallery */}
      <div>
        <div className="relative aspect-square overflow-hidden bg-brand-50">
          {images.length > 0 ? (
            <Image
              src={images[selectedImage].url}
              alt={product.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center text-brand-300">
              <svg className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          {!inStock && (
            <span className="absolute left-4 top-4 bg-red-600 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white">
              Sold Out
            </span>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="mt-3 flex gap-2 overflow-x-auto">
            {images.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setSelectedImage(i)}
                className={`relative h-16 w-16 flex-shrink-0 overflow-hidden border-2 transition-colors ${
                  i === selectedImage ? 'border-brand-900' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <Image src={img.url} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col">
        <h1 className="text-xl font-bold uppercase tracking-wide text-brand-900 md:text-2xl">
          {product.title}
        </h1>
        {product.subtitle && (
          <p className="mt-1 text-sm text-brand-400">{product.subtitle}</p>
        )}

        <p className="mt-4 text-xl font-bold text-brand-900">{formatRupiah(priceAmount)}</p>

        {/* Share */}
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={() => handleShare('whatsapp')}
            className="flex items-center gap-1.5 text-xs font-medium text-brand-400 transition-colors hover:text-brand-900"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Bagikan
          </button>
          <button
            onClick={() => handleShare('copy')}
            className="flex items-center gap-1.5 text-xs font-medium text-brand-400 transition-colors hover:text-brand-900"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.193-3.504a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L4.25 8.688" />
            </svg>
            Salin Link
          </button>
        </div>

        {/* Variant Selector */}
        {product.options && product.options.length > 0 && (
          <div className="mt-6">
            <VariantSelector
              options={product.options}
              variants={product.variants}
              selectedVariant={selectedVariant}
              onSelect={setSelectedVariant}
            />
          </div>
        )}

        {/* Stock Status */}
        <div className="mt-5">
          {inStock ? (
            <span className="text-sm text-brand-500">
              Stok tersedia ({selectedVariant.inventory_quantity} pcs)
            </span>
          ) : (
            <span className="text-sm font-semibold text-red-600">Stok habis</span>
          )}
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={!inStock || adding || added}
          className={`mt-6 w-full py-4 text-[13px] font-semibold uppercase tracking-wider transition-colors ${
            added
              ? 'bg-green-600 text-white'
              : !inStock
                ? 'cursor-not-allowed bg-brand-200 text-brand-400'
                : 'btn-primary'
          }`}
        >
          {adding ? 'MENAMBAHKAN...' : added ? '✓ BERHASIL DITAMBAHKAN' : !inStock ? 'STOK HABIS' : 'TAMBAH KE KERANJANG'}
        </button>

        {/* Description */}
        {product.description && (
          <div className="mt-8 border-t border-brand-100 pt-6">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-brand-900">
              Deskripsi
            </h3>
            <p className="text-sm leading-relaxed text-brand-500">{product.description}</p>
          </div>
        )}

        {/* Weight */}
        {product.weight && (
          <div className="mt-4 text-sm text-brand-400">
            Berat: {product.weight}g
          </div>
        )}
      </div>
    </div>
  )
}
