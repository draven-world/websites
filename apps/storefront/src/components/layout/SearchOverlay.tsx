'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useRef, useCallback } from 'react'
import { formatRupiah } from '@/lib/utils'

type SearchResult = {
  id: string
  title: string
  handle: string
  thumbnail: string | null
  variants: Array<{ prices: Array<{ amount: number }> }>
}

export default function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [searching, setSearching] = useState(false)
  const [searched, setSearched] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [searchQuery, doSearch])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  function handleClose() {
    onClose()
    setSearchQuery('')
    setResults([])
    setSearched(false)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-white">
      <div className="flex h-14 items-center justify-end px-5">
        <button
          onClick={handleClose}
          className="text-ink-950 transition-opacity hover:opacity-50"
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
          <label htmlFor="search-input" className="sr-only">
            Search products
          </label>
          <input
            id="search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="SEARCH"
            className="w-full border-b border-ink-950 bg-transparent pb-3 text-2xl font-medium uppercase tracking-widest text-ink-950 placeholder-ink-300 outline-none"
            autoFocus
          />
        </form>

        <div className="mt-6">
          {searching && (
            <div className="flex items-center gap-2 py-4">
              <div className="h-4 w-4 animate-spin border-2 border-ink-950 border-t-transparent" />
              <span className="text-sm text-ink-500">Searching...</span>
            </div>
          )}

          {!searching && searched && results.length === 0 && (
            <p className="py-4 text-sm text-ink-500">
              No results found for &ldquo;{searchQuery}&rdquo;
            </p>
          )}

          {!searching && results.length > 0 && (
            <>
              <p className="text-[11px] uppercase tracking-widest text-ink-500">
                {results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{searchQuery}&rdquo;
              </p>
              <div className="mt-4 divide-y divide-ink-100">
                {results.map((item) => (
                  <Link
                    key={item.id}
                    href={`/products/${item.handle}`}
                    onClick={handleClose}
                    className="flex items-center gap-4 py-3 transition-opacity hover:opacity-60"
                  >
                    <div className="relative h-14 w-11 flex-shrink-0 overflow-hidden bg-ink-50">
                      {item.thumbnail ? (
                        <Image src={item.thumbnail} alt={item.title} fill className="object-cover" sizes="44px" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <span className="text-[7px] uppercase tracking-widest text-ink-300">No img</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-ink-950">{item.title}</p>
                      <p className="text-xs text-ink-500">
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
                onClick={handleClose}
                className="mt-4 block text-center text-[11px] uppercase tracking-widest text-ink-500 transition-colors hover:text-ink-950"
              >
                View all results
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
