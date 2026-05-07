'use client'

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'draven_announce_dismissed_v1'
const MESSAGE = 'FREE SHIPPING ACROSS INDONESIA OVER RP 500.000 · NEW DROP NOW LIVE'

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
    <div className="relative z-50 bg-ink-900 border-b border-ink-700">
      <div className="mx-auto flex max-w-container items-center justify-center px-5 lg:px-8">
        <p className="text-center text-[0.75rem] uppercase tracking-[0.15em] text-ink-300 py-2">{MESSAGE}</p>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss announcement"
          className="absolute right-4 lg:right-8 text-ink-500 transition-colors hover:text-ink-100"
        >
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
