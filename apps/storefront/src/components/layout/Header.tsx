'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useCart } from '@/providers/cart-provider'
import { useAuth } from '@/providers/auth-provider'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { totalItems } = useCart()
  const { user } = useAuth()

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-container items-center justify-between px-5 lg:h-16 lg:px-8">
          {/* Left */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => setMenuOpen(true)}
              className="text-brand-950 lg:hidden"
              aria-label="Menu"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            <nav className="hidden items-center gap-8 lg:flex">
              <Link href="/products" className="text-[13px] uppercase tracking-widest text-brand-950 transition-opacity hover:opacity-50">
                Shop
              </Link>
              <Link href="/tentang-kami" className="text-[13px] uppercase tracking-widest text-brand-950 transition-opacity hover:opacity-50">
                About
              </Link>
              <Link href="/komunitas" className="text-[13px] uppercase tracking-widest text-brand-950 transition-opacity hover:opacity-50">
                Community
              </Link>
            </nav>
          </div>

          {/* Center: Logo */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <Image
              src="/images/logo.png"
              alt="DRAVEN"
              width={130}
              height={16}
              className="h-4 w-auto object-contain lg:h-[18px]"
              priority
            />
          </Link>

          {/* Right */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSearchOpen(true)}
              className="text-brand-950 transition-opacity hover:opacity-50"
              aria-label="Search"
            >
              <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>
            <Link
              href={user ? '/account' : '/login'}
              className="text-brand-950 transition-opacity hover:opacity-50"
              aria-label="Account"
            >
              <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </Link>
            <Link href="/cart" className="relative text-brand-950 transition-opacity hover:opacity-50" aria-label="Cart">
              <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center bg-brand-950 text-[8px] font-bold text-white">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Search */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="flex h-14 items-center justify-end px-5">
            <button onClick={() => { setSearchOpen(false); setSearchQuery('') }} className="text-brand-950">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="mx-auto max-w-lg px-5 pt-20">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (searchQuery.trim()) window.location.href = `/products?q=${encodeURIComponent(searchQuery)}`
              }}
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SEARCH"
                className="w-full border-b border-brand-950 bg-transparent pb-3 text-2xl font-medium uppercase tracking-widest text-brand-950 placeholder-brand-300 outline-none"
                autoFocus
              />
            </form>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-brand-950 lg:hidden">
          <div className="flex h-14 items-center justify-between px-5">
            <span className="text-[13px] uppercase tracking-widest text-white/50">Menu</span>
            <button onClick={() => setMenuOpen(false)} className="text-white">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="flex flex-col gap-0 px-5 pt-8">
            {[
              { label: 'Shop', href: '/products' },
              { label: 'About', href: '/tentang-kami' },
              { label: 'Community', href: '/komunitas' },
              { label: 'FAQ', href: '/faq' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="border-b border-white/10 py-5 text-2xl font-medium uppercase tracking-tightest text-white transition-opacity hover:opacity-50"
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
