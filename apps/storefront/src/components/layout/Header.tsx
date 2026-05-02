'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useCart } from '@/providers/cart-provider'
import { useAuth } from '@/providers/auth-provider'
import { formatRupiah } from '@/lib/utils'

type SearchResult = {
  id: string
  title: string
  handle: string
  thumbnail: string | null
  variants: Array<{ prices: Array<{ amount: number }> }>
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [searching, setSearching] = useState(false)
  const [searched, setSearched] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [badgeBounce, setBadgeBounce] = useState(false)
  const { totalItems, lastAddedAt } = useCart()
  const { user } = useAuth()

  useEffect(() => {
    if (lastAddedAt > 0) {
      setBadgeBounce(true)
      const t = setTimeout(() => setBadgeBounce(false), 600)
      return () => clearTimeout(t)
    }
  }, [lastAddedAt])

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([])
      setSearched(false)
      setSearching(false)
      return
    }
    setSearching(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      setResults(data)
      setSearched(true)
    } catch {
      setResults([])
      setSearched(true)
    } finally {
      setSearching(false)
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!searchQuery.trim()) {
      setResults([])
      setSearched(false)
      return
    }
    debounceRef.current = setTimeout(() => doSearch(searchQuery), 300)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [searchQuery, doSearch])

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
              <Link href="/gallery" className="text-[13px] uppercase tracking-widest text-brand-950 transition-opacity hover:opacity-50">
                Gallery
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
                <span className={`absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center bg-brand-950 text-[8px] font-bold text-white ${badgeBounce ? 'animate-badge-bounce' : ''}`}>
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
            <button
              onClick={() => { setSearchOpen(false); setSearchQuery(''); setResults([]); setSearched(false) }}
              className="text-brand-950"
              aria-label="Close search"
            >
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
              <label htmlFor="search-input" className="sr-only">Search products</label>
              <input
                id="search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SEARCH"
                className="w-full border-b border-brand-950 bg-transparent pb-3 text-2xl font-medium uppercase tracking-widest text-brand-950 placeholder-brand-300 outline-none"
                autoFocus
              />
            </form>

            {/* Live results */}
            <div className="mt-6">
              {searching && (
                <div className="flex items-center gap-2 py-4">
                  <div className="h-4 w-4 animate-spin border-2 border-brand-950 border-t-transparent" />
                  <span className="text-sm text-brand-400">Searching...</span>
                </div>
              )}

              {!searching && searched && results.length === 0 && (
                <p className="py-4 text-sm text-brand-400">
                  No results found for &ldquo;{searchQuery}&rdquo;
                </p>
              )}

              {!searching && results.length > 0 && (
                <>
                  <p className="text-[11px] uppercase tracking-widest text-brand-400">
                    {results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{searchQuery}&rdquo;
                  </p>
                  <div className="mt-4 divide-y divide-brand-100">
                    {results.map((item) => (
                      <Link
                        key={item.id}
                        href={`/products/${item.handle}`}
                        onClick={() => { setSearchOpen(false); setSearchQuery(''); setResults([]); setSearched(false) }}
                        className="flex items-center gap-4 py-3 transition-opacity hover:opacity-60"
                      >
                        <div className="relative h-14 w-11 flex-shrink-0 overflow-hidden bg-brand-50">
                          {item.thumbnail ? (
                            <Image src={item.thumbnail} alt={item.title} fill className="object-cover" sizes="44px" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <span className="text-[7px] uppercase tracking-widest text-brand-300">No img</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-sm font-medium text-brand-950">{item.title}</p>
                          <p className="text-xs text-brand-400">
                            {item.variants?.[0]?.prices?.[0]
                              ? formatRupiah(item.variants[0].prices[0].amount)
                              : ''}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Link
                    href={`/products?q=${encodeURIComponent(searchQuery)}`}
                    onClick={() => { setSearchOpen(false); setSearchQuery(''); setResults([]); setSearched(false) }}
                    className="mt-4 block text-center text-[11px] uppercase tracking-widest text-brand-400 transition-colors hover:text-brand-950"
                  >
                    View all results
                  </Link>
                </>
              )}
            </div>
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
              { label: 'Gallery', href: '/gallery' },
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
