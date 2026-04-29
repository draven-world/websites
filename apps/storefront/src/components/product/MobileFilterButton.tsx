'use client'

import { useState } from 'react'
import { MobileFilterDrawer } from './ProductFilters'

export default function MobileFilterButton({
  activeCount,
  productCount,
  availableColors,
}: {
  activeCount: number
  productCount?: number
  availableColors?: Array<{ name: string; hex: string }>
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 text-[13px] uppercase tracking-widest text-brand-950 transition-opacity hover:opacity-60"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
        </svg>
        Filter
        {activeCount > 0 && (
          <span className="flex h-4 min-w-[1rem] items-center justify-center bg-brand-950 px-1 text-[9px] font-bold text-white">
            {activeCount}
          </span>
        )}
      </button>

      <MobileFilterDrawer
        open={open}
        onClose={() => setOpen(false)}
        productCount={productCount}
        availableColors={availableColors}
      />
    </div>
  )
}
