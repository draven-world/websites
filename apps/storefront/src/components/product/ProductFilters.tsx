'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const categories = [
  { label: 'All', value: '' },
  { label: 'Kaos', value: 'kaos' },
  { label: 'Hoodie', value: 'hoodie' },
  { label: 'Celana', value: 'celana' },
  { label: 'Jaket', value: 'jaket' },
  { label: 'Aksesoris', value: 'aksesoris' },
]

const sortOptions = [
  { label: 'Featured', value: '' },
  { label: 'Price: Low', value: 'price-asc' },
  { label: 'Price: High', value: 'price-desc' },
]

export default function ProductFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get('category') || ''

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/products?${params.toString()}`)
  }

  return (
    <aside className="w-full">
      {/* Categories */}
      <div className="space-y-2">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => updateParam('category', cat.value)}
            aria-current={currentCategory === cat.value ? 'page' : undefined}
            className={`block text-sm transition-opacity ${
              currentCategory === cat.value
                ? 'text-brand-950'
                : 'text-brand-400 hover:text-brand-950'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </aside>
  )
}

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
