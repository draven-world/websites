'use client'

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'draven_announce_dismissed_v1'
const MESSAGE = 'Free shipping over Rp 500.000 · Pengiriman ke seluruh Indonesia'

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const dismissed = window.localStorage.getItem(STORAGE_KEY)
    if (!dismissed) setVisible(true)
  }, [])

  function dismiss() {
    setVisible(false)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, '1')
    }
  }

  if (!visible) return null

  return (
    <div className="relative z-50 bg-brand-950 text-white">
      <div className="mx-auto flex h-8 max-w-container items-center justify-center px-5 lg:px-8">
        <p className="text-[10px] uppercase tracking-[0.2em] lg:text-[11px]">{MESSAGE}</p>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss announcement"
          className="absolute right-4 lg:right-8 text-white/60 transition-colors hover:text-white"
        >
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
