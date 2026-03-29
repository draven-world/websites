'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useCart } from '@/providers/cart-provider'

const navLinks = [
  { label: 'KATALOG', href: '/products' },
  { label: 'KOMUNITAS', href: '/komunitas' },
  { label: 'TENTANG', href: '/tentang' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { totalItems } = useCart()

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-brand-100 bg-white">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 lg:h-[72px] lg:px-8">
          {/* Left: Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/images/logo.png"
              alt="DRAVEN"
              width={150}
              height={20}
              className="h-5 w-auto object-contain lg:h-6"
              priority
            />
          </Link>

          {/* Center: Nav (desktop) */}
          <nav className="hidden items-center gap-10 lg:flex">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[13px] font-semibold tracking-wider text-brand-500 transition-colors hover:text-brand-900"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-brand-400 transition-colors hover:text-brand-900"
              aria-label="Cari"
            >
              <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 text-brand-400 transition-colors hover:text-brand-900"
              aria-label="Keranjang"
            >
              <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center bg-brand-900 text-[9px] font-bold text-white">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Hamburger (mobile) */}
            <button
              onClick={() => setMenuOpen(true)}
              className="p-2 text-brand-400 transition-colors hover:text-brand-900 lg:hidden"
              aria-label="Menu"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="mx-auto max-w-xl px-5 pt-28">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (searchQuery.trim()) {
                  window.location.href = `/products?q=${encodeURIComponent(searchQuery)}`
                }
              }}
              className="border-b border-brand-900 pb-3"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari produk..."
                className="w-full bg-transparent text-lg text-brand-900 placeholder-brand-300 outline-none"
                autoFocus
              />
            </form>
          </div>
          <button
            onClick={() => setSearchOpen(false)}
            className="absolute right-5 top-5 p-2 text-brand-400 hover:text-brand-900"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-white lg:hidden">
          <div className="flex h-16 items-center justify-between border-b border-brand-100 px-5">
            <Image src="/images/logo.png" alt="DRAVEN" width={140} height={17} className="h-5 w-auto object-contain" />
            <button
              onClick={() => setMenuOpen(false)}
              className="p-2 text-brand-400 hover:text-brand-900"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="px-5 pt-2">
            {[
              { label: 'BERANDA', href: '/' },
              ...navLinks,
              { label: 'FAQ', href: '/faq' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block border-b border-brand-50 py-5 text-[14px] font-semibold tracking-wider text-brand-900"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  )
}
