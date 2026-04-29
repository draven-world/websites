'use client'

import { useRouter, useSearchParams } from 'next/navigation'

const categories = [
  { label: 'Semua', value: '' },
  { label: 'Kaos', value: 'kaos' },
  { label: 'Hoodie', value: 'hoodie' },
  { label: 'Celana', value: 'celana' },
  { label: 'Jaket', value: 'jaket' },
  { label: 'Aksesoris', value: 'aksesoris' },
]

const priceRanges = [
  { label: 'Semua Harga', value: '' },
  { label: 'Di bawah Rp 100.000', value: '0-100000' },
  { label: 'Rp 100.000 – 200.000', value: '100000-200000' },
  { label: 'Rp 200.000 – 500.000', value: '200000-500000' },
  { label: 'Di atas Rp 500.000', value: '500000-' },
]

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'ALL']

const defaultColors = [
  { name: 'Hitam', hex: '#000000' },
  { name: 'Putih', hex: '#FFFFFF' },
  { name: 'Abu-abu', hex: '#808080' },
  { name: 'Navy', hex: '#1B2A4A' },
  { name: 'Merah', hex: '#C0392B' },
  { name: 'Hijau', hex: '#27AE60' },
  { name: 'Cream', hex: '#F5E6CC' },
  { name: 'Coklat', hex: '#6B4226' },
]

const sortOptions = [
  { label: 'Terbaru', value: '' },
  { label: 'Harga: Rendah ke Tinggi', value: 'price-asc' },
  { label: 'Harga: Tinggi ke Rendah', value: 'price-desc' },
  { label: 'Nama: A–Z', value: 'name-asc' },
]

type FilterProps = {
  productCount?: number
  availableColors?: Array<{ name: string; hex: string }>
}

export default function ProductFilters({ productCount, availableColors }: FilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentCategory = searchParams.get('category') || ''
  const currentPrice = searchParams.get('price') || ''
  const currentSize = searchParams.get('size') || ''
  const currentColor = searchParams.get('color') || ''
  const currentSort = searchParams.get('sort') || ''
  const currentQuery = searchParams.get('q') || ''

  const activeCount = [currentCategory, currentPrice, currentSize, currentColor, currentQuery].filter(Boolean).length

  const colors = availableColors && availableColors.length > 0 ? availableColors : defaultColors

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/products?${params.toString()}`)
  }

  function clearAll() {
    router.push('/products')
  }

  return (
    <aside className="w-full">
      {/* Active Filters */}
      {activeCount > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-brand-400">
              Filter Aktif ({activeCount})
            </span>
            <button
              onClick={clearAll}
              className="text-[10px] uppercase tracking-widest text-brand-400 underline underline-offset-4 hover:text-brand-950"
            >
              Reset
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {currentQuery && (
              <FilterTag label={`"${currentQuery}"`} onRemove={() => updateParam('q', '')} />
            )}
            {currentCategory && (
              <FilterTag
                label={categories.find((c) => c.value === currentCategory)?.label || currentCategory}
                onRemove={() => updateParam('category', '')}
              />
            )}
            {currentPrice && (
              <FilterTag
                label={priceRanges.find((p) => p.value === currentPrice)?.label || currentPrice}
                onRemove={() => updateParam('price', '')}
              />
            )}
            {currentSize && (
              <FilterTag label={`Size ${currentSize}`} onRemove={() => updateParam('size', '')} />
            )}
            {currentColor && (
              <FilterTag label={currentColor} onRemove={() => updateParam('color', '')} />
            )}
          </div>
        </div>
      )}

      {/* Category */}
      <FilterSection title="Kategori">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => updateParam('category', cat.value)}
            aria-current={currentCategory === cat.value ? 'page' : undefined}
            className={`block text-sm transition-colors ${
              currentCategory === cat.value
                ? 'font-medium text-brand-950'
                : 'text-brand-400 hover:text-brand-950'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </FilterSection>

      {/* Price */}
      <FilterSection title="Harga">
        {priceRanges.map((range) => (
          <button
            key={range.value}
            onClick={() => updateParam('price', range.value)}
            className={`block text-sm transition-colors ${
              currentPrice === range.value
                ? 'font-medium text-brand-950'
                : 'text-brand-400 hover:text-brand-950'
            }`}
          >
            {range.label}
          </button>
        ))}
      </FilterSection>

      {/* Size */}
      <FilterSection title="Ukuran">
        <div className="flex flex-wrap gap-1.5">
          {sizes.map((s) => (
            <button
              key={s}
              onClick={() => updateParam('size', currentSize === s ? '' : s)}
              className={`flex h-9 min-w-[2.25rem] items-center justify-center border px-2 text-xs transition-colors ${
                currentSize === s
                  ? 'border-brand-950 bg-brand-950 text-white'
                  : 'border-brand-200 text-brand-500 hover:border-brand-950'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Color */}
      <FilterSection title="Warna">
        <div className="flex flex-wrap gap-2">
          {colors.map((c) => {
            const isActive = currentColor.toLowerCase() === c.name.toLowerCase()
            const isLight = ['#FFFFFF', '#F5E6CC', '#FFFAF0'].includes(c.hex.toUpperCase())
            return (
              <button
                key={c.name}
                onClick={() => updateParam('color', isActive ? '' : c.name)}
                title={c.name}
                aria-label={`Filter by ${c.name}`}
                className={`group flex items-center gap-1.5 border px-2.5 py-1.5 text-xs transition-colors ${
                  isActive
                    ? 'border-brand-950 bg-brand-50'
                    : 'border-brand-200 hover:border-brand-400'
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 rounded-full ${isLight ? 'border border-brand-200' : ''}`}
                  style={{ backgroundColor: c.hex }}
                />
                <span className={isActive ? 'font-medium text-brand-950' : 'text-brand-500'}>
                  {c.name}
                </span>
              </button>
            )
          })}
        </div>
      </FilterSection>

      {/* Sort */}
      <FilterSection title="Urutkan">
        {sortOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => updateParam('sort', opt.value)}
            className={`block text-sm transition-colors ${
              currentSort === opt.value
                ? 'font-medium text-brand-950'
                : 'text-brand-400 hover:text-brand-950'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </FilterSection>

      {/* Product Count */}
      {productCount !== undefined && (
        <div className="mt-6 border-t border-brand-100 pt-4">
          <p className="text-[10px] uppercase tracking-widest text-brand-300">
            {productCount} produk ditemukan
          </p>
        </div>
      )}
    </aside>
  )
}

// --- Sub-components ---

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-brand-100 py-5">
      <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-brand-950">
        {title}
      </h3>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

function FilterTag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 bg-brand-950 px-2.5 py-1 text-[10px] uppercase tracking-widest text-white">
      {label}
      <button onClick={onRemove} className="ml-0.5 hover:opacity-60" aria-label={`Remove ${label}`}>
        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </span>
  )
}

// --- Sort Dropdown (compact, for header area) ---
export function SortDropdown() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentSort = searchParams.get('sort') || ''

  function handleSort(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set('sort', value)
    } else {
      params.delete('sort')
    }
    router.push(`/products?${params.toString()}`)
  }

  return (
    <select
      value={currentSort}
      onChange={(e) => handleSort(e.target.value)}
      aria-label="Sort products"
      className="border-0 bg-transparent text-sm text-brand-400 outline-none focus:text-brand-950"
    >
      {sortOptions.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}

// --- Mobile Filter Drawer ---
export function MobileFilterDrawer({
  open,
  onClose,
  productCount,
  availableColors,
}: {
  open: boolean
  onClose: () => void
  productCount?: number
  availableColors?: Array<{ name: string; hex: string }>
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Drawer */}
      <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto bg-white animate-slide-up">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-brand-100 bg-white px-5 py-4">
          <span className="text-[13px] font-semibold uppercase tracking-widest text-brand-950">
            Filter & Sort
          </span>
          <button
            onClick={onClose}
            className="text-brand-400 hover:text-brand-950"
            aria-label="Close filters"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-5 pb-8 pt-2">
          <ProductFilters productCount={productCount} availableColors={availableColors} />
        </div>

        <div className="sticky bottom-0 border-t border-brand-100 bg-white px-5 py-4">
          <button
            onClick={onClose}
            className="btn-primary w-full py-3.5"
          >
            Tampilkan {productCount !== undefined ? `${productCount} Produk` : 'Hasil'}
          </button>
        </div>
      </div>
    </div>
  )
}
