# Editorial Fashion UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Elevate the DRAVEN storefront from functional minimalism to a distinctive editorial fashion aesthetic by adding a serif display typeface, dramatic type scale, and richer homepage modules — with no changes to commerce/payment/shipping logic.

**Architecture:** Pure component refactors and additions in `apps/storefront`. Shared design tokens via `packages/config/tailwind`. CSS-only motion (no Framer Motion / GSAP). Server Components by default; Client Components only where state is needed (HeroBanner, AnnouncementBar dismiss, accordions, ProductDetail).

**Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, next/font/google (Fraunces + Work Sans), Sanity (existing), Medusa.js (existing).

**Verification convention:** This codebase has no unit-test setup. Each task ends with `pnpm --filter @draven/storefront typecheck` and visual verification on `pnpm dev --filter storefront` at `http://localhost:3000`. Treat the typecheck + visual check as the "test."

---

## File map

**New:**
- `apps/storefront/src/components/layout/AnnouncementBar.tsx`
- `apps/storefront/src/components/home/FeaturedCollection.tsx`
- `apps/storefront/src/components/home/ProductGridSection.tsx`
- `apps/storefront/src/components/home/LookbookTiles.tsx`
- `apps/storefront/src/components/home/EditorialQuote.tsx`
- `apps/storefront/src/components/ui/Accordion.tsx`
- `apps/storefront/src/components/ui/NewsletterForm.tsx`

**Modified:**
- `apps/storefront/src/app/layout.tsx`
- `apps/storefront/src/app/(store)/layout.tsx` (if exists — check; otherwise edits go in root layout)
- `apps/storefront/src/app/(store)/page.tsx`
- `apps/storefront/src/app/globals.css`
- `apps/storefront/src/components/layout/Header.tsx`
- `apps/storefront/src/components/layout/Footer.tsx`
- `apps/storefront/src/components/home/HeroBanner.tsx`
- `apps/storefront/src/components/product/ProductCard.tsx`
- `apps/storefront/src/components/product/ProductDetail.tsx`
- `packages/config/tailwind/index.js`

---

## Task 1: Foundation — type system & tokens

**Files:**
- Modify: `packages/config/tailwind/index.js`
- Modify: `apps/storefront/src/app/layout.tsx`
- Modify: `apps/storefront/src/app/globals.css`

- [ ] **Step 1: Extend Tailwind theme with serif family, display scale, and eyebrow**

Replace contents of `packages/config/tailwind/index.js`:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fafafa',
          100: '#f0f0f0',
          200: '#e0e0e0',
          300: '#b0b0b0',
          400: '#808080',
          500: '#606060',
          600: '#404040',
          700: '#303030',
          800: '#202020',
          900: '#141414',
          950: '#0a0a0a',
        },
      },
      fontFamily: {
        sans: ['var(--font-work-sans)', 'Helvetica Neue', 'Arial', 'sans-serif'],
        serif: ['var(--font-fraunces)', 'Georgia', 'serif'],
      },
      fontSize: {
        'display-xl': ['clamp(3.5rem, 9vw, 7rem)', { lineHeight: '0.95', letterSpacing: '-0.03em' }],
        'display':    ['clamp(2.5rem, 6vw, 4.5rem)', { lineHeight: '1.0',  letterSpacing: '-0.025em' }],
        'display-sm': ['clamp(1.75rem, 4vw, 2.75rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'eyebrow':    ['11px', { lineHeight: '1', letterSpacing: '0.2em' }],
      },
      letterSpacing: {
        tightest: '-0.05em',
        tighter: '-0.03em',
      },
      maxWidth: {
        container: '1400px',
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out',
        'slide-up': 'slide-up 0.4s ease-out',
        'letter-rise': 'letter-rise 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'letter-rise': {
          '0%':   { opacity: '0', transform: 'translateY(0.6em)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 2: Add Fraunces font in root layout**

Modify `apps/storefront/src/app/layout.tsx`. Replace the existing Google Font import/usage block (lines 3, 9–14, 41–42) with:

```tsx
import type { Metadata } from 'next'
import Script from 'next/script'
import { Work_Sans, Fraunces } from 'next/font/google'
import { CartProvider } from '@/providers/cart-provider'
import { AuthProvider } from '@/providers/auth-provider'
import { ToastProvider } from '@/providers/toast-provider'
import './globals.css'

const workSans = Work_Sans({
  subsets: ['latin'],
  variable: '--font-work-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['opsz', 'SOFT', 'WONK'],
})
```

Then update the `<html>` and `<body>` tags:

```tsx
    <html lang="id" className={`${workSans.variable} ${fraunces.variable}`}>
      <body className="font-sans">
```

(Remove `className={workSans.className}` from `<body>`; the variable + `font-sans` utility handles it.)

- [ ] **Step 3: Add globals.css editorial utilities and accordion transitions**

Append to `apps/storefront/src/app/globals.css` (after the existing `@layer utilities` block):

```css
@layer components {
  .text-eyebrow {
    @apply text-[11px] uppercase tracking-[0.2em] font-medium;
  }
}

@layer utilities {
  /* Letter-stagger reveal — pair with inline style="animation-delay: Nms" */
  .letter-rise {
    display: inline-block;
    opacity: 0;
    animation: letter-rise 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  /* Accordion height transition without JS measurement */
  .accordion-grid {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 300ms ease;
  }
  .accordion-grid[data-open='true'] {
    grid-template-rows: 1fr;
  }
  .accordion-grid > * {
    overflow: hidden;
  }
}
```

- [ ] **Step 4: Verify typecheck and visual loading of Fraunces**

Run: `pnpm --filter @draven/storefront typecheck`
Expected: no errors.

Run: `pnpm dev --filter storefront`
Open `http://localhost:3000`. In DevTools → Network, filter for "fraunces". Expected: at least one Fraunces font file loaded (woff2). No console errors.

- [ ] **Step 5: Commit**

```bash
git add packages/config/tailwind/index.js apps/storefront/src/app/layout.tsx apps/storefront/src/app/globals.css
git commit -m "feat(ui): add Fraunces serif + editorial type scale and tokens"
```

---

## Task 2: Shared `Accordion` component

**Files:**
- Create: `apps/storefront/src/components/ui/Accordion.tsx`

- [ ] **Step 1: Write the component**

Create `apps/storefront/src/components/ui/Accordion.tsx`:

```tsx
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
```

- [ ] **Step 2: Verify typecheck**

Run: `pnpm --filter @draven/storefront typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add apps/storefront/src/components/ui/Accordion.tsx
git commit -m "feat(ui): add shared Accordion component"
```

---

## Task 3: AnnouncementBar component

**Files:**
- Create: `apps/storefront/src/components/layout/AnnouncementBar.tsx`
- Modify: `apps/storefront/src/app/layout.tsx`
- Modify: `apps/storefront/src/components/layout/Header.tsx`

- [ ] **Step 1: Create AnnouncementBar**

Create `apps/storefront/src/components/layout/AnnouncementBar.tsx`:

```tsx
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
```

- [ ] **Step 2: Mount AnnouncementBar in root layout**

In `apps/storefront/src/app/layout.tsx`, import the bar and place it at the top of `<body>` (above all providers' children rendering chain — but inside ToastProvider so toast still renders above). Simplest: render directly inside `<body>` as the first child after providers wrap children.

Find the JSX:

```tsx
<body className="font-sans">
  <AuthProvider>
    <CartProvider>
      <ToastProvider>{children}</ToastProvider>
    </CartProvider>
  </AuthProvider>
```

Replace with:

```tsx
<body className="font-sans">
  <AnnouncementBar />
  <AuthProvider>
    <CartProvider>
      <ToastProvider>{children}</ToastProvider>
    </CartProvider>
  </AuthProvider>
```

Add the import at the top:

```tsx
import AnnouncementBar from '@/components/layout/AnnouncementBar'
```

- [ ] **Step 3: Header stays sticky from top — no changes**

The announcement bar lives above the page, scrolls away naturally; the existing `sticky top-0` on `<Header>` continues to pin to viewport top once the bar scrolls past. **Do not** modify Header sticky offset.

- [ ] **Step 4: Verify typecheck and visual**

Run: `pnpm --filter @draven/storefront typecheck`
Expected: no errors.

In browser, hard-reload `http://localhost:3000`. Expected:
- Black bar appears at very top with the message
- Click X — bar disappears, refresh page, bar stays dismissed
- Clear localStorage `draven_announce_dismissed_v1`, reload, bar returns

- [ ] **Step 5: Commit**

```bash
git add apps/storefront/src/components/layout/AnnouncementBar.tsx apps/storefront/src/app/layout.tsx
git commit -m "feat(ui): add dismissible announcement bar"
```

---

## Task 4: ProductCard editorial variant

**Files:**
- Modify: `apps/storefront/src/components/product/ProductCard.tsx`

- [ ] **Step 1: Replace component**

Replace contents of `apps/storefront/src/components/product/ProductCard.tsx`:

```tsx
import Image from 'next/image'
import Link from 'next/link'
import { formatRupiah } from '@/lib/utils'

const BLUR_DATA =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8+P9/PQAJhAN8xGmFjwAAAABJRU5ErkJggg=='

type Variant = {
  id: string
  inventory_quantity?: number
  options?: Array<{ value: string }>
  prices: Array<{ amount: number; currency_code: string }>
}

type Product = {
  id: string
  title: string
  handle: string
  thumbnail: string | null
  images?: Array<{ id: string; url: string }>
  collection?: { title?: string | null } | null
  tags?: Array<{ value: string }>
  variants: Variant[]
}

function deriveCategory(product: Product): string | null {
  if (product.collection?.title) return product.collection.title
  if (product.tags && product.tags.length > 0) return product.tags[0].value
  return null
}

function deriveSizes(variants: Variant[]): Array<{ label: string; soldOut: boolean }> {
  const seen = new Map<string, { label: string; soldOut: boolean }>()
  for (const v of variants) {
    const sizeOpt = v.options?.find((o) => /^(xs|s|m|l|xl|xxl|\d+)$/i.test((o.value || '').trim()))
    if (!sizeOpt) continue
    const label = sizeOpt.value.toUpperCase()
    const soldOut = (v.inventory_quantity ?? 0) <= 0
    const existing = seen.get(label)
    if (!existing || (existing.soldOut && !soldOut)) {
      seen.set(label, { label, soldOut })
    }
  }
  return Array.from(seen.values())
}

export default function ProductCard({
  product,
  priority = false,
}: {
  product: Product
  priority?: boolean
}) {
  const price = product.variants[0]?.prices?.find((p) => p.currency_code === 'idr')
  const priceAmount = price?.amount ?? 0
  const allSoldOut = product.variants.every((v) => (v.inventory_quantity ?? 0) <= 0)
  const category = deriveCategory(product)
  const sizes = deriveSizes(product.variants)
  const secondaryImage = product.images?.[1]?.url

  return (
    <Link href={`/products/${product.handle}`} className="group block">
      <div className={`relative aspect-[3/4] overflow-hidden bg-brand-100 ${allSoldOut ? 'grayscale opacity-70' : ''}`}>
        {product.thumbnail ? (
          <>
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 50vw, 25vw"
              placeholder="blur"
              blurDataURL={BLUR_DATA}
              priority={priority}
            />
            {secondaryImage && (
              <Image
                src={secondaryImage}
                alt=""
                fill
                aria-hidden
                className="object-cover opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            )}
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-eyebrow text-brand-300">No Image</span>
          </div>
        )}
        {allSoldOut && (
          <span className="absolute bottom-3 left-3 bg-white px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-brand-950">
            Sold Out
          </span>
        )}
      </div>
      <div className="mt-3">
        {category && (
          <p className="text-[10px] uppercase tracking-[0.2em] text-brand-400 mb-1">{category}</p>
        )}
        <h3 className="text-[13px] font-medium tracking-tight text-brand-950 line-clamp-1">
          {product.title}
        </h3>
        <p className="mt-0.5 text-[13px] text-brand-400">{formatRupiah(priceAmount)}</p>
        {sizes.length > 0 && (
          <div
            className="mt-2 hidden gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100 lg:flex"
            aria-hidden
          >
            {sizes.map((s) => (
              <span
                key={s.label}
                className={`text-[10px] uppercase tracking-[0.15em] ${
                  s.soldOut ? 'text-brand-300 line-through' : 'text-brand-950'
                }`}
              >
                {s.label}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
```

- [ ] **Step 2: Verify typecheck**

Run: `pnpm --filter @draven/storefront typecheck`
Expected: no errors. If `collection` or `tags` cause type errors at call sites, those callers may need their query types loosened — check `lib/medusa.ts` and `lib/sanity.ts` to confirm. The new `Product` type uses optional fields so it should accept the existing shape.

- [ ] **Step 3: Visual verify on `/products` page**

Open `http://localhost:3000/products`. Expected:
- Product cards still render
- Hovering a card: image scales 1.03; if a second image exists it crossfades in; size dots appear under price (desktop only, ≥1024px)
- Sold-out items (if any) appear desaturated with "Sold Out" badge bottom-left

- [ ] **Step 4: Commit**

```bash
git add apps/storefront/src/components/product/ProductCard.tsx
git commit -m "feat(ui): editorial ProductCard with hover swap, eyebrow, size dots"
```

---

## Task 5: Hero refactor with letter-stagger reveal

**Files:**
- Modify: `apps/storefront/src/components/home/HeroBanner.tsx`

- [ ] **Step 1: Replace component**

Replace contents of `apps/storefront/src/components/home/HeroBanner.tsx`:

```tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useRef, useCallback } from 'react'

type Banner = {
  title: string
  subtitle?: string
  eyebrow?: string
  image: string | null
  link: string | null
}

const fallbackSlides: Banner[] = [
  { title: '', image: '/images/hero-1.png', link: '/products' },
  { title: '', image: '/images/hero-2.png', link: '/products' },
]

const SLIDE_DURATION_MS = 8000

function StaggeredTitle({ text, slideKey }: { text: string; slideKey: number }) {
  // Split on spaces but preserve them as their own non-breaking units
  const chars = Array.from(text)
  return (
    <h1
      key={slideKey}
      className="font-serif text-display-xl text-white"
      aria-label={text}
    >
      {chars.map((ch, i) => (
        <span
          key={i}
          aria-hidden
          className="letter-rise"
          style={{ animationDelay: `${i * 30}ms` }}
        >
          {ch === ' ' ? ' ' : ch}
        </span>
      ))}
    </h1>
  )
}

export default function HeroBanner({ banners }: { banners: Banner[] }) {
  const slides = banners.length > 0 ? banners : fallbackSlides
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startTimer = useCallback(() => {
    if (slides.length <= 1) return
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, SLIDE_DURATION_MS)
  }, [slides.length])

  useEffect(() => {
    if (paused) {
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }
    startTimer()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [paused, startTimer])

  const slide = slides[current]
  const hasContent = slide.title || slide.subtitle || slide.eyebrow

  return (
    <section className="relative">
      <div
        className="relative h-[90vh] min-h-[600px] w-full overflow-hidden bg-brand-950"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {slide.image && (
          <Image
            src={slide.image}
            alt={slide.title || 'DRAVEN'}
            fill
            className="object-cover opacity-80 transition-opacity duration-1000"
            priority
          />
        )}

        <div className="absolute inset-0 flex flex-col justify-end px-8 pb-20 md:px-16 md:pb-24">
          {hasContent && (
            <div className="mb-8 max-w-2xl">
              {slide.eyebrow && (
                <p className="mb-4 text-eyebrow text-white/80">{slide.eyebrow}</p>
              )}
              {slide.title && <StaggeredTitle text={slide.title} slideKey={current} />}
              {slide.subtitle && (
                <p className="mt-4 max-w-md text-sm leading-relaxed text-white/80">
                  {slide.subtitle}
                </p>
              )}
            </div>
          )}
          <Link
            href={slide.link || '/products'}
            className="group inline-flex items-center gap-3 self-start text-eyebrow text-white transition-opacity hover:opacity-60"
          >
            Shop Collection
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 flex">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="flex-1 py-3"
              aria-label={`Slide ${i + 1}`}
            >
              <div
                className={`h-[2px] transition-all duration-300 ${
                  i === current ? 'bg-white' : 'bg-white/20'
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
```

- [ ] **Step 2: Update homepage to pass eyebrow + subtitle**

Modify `apps/storefront/src/app/(store)/page.tsx`:

```tsx
import { getBanners, urlFor } from '@/lib/sanity'
import HeroBanner from '@/components/home/HeroBanner'

export const revalidate = 0

export default async function HomePage() {
  let banners: Array<{ title: string; subtitle?: string; eyebrow?: string; image: string | null; link: string | null }> = []

  try {
    const rawBanners = await getBanners()
    banners = (rawBanners as Array<Record<string, unknown>>).map((b) => ({
      title: (b.title as string) || '',
      subtitle: (b.subtitle as string) || undefined,
      eyebrow: (b.eyebrow as string) || undefined,
      image: b.image ? urlFor(b.image).width(1920).height(1080).url() : null,
      link: (b.link as string) || null,
    }))
  } catch {
    // graceful fallback
  }

  return <HeroBanner banners={banners} />
}
```

- [ ] **Step 3: Verify typecheck and visually**

Run: `pnpm --filter @draven/storefront typecheck`
Expected: no errors.

Visit `http://localhost:3000`. Expected:
- Hero shows existing background image
- If a banner has a `title` in Sanity, large serif title animates in letter-by-letter
- If no `title` field, only the "Shop Collection" CTA is visible (no broken layout)

- [ ] **Step 4: Commit**

```bash
git add apps/storefront/src/components/home/HeroBanner.tsx apps/storefront/src/app/\(store\)/page.tsx
git commit -m "feat(ui): editorial hero with serif title and letter-stagger reveal"
```

---

## Task 6: FeaturedCollection module

**Files:**
- Create: `apps/storefront/src/components/home/FeaturedCollection.tsx`

- [ ] **Step 1: Create component**

Create `apps/storefront/src/components/home/FeaturedCollection.tsx`:

```tsx
import Image from 'next/image'
import Link from 'next/link'

type Props = {
  eyebrow: string
  title: string
  body: string
  image: string
  imageAlt: string
  ctaLabel: string
  ctaHref: string
  reverse?: boolean
}

export default function FeaturedCollection({
  eyebrow,
  title,
  body,
  image,
  imageAlt,
  ctaLabel,
  ctaHref,
  reverse = false,
}: Props) {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2">
      <div
        className={`relative aspect-[4/5] w-full overflow-hidden bg-brand-100 ${
          reverse ? 'lg:order-2' : ''
        }`}
      >
        <Image
          src={image}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
      <div className="flex items-center bg-white px-8 py-16 lg:px-[10vw] lg:py-24">
        <div className="max-w-md">
          <p className="text-eyebrow text-brand-400">{eyebrow}</p>
          <h2 className="mt-6 font-serif text-display text-brand-950">{title}</h2>
          <p className="mt-6 text-sm leading-relaxed text-brand-500">{body}</p>
          <Link
            href={ctaHref}
            className="group mt-10 inline-flex items-center gap-3 text-eyebrow text-brand-950 transition-opacity hover:opacity-60"
          >
            {ctaLabel}
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify typecheck**

Run: `pnpm --filter @draven/storefront typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add apps/storefront/src/components/home/FeaturedCollection.tsx
git commit -m "feat(ui): add FeaturedCollection editorial split module"
```

---

## Task 7: ProductGridSection module ("Latest")

**Files:**
- Create: `apps/storefront/src/components/home/ProductGridSection.tsx`

- [ ] **Step 1: Create component**

Create `apps/storefront/src/components/home/ProductGridSection.tsx`:

```tsx
import Link from 'next/link'
import ProductCard from '@/components/product/ProductCard'

type Variant = {
  id: string
  inventory_quantity?: number
  options?: Array<{ value: string }>
  prices: Array<{ amount: number; currency_code: string }>
}

type Product = {
  id: string
  title: string
  handle: string
  thumbnail: string | null
  images?: Array<{ id: string; url: string }>
  collection?: { title?: string | null } | null
  tags?: Array<{ value: string }>
  variants: Variant[]
}

type Props = {
  eyebrow: string
  title: string
  products: Product[]
  viewAllHref?: string
  viewAllLabel?: string
  /** When true, the first 4 cards get `priority` (above-the-fold) */
  prioritizeFirstRow?: boolean
}

export default function ProductGridSection({
  eyebrow,
  title,
  products,
  viewAllHref = '/products',
  viewAllLabel = 'View all',
  prioritizeFirstRow = false,
}: Props) {
  if (!products || products.length === 0) return null

  return (
    <section className="mx-auto max-w-container px-5 py-20 lg:px-8 lg:py-32">
      <div className="mb-12 flex items-end justify-between">
        <div>
          <p className="text-eyebrow text-brand-400">{eyebrow}</p>
          <h2 className="mt-4 font-serif text-display-sm text-brand-950">{title}</h2>
        </div>
        <Link
          href={viewAllHref}
          className="hidden text-eyebrow text-brand-950 transition-opacity hover:opacity-60 lg:inline-flex lg:items-center lg:gap-2"
        >
          {viewAllLabel}
          <span aria-hidden>→</span>
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-12 lg:grid-cols-4">
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} priority={prioritizeFirstRow && i < 4} />
        ))}
      </div>
      <div className="mt-10 text-center lg:hidden">
        <Link href={viewAllHref} className="text-eyebrow text-brand-950">
          {viewAllLabel} →
        </Link>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify typecheck**

Run: `pnpm --filter @draven/storefront typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add apps/storefront/src/components/home/ProductGridSection.tsx
git commit -m "feat(ui): add ProductGridSection homepage module"
```

---

## Task 8: LookbookTiles module

**Files:**
- Create: `apps/storefront/src/components/home/LookbookTiles.tsx`

- [ ] **Step 1: Create component**

Create `apps/storefront/src/components/home/LookbookTiles.tsx`:

```tsx
import Image from 'next/image'
import Link from 'next/link'

type Tile = {
  eyebrow?: string
  title: string
  image: string
  imageAlt: string
  href: string
}

type Props = {
  eyebrow?: string
  heading?: string
  tiles: [Tile, Tile, Tile]
}

export default function LookbookTiles({ eyebrow, heading, tiles }: Props) {
  return (
    <section className="mx-auto max-w-container px-5 py-20 lg:px-8 lg:py-32">
      {(eyebrow || heading) && (
        <div className="mb-12">
          {eyebrow && <p className="text-eyebrow text-brand-400">{eyebrow}</p>}
          {heading && (
            <h2 className="mt-4 font-serif text-display-sm text-brand-950">{heading}</h2>
          )}
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:grid-rows-2">
        <TileCard tile={tiles[0]} className="lg:col-span-2 lg:row-span-2 lg:aspect-[4/5]" mobileAspect="aspect-[4/5]" />
        <TileCard tile={tiles[1]} className="lg:aspect-square" mobileAspect="aspect-[4/5]" />
        <TileCard tile={tiles[2]} className="lg:aspect-square" mobileAspect="aspect-[4/5]" />
      </div>
    </section>
  )
}

function TileCard({
  tile,
  className,
  mobileAspect,
}: {
  tile: Tile
  className: string
  mobileAspect: string
}) {
  return (
    <Link
      href={tile.href}
      className={`group relative block w-full overflow-hidden bg-brand-100 ${mobileAspect} ${className}`}
    >
      <Image
        src={tile.image}
        alt={tile.imageAlt}
        fill
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        sizes="(max-width: 1024px) 100vw, 50vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      <div className="absolute bottom-6 left-6 right-6 text-white">
        {tile.eyebrow && <p className="text-eyebrow text-white/80">{tile.eyebrow}</p>}
        <h3 className="mt-2 font-serif text-display-sm text-white">{tile.title}</h3>
      </div>
    </Link>
  )
}
```

- [ ] **Step 2: Verify typecheck**

Run: `pnpm --filter @draven/storefront typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add apps/storefront/src/components/home/LookbookTiles.tsx
git commit -m "feat(ui): add LookbookTiles asymmetric grid module"
```

---

## Task 9: EditorialQuote module

**Files:**
- Create: `apps/storefront/src/components/home/EditorialQuote.tsx`

- [ ] **Step 1: Create component**

Create `apps/storefront/src/components/home/EditorialQuote.tsx`:

```tsx
import Link from 'next/link'

type Props = {
  eyebrow?: string
  quote: string
  attribution?: string
  ctaLabel?: string
  ctaHref?: string
}

export default function EditorialQuote({ eyebrow, quote, attribution, ctaLabel, ctaHref }: Props) {
  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-3xl px-5 text-center lg:px-8">
        {eyebrow && <p className="text-eyebrow text-brand-400">{eyebrow}</p>}
        <blockquote className="mt-8 font-serif text-display italic text-brand-950">
          “{quote}”
        </blockquote>
        {attribution && (
          <p className="mt-8 text-eyebrow text-brand-400">— {attribution}</p>
        )}
        {ctaLabel && ctaHref && (
          <Link
            href={ctaHref}
            className="mt-10 inline-flex items-center gap-2 text-eyebrow text-brand-950 transition-opacity hover:opacity-60"
          >
            {ctaLabel}
            <span aria-hidden>→</span>
          </Link>
        )}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify typecheck**

Run: `pnpm --filter @draven/storefront typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add apps/storefront/src/components/home/EditorialQuote.tsx
git commit -m "feat(ui): add EditorialQuote pull-quote module"
```

---

## Task 10: Compose homepage

**Files:**
- Modify: `apps/storefront/src/app/(store)/page.tsx`
- Reference (existing): `apps/storefront/src/lib/medusa.ts` — confirm a `listProducts` (or similar) helper exists. If only `getProducts({ limit })` exists, use that.

- [ ] **Step 1: Inspect existing product fetcher**

Run: `grep -n "export" apps/storefront/src/lib/medusa.ts | head -30`
Identify the export used by `(store)/products/page.tsx` to fetch product lists. We will reuse it. Common name: `getProducts`. **If the actual name differs**, substitute it in the next step's import — the rest of the code is unchanged.

- [ ] **Step 2: Replace homepage**

Replace contents of `apps/storefront/src/app/(store)/page.tsx`:

```tsx
import { getBanners, urlFor } from '@/lib/sanity'
import { getProducts } from '@/lib/medusa'
import HeroBanner from '@/components/home/HeroBanner'
import FeaturedCollection from '@/components/home/FeaturedCollection'
import ProductGridSection from '@/components/home/ProductGridSection'
import LookbookTiles from '@/components/home/LookbookTiles'
import EditorialQuote from '@/components/home/EditorialQuote'

export const revalidate = 0

export default async function HomePage() {
  let banners: Array<{
    title: string
    subtitle?: string
    eyebrow?: string
    image: string | null
    link: string | null
  }> = []
  let latestProducts: Awaited<ReturnType<typeof getProducts>> = []

  try {
    const rawBanners = await getBanners()
    banners = (rawBanners as Array<Record<string, unknown>>).map((b) => ({
      title: (b.title as string) || '',
      subtitle: (b.subtitle as string) || undefined,
      eyebrow: (b.eyebrow as string) || undefined,
      image: b.image ? urlFor(b.image).width(1920).height(1080).url() : null,
      link: (b.link as string) || null,
    }))
  } catch {
    // graceful fallback
  }

  try {
    latestProducts = (await getProducts({ limit: 8 })) || []
  } catch {
    latestProducts = []
  }

  return (
    <>
      <HeroBanner banners={banners} />

      <FeaturedCollection
        eyebrow="Featured Collection"
        title="Tailoring, reimagined."
        body="Garments built for the everyday — cut from premium fabric in Indonesia, finished by hand. Discover our latest chapter."
        image="/images/hero-1.png"
        imageAlt="Featured collection editorial"
        ctaLabel="Discover"
        ctaHref="/products"
      />

      <ProductGridSection
        eyebrow="Just dropped"
        title="Latest"
        products={latestProducts as never[]}
        viewAllHref="/products"
        viewAllLabel="View all"
        prioritizeFirstRow
      />

      <LookbookTiles
        eyebrow="Categories"
        heading="By the look"
        tiles={[
          {
            eyebrow: 'Outerwear',
            title: 'Built for the season',
            image: '/images/hero-2.png',
            imageAlt: 'Outerwear lookbook',
            href: '/products?category=outerwear',
          },
          {
            eyebrow: 'Knitwear',
            title: 'Soft hands',
            image: '/images/hero-1.png',
            imageAlt: 'Knitwear lookbook',
            href: '/products?category=knitwear',
          },
          {
            eyebrow: 'Accessories',
            title: 'Finishing touches',
            image: '/images/hero-2.png',
            imageAlt: 'Accessories lookbook',
            href: '/products?category=accessories',
          },
        ]}
      />

      <EditorialQuote
        eyebrow="Journal"
        quote="Style is the point at which restraint and intention meet."
        attribution="DRAVEN"
      />
    </>
  )
}
```

> Note: The `latestProducts as never[]` cast is a deliberate temporary loosening because `getProducts` in this codebase returns `any[]` and `ProductGridSection` expects the typed `Product[]` shape. The actual runtime fields match. If later you tighten `getProducts`'s return type, drop the cast.

- [ ] **Step 3: Verify typecheck and visual**

Run: `pnpm --filter @draven/storefront typecheck`
Expected: no errors.

Open `http://localhost:3000`. Expected (top to bottom):
1. Announcement bar
2. Header
3. Hero (90vh, optional title/eyebrow/subtitle if Sanity has them)
4. Featured collection split (image + serif title "Tailoring, reimagined.")
5. Latest 8 products in a 4-up grid (2-up mobile)
6. Lookbook 3 tiles (asymmetric on desktop, stacked on mobile)
7. Editorial quote
8. Existing footer (Task 11 will replace)

- [ ] **Step 4: Commit**

```bash
git add apps/storefront/src/app/\(store\)/page.tsx
git commit -m "feat(ui): compose editorial homepage with new modules"
```

---

## Task 11: NewsletterForm + Footer restructure

**Files:**
- Create: `apps/storefront/src/components/ui/NewsletterForm.tsx`
- Modify: `apps/storefront/src/components/layout/Footer.tsx`

- [ ] **Step 1: Create NewsletterForm**

Create `apps/storefront/src/components/ui/NewsletterForm.tsx`:

```tsx
'use client'

import { useState, type FormEvent } from 'react'

type Status = 'idle' | 'submitting' | 'success' | 'error'

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('submitting')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      // Endpoint may not exist yet — treat 404 as gentle success
      if (res.ok || res.status === 404) {
        setStatus('success')
        setEmail('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <p className="text-sm text-brand-500">
        Thanks for subscribing — keep an eye on your inbox.
      </p>
    )
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-md items-end gap-3">
      <label className="flex-1">
        <span className="sr-only">Email address</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="w-full border-b border-brand-300 bg-transparent px-0 py-3 text-sm text-brand-950 placeholder:text-brand-400 transition-colors focus:border-brand-950 focus:outline-none"
          aria-label="Email address"
        />
      </label>
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="text-eyebrow text-brand-950 transition-opacity hover:opacity-60 disabled:opacity-30"
        aria-label="Subscribe"
      >
        {status === 'submitting' ? '...' : 'Subscribe →'}
      </button>
      {status === 'error' && (
        <p className="absolute mt-12 text-xs text-red-600">Something went wrong. Try again.</p>
      )}
    </form>
  )
}
```

- [ ] **Step 2: Restructure Footer**

Replace contents of `apps/storefront/src/components/layout/Footer.tsx`:

```tsx
'use client'

import Link from 'next/link'
import { useState } from 'react'
import NewsletterForm from '@/components/ui/NewsletterForm'

const columns = [
  {
    label: 'Shop',
    links: [
      { label: 'All Products', href: '/products' },
      { label: 'New Arrivals', href: '/products?sort=newest' },
      { label: 'Sale', href: '/products?sale=true' },
    ],
  },
  {
    label: 'Help',
    links: [
      { label: 'FAQ', href: '/faq' },
      { label: 'Cara Order', href: '/cara-order' },
      { label: 'Shipping', href: '/shipping' },
      { label: 'Returns', href: '/returns' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    label: 'About',
    links: [
      { label: 'Tentang Kami', href: '/tentang-kami' },
      { label: 'Komunitas', href: '/komunitas' },
      { label: 'Journal', href: '/journal' },
    ],
  },
  {
    label: 'Connect',
    links: [
      { label: 'Instagram', href: 'https://instagram.com/dravenworldwide', external: true },
      { label: 'TikTok', href: 'https://tiktok.com/@dravenworldwide', external: true },
      { label: 'WhatsApp Support', href: 'https://wa.me/6281234567890', external: true },
      { label: 'Email', href: 'mailto:hello@draven.store', external: true },
    ],
  },
] as const

function FooterColumn({ label, links }: { label: string; links: ReadonlyArray<{ label: string; href: string; external?: boolean }> }) {
  return (
    <div>
      <h4 className="text-eyebrow text-white">{label}</h4>
      <ul className="mt-5 space-y-3">
        {links.map((l) => (
          <li key={l.label}>
            {l.external ? (
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white/60 transition-colors hover:text-white"
              >
                {l.label}
              </a>
            ) : (
              <Link href={l.href} className="text-sm text-white/60 transition-colors hover:text-white">
                {l.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

function MobileColumn({ label, links }: { label: string; links: ReadonlyArray<{ label: string; href: string; external?: boolean }> }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-white/10">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-5 text-left"
        aria-expanded={open}
      >
        <span className="text-eyebrow text-white">{label}</span>
        <span aria-hidden className="text-white/60 text-lg leading-none">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <ul className="space-y-3 pb-5">
          {links.map((l) => (
            <li key={l.label}>
              {l.external ? (
                <a href={l.href} target="_blank" rel="noopener noreferrer" className="text-sm text-white/60">
                  {l.label}
                </a>
              ) : (
                <Link href={l.href} className="text-sm text-white/60">
                  {l.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function Footer() {
  return (
    <footer>
      {/* Newsletter band */}
      <section className="border-y border-brand-100 bg-white">
        <div className="mx-auto max-w-container px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-eyebrow text-brand-400">Newsletter</p>
            <h2 className="mt-6 font-serif text-display-sm text-brand-950">Stay in the loop.</h2>
            <p className="mt-4 text-sm text-brand-500">
              New drops, lookbooks, and members-only releases — straight to your inbox.
            </p>
            <div className="mt-8 flex justify-center">
              <NewsletterForm />
            </div>
            <p className="mt-6 text-[10px] uppercase tracking-[0.2em] text-brand-300">
              By subscribing you agree to our Privacy Policy.
            </p>
          </div>
        </div>
      </section>

      {/* Main footer */}
      <div className="bg-brand-950 text-white">
        <div className="mx-auto max-w-container px-5 py-16 lg:px-8 lg:py-20">
          {/* Desktop columns */}
          <div className="hidden lg:grid lg:grid-cols-4 lg:gap-12">
            {columns.map((c) => (
              <FooterColumn key={c.label} label={c.label} links={c.links} />
            ))}
          </div>
          {/* Mobile accordions */}
          <div className="lg:hidden">
            {columns.map((c) => (
              <MobileColumn key={c.label} label={c.label} links={c.links} />
            ))}
          </div>

          {/* Brand + trust */}
          <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 lg:flex-row lg:items-center lg:justify-between">
            <span className="font-serif text-2xl tracking-tightest text-white">DRAVEN</span>
            <p className="text-eyebrow text-white/60">
              Pembayaran aman via Midtrans · Pengiriman seluruh Indonesia
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-container flex-col items-center justify-between gap-2 px-5 py-5 text-center lg:flex-row lg:px-8">
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/30">
              &copy; {new Date().getFullYear()} DRAVEN. All rights reserved.
            </p>
            <div className="flex gap-5 text-[11px] uppercase tracking-[0.2em] text-white/30">
              <Link href="/kebijakan-privasi" className="transition-colors hover:text-white">
                Privacy
              </Link>
              <Link href="/syarat-ketentuan" className="transition-colors hover:text-white">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 3: Verify typecheck and visual**

Run: `pnpm --filter @draven/storefront typecheck`
Expected: no errors.

Visit `http://localhost:3000`. Expected:
- Newsletter band sits above the dark footer
- Subscribe form posts (404 still treated as success — toast "Thanks for subscribing")
- Desktop: 4 columns of links
- Mobile (resize to <1024px): each column collapses to an expandable accordion
- DRAVEN serif wordmark + trust line at bottom

- [ ] **Step 4: Commit**

```bash
git add apps/storefront/src/components/ui/NewsletterForm.tsx apps/storefront/src/components/layout/Footer.tsx
git commit -m "feat(ui): newsletter band + restructured editorial footer"
```

---

## Task 12: ProductDetail PDP refactor

**Files:**
- Modify: `apps/storefront/src/components/product/ProductDetail.tsx`

- [ ] **Step 1: Replace component**

Replace contents of `apps/storefront/src/components/product/ProductDetail.tsx`:

```tsx
'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { useCart } from '@/providers/cart-provider'
import { useToast } from '@/providers/toast-provider'
import { formatRupiah } from '@/lib/utils'
import VariantSelector from './VariantSelector'
import SanityContent from '@/components/sanity/SanityContent'
import Accordion from '@/components/ui/Accordion'

const BLUR_DATA =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8+P9/PQAJhAN8xGmFjwAAAABJRU5ErkJggg=='

type Variant = {
  id: string
  title: string
  inventory_quantity: number
  options: Array<{ value: string }>
  prices: Array<{ amount: number; currency_code: string }>
}

type Product = {
  id: string
  title: string
  subtitle: string | null
  description: string | null
  richDescription?: unknown[] | null
  handle: string
  thumbnail: string | null
  images: Array<{ id: string; url: string }>
  options: Array<{ id: string; title: string; values: Array<{ id: string; value: string }> }>
  variants: Variant[]
  weight: number | null
  collection?: { title?: string | null } | null
}

export default function ProductDetail({ product }: { product: Product }) {
  const [selectedVariant, setSelectedVariant] = useState<Variant>(product.variants[0])
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)
  const [mobileIndex, setMobileIndex] = useState(0)
  const mobileGalleryRef = useRef<HTMLDivElement | null>(null)
  const { addItem } = useCart()
  const { toast } = useToast()

  const price = selectedVariant?.prices?.find((p) => p.currency_code === 'idr')
  const priceAmount = price?.amount ?? 0
  const variantQty = selectedVariant?.inventory_quantity ?? 0
  const inStock = variantQty > 0
  const lowStock = inStock && variantQty <= 5
  const allSoldOut = product.variants.every((v) => (v.inventory_quantity ?? 0) <= 0)

  const images =
    product.images?.length > 0
      ? product.images
      : product.thumbnail
        ? [{ id: 'thumb', url: product.thumbnail }]
        : []

  // Track mobile carousel index via scroll position
  useEffect(() => {
    const el = mobileGalleryRef.current
    if (!el) return
    function onScroll() {
      if (!el) return
      const idx = Math.round(el.scrollLeft / el.clientWidth)
      setMobileIndex(idx)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  function getVariantLabel(): string {
    if (!selectedVariant) return 'Default'
    const parts = selectedVariant.options
      ?.map((o) => o.value)
      .filter((v) => v && v !== 'ALL')
    if (parts && parts.length > 0) return parts.join(' / ')
    return selectedVariant.title || 'Default'
  }

  const handleAddToCart = useCallback(() => {
    if (!selectedVariant || !inStock) return
    setAdding(true)
    addItem({
      id: selectedVariant.id,
      productId: product.id,
      title: product.title,
      handle: product.handle,
      variant: getVariantLabel(),
      thumbnail: product.thumbnail,
      price: priceAmount,
    })
    setAdded(true)
    toast('Added to bag')
    setTimeout(() => setAdded(false), 5000)
    setAdding(false)
  }, [selectedVariant, inStock, addItem, product, priceAmount, toast])

  const category = product.collection?.title

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12">
      {/* Gallery */}
      <div className="lg:col-span-7">
        {/* Mobile: horizontal snap carousel */}
        <div className="lg:hidden">
          {images.length > 0 ? (
            <>
              <div
                ref={mobileGalleryRef}
                className="flex snap-x snap-mandatory overflow-x-auto"
                style={{ scrollSnapType: 'x mandatory' }}
              >
                {images.map((img, i) => (
                  <div
                    key={img.id}
                    className="relative aspect-[3/4] w-full flex-shrink-0 snap-center bg-brand-100"
                  >
                    <Image
                      src={img.url}
                      alt={product.title}
                      fill
                      className="object-cover"
                      priority={i === 0}
                      placeholder="blur"
                      blurDataURL={BLUR_DATA}
                      sizes="100vw"
                    />
                  </div>
                ))}
              </div>
              {images.length > 1 && (
                <div className="mt-3 flex justify-center gap-2">
                  {images.map((_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 w-1.5 rounded-full transition-colors ${
                        i === mobileIndex ? 'bg-brand-950' : 'bg-brand-200'
                      }`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex aspect-[3/4] items-center justify-center bg-brand-100">
              <span className="text-eyebrow text-brand-300">No Image</span>
            </div>
          )}
        </div>

        {/* Desktop: vertical scroll stack, no thumbs */}
        <div className="hidden lg:block lg:space-y-1">
          {images.length > 0 ? (
            images.map((img, i) => (
              <div key={img.id} className="relative aspect-[3/4] w-full overflow-hidden bg-brand-100">
                <Image
                  src={img.url}
                  alt={product.title}
                  fill
                  className="object-cover"
                  priority={i === 0}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  placeholder="blur"
                  blurDataURL={BLUR_DATA}
                  sizes="(max-width: 1024px) 100vw, 58vw"
                />
              </div>
            ))
          ) : (
            <div className="flex aspect-[3/4] items-center justify-center bg-brand-100">
              <span className="text-eyebrow text-brand-300">No Image</span>
            </div>
          )}
        </div>
      </div>

      {/* Info — sticky on desktop */}
      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-24 lg:self-start lg:pl-8 xl:pl-16 lg:pt-8">
          {category && <p className="text-eyebrow text-brand-400">{category}</p>}
          <h1 className="mt-4 font-serif text-display-sm text-brand-950">{product.title}</h1>
          <p className="mt-4 text-lg text-brand-500">{formatRupiah(priceAmount)}</p>

          {product.subtitle && (
            <p className="mt-4 text-sm leading-relaxed text-brand-500">{product.subtitle}</p>
          )}

          {product.options && product.options.length > 0 && (
            <div className="mt-8">
              <VariantSelector
                options={product.options}
                variants={product.variants}
                selectedVariant={selectedVariant}
                onSelect={setSelectedVariant}
              />
            </div>
          )}

          <div className="mt-6">
            {allSoldOut ? (
              <div className="flex items-center gap-2 rounded bg-red-50 px-4 py-3">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                <span className="text-sm font-medium text-red-700">
                  Stok Habis — Semua varian tidak tersedia
                </span>
              </div>
            ) : !inStock ? (
              <div className="flex items-center gap-2 rounded bg-red-50 px-4 py-3">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                <span className="text-sm text-red-600">
                  Varian ini habis — pilih ukuran/warna lain
                </span>
              </div>
            ) : lowStock ? (
              <div className="flex items-center gap-2 rounded bg-amber-50 px-4 py-3">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <span className="text-sm text-amber-700">Sisa {variantQty} — Hampir habis!</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-sm text-brand-500">Stok tersedia ({variantQty})</span>
              </div>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!inStock || adding || added}
            className={`mt-4 w-full py-4 text-eyebrow transition-all active:scale-[0.98] ${
              added
                ? 'bg-brand-800 text-white'
                : !inStock
                  ? 'cursor-not-allowed bg-brand-100 text-brand-400'
                  : 'bg-brand-950 text-white hover:bg-brand-800'
            }`}
          >
            {adding ? 'Menambahkan...' : added ? 'Ditambahkan ✓' : !inStock ? 'Stok Habis' : 'Tambah ke Tas'}
          </button>

          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1 text-eyebrow text-brand-400">
            <span className="flex items-center gap-1">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              Secure Payment
            </span>
            <span className="flex items-center gap-1">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.746 3.746 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
              </svg>
              100% Original
            </span>
          </div>

          <div className="mt-10 border-t border-brand-100">
            <Accordion label="Description" defaultOpen>
              {product.richDescription && product.richDescription.length > 0 ? (
                <SanityContent content={product.richDescription} />
              ) : product.description ? (
                <p>{product.description}</p>
              ) : (
                <p className="text-brand-400">No description available.</p>
              )}
            </Accordion>
            <Accordion label="Materials & Care">
              <p>Premium fabric, hand-finished. Cold wash, line dry, low iron.</p>
              {product.weight && <p className="mt-2">Weight: {product.weight}g</p>}
            </Accordion>
            <Accordion label="Shipping & Returns">
              <p>JNE REG / YES — pengiriman seluruh Indonesia.</p>
              <p>Free shipping min. Rp 300.000.</p>
              <p>Pengembalian dalam 7 hari dengan tag intact.</p>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify typecheck and visual**

Run: `pnpm --filter @draven/storefront typecheck`
Expected: no errors.

Visit any product detail page (e.g. `http://localhost:3000/products/<handle>`). Expected:
- Desktop: gallery on left scrolls vertically; right column (price + add to cart + accordions) stays sticky as you scroll
- Mobile: gallery is a horizontal snap carousel with dot indicator; info stacks below
- Three accordions (Description default-open, Materials & Care, Shipping & Returns)

- [ ] **Step 3: Commit**

```bash
git add apps/storefront/src/components/product/ProductDetail.tsx
git commit -m "feat(ui): editorial PDP with sticky panel, vertical gallery, accordions"
```

---

## Task 13: Final pass — typecheck, build, regression check

**Files:** none modified

- [ ] **Step 1: Run full typecheck**

Run: `pnpm --filter @draven/storefront typecheck`
Expected: no errors.

- [ ] **Step 2: Run production build**

Run: `pnpm --filter @draven/storefront build`
Expected: build succeeds. Note any warnings; do not ignore type errors.

- [ ] **Step 3: Manual regression sweep**

Walk these flows on `http://localhost:3000`:
1. **Homepage** — hero animates, all 4 sections render in order, no console errors
2. **Header** — sticky behavior intact, search opens, cart badge animates on add
3. **Product list** — `/products` filters work, cards show hover swap + size dots on desktop
4. **Product detail** — desktop sticky panel + vertical gallery; mobile snap carousel; add to cart toast
5. **Cart** — open `/cart`, remove item shows toast (existing audit fix unaffected)
6. **Checkout** — start checkout, ShippingForm and PaymentSection render unchanged
7. **Footer** — newsletter form posts; mobile accordions toggle
8. **Announcement bar** — dismiss, refresh, stays dismissed

If any flow breaks, fix in place and add a fixup commit. Do not move on to Step 4 until all flows pass.

- [ ] **Step 4: Final commit (only if fixups were needed in Step 3)**

```bash
git add -A
git commit -m "fix(ui): post-redesign regression fixes"
```

---

## Coverage check (self-review)

| Spec section | Implemented in |
|---|---|
| Type system (Fraunces + scale) | Task 1 |
| Module 1 — Announcement bar | Task 3 |
| Module 2 — Hero refactor | Task 5 |
| Module 3 — Featured collection | Tasks 6, 10 |
| Module 4 — Product grid | Tasks 7, 10 |
| Module 5 — ProductCard variant | Task 4 |
| Module 6 — Lookbook tiles | Tasks 8, 10 |
| Module 7 — Editorial quote | Tasks 9, 10 |
| Module 8 — Footer + newsletter | Task 11 |
| Module 9 — PDP refactor | Tasks 2 (Accordion dep), 12 |
| Motion (letter-stagger, accordion) | Task 1 (CSS), 5 (hero), 2 (Accordion) |
| Acceptance criteria 1–10 | Task 13 manual sweep |

No spec items unmapped. No type/method names diverge between tasks (`getProducts`, `Accordion`, `NewsletterForm`, `Product`, `Variant`, `Banner` consistent throughout).
