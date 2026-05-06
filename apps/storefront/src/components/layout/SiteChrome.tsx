'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useCart } from '@/providers/cart-provider'
import { useAuth } from '@/providers/auth-provider'
import SearchOverlay from './SearchOverlay'
import MobileMenuOverlay from './MobileMenuOverlay'

const VERTICAL_NAV = [
  { label: 'SHOP', href: '/products' },
  { label: 'SIZE GUIDE', href: '/size-guide' },
  { label: 'GALLERY', href: '/gallery' },
  { label: 'ABOUT', href: '/tentang-kami' },
  { label: 'HOW TO ORDER', href: '/cara-order' },
  { label: 'FAQ', href: '/faq' },
  { label: 'TERMS', href: '/terms' },
  { label: 'PRIVACY', href: '/kebijakan-privasi' },
] as const

export default function SiteChrome() {
  const { totalItems, lastAddedAt } = useCart()
  const { user } = useAuth()
  const pathname = usePathname()
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [bagBounce, setBagBounce] = useState(false)

  useEffect(() => {
    if (lastAddedAt > 0) {
      setBagBounce(true)
      const t = setTimeout(() => setBagBounce(false), 600)
      return () => clearTimeout(t)
    }
  }, [lastAddedAt])

  return (
    <>
      {/* Top-left: Draven wordmark */}
      <Link
        href="/"
        className="fixed top-5 left-5 lg:top-8 lg:left-8 z-50 transition-opacity hover:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-lime focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950"
        aria-label="Draven home"
      >
        <Image
          src="/images/logo.png"
          alt="DRAVEN"
          width={130}
          height={20}
          className="h-4 lg:h-5 w-auto object-contain"
          style={{ filter: 'invert(1) brightness(2)' }}
          priority
        />
      </Link>

      {/* Top-right desktop: SEARCH + BAG */}
      <div className="hidden lg:flex fixed top-8 right-8 z-50 items-center gap-5">
        <button
          onClick={() => setSearchOpen(true)}
          className="text-[0.8125rem] font-bold uppercase tracking-[0.18em] text-ink-100 transition-opacity hover:opacity-60"
          aria-label="Open search"
        >
          SEARCH
        </button>
        <Link
          href="/cart"
          className="text-[0.8125rem] font-bold uppercase tracking-[0.18em] text-ink-100 transition-opacity hover:opacity-60"
          aria-label={`Bag, ${totalItems} items`}
        >
          BAG<sup className={`ml-0.5 text-[10px] ${bagBounce ? 'animate-badge-bounce inline-block' : ''}`}>{totalItems}</sup>
        </Link>
      </div>

      {/* Top-right mobile: MENU + BAG */}
      <div className="flex lg:hidden fixed top-5 right-5 z-50 items-center gap-4">
        <button
          onClick={() => setMenuOpen(true)}
          className="text-[0.8125rem] font-bold uppercase tracking-[0.18em] text-ink-100"
          aria-label="Open menu"
        >
          MENU
        </button>
        <Link
          href="/cart"
          className="text-[0.8125rem] font-bold uppercase tracking-[0.18em] text-ink-100"
          aria-label={`Bag, ${totalItems} items`}
        >
          BAG<sup className={`ml-0.5 text-[10px] ${bagBounce ? 'animate-badge-bounce inline-block' : ''}`}>{totalItems}</sup>
        </Link>
      </div>

      {/* Bottom-left: vertical nav (desktop only) */}
      <nav className="hidden lg:flex fixed bottom-8 left-8 z-50 flex-col gap-2.5" aria-label="Site navigation">
        {VERTICAL_NAV.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`text-[0.8125rem] font-bold uppercase tracking-[0.18em] transition-opacity hover:opacity-60 ${
                active ? 'text-accent-lime' : 'text-ink-100'
              }`}
            >
              {item.label}
            </Link>
          )
        })}
        {user ? (
          <Link
            href="/account"
            className={`text-[0.8125rem] font-bold uppercase tracking-[0.18em] transition-opacity hover:opacity-60 ${
              pathname === '/account' ? 'text-accent-lime' : 'text-ink-100'
            }`}
          >
            ACCOUNT
          </Link>
        ) : (
          <Link
            href="/register"
            className={`text-[0.8125rem] font-bold uppercase tracking-[0.18em] transition-opacity hover:opacity-60 ${
              pathname === '/register' ? 'text-accent-lime' : 'text-ink-100'
            }`}
          >
            SIGN UP
          </Link>
        )}
      </nav>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <MobileMenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
