'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const sortOptions = [
  { label: 'Featured', value: '' },
  { label: 'Harga Terendah', value: 'price-asc' },
  { label: 'Harga Tertinggi', value: 'price-desc' },
]

const priceRanges = [
  { label: 'Semua Harga', value: '' },
  { label: 'Di bawah Rp 200.000', value: '0-200000' },
  { label: 'Rp 200.000 - Rp 500.000', value: '200000-500000' },
  { label: 'Rp 500.000 - Rp 1.000.000', value: '500000-1000000' },
  { label: 'Di atas Rp 1.000.000', value: '1000000-' },
]

const categories = [
  { label: 'Semua Produk', value: '' },
  { label: 'Kaos', value: 'kaos' },
  { label: 'Hoodie', value: 'hoodie' },
  { label: 'Celana', value: 'celana' },
  { label: 'Jaket', value: 'jaket' },
  { label: 'Tas', value: 'tas' },
  { label: 'Aksesoris', value: 'aksesoris' },
]

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-brand-100 py-5">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="text-sm font-bold text-brand-900">{title}</span>
        <svg
          className={`h-4 w-4 text-brand-400 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="mt-4">{children}</div>}
    </div>
  )
}

export default function ProductFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentSort = searchParams.get('sort') || ''
  const currentCategory = searchParams.get('category') || ''
  const currentPrice = searchParams.get('price') || ''

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/products?${params.toString()}`)
  }

  const hasFilters = currentCategory || currentPrice || currentSort || searchParams.get('q')

  function clearAll() {
    router.push('/products')
  }

  return (
    <aside className="w-full">
      {/* Clear All */}
      {hasFilters && (
        <button
          onClick={clearAll}
          className="mb-4 w-full border border-brand-200 py-2.5 text-xs font-semibold uppercase tracking-wider text-brand-500 transition-colors hover:border-brand-900 hover:text-brand-900"
        >
          Hapus Semua Filter
        </button>
      )}

      {/* Search */}
      <div className="border-b border-brand-100 pb-5">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const q = (e.currentTarget.elements.namedItem('q') as HTMLInputElement).value
            updateParam('q', q)
          }}
          className="flex items-center gap-2 border border-brand-200 px-3 py-2.5"
        >
          <svg className="h-4 w-4 flex-shrink-0 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            name="q"
            placeholder="Search"
            defaultValue={searchParams.get('q') || ''}
            className="w-full bg-transparent text-sm text-brand-900 placeholder-brand-400 outline-none"
          />
        </form>
      </div>

      {/* Category */}
      <FilterSection title="Product Type">
        <div className="space-y-3">
          {categories.map((cat) => (
            <label key={cat.value} className="flex cursor-pointer items-center gap-2.5">
              <input
                type="radio"
                name="category"
                checked={currentCategory === cat.value}
                onChange={() => updateParam('category', cat.value)}
                className="h-4 w-4 appearance-none rounded-full border border-brand-300 checked:border-[5px] checked:border-brand-900 focus:outline-none"
              />
              <span className="text-sm text-brand-700">{cat.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price */}
      <FilterSection title="Price">
        <div className="space-y-3">
          {priceRanges.map((range) => (
            <label key={range.value} className="flex cursor-pointer items-center gap-2.5">
              <input
                type="radio"
                name="price"
                checked={currentPrice === range.value}
                onChange={() => updateParam('price', range.value)}
                className="h-4 w-4 appearance-none rounded-full border border-brand-300 checked:border-[5px] checked:border-brand-900 focus:outline-none"
              />
              <span className="text-sm text-brand-700">{range.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Sort — mobile friendly, also appears as top bar on desktop */}
      <div className="py-5">
        <label className="text-sm font-bold text-brand-900">Sort</label>
        <select
          value={currentSort}
          onChange={(e) => updateParam('sort', e.target.value)}
          className="mt-2 w-full border border-brand-200 bg-white px-3 py-2.5 text-sm text-brand-700 focus:border-brand-900 focus:outline-none"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </aside>
  )
}

/* Desktop sort dropdown — used separately in the products page header */
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
    <div className="flex items-center gap-2">
      <span className="text-sm font-bold text-brand-900">sort :</span>
      <select
        value={currentSort}
        onChange={(e) => handleSort(e.target.value)}
        className="border border-brand-200 bg-white px-3 py-1.5 text-sm text-brand-700 focus:border-brand-900 focus:outline-none"
      >
        {sortOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
