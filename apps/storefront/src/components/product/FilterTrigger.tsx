'use client'
import { useState } from 'react'
import FilterDrawer from './FilterDrawer'

export default function FilterTrigger({
  productCount,
  availableColors,
}: {
  productCount: number
  availableColors: Array<{ name: string; hex: string }>
}) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-[0.75rem] uppercase tracking-[0.15em] text-ink-100 hover:text-accent-lime transition-colors"
      >
        FILTER
      </button>
      <FilterDrawer
        open={open}
        onClose={() => setOpen(false)}
        productCount={productCount}
        availableColors={availableColors}
      />
    </>
  )
}
