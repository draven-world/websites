'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function FilterDrawer({
  open,
  onClose,
  productCount,
  availableColors,
}: {
  open: boolean
  onClose: () => void
  productCount: number
  availableColors: Array<{ name: string; hex: string }>
}) {
  const router = useRouter()
  const params = useSearchParams()

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  function setParam(key: string, value: string | null) {
    const next = new URLSearchParams(params.toString())
    if (value === null || value === '') next.delete(key)
    else next.set(key, value)
    router.push(`/products?${next.toString()}`)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60]" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60" />
      <aside
        onClick={(e) => e.stopPropagation()}
        className="absolute top-0 left-0 h-full w-full sm:w-[380px] bg-ink-900 border-r border-ink-700 overflow-y-auto"
      >
        <div className="flex items-center justify-between px-6 h-14 border-b border-ink-700">
          <span className="text-[0.8125rem] uppercase tracking-[0.18em] text-ink-300">FILTER</span>
          <button onClick={onClose} className="text-[0.8125rem] font-bold uppercase tracking-[0.18em] text-ink-100">CLOSE</button>
        </div>

        <div className="p-6 flex flex-col gap-8">
          <FilterGroup title="CATEGORY">
            {['hoodies', 't-shirts', 'jackets', 'accessories'].map((cat) => (
              <FilterPill
                key={cat}
                active={params.get('category') === cat}
                onClick={() => setParam('category', params.get('category') === cat ? null : cat)}
              >
                {cat.toUpperCase()}
              </FilterPill>
            ))}
          </FilterGroup>

          <FilterGroup title="PRICE">
            {[
              { label: 'UNDER 250K', value: '0-250000' },
              { label: '250K – 500K', value: '250000-500000' },
              { label: '500K – 1M',   value: '500000-1000000' },
              { label: 'OVER 1M',     value: '1000000-' },
            ].map((opt) => (
              <FilterPill
                key={opt.value}
                active={params.get('price') === opt.value}
                onClick={() => setParam('price', params.get('price') === opt.value ? null : opt.value)}
              >
                {opt.label}
              </FilterPill>
            ))}
          </FilterGroup>

          <FilterGroup title="SIZE">
            {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((s) => (
              <FilterPill
                key={s}
                active={params.get('size')?.toUpperCase() === s}
                onClick={() => setParam('size', params.get('size')?.toUpperCase() === s ? null : s)}
              >
                {s}
              </FilterPill>
            ))}
          </FilterGroup>

          {availableColors.length > 0 && (
            <FilterGroup title="COLOR">
              {availableColors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setParam('color', params.get('color') === c.name ? null : c.name)}
                  className={`flex items-center gap-2 px-3 py-2 border ${
                    params.get('color') === c.name ? 'border-accent-lime text-accent-lime' : 'border-ink-700 text-ink-100'
                  }`}
                >
                  <span className="w-3 h-3 rounded-full" style={{ background: c.hex }} />
                  <span className="text-[0.75rem] uppercase tracking-[0.15em]">{c.name.toUpperCase()}</span>
                </button>
              ))}
            </FilterGroup>
          )}
        </div>

        <div className="sticky bottom-0 bg-ink-900 border-t border-ink-700 p-4 flex gap-3">
          <button onClick={() => router.push('/products')} className="flex-1 btn-ghost">RESET</button>
          <button onClick={onClose} className="flex-1 btn-primary">VIEW {productCount}</button>
        </div>
      </aside>
    </div>
  )
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[0.75rem] uppercase tracking-[0.15em] text-ink-300 mb-3">{title}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}

function FilterPill({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 border text-[0.75rem] uppercase tracking-[0.15em] transition-colors ${
        active
          ? 'border-accent-lime text-accent-lime'
          : 'border-ink-700 text-ink-100 hover:border-ink-300'
      }`}
    >
      {children}
    </button>
  )
}
