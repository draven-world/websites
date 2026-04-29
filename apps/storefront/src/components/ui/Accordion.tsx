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
    <div className="border-b border-brand-100">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={isOpen}
        aria-controls={id}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="text-eyebrow text-brand-950">{label}</span>
        <span aria-hidden className="text-brand-400 text-lg leading-none">
          {isOpen ? '−' : '+'}
        </span>
      </button>
      <div
        id={id}
        className="accordion-grid"
        data-open={isOpen ? 'true' : 'false'}
      >
        <div>
          <div className="pb-5 text-sm leading-relaxed text-brand-500">{children}</div>
        </div>
      </div>
    </div>
  )
}
