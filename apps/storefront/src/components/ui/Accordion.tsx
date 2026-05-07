'use client'

import { useState, useId, type ReactNode } from 'react'

type AccordionProps = {
  label: string
  children: ReactNode
  defaultOpen?: boolean
  /** Force-controlled open state. If provided, `defaultOpen` is ignored. */
  open?: boolean
  onToggle?: (open: boolean) => void
}

export default function Accordion({ label, children, defaultOpen = false, open, onToggle }: AccordionProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const isControlled = typeof open === 'boolean'
  const isOpen = isControlled ? open : internalOpen
  const id = useId()

  function toggle() {
    const next = !isOpen
    if (!isControlled) setInternalOpen(next)
    onToggle?.(next)
  }

  return (
    <div className="border-b border-ink-700">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={isOpen}
        aria-controls={id}
        className="text-[0.8125rem] font-bold uppercase tracking-[0.18em] text-ink-100 py-4 hover:text-accent-lime w-full text-left flex items-center justify-between transition-colors"
      >
        <span>{label}</span>
        <span aria-hidden className="text-ink-400 text-lg leading-none">
          {isOpen ? '−' : '+'}
        </span>
      </button>
      <div
        id={id}
        className="accordion-grid"
        data-open={isOpen ? 'true' : 'false'}
      >
        <div>
          <div className="text-sm text-ink-300 pb-4 leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  )
}
