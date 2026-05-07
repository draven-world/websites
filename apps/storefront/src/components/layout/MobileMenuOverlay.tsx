'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useAuth } from '@/providers/auth-provider'

const NAV_ITEMS = [
  { label: 'SHOP', href: '/products' },
  { label: 'SIZE GUIDE', href: '/size-guide' },
  { label: 'GALLERY', href: '/gallery' },
  { label: 'ABOUT', href: '/tentang-kami' },
  { label: 'HOW TO ORDER', href: '/cara-order' },
  { label: 'FAQ', href: '/faq' },
  { label: 'TERMS', href: '/terms' },
  { label: 'PRIVACY', href: '/kebijakan-privasi' },
] as const

export default function MobileMenuOverlay({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const { user } = useAuth()
  const [searchQ, setSearchQ] = useState('')

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] bg-ink-950 lg:hidden overflow-y-auto">
      <div className="flex h-14 items-center justify-between px-5">
        <span className="text-[0.8125rem] font-black uppercase tracking-[0.18em] text-ink-300">MENU</span>
        <button
          onClick={onClose}
          className="text-[0.8125rem] font-black uppercase tracking-[0.18em] text-ink-100"
          aria-label="Close menu"
        >
          CLOSE
        </button>
      </div>

      <div className="px-5 pt-6">
        <form onSubmit={(e) => {
          e.preventDefault()
          if (searchQ.trim()) window.location.href = `/products?q=${encodeURIComponent(searchQ)}`
        }}>
          <input
            type="text"
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
            placeholder="SEARCH"
            className="w-full border-b border-ink-700 bg-transparent pb-3 text-lg font-black uppercase tracking-[0.18em] text-ink-100 placeholder-ink-500 outline-none focus:border-accent-lime transition-colors"
          />
        </form>
      </div>

      <nav className="flex flex-col mt-8">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className="border-b border-ink-700 px-5 py-5 text-[clamp(1.5rem,3.5vw,2.5rem)] font-black uppercase tracking-tighter text-ink-100 transition-opacity hover:opacity-60"
          >
            {item.label}
          </Link>
        ))}
        {user ? (
          <Link
            href="/account"
            onClick={onClose}
            className="border-b border-ink-700 px-5 py-5 text-[clamp(1.5rem,3.5vw,2.5rem)] font-black uppercase tracking-tighter text-ink-100 transition-opacity hover:opacity-60"
          >
            ACCOUNT
          </Link>
        ) : (
          <Link
            href="/register"
            onClick={onClose}
            className="border-b border-ink-700 px-5 py-5 text-[clamp(1.5rem,3.5vw,2.5rem)] font-black uppercase tracking-tighter text-ink-100 transition-opacity hover:opacity-60"
          >
            SIGN UP
          </Link>
        )}
      </nav>
    </div>
  )
}
