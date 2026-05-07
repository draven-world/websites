'use client'
import { useRouter, useSearchParams } from 'next/navigation'

export default function SortDropdown() {
  const router = useRouter()
  const params = useSearchParams()
  const current = params.get('sort') ?? 'default'

  function set(value: string) {
    const next = new URLSearchParams(params.toString())
    if (value === 'default') next.delete('sort')
    else next.set('sort', value)
    router.push(`/products?${next.toString()}`)
  }

  return (
    <select
      value={current}
      onChange={(e) => set(e.target.value)}
      className="bg-transparent border-0 text-[0.75rem] uppercase tracking-[0.15em] text-ink-100 focus:outline-none cursor-pointer hover:text-accent-lime"
      aria-label="Sort products"
    >
      <option value="default" className="bg-ink-900">SORT</option>
      <option value="price-asc" className="bg-ink-900">PRICE ↑</option>
      <option value="price-desc" className="bg-ink-900">PRICE ↓</option>
      <option value="name-asc" className="bg-ink-900">A → Z</option>
    </select>
  )
}
