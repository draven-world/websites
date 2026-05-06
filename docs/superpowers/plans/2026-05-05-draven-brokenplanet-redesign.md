# Draven × Brokenplanet Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reskin the entire Draven storefront in the visual language of brokenplanet.com — fully dark, corner-chrome layout, PP Neue Machina + PP Neue Montreal typography, single-accent lime — while preserving the Draven logo and existing commerce/CMS plumbing.

**Architecture:** Top-to-bottom transformation in 20 sequential tasks. Foundation first (tokens, fonts, Sanity schema), then global chrome, then page-by-page rebuild (homepage, shop, PDP, commerce flows, static pages), then cleanup. Each task is independently verifiable and ends with `pnpm typecheck`, `pnpm lint`, a manual browser smoke check on the touched routes, and a commit. No backend (Medusa) changes.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS, Sanity v3 (Studio), Medusa.js v2 (consumed only — not changed), `next/font/local`, pnpm workspaces / Turborepo.

**Source spec:** `docs/superpowers/specs/2026-05-05-draven-brokenplanet-redesign-design.md`

**Conventions used in this plan:**
- "Run typecheck": `pnpm --filter storefront typecheck`
- "Run lint": `pnpm --filter storefront lint`
- "Run dev": `pnpm --filter storefront dev` (port 3000)
- "Run studio dev": `pnpm --filter studio dev` (port 3333)
- All imports use the `@/` alias mapped to `apps/storefront/src/`
- Commit style: `feat(redesign): ...`, `chore(redesign): ...`, `refactor(redesign): ...`

---

## Task 1: Replace Tailwind tokens (colors + typography + spacing)

**Files:**
- Modify: `packages/config/tailwind/index.js`

- [ ] **Step 1: Replace the Tailwind config**

Overwrite `packages/config/tailwind/index.js` with:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        ink: {
          50:  '#fafafa',
          100: '#e5e5e5',
          300: '#a3a3a3',
          500: '#737373',
          700: '#262626',
          800: '#1a1a1a',
          900: '#111111',
          950: '#0a0a0a',
        },
        accent: {
          lime: '#c6ff3d',
        },
        // legacy alias - keeps existing brand-* references compiling
        // during migration; deleted in Task 20
        brand: {
          50:  '#fafafa',
          100: '#e5e5e5',
          200: '#262626',
          300: '#a3a3a3',
          400: '#737373',
          500: '#737373',
          600: '#262626',
          700: '#262626',
          800: '#1a1a1a',
          900: '#111111',
          950: '#0a0a0a',
        },
      },
      fontFamily: {
        sans: ['var(--font-pp-montreal)', 'Helvetica Neue', 'Arial', 'sans-serif'],
        display: ['var(--font-pp-machina)', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      fontSize: {
        'display-xxl': ['clamp(4.5rem, 12vw, 11rem)', { lineHeight: '0.9',  letterSpacing: '-0.04em' }],
        'display-xl':  ['clamp(3rem, 8vw, 7rem)',     { lineHeight: '0.95', letterSpacing: '-0.03em' }],
        'display':     ['clamp(2rem, 5vw, 4rem)',     { lineHeight: '1.0',  letterSpacing: '-0.025em' }],
        'display-sm':  ['clamp(1.5rem, 3.5vw, 2.5rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'title':       ['1.25rem', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
        'caption':     ['0.75rem', { lineHeight: '1.3', letterSpacing: '0.15em' }],
        'nav':         ['0.8125rem', { lineHeight: '1.0', letterSpacing: '0.18em' }],
      },
      letterSpacing: {
        tightest: '-0.05em',
        tighter: '-0.03em',
        widest: '0.18em',
        wider2: '0.25em',
      },
      maxWidth: {
        container: '1400px',
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out',
        'slide-up': 'slide-up 0.4s ease-out',
        'breathe': 'breathe 4s ease-in-out infinite',
        'badge-bounce': 'badge-bounce 0.6s ease-out',
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
        'breathe': {
          '0%, 100%': { transform: 'scale(1.0)' },
          '50%':      { transform: 'scale(1.02)' },
        },
        'badge-bounce': {
          '0%':   { transform: 'scale(1.0)' },
          '40%':  { transform: 'scale(1.4)' },
          '100%': { transform: 'scale(1.0)' },
        },
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 2: Run typecheck and confirm green**

Run: `pnpm --filter storefront typecheck`
Expected: PASS (config file is JS — type errors would be in `.tsx` consumers; legacy `brand-*` alias keeps everything compiling).

- [ ] **Step 3: Commit**

```bash
git add packages/config/tailwind/index.js
git commit -m "feat(redesign): introduce ink/accent token system, keep brand-* alias for migration"
```

---

## Task 2: Vendor PP Neue Machina + PP Neue Montreal fonts

**Files:**
- Create: `apps/storefront/public/fonts/PPNeueMachina-PlainRegular.woff2`
- Create: `apps/storefront/public/fonts/PPNeueMachina-PlainUltrabold.woff2`
- Create: `apps/storefront/public/fonts/PPNeueMontreal-Regular.woff2`
- Create: `apps/storefront/public/fonts/PPNeueMontreal-Medium.woff2`
- Create: `apps/storefront/public/fonts/PPNeueMontreal-Bold.woff2`
- Create: `apps/storefront/src/styles/fonts.ts`
- Modify: `apps/storefront/src/app/layout.tsx`

- [ ] **Step 1: Download fonts**

Pangram Pangram offers PP Neue Machina + PP Neue Montreal free for commercial use. Download from https://pangrampangram.com/products/neue-machina and https://pangrampangram.com/products/neue-montreal. Drop the `.woff2` files into `apps/storefront/public/fonts/` with the exact filenames listed above.

If file names differ, rename to match. (If the user does not yet have the font files, this task must be paused and the user provided with a written prompt to download them; do not substitute system fonts.)

- [ ] **Step 2: Create the font module**

Create `apps/storefront/src/styles/fonts.ts`:

```ts
import localFont from 'next/font/local'

export const ppMachina = localFont({
  src: [
    { path: '../../public/fonts/PPNeueMachina-PlainRegular.woff2',   weight: '400', style: 'normal' },
    { path: '../../public/fonts/PPNeueMachina-PlainUltrabold.woff2', weight: '800', style: 'normal' },
  ],
  variable: '--font-pp-machina',
  display: 'swap',
})

export const ppMontreal = localFont({
  src: [
    { path: '../../public/fonts/PPNeueMontreal-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../../public/fonts/PPNeueMontreal-Medium.woff2',  weight: '500', style: 'normal' },
    { path: '../../public/fonts/PPNeueMontreal-Bold.woff2',    weight: '700', style: 'normal' },
  ],
  variable: '--font-pp-montreal',
  display: 'swap',
})
```

- [ ] **Step 3: Wire fonts into the root layout**

Open `apps/storefront/src/app/layout.tsx`. Replace any existing `Work_Sans` / `Fraunces` imports with:

```tsx
import { ppMachina, ppMontreal } from '@/styles/fonts'
```

Update the root `<html>` (or `<body>`) tag's className to include both variables:

```tsx
<html lang="en" className={`${ppMachina.variable} ${ppMontreal.variable}`}>
  <body className="font-sans bg-ink-950 text-ink-100 antialiased">
    {children}
  </body>
</html>
```

(Change `lang` to `en` to match the new English-first decision.)

- [ ] **Step 4: Run dev and confirm fonts load**

Run: `pnpm --filter storefront dev`
Open http://localhost:3000 and confirm the page renders without console errors. The site will look broken (existing components target `brand-*` on white backgrounds) — that is expected. Verify font loading by inspecting `<html>` and seeing the two CSS variables on the element.

- [ ] **Step 5: Commit**

```bash
git add apps/storefront/public/fonts apps/storefront/src/styles/fonts.ts apps/storefront/src/app/layout.tsx
git commit -m "feat(redesign): self-host PP Neue Machina + PP Neue Montreal, switch lang to en"
```

---

## Task 3: Establish dark page baseline + scrollbar styling

**Files:**
- Modify: `apps/storefront/src/app/globals.css`

- [ ] **Step 1: Update globals.css**

Open `apps/storefront/src/app/globals.css`. Replace its full contents with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html { scroll-behavior: smooth; }
  body {
    background-color: #0a0a0a;
    color: #e5e5e5;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }
  ::selection {
    background-color: #c6ff3d;
    color: #0a0a0a;
  }
  /* Hide scrollbar for horizontal scroll containers */
  .scrollbar-hide::-webkit-scrollbar { display: none; }
  .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
  /* Body scrollbar — slim, dark */
  ::-webkit-scrollbar { width: 8px; height: 8px; }
  ::-webkit-scrollbar-track { background: #0a0a0a; }
  ::-webkit-scrollbar-thumb { background: #262626; }
  ::-webkit-scrollbar-thumb:hover { background: #737373; }
}

@layer components {
  .btn-primary {
    @apply inline-flex items-center justify-center bg-accent-lime text-ink-950
           font-bold uppercase tracking-widest text-sm py-4 px-8
           transition-colors duration-200 hover:bg-ink-50;
  }
  .btn-ghost {
    @apply inline-flex items-center justify-center border border-ink-700 text-ink-100
           font-bold uppercase tracking-widest text-sm py-4 px-8
           transition-colors duration-200 hover:border-ink-100;
  }
  .underline-input {
    @apply w-full bg-transparent border-0 border-b border-ink-700 px-0 py-3
           text-ink-100 placeholder-ink-500
           focus:outline-none focus:border-accent-lime
           transition-colors duration-200;
  }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 2: Run dev and confirm dark baseline**

Run: `pnpm --filter storefront dev`
The page background should now be `#0a0a0a`. Existing white-background components will look broken — expected.

- [ ] **Step 3: Commit**

```bash
git add apps/storefront/src/app/globals.css
git commit -m "feat(redesign): dark page baseline + lime selection + reusable btn/input components"
```

---

## Task 4: Add Sanity schema additions

**Files:**
- Modify: `studio/schemas/homepage.ts` (or wherever the homepage doc is defined)
- Modify: `studio/schemas/product.ts`
- Create: `studio/schemas/sizeGuide.ts`
- Create: `studio/schemas/terms.ts`
- Modify: `studio/schemas/index.ts`
- Modify: `studio/structure.ts`

- [ ] **Step 1: Locate existing homepage and product schemas**

Run a quick scan to find them:
```bash
ls studio/schemas/
```

If `homepage.ts` does not exist, the homepage banner data is currently coming from `banner.ts` or similar. In that case create `studio/schemas/homepage.ts` as a singleton with the fields below; otherwise extend the existing file.

- [ ] **Step 2: Augment / create `homepage.ts`**

```ts
import { defineField, defineType } from 'sanity'

export const homepage = defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  fields: [
    defineField({
      name: 'heroVideo',
      title: 'Hero Video URL (optional, falls back to image)',
      type: 'url',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image (fallback if no video)',
      type: 'image',
    }),
    defineField({
      name: 'featuredCollection',
      title: 'Featured Collection (Latest Drop)',
      type: 'reference',
      to: [{ type: 'collection' }],
    }),
    defineField({
      name: 'lookbookImages',
      title: 'Lookbook Images',
      type: 'array',
      validation: (r) => r.max(8),
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'image', type: 'image' }),
          defineField({ name: 'caption', type: 'string' }),
        ],
      }],
    }),
    defineField({
      name: 'closingStatement',
      title: 'Closing Statement',
      type: 'string',
      initialValue: 'BUILT FOR THOSE WHO MOVE DIFFERENTLY',
    }),
  ],
})
```

If `homepage.ts` already exists, merge these fields into it without removing existing fields.

- [ ] **Step 3: Augment `product.ts` with the badge field**

Add to the `fields` array:

```ts
defineField({
  name: 'badge',
  title: 'Badge (optional pill above title)',
  type: 'string',
  options: {
    list: [
      { title: 'New', value: 'NEW' },
      { title: 'Glow in the Dark', value: 'GLOW IN THE DARK' },
      { title: 'Last Pieces', value: 'LAST PIECES' },
      { title: 'Coming Soon', value: 'COMING SOON' },
    ],
  },
}),
```

- [ ] **Step 4: Create `studio/schemas/sizeGuide.ts`**

```ts
import { defineField, defineType } from 'sanity'

export const sizeGuide = defineType({
  name: 'sizeGuide',
  title: 'Size Guide',
  type: 'document',
  fields: [
    defineField({ name: 'intro', title: 'Intro', type: 'text' }),
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'garmentType', title: 'Garment Type', type: 'string' }),
          defineField({ name: 'note', title: 'Note', type: 'text' }),
          defineField({
            name: 'measurements',
            title: 'Measurements',
            type: 'array',
            of: [{
              type: 'object',
              fields: [
                defineField({ name: 'size', type: 'string' }),
                defineField({ name: 'chest', type: 'string' }),
                defineField({ name: 'length', type: 'string' }),
                defineField({ name: 'sleeve', type: 'string' }),
              ],
            }],
          }),
        ],
      }],
    }),
  ],
})
```

- [ ] **Step 5: Create `studio/schemas/terms.ts`**

```ts
import { defineField, defineType } from 'sanity'

export const terms = defineType({
  name: 'terms',
  title: 'Terms',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', initialValue: 'Terms' }),
    defineField({ name: 'body', type: 'array', of: [{ type: 'block' }] }),
  ],
})
```

- [ ] **Step 6: Register schemas in `studio/schemas/index.ts`**

Append to the schema-types array:

```ts
import { homepage } from './homepage'
import { sizeGuide } from './sizeGuide'
import { terms } from './terms'

export const schemaTypes = [
  // ... existing
  homepage,
  sizeGuide,
  terms,
]
```

(If `homepage` is already exported, do not duplicate it.)

- [ ] **Step 7: Expose new singletons in `studio/structure.ts`**

Add to the Konten/Content list (next to Galeri):

```ts
S.listItem().title('Homepage').id('homepage')
  .child(S.document().schemaType('homepage').documentId('homepage')),
S.listItem().title('Size Guide').id('sizeGuide')
  .child(S.document().schemaType('sizeGuide').documentId('sizeGuide')),
S.listItem().title('Terms').id('terms')
  .child(S.document().schemaType('terms').documentId('terms')),
```

- [ ] **Step 8: Run studio dev and verify**

Run: `pnpm --filter studio dev`
Open http://localhost:3333. Confirm Homepage / Size Guide / Terms appear in the structure tree, and that the new fields render in the Homepage and Product editors. Create a Homepage document with the default fields populated. Save.

- [ ] **Step 9: Commit**

```bash
git add studio/schemas studio/structure.ts
git commit -m "feat(cms): add hero video, featured collection, lookbook, badge, sizeGuide, terms schemas"
```

---

## Task 5: Extend Sanity queries on the storefront

**Files:**
- Modify: `apps/storefront/src/lib/sanity.ts`

- [ ] **Step 1: Locate the file**

Open `apps/storefront/src/lib/sanity.ts`. Identify existing query helpers like `getBanners()`.

- [ ] **Step 2: Add new helpers**

Append these functions (preserving existing exports). The actual `client` import should match what already exists in the file:

```ts
export async function getHomepage() {
  return client.fetch(`*[_type == "homepage"][0]{
    heroVideo,
    "heroImage": heroImage.asset->url,
    "featuredCollection": featuredCollection->{
      _id, title, "slug": slug.current,
      "products": *[_type == "product" && references(^._id)][0...3]{
        _id, title, "handle": slug.current, "thumbnail": images[0].asset->url, badge,
        "price": variants[0].prices[0].amount
      }
    },
    lookbookImages[]{
      "image": image.asset->url,
      caption
    },
    closingStatement
  }`)
}

export async function getSizeGuide() {
  return client.fetch(`*[_type == "sizeGuide"][0]{
    intro,
    sections[]{ garmentType, note, measurements[]{ size, chest, length, sleeve } }
  }`)
}

export async function getTerms() {
  return client.fetch(`*[_type == "terms"][0]{ title, body }`)
}
```

If the existing `getProducts()` GROQ does not project a `badge` field, add `badge` to its projection.

- [ ] **Step 3: Run typecheck**

Run: `pnpm --filter storefront typecheck`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add apps/storefront/src/lib/sanity.ts
git commit -m "feat(redesign): add getHomepage/getSizeGuide/getTerms + product badge projection"
```

---

## Task 6: UI primitives — PillBadge, UnderlineInput, LeaderRow

**Files:**
- Create: `apps/storefront/src/components/ui/PillBadge.tsx`
- Create: `apps/storefront/src/components/ui/UnderlineInput.tsx`
- Create: `apps/storefront/src/components/ui/LeaderRow.tsx`

- [ ] **Step 1: Create PillBadge**

```tsx
import { ReactNode } from 'react'

export default function PillBadge({
  children,
  variant = 'lime',
}: {
  children: ReactNode
  variant?: 'lime' | 'outline'
}) {
  const styles = variant === 'lime'
    ? 'bg-accent-lime text-ink-950'
    : 'border border-ink-700 text-ink-100'
  return (
    <span className={`inline-block ${styles} rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em]`}>
      {children}
    </span>
  )
}
```

- [ ] **Step 2: Create UnderlineInput**

```tsx
import { InputHTMLAttributes, forwardRef } from 'react'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
}

const UnderlineInput = forwardRef<HTMLInputElement, Props>(function UnderlineInput(
  { label, id, className = '', ...rest },
  ref,
) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-caption text-ink-300 mb-2">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={`underline-input ${className}`}
        {...rest}
      />
    </div>
  )
})

export default UnderlineInput
```

- [ ] **Step 3: Create LeaderRow**

```tsx
import { ReactNode } from 'react'

export default function LeaderRow({
  label,
  value,
  emphasis = false,
}: {
  label: ReactNode
  value: ReactNode
  emphasis?: boolean
}) {
  return (
    <div className={`flex items-baseline gap-2 ${emphasis ? 'text-display-sm font-bold text-ink-100' : 'text-sm text-ink-300'}`}>
      <span className="uppercase tracking-widest">{label}</span>
      <span className="flex-1 border-b border-dotted border-ink-700 translate-y-[-4px]" aria-hidden />
      <span className={emphasis ? 'text-ink-100' : 'text-ink-100'}>{value}</span>
    </div>
  )
}
```

- [ ] **Step 4: Typecheck + commit**

```bash
pnpm --filter storefront typecheck
git add apps/storefront/src/components/ui
git commit -m "feat(redesign): PillBadge, UnderlineInput, LeaderRow primitives"
```

---

## Task 7: Extract SearchOverlay from current Header

**Files:**
- Create: `apps/storefront/src/components/layout/SearchOverlay.tsx`

- [ ] **Step 1: Read the current Header**

Open `apps/storefront/src/components/layout/Header.tsx` and identify the search overlay JSX (the `searchOpen` block). Lift it intact.

- [ ] **Step 2: Create the standalone component**

```tsx
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
    if (!q.trim()) { setResults([]); setSearched(false); setSearching(false); return }
    setSearching(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
      setResults(await res.json())
      setSearched(true)
    } catch {
      setResults([]); setSearched(true)
    } finally {
      setSearching(false)
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!searchQuery.trim()) { setResults([]); setSearched(false); return }
    debounceRef.current = setTimeout(() => doSearch(searchQuery), 300)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [searchQuery, doSearch])

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] bg-ink-950">
      <div className="flex h-14 items-center justify-end px-5 lg:px-8">
        <button
          onClick={() => { onClose(); setSearchQuery(''); setResults([]); setSearched(false) }}
          className="text-ink-100 text-nav"
          aria-label="Close search"
        >
          CLOSE
        </button>
      </div>
      <div className="mx-auto max-w-lg px-5 pt-20">
        <form onSubmit={(e) => {
          e.preventDefault()
          if (searchQuery.trim()) window.location.href = `/products?q=${encodeURIComponent(searchQuery)}`
        }}>
          <label htmlFor="search-input" className="sr-only">Search products</label>
          <input
            id="search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="SEARCH"
            className="w-full border-b border-ink-100 bg-transparent pb-3 text-2xl font-bold uppercase tracking-widest text-ink-100 placeholder-ink-500 outline-none"
            autoFocus
          />
        </form>

        <div className="mt-6">
          {searching && (
            <div className="flex items-center gap-2 py-4">
              <div className="h-4 w-4 animate-spin border-2 border-ink-100 border-t-transparent" />
              <span className="text-sm text-ink-300">Searching...</span>
            </div>
          )}
          {!searching && searched && results.length === 0 && (
            <p className="py-4 text-sm text-ink-300">
              No results for &ldquo;{searchQuery}&rdquo;
            </p>
          )}
          {!searching && results.length > 0 && (
            <>
              <p className="text-caption text-ink-300">
                {results.length} result{results.length !== 1 ? 's' : ''}
              </p>
              <div className="mt-4 divide-y divide-ink-700">
                {results.map((item) => (
                  <Link
                    key={item.id}
                    href={`/products/${item.handle}`}
                    onClick={onClose}
                    className="flex items-center gap-4 py-3 transition-opacity hover:opacity-60"
                  >
                    <div className="relative h-14 w-11 flex-shrink-0 overflow-hidden bg-ink-900">
                      {item.thumbnail ? (
                        <Image src={item.thumbnail} alt={item.title} fill className="object-cover" sizes="44px" />
                      ) : null}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-ink-100 uppercase">{item.title}</p>
                      <p className="text-xs text-ink-300">
                        {item.variants?.[0]?.prices?.[0]
                          ? formatRupiah(item.variants[0].prices[0].amount)
                          : ''}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Typecheck + commit**

```bash
pnpm --filter storefront typecheck
git add apps/storefront/src/components/layout/SearchOverlay.tsx
git commit -m "feat(redesign): extract SearchOverlay as standalone component"
```

---

## Task 8: MobileMenuOverlay component

**Files:**
- Create: `apps/storefront/src/components/layout/MobileMenuOverlay.tsx`

- [ ] **Step 1: Create the component**

```tsx
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
        <span className="text-nav text-ink-300">MENU</span>
        <button onClick={onClose} className="text-nav text-ink-100" aria-label="Close menu">
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
            className="w-full border-b border-ink-700 bg-transparent pb-3 text-lg font-bold uppercase tracking-widest text-ink-100 placeholder-ink-500 outline-none focus:border-accent-lime"
          />
        </form>
      </div>

      <nav className="flex flex-col mt-8">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className="border-b border-ink-700 px-5 py-5 text-display-sm font-bold uppercase tracking-tighter text-ink-100 transition-opacity hover:opacity-60"
          >
            {item.label}
          </Link>
        ))}
        {user ? (
          <Link
            href="/account"
            onClick={onClose}
            className="border-b border-ink-700 px-5 py-5 text-display-sm font-bold uppercase tracking-tighter text-ink-100 transition-opacity hover:opacity-60"
          >
            ACCOUNT
          </Link>
        ) : (
          <Link
            href="/register"
            onClick={onClose}
            className="border-b border-ink-700 px-5 py-5 text-display-sm font-bold uppercase tracking-tighter text-ink-100 transition-opacity hover:opacity-60"
          >
            SIGN UP
          </Link>
        )}
      </nav>
    </div>
  )
}
```

- [ ] **Step 2: Typecheck + commit**

```bash
pnpm --filter storefront typecheck
git add apps/storefront/src/components/layout/MobileMenuOverlay.tsx
git commit -m "feat(redesign): MobileMenuOverlay with embedded search + nav stack"
```

---

## Task 9: SiteChrome — corner navigation

**Files:**
- Create: `apps/storefront/src/components/layout/SiteChrome.tsx`

- [ ] **Step 1: Create SiteChrome**

```tsx
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
      {/* Top-left: wordmark */}
      <Link
        href="/"
        className="fixed top-5 left-5 lg:top-8 lg:left-8 z-50 transition-opacity hover:opacity-60 focus-visible:ring-2 focus-visible:ring-accent-lime focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950"
        aria-label="Draven home"
      >
        <Image
          src="/images/logo.png"
          alt="DRAVEN"
          width={130}
          height={20}
          className="h-4 lg:h-5 w-auto object-contain invert brightness-200"
          priority
        />
      </Link>

      {/* Top-right desktop: SEARCH + BAG */}
      <div className="hidden lg:flex fixed top-8 right-8 z-50 items-center gap-5">
        <button
          onClick={() => setSearchOpen(true)}
          className="text-nav font-bold text-ink-100 transition-opacity hover:opacity-60"
        >
          SEARCH
        </button>
        <Link
          href="/cart"
          className="text-nav font-bold text-ink-100 transition-opacity hover:opacity-60"
          aria-label="Bag"
        >
          BAG
          <sup className={`ml-0.5 text-[10px] ${bagBounce ? 'animate-badge-bounce inline-block' : ''}`}>
            {totalItems}
          </sup>
        </Link>
      </div>

      {/* Top-right mobile: MENU + BAG */}
      <div className="flex lg:hidden fixed top-5 right-5 z-50 items-center gap-4">
        <button
          onClick={() => setMenuOpen(true)}
          className="text-nav font-bold text-ink-100"
        >
          MENU
        </button>
        <Link
          href="/cart"
          className="text-nav font-bold text-ink-100"
          aria-label="Bag"
        >
          BAG<sup className={`ml-0.5 text-[10px] ${bagBounce ? 'animate-badge-bounce inline-block' : ''}`}>{totalItems}</sup>
        </Link>
      </div>

      {/* Bottom-left vertical nav (desktop only) */}
      <nav className="hidden lg:flex fixed bottom-8 left-8 z-50 flex-col gap-2.5">
        {VERTICAL_NAV.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`text-nav font-bold transition-opacity hover:opacity-60 ${active ? 'text-accent-lime' : 'text-ink-100'}`}
            >
              {item.label}
            </Link>
          )
        })}
        {user ? (
          <Link
            href="/account"
            className={`text-nav font-bold transition-opacity hover:opacity-60 ${pathname === '/account' ? 'text-accent-lime' : 'text-ink-100'}`}
          >
            ACCOUNT
          </Link>
        ) : (
          <Link
            href="/register"
            className={`text-nav font-bold transition-opacity hover:opacity-60 ${pathname === '/register' ? 'text-accent-lime' : 'text-ink-100'}`}
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
```

- [ ] **Step 2: Typecheck + commit**

```bash
pnpm --filter storefront typecheck
git add apps/storefront/src/components/layout/SiteChrome.tsx
git commit -m "feat(redesign): SiteChrome corner-nav layout"
```

---

## Task 10: Wire SiteChrome into the (store) layout, remove Header/Footer

**Files:**
- Modify: `apps/storefront/src/app/(store)/layout.tsx`

- [ ] **Step 1: Open and rewrite the layout**

Replace whatever is currently in `(store)/layout.tsx` with the chrome-driven version. Keep any existing providers (Cart/Auth/etc.).

```tsx
import { ReactNode } from 'react'
import SiteChrome from '@/components/layout/SiteChrome'
import AnnouncementBar from '@/components/layout/AnnouncementBar'
import WhatsAppButton from '@/components/layout/WhatsAppButton'

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AnnouncementBar />
      <SiteChrome />
      <main className="min-h-screen">{children}</main>
      <WhatsAppButton />
    </>
  )
}
```

If `AnnouncementBar` does not fit the dark theme yet, leave the import — it will be reskinned in Task 19. If the project does not have one of the imports above, omit it.

- [ ] **Step 2: Verify Header / Footer / MobileNav are no longer imported**

Run: `grep -r "from '@/components/layout/Header'" apps/storefront/src` (use the Grep tool, not bash). All references must come back empty. If anything still imports `Header.tsx`, `Footer.tsx`, or `MobileNav.tsx`, remove or replace those imports — those files will be deleted in Task 20.

- [ ] **Step 3: Run dev and smoke-test**

Run: `pnpm --filter storefront dev`
Visit `/`, `/products`, `/cart`. Confirm:
- Logo appears top-left in white
- `SEARCH` and `BAG⁰` appear top-right
- Vertical nav stack appears bottom-left on viewport ≥ `lg`
- On mobile width, `MENU` + `BAG` appear top-right; vertical stack hidden
- Clicking SEARCH opens overlay; pressing ESC closes
- Clicking MENU on mobile opens overlay; clicking a link navigates and closes
- No `<header>` or `<footer>` element in the DOM (other than what individual pages render)

- [ ] **Step 4: Commit**

```bash
git add apps/storefront/src/app/\(store\)/layout.tsx
git commit -m "feat(redesign): mount SiteChrome in (store) layout, drop Header/Footer wrappers"
```

---

## Task 11: ProductCard redesign

**Files:**
- Modify: `apps/storefront/src/components/product/ProductCard.tsx`

- [ ] **Step 1: Replace ProductCard**

```tsx
import Image from 'next/image'
import Link from 'next/link'
import { formatRupiah } from '@/lib/utils'
import PillBadge from '@/components/ui/PillBadge'

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
  badge?: string | null
  images?: Array<{ id: string; url: string }>
  variants: Variant[]
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

  return (
    <Link href={`/products/${product.handle}`} className="group block">
      <div className={`relative aspect-[4/5] overflow-hidden bg-ink-900 ${allSoldOut ? 'opacity-50' : ''}`}>
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            className="object-contain transition-transform duration-[600ms] ease-out group-hover:scale-[1.04]"
            sizes="(max-width: 768px) 50vw, 33vw"
            placeholder="blur"
            blurDataURL={BLUR_DATA}
            priority={priority}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-caption text-ink-500">No Image</span>
          </div>
        )}
      </div>
      <div className="mt-4 flex flex-col items-center text-center">
        {product.badge && (
          <div className="mb-2"><PillBadge>{product.badge}</PillBadge></div>
        )}
        <h3 className="text-title font-bold uppercase tracking-tighter text-ink-100">
          {product.title}
        </h3>
        <p className="mt-1.5 text-sm font-bold text-ink-100">{formatRupiah(priceAmount)}</p>
        {allSoldOut && (
          <p className="mt-1 text-caption text-ink-500">SOLD OUT</p>
        )}
      </div>
    </Link>
  )
}
```

- [ ] **Step 2: Typecheck + commit**

```bash
pnpm --filter storefront typecheck
git add apps/storefront/src/components/product/ProductCard.tsx
git commit -m "feat(redesign): ProductCard floats on dark with center-aligned title + lime badge"
```

---

## Task 12: FilterDrawer + reskin shop page

**Files:**
- Create: `apps/storefront/src/components/product/FilterDrawer.tsx`
- Modify: `apps/storefront/src/app/(store)/products/page.tsx`

- [ ] **Step 1: Create FilterDrawer**

The drawer renders the same filter facets that the existing `ProductFilters` sidebar covers. Lift the facet logic from `ProductFilters.tsx` rather than duplicating it. Skeleton:

```tsx
'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function FilterDrawer({
  open,
  onClose,
  productCount,
  availableColors,
}: {
  open: boolean
  onClose: () => void
  productCount: number
  availableColors: Array<{ name: string; hex: string }>
}) {
  const router = useRouter()
  const params = useSearchParams()

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  function setParam(key: string, value: string | null) {
    const next = new URLSearchParams(params.toString())
    if (value === null || value === '') next.delete(key)
    else next.set(key, value)
    router.push(`/products?${next.toString()}`)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60]" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60" />
      <aside
        onClick={(e) => e.stopPropagation()}
        className="absolute top-0 left-0 h-full w-full sm:w-[380px] bg-ink-900 border-r border-ink-700 overflow-y-auto"
      >
        <div className="flex items-center justify-between px-6 h-14 border-b border-ink-700">
          <span className="text-nav text-ink-300">FILTER</span>
          <button onClick={onClose} className="text-nav text-ink-100">CLOSE</button>
        </div>

        <div className="p-6 flex flex-col gap-8">
          {/* CATEGORY */}
          <FilterGroup title="CATEGORY">
            {['hoodies', 't-shirts', 'jackets', 'accessories'].map((cat) => (
              <FilterPill
                key={cat}
                active={params.get('category') === cat}
                onClick={() => setParam('category', params.get('category') === cat ? null : cat)}
              >
                {cat.toUpperCase()}
              </FilterPill>
            ))}
          </FilterGroup>

          {/* PRICE */}
          <FilterGroup title="PRICE">
            {[
              { label: 'UNDER 250K', value: '0-250000' },
              { label: '250K – 500K', value: '250000-500000' },
              { label: '500K – 1M',   value: '500000-1000000' },
              { label: 'OVER 1M',     value: '1000000-' },
            ].map((opt) => (
              <FilterPill
                key={opt.value}
                active={params.get('price') === opt.value}
                onClick={() => setParam('price', params.get('price') === opt.value ? null : opt.value)}
              >
                {opt.label}
              </FilterPill>
            ))}
          </FilterGroup>

          {/* SIZE */}
          <FilterGroup title="SIZE">
            {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((s) => (
              <FilterPill
                key={s}
                active={params.get('size')?.toUpperCase() === s}
                onClick={() => setParam('size', params.get('size')?.toUpperCase() === s ? null : s)}
              >
                {s}
              </FilterPill>
            ))}
          </FilterGroup>

          {/* COLOR */}
          {availableColors.length > 0 && (
            <FilterGroup title="COLOR">
              {availableColors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setParam('color', params.get('color') === c.name ? null : c.name)}
                  className={`flex items-center gap-2 px-3 py-2 border ${
                    params.get('color') === c.name ? 'border-accent-lime text-accent-lime' : 'border-ink-700 text-ink-100'
                  }`}
                >
                  <span className="w-3 h-3 rounded-full" style={{ background: c.hex }} />
                  <span className="text-caption">{c.name.toUpperCase()}</span>
                </button>
              ))}
            </FilterGroup>
          )}
        </div>

        <div className="sticky bottom-0 bg-ink-900 border-t border-ink-700 p-4 flex gap-3">
          <button
            onClick={() => router.push('/products')}
            className="flex-1 btn-ghost"
          >
            RESET
          </button>
          <button onClick={onClose} className="flex-1 btn-primary">
            VIEW {productCount}
          </button>
        </div>
      </aside>
    </div>
  )
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-caption text-ink-300 mb-3">{title}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}

function FilterPill({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 border text-caption transition-colors ${
        active
          ? 'border-accent-lime text-accent-lime'
          : 'border-ink-700 text-ink-100 hover:border-ink-300'
      }`}
    >
      {children}
    </button>
  )
}
```

- [ ] **Step 2: Rewrite products page**

Open `apps/storefront/src/app/(store)/products/page.tsx`. Replace the layout (sidebar + grid) with chrome-aware single-column. Keep the existing filtering logic (the data manipulation block at the top of the file) unchanged. Replace only the JSX return:

```tsx
return (
  <div className="px-8 lg:px-16 pt-32 lg:pt-40 pb-32">
    {/* Header strip */}
    <div className="flex items-end justify-between mb-12 border-b border-ink-700 pb-6">
      <div>
        <h1 className="text-display uppercase font-bold tracking-tighter text-ink-100">
          {pageTitle}
        </h1>
      </div>
      <div className="flex items-center gap-6 text-caption text-ink-300">
        <span>{products.length} PIECES</span>
        <Suspense>
          <FilterTrigger productCount={products.length} availableColors={availableColors} />
        </Suspense>
        <Suspense>
          <SortDropdown />
        </Suspense>
      </div>
    </div>

    {products.length > 0 ? (
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-12 md:gap-x-24 lg:gap-x-32 gap-y-24 lg:gap-y-32">
        {products.map((product: any, i: number) => (
          <ProductCard key={product.id} product={product} priority={i < 3} />
        ))}
      </div>
    ) : (
      <div className="py-24 text-center">
        <p className="text-display-sm uppercase font-bold text-ink-100">NO PIECES FOUND</p>
        {activeFilterCount > 0 && (
          <a
            href="/products"
            className="mt-6 inline-block text-nav text-ink-300 underline underline-offset-4 hover:text-accent-lime"
          >
            RESET FILTER
          </a>
        )}
      </div>
    )}
  </div>
)
```

Replace the imports of `ProductFilters`, `MobileFilterButton` with a new client component `FilterTrigger` that wraps the drawer-open button. Add at the top of the file:

```tsx
import FilterDrawer from '@/components/product/FilterDrawer'
```

And create a small client wrapper inline in the same module — but since the page itself is a Server Component, instead create a small client component file:

`apps/storefront/src/components/product/FilterTrigger.tsx`:

```tsx
'use client'
import { useState } from 'react'
import FilterDrawer from './FilterDrawer'

export default function FilterTrigger({
  productCount,
  availableColors,
}: {
  productCount: number
  availableColors: Array<{ name: string; hex: string }>
}) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button onClick={() => setOpen(true)} className="text-caption text-ink-100 hover:text-accent-lime">
        FILTER
      </button>
      <FilterDrawer
        open={open}
        onClose={() => setOpen(false)}
        productCount={productCount}
        availableColors={availableColors}
      />
    </>
  )
}
```

Update the products page import to use `FilterTrigger` instead of `MobileFilterButton`. The existing `SortDropdown` from `ProductFilters.tsx` is currently exported alongside `ProductFilters` — copy `SortDropdown` into its own file `apps/storefront/src/components/product/SortDropdown.tsx` so it survives Task 20's deletion of `ProductFilters.tsx`. Restyle it to dark:

```tsx
'use client'
import { useRouter, useSearchParams } from 'next/navigation'

export default function SortDropdown() {
  const router = useRouter()
  const params = useSearchParams()
  const current = params.get('sort') ?? 'default'

  function set(value: string) {
    const next = new URLSearchParams(params.toString())
    if (value === 'default') next.delete('sort')
    else next.set('sort', value)
    router.push(`/products?${next.toString()}`)
  }

  return (
    <select
      value={current}
      onChange={(e) => set(e.target.value)}
      className="bg-transparent border-0 text-caption text-ink-100 focus:outline-none cursor-pointer hover:text-accent-lime"
    >
      <option value="default" className="bg-ink-900">SORT</option>
      <option value="price-asc" className="bg-ink-900">PRICE ↑</option>
      <option value="price-desc" className="bg-ink-900">PRICE ↓</option>
      <option value="name-asc" className="bg-ink-900">A → Z</option>
    </select>
  )
}
```

Update imports in the products page:
```tsx
import FilterTrigger from '@/components/product/FilterTrigger'
import SortDropdown from '@/components/product/SortDropdown'
```

- [ ] **Step 3: Smoke test**

Run dev. Visit `/products`. Confirm:
- 3-column grid on desktop, 2-column on mobile
- `FILTER` opens drawer; selecting a filter updates URL params and grid
- `SORT` dropdown works
- Empty filter result shows `NO PIECES FOUND`

- [ ] **Step 4: Commit**

```bash
git add apps/storefront/src/components/product/FilterDrawer.tsx \
        apps/storefront/src/components/product/FilterTrigger.tsx \
        apps/storefront/src/components/product/SortDropdown.tsx \
        apps/storefront/src/app/\(store\)/products/page.tsx
git commit -m "feat(redesign): shop grid floats on dark with FilterDrawer + sort"
```

---

## Task 13: PDP — magazine stack gallery + sticky info column

**Files:**
- Modify: `apps/storefront/src/components/product/ProductDetail.tsx`

- [ ] **Step 1: Replace ProductDetail**

The existing `ProductDetail` reads variant/option/price logic from props. Preserve all that logic; replace only the layout/styling. The replacement skeleton:

```tsx
'use client'

import Image from 'next/image'
import { useState } from 'react'
import { formatRupiah } from '@/lib/utils'
import { useCart } from '@/providers/cart-provider'
import PillBadge from '@/components/ui/PillBadge'
import Accordion from '@/components/ui/Accordion'

type Variant = {
  id: string
  title?: string
  inventory_quantity?: number
  options?: Array<{ value: string; option_id: string }>
  prices: Array<{ amount: number; currency_code: string }>
}

type Product = {
  id: string
  title: string
  description?: string
  handle: string
  badge?: string | null
  images: Array<{ id: string; url: string }>
  options?: Array<{ id: string; title: string; values: Array<{ value: string }> }>
  variants: Variant[]
  colors?: Array<{ name: string; hex: string }>
}

export default function ProductDetail({ product }: { product: Product }) {
  const { addItem } = useCart()
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)

  const sizeOption = product.options?.find((o) =>
    /size|ukuran/i.test(o.title)
  )
  const sizes = sizeOption?.values?.map((v) => v.value) ?? []
  const colors = product.colors ?? []

  // Find variant matching selection (or fall back to first)
  const matchingVariant = product.variants.find((v) => {
    const sizeMatch = !selectedSize || v.options?.some((o) => o.value === selectedSize)
    return sizeMatch
  }) ?? product.variants[0]
  const price = matchingVariant?.prices.find((p) => p.currency_code === 'idr')?.amount ?? 0
  const variantSoldOut = (matchingVariant?.inventory_quantity ?? 0) <= 0

  function handleAdd() {
    if (!matchingVariant || variantSoldOut) return
    addItem(matchingVariant.id, 1)
  }

  return (
    <div className="mx-auto max-w-container px-5 lg:px-16 pt-32 lg:pt-40 pb-32">
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-12 lg:gap-20">
        {/* Image stack */}
        <div className="flex flex-col gap-1">
          {product.images.map((img) => (
            <div key={img.id} className="relative aspect-[4/5] bg-ink-900">
              <Image
                src={img.url}
                alt={product.title}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority
              />
            </div>
          ))}
        </div>

        {/* Sticky info column */}
        <div className="lg:sticky lg:top-32 lg:self-start flex flex-col gap-6">
          {product.badge && <PillBadge>{product.badge}</PillBadge>}
          <h1 className="text-display-sm uppercase font-bold tracking-tighter text-ink-100">
            {product.title}
          </h1>
          <p className="text-lg font-bold text-ink-100">{formatRupiah(price)}</p>
          {product.description && (
            <p className="text-sm text-ink-300 leading-relaxed line-clamp-3">{product.description}</p>
          )}

          {colors.length > 0 && (
            <div>
              <p className="text-caption text-ink-300 mb-3">COLOR</p>
              <div className="flex gap-3 flex-wrap">
                {colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`w-7 h-7 rounded-full border ${
                      selectedColor === c.name ? 'ring-2 ring-accent-lime ring-offset-2 ring-offset-ink-950' : 'border-ink-700'
                    }`}
                    style={{ background: c.hex }}
                    aria-label={c.name}
                  />
                ))}
              </div>
            </div>
          )}

          {sizes.length > 0 && (
            <div>
              <p className="text-caption text-ink-300 mb-3">SIZE</p>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => {
                  const variantForSize = product.variants.find((v) =>
                    v.options?.some((o) => o.value === size)
                  )
                  const soldOut = (variantForSize?.inventory_quantity ?? 0) <= 0
                  const active = selectedSize === size
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      disabled={soldOut}
                      className={`border px-5 py-2.5 text-sm uppercase font-bold transition-colors ${
                        active
                          ? 'border-accent-lime text-accent-lime'
                          : soldOut
                            ? 'border-ink-700 text-ink-500 line-through'
                            : 'border-ink-700 text-ink-100 hover:border-ink-300'
                      }`}
                    >
                      {size}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          <button
            onClick={handleAdd}
            disabled={!selectedSize || variantSoldOut}
            className={`w-full py-4 text-sm font-bold uppercase tracking-widest transition-colors ${
              !selectedSize || variantSoldOut
                ? 'bg-ink-700 text-ink-500 cursor-not-allowed'
                : 'bg-accent-lime text-ink-950 hover:bg-ink-50'
            }`}
          >
            {variantSoldOut ? 'SOLD OUT' : !selectedSize ? 'SELECT SIZE' : 'ADD TO BAG'}
          </button>

          <div className="flex flex-col gap-1 mt-4 border-t border-ink-700 pt-4">
            <Accordion title="SHIPPING & RETURNS">
              <p className="text-sm text-ink-300 leading-relaxed">
                Shipping handled via JNE / J&amp;T / SiCepat across Indonesia.
                Free returns within 7 days of receipt for unworn items in original packaging.
              </p>
            </Accordion>
            <Accordion title="SIZE GUIDE">
              <p className="text-sm text-ink-300 leading-relaxed">
                See the <a href="/size-guide" className="text-accent-lime underline underline-offset-4">size guide</a> for chest, length, and sleeve measurements per garment.
              </p>
            </Accordion>
            <Accordion title="MATERIALS">
              <p className="text-sm text-ink-300 leading-relaxed">
                Premium 380gsm cotton fleece, garment-dyed, pre-shrunk.
                Made in Indonesia.
              </p>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  )
}
```

(If the existing ProductDetail uses a separate `VariantSelector.tsx`, leave that file in place but pass the same props through to it. The size button block above can replace that selector if it duplicates the logic.)

- [ ] **Step 2: Reskin Accordion**

Open `apps/storefront/src/components/ui/Accordion.tsx`. Update its visual styling so closed state shows `border-b border-ink-700`, the trigger uses `text-nav text-ink-100 py-4 hover:text-accent-lime`, and the open content uses `text-sm text-ink-300 pb-4`. (The component's logic is unchanged.)

- [ ] **Step 3: Smoke test**

Run dev. Visit a product page. Confirm:
- Vertical image stack scrolls
- Info column stays sticky on desktop scroll
- Size selection enables ADD TO BAG (lime button)
- Sold-out variant strikes through
- Accordion sections expand/collapse

- [ ] **Step 4: Commit**

```bash
git add apps/storefront/src/components/product/ProductDetail.tsx \
        apps/storefront/src/components/ui/Accordion.tsx
git commit -m "feat(redesign): PDP magazine stack + sticky info column + lime add-to-bag"
```

---

## Task 14: Homepage — assemble new sections

**Files:**
- Create: `apps/storefront/src/components/home/HeroSilent.tsx`
- Create: `apps/storefront/src/components/home/LatestDrop.tsx`
- Create: `apps/storefront/src/components/home/LookbookStrip.tsx`
- Create: `apps/storefront/src/components/home/ClosingStatement.tsx`
- Modify: `apps/storefront/src/app/(store)/page.tsx`

- [ ] **Step 1: HeroSilent**

```tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function HeroSilent({
  videoUrl,
  imageUrl,
}: {
  videoUrl?: string | null
  imageUrl?: string | null
}) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function onScroll() {
      const scrollY = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setProgress(docHeight > 0 ? scrollY / docHeight : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section className="relative h-screen w-full overflow-hidden bg-ink-950">
      <div
        className="absolute inset-0 transition-transform duration-100 ease-out"
        style={{ transform: `scale(${1 + progress * 0.1})` }}
      >
        {videoUrl ? (
          <video
            src={videoUrl}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="w-full h-full object-cover"
          />
        ) : imageUrl ? (
          <Image src={imageUrl} alt="" fill className="object-cover" priority />
        ) : (
          <div className="h-full w-full bg-ink-950" />
        )}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="relative z-10 flex h-full items-center justify-center">
        <Link
          href="/products"
          className="text-display uppercase font-bold text-ink-100 tracking-tighter animate-breathe motion-reduce:animate-none"
        >
          SHOP HERE
        </Link>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: LatestDrop**

```tsx
import Link from 'next/link'
import ProductCard from '@/components/product/ProductCard'

type Collection = {
  _id: string
  title: string
  slug: string
  products: Array<{
    _id: string
    title: string
    handle: string
    thumbnail: string | null
    badge?: string | null
    price: number
  }>
}

export default function LatestDrop({ collection }: { collection: Collection | null }) {
  if (!collection || !collection.products?.length) return null
  return (
    <section className="px-8 lg:px-16 py-32 lg:py-40 bg-ink-950">
      <div className="flex items-end justify-between mb-16">
        <div>
          <p className="text-caption text-ink-500">LATEST DROP / {collection.title.toUpperCase()}</p>
        </div>
        <p className="text-caption text-ink-500">{collection.products.length} PIECES</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 md:gap-x-24 lg:gap-x-32 gap-y-24">
        {collection.products.map((p) => (
          <ProductCard
            key={p._id}
            product={{
              id: p._id,
              title: p.title,
              handle: p.handle,
              thumbnail: p.thumbnail,
              badge: p.badge,
              variants: [{ id: '', prices: [{ amount: p.price, currency_code: 'idr' }] }],
            }}
          />
        ))}
      </div>
      <div className="mt-16 text-center">
        <Link href="/products" className="text-nav text-ink-300 hover:text-accent-lime transition-colors">
          VIEW ALL →
        </Link>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: LookbookStrip**

```tsx
'use client'

import Image from 'next/image'

type Item = { image: string; caption?: string }

export default function LookbookStrip({ items }: { items: Item[] }) {
  if (!items?.length) return null
  return (
    <section className="bg-ink-950 py-24 overflow-hidden">
      <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-1 px-1">
        {items.map((it, i) => (
          <div
            key={i}
            className="relative aspect-[3/4] w-[80vw] md:w-[50vw] lg:w-[35vw] flex-shrink-0 snap-start overflow-hidden bg-ink-900 group"
          >
            <Image
              src={it.image}
              alt={it.caption ?? ''}
              fill
              sizes="(max-width: 768px) 80vw, (max-width: 1024px) 50vw, 35vw"
              className="object-cover"
            />
            {it.caption && (
              <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/70 to-transparent">
                <p className="text-caption text-ink-100">{it.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 4: ClosingStatement**

```tsx
export default function ClosingStatement({ statement }: { statement: string }) {
  return (
    <section className="relative h-[50vh] w-full bg-ink-950 flex flex-col items-center justify-center px-5">
      <h2 className="text-display-xl uppercase font-bold text-ink-100/30 tracking-tighter text-center max-w-5xl leading-none">
        {statement}
      </h2>
      <div className="absolute bottom-12 left-0 right-0 flex flex-col items-center gap-3">
        <p className="text-caption text-ink-500">JAKARTA, INDONESIA</p>
        <div className="flex gap-6">
          <a href="https://instagram.com/dravenworldwide" target="_blank" rel="noopener noreferrer"
             className="text-caption text-ink-300 hover:text-accent-lime transition-colors">INSTAGRAM</a>
          <a href="https://wa.me/62" target="_blank" rel="noopener noreferrer"
             className="text-caption text-ink-300 hover:text-accent-lime transition-colors">WHATSAPP</a>
          <a href="https://tiktok.com/@dravenworldwide" target="_blank" rel="noopener noreferrer"
             className="text-caption text-ink-300 hover:text-accent-lime transition-colors">TIKTOK</a>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Rewrite homepage page.tsx**

```tsx
import { getHomepage } from '@/lib/sanity'
import HeroSilent from '@/components/home/HeroSilent'
import LatestDrop from '@/components/home/LatestDrop'
import LookbookStrip from '@/components/home/LookbookStrip'
import ClosingStatement from '@/components/home/ClosingStatement'

export const revalidate = 0

export default async function HomePage() {
  let data: any = null
  try { data = await getHomepage() } catch { data = null }

  return (
    <>
      <HeroSilent videoUrl={data?.heroVideo} imageUrl={data?.heroImage} />
      <LatestDrop collection={data?.featuredCollection ?? null} />
      <LookbookStrip items={(data?.lookbookImages ?? []).filter((i: any) => i?.image)} />
      <ClosingStatement statement={data?.closingStatement || 'BUILT FOR THOSE WHO MOVE DIFFERENTLY'} />
    </>
  )
}
```

- [ ] **Step 6: Smoke test**

Run dev. Visit `/`. Confirm hero shows breathing SHOP HERE link, sections render or are skipped based on Sanity data, and chrome stays fixed throughout scroll.

- [ ] **Step 7: Commit**

```bash
git add apps/storefront/src/components/home apps/storefront/src/app/\(store\)/page.tsx
git commit -m "feat(redesign): silent hero + latest drop + lookbook + closing statement homepage"
```

---

## Task 15: Cart redesign

**Files:**
- Modify: `apps/storefront/src/app/(store)/cart/page.tsx`

- [ ] **Step 1: Read existing page**

Read the current cart page. Preserve cart state usage (`useCart`) and any line-item mutation handlers.

- [ ] **Step 2: Replace cart page**

```tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/providers/cart-provider'
import { formatRupiah } from '@/lib/utils'
import LeaderRow from '@/components/ui/LeaderRow'

export default function CartPage() {
  const { items, removeItem, updateQty, subtotal } = useCart()

  if (!items?.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-8">
        <h1 className="text-display uppercase font-bold tracking-tighter text-ink-100">BAG IS EMPTY</h1>
        <Link href="/products" className="mt-8 text-nav text-ink-300 hover:text-accent-lime">
          CONTINUE SHOPPING →
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-8 pt-32 lg:pt-40 pb-32">
      <h1 className="text-display uppercase font-bold tracking-tighter text-ink-100">BAG</h1>
      <p className="mt-2 text-caption text-ink-500">{items.length} ITEM{items.length !== 1 ? 'S' : ''}</p>

      <div className="mt-12 border-t border-ink-700">
        {items.map((item) => (
          <div key={item.id} className="grid grid-cols-[80px_1fr_auto] lg:grid-cols-[100px_1fr_auto] gap-6 py-6 border-b border-ink-700">
            <div className="relative aspect-[4/5] bg-ink-900">
              {item.thumbnail && (
                <Image src={item.thumbnail} alt={item.title} fill className="object-contain" sizes="100px" />
              )}
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-sm font-bold uppercase text-ink-100">{item.title}</p>
              {item.variantTitle && <p className="text-caption text-ink-300">{item.variantTitle}</p>}
              <button
                onClick={() => removeItem(item.id)}
                className="text-caption text-ink-500 hover:text-accent-lime mt-auto self-start"
              >
                REMOVE
              </button>
            </div>
            <div className="flex flex-col items-end justify-between gap-2">
              <div className="flex items-center gap-3 text-sm text-ink-100 font-bold">
                <button onClick={() => updateQty(item.id, Math.max(1, item.qty - 1))} aria-label="Decrease">−</button>
                <span>{item.qty}</span>
                <button onClick={() => updateQty(item.id, item.qty + 1)} aria-label="Increase">+</button>
              </div>
              <p className="text-sm font-bold text-ink-100">{formatRupiah(item.price * item.qty)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-col gap-3">
        <LeaderRow label="Subtotal" value={formatRupiah(subtotal)} />
        <LeaderRow label="Shipping" value="CALCULATED AT CHECKOUT" />
        <LeaderRow label="Total" value={formatRupiah(subtotal)} emphasis />
      </div>

      <Link href="/checkout" className="mt-12 btn-primary w-full">
        CHECKOUT
      </Link>
    </div>
  )
}
```

If the cart provider's API names differ (e.g., `lineItems` instead of `items`, `decrement`/`increment` instead of `updateQty`), adapt to the actual names — do not invent fields. Search `apps/storefront/src/providers/cart-provider.tsx` to confirm shape before writing.

- [ ] **Step 3: Smoke test**

Run dev. Add a product to cart from PDP. Visit `/cart`. Confirm dark layout, leader rows, lime CHECKOUT.

- [ ] **Step 4: Commit**

```bash
git add apps/storefront/src/app/\(store\)/cart/page.tsx
git commit -m "feat(redesign): cart with leader-row totals + dark line items"
```

---

## Task 16: Checkout redesign

**Files:**
- Modify: `apps/storefront/src/app/(store)/checkout/page.tsx`
- Modify: `apps/storefront/src/components/checkout/ShippingForm.tsx`
- Modify: `apps/storefront/src/components/checkout/ShippingOptions.tsx`
- Modify: `apps/storefront/src/components/checkout/PaymentSection.tsx`
- Modify: `apps/storefront/src/components/checkout/OrderSummary.tsx`

- [ ] **Step 1: Read existing checkout page**

Inspect `(store)/checkout/page.tsx`. Identify the existing two-column structure (form left, summary right) and the section components.

- [ ] **Step 2: Restructure to single column with section numbers**

Replace the page wrapper layout with:

```tsx
<div className="mx-auto max-w-2xl px-8 pt-32 lg:pt-40 pb-32">
  <h1 className="text-display uppercase font-bold tracking-tighter text-ink-100">CHECKOUT</h1>

  <div className="mt-8">
    <OrderSummary collapsible />
  </div>

  <Section number="01" title="CONTACT">
    {/* contact form fields here */}
  </Section>
  <Section number="02" title="SHIPPING">
    <ShippingForm />
  </Section>
  <Section number="03" title="SHIPPING METHOD">
    <ShippingOptions />
  </Section>
  <Section number="04" title="PAYMENT">
    <PaymentSection />
  </Section>

  <button className="mt-12 btn-primary w-full">PLACE ORDER</button>
</div>
```

Add a small inline `Section` component above the page export:

```tsx
function Section({
  number,
  title,
  children,
}: {
  number: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="mt-16 pt-8 border-t border-ink-700">
      <div className="flex items-baseline gap-4 mb-6">
        <span className="text-display-sm font-bold text-ink-500">{number}</span>
        <span className="text-caption text-ink-300">/ {title}</span>
      </div>
      {children}
    </section>
  )
}
```

- [ ] **Step 3: Restyle ShippingForm to underline inputs**

Open `ShippingForm.tsx`. Replace any `<input>` className with `underline-input`, and any `<label>` styling with `text-caption text-ink-300 mb-2 block`. Keep validation and onSubmit logic intact.

- [ ] **Step 4: Restyle ShippingOptions and PaymentSection**

For each radio row in `ShippingOptions.tsx`: convert filled-card layout to `border-b border-ink-700 py-4 cursor-pointer hover:border-ink-300`, with the selected state showing `border-accent-lime`.

For `PaymentSection.tsx`: keep the Midtrans Snap integration logic. Restyle the trigger button to `btn-primary`. Restyle any payment method choice cards to the same border-bottom pattern as ShippingOptions.

- [ ] **Step 5: Restyle OrderSummary as collapsible header**

Edit `OrderSummary.tsx` to optionally render as a collapsible top strip:

```tsx
export default function OrderSummary({ collapsible = false }: { collapsible?: boolean }) {
  // ... existing logic to load lineItems and total ...

  if (collapsible) {
    return (
      <details className="bg-ink-900 border border-ink-700 px-5 py-4">
        <summary className="cursor-pointer flex items-center justify-between text-caption text-ink-100">
          <span>{lineItems.length} ITEMS · TOTAL {formatRupiah(total)}</span>
          <span>SHOW DETAILS ▾</span>
        </summary>
        <div className="mt-4 flex flex-col gap-2">
          {lineItems.map((item) => (
            <div key={item.id} className="flex justify-between text-sm text-ink-300">
              <span>{item.title} × {item.qty}</span>
              <span>{formatRupiah(item.price * item.qty)}</span>
            </div>
          ))}
        </div>
      </details>
    )
  }

  // ... existing render path for other usages
}
```

- [ ] **Step 6: Smoke test**

Run dev. Walk through `/checkout` end-to-end with sandbox Midtrans. Confirm sections animate, inputs use underline style, submit reaches Snap.

- [ ] **Step 7: Commit**

```bash
git add apps/storefront/src/app/\(store\)/checkout apps/storefront/src/components/checkout
git commit -m "feat(redesign): checkout single-column with section numbers + underline inputs"
```

---

## Task 17: Account + Orders pages

**Files:**
- Modify: `apps/storefront/src/app/(store)/account/page.tsx`
- Modify: `apps/storefront/src/app/(store)/account/orders/page.tsx`

- [ ] **Step 1: Account landing**

```tsx
'use client'

import Link from 'next/link'
import { useAuth } from '@/providers/auth-provider'

export default function AccountPage() {
  const { user, logout } = useAuth()
  if (!user) return null
  return (
    <div className="mx-auto max-w-2xl px-8 pt-32 lg:pt-40 pb-32">
      <h1 className="text-display-sm uppercase font-bold tracking-tighter text-ink-100">
        HELLO, {user.firstName?.toUpperCase() || 'FRIEND'}
      </h1>
      <div className="mt-12 flex flex-col">
        <Link href="/account/orders" className="border-t border-ink-700 py-6 flex items-center justify-between text-sm uppercase font-bold text-ink-100 hover:text-accent-lime transition-colors">
          <span>ORDERS</span><span>→</span>
        </Link>
        <Link href="/account#address" className="border-t border-ink-700 py-6 flex items-center justify-between text-sm uppercase font-bold text-ink-100 hover:text-accent-lime transition-colors">
          <span>ADDRESS BOOK</span><span>→</span>
        </Link>
        <button onClick={logout} className="border-t border-b border-ink-700 py-6 flex items-center justify-between text-sm uppercase font-bold text-ink-100 hover:text-accent-lime transition-colors text-left">
          <span>LOG OUT</span><span>→</span>
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Orders page**

Read existing orders page to identify how orders are fetched, then replace its render with hairline-row list:

```tsx
{orders.map((order: any) => (
  <details key={order.id} className="border-t border-ink-700 py-4">
    <summary className="cursor-pointer grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center text-sm">
      <span className="font-bold text-ink-100">#{order.display_id}</span>
      <span className="text-ink-300">{new Date(order.created_at).toLocaleDateString('en-US')}</span>
      <span className={`text-caption ${
        order.payment_status === 'captured' ? 'text-accent-lime'
        : order.status === 'canceled' ? 'text-ink-500'
        : 'text-ink-100'
      }`}>{order.payment_status?.toUpperCase()}</span>
      <span className="font-bold text-ink-100">{formatRupiah(order.total)}</span>
    </summary>
    <div className="mt-4 flex flex-col gap-2 text-sm text-ink-300">
      {order.items?.map((it: any) => (
        <div key={it.id} className="flex justify-between">
          <span>{it.title} × {it.quantity}</span>
          <span>{formatRupiah(it.unit_price * it.quantity)}</span>
        </div>
      ))}
    </div>
  </details>
))}
```

Wrap it in `<div className="mx-auto max-w-2xl px-8 pt-32 pb-32">` with a `<h1 className="text-display ...">ORDERS</h1>` heading.

- [ ] **Step 3: Smoke test + commit**

```bash
pnpm --filter storefront typecheck
git add apps/storefront/src/app/\(store\)/account
git commit -m "feat(redesign): account landing + orders list reskinned"
```

---

## Task 18: Auth pages (login + register) and order confirmation pages

**Files:**
- Modify: `apps/storefront/src/app/(store)/login/page.tsx`
- Modify: `apps/storefront/src/app/(store)/register/page.tsx`
- Modify: `apps/storefront/src/app/(store)/order/success/page.tsx`
- Modify: `apps/storefront/src/app/(store)/order/pending/page.tsx`

- [ ] **Step 1: Login page**

Replace the page content with:

```tsx
<div className="min-h-screen flex items-center justify-center px-8">
  <div className="w-full max-w-md">
    <h1 className="text-display-sm uppercase font-bold tracking-tighter text-ink-100">LOG IN</h1>
    <form onSubmit={handleSubmit} className="mt-12 flex flex-col gap-6">
      <UnderlineInput label="EMAIL" type="email" name="email" required />
      <UnderlineInput label="PASSWORD" type="password" name="password" required />
      {error && <p className="text-caption text-red-400">{error}</p>}
      <button type="submit" className="btn-primary w-full mt-4">LOG IN</button>
    </form>
    <Link href="/register" className="mt-8 block text-caption text-ink-300 hover:text-accent-lime">
      NO ACCOUNT? CREATE ONE →
    </Link>
  </div>
</div>
```

Preserve the `handleSubmit` and `error` logic that already exists.

- [ ] **Step 2: Register page**

Same skeleton, with extra `UnderlineInput` fields for first name and last name. Bottom cross-link: `ALREADY A MEMBER? LOG IN →`. Title: `SIGN UP`.

- [ ] **Step 3: Order success / pending pages**

```tsx
<div className="min-h-screen flex items-center justify-center px-8">
  <div className="w-full max-w-md text-center">
    <h1 className="text-display-sm uppercase font-bold tracking-tighter text-ink-100">
      {/* ORDER CONFIRMED  or  PAYMENT PENDING */}
    </h1>
    <p className="mt-4 text-sm text-ink-300">Order #{orderId}</p>
    {expectedDelivery && <p className="mt-2 text-caption text-ink-500">EXPECTED DELIVERY: {expectedDelivery}</p>}
    <Link href="/products" className="mt-12 btn-primary inline-flex">BACK TO SHOP</Link>
  </div>
</div>
```

- [ ] **Step 4: Smoke test + commit**

```bash
pnpm --filter storefront typecheck
git add apps/storefront/src/app/\(store\)/login apps/storefront/src/app/\(store\)/register apps/storefront/src/app/\(store\)/order
git commit -m "feat(redesign): auth + order confirmation pages reskinned"
```

---

## Task 19: Static pages — FAQ, About, How to Order, Privacy, AnnouncementBar

**Files:**
- Modify: `apps/storefront/src/app/(store)/faq/page.tsx`
- Modify: `apps/storefront/src/app/(store)/[slug]/page.tsx` (handles About, How to Order, Privacy via Sanity slug)
- Modify: `apps/storefront/src/components/faq/FaqList.tsx`
- Modify: `apps/storefront/src/components/sanity/SanityContent.tsx`
- Modify: `apps/storefront/src/components/layout/AnnouncementBar.tsx`

- [ ] **Step 1: FAQ page**

Wrap the existing list in a centered max-w-2xl container with `pt-32 pb-32`:

```tsx
<div className="mx-auto max-w-2xl px-8 pt-32 lg:pt-40 pb-32">
  <h1 className="text-display uppercase font-bold tracking-tighter text-ink-100 mb-12">FAQ</h1>
  <FaqList items={items} />
</div>
```

- [ ] **Step 2: FaqList styling**

Update each item to use `border-t border-ink-700 py-4`, `text-nav text-ink-100 hover:text-accent-lime` for the question button, `text-sm text-ink-300 mt-3 leading-relaxed` for the answer. Preserve open/close logic.

- [ ] **Step 3: Sanity slug page (`[slug]/page.tsx`)**

This file currently renders About, How to Order, Privacy via Sanity content. Wrap its output:

```tsx
<article className="mx-auto max-w-2xl px-8 pt-32 lg:pt-40 pb-32">
  <h1 className="text-display uppercase font-bold tracking-tighter text-ink-100 mb-12">{page.title}</h1>
  <SanityContent value={page.body} />
</article>
```

- [ ] **Step 4: SanityContent prose treatment**

In `SanityContent.tsx`, the wrapper div className becomes:

```tsx
<div className="prose prose-invert max-w-none
                prose-headings:uppercase prose-headings:font-bold prose-headings:tracking-tighter
                prose-headings:text-ink-100
                prose-p:text-ink-300 prose-p:leading-relaxed
                prose-a:text-accent-lime prose-a:no-underline hover:prose-a:underline
                prose-hr:border-ink-700
                prose-strong:text-ink-100">
```

Confirm `@tailwindcss/typography` is installed in `apps/storefront/package.json`. If not, install it: `pnpm --filter storefront add -D @tailwindcss/typography`, and add `require('@tailwindcss/typography')` to the storefront's local Tailwind plugins (the storefront config currently extends a shared preset; add the plugin in the storefront's own config file by overriding plugins).

Update `apps/storefront/tailwind.config.ts`:

```ts
import type { Config } from 'tailwindcss'
import sharedConfig from '@draven/tailwind-config'

const config: Config = {
  presets: [sharedConfig],
  content: [
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  plugins: [require('@tailwindcss/typography')],
}

export default config
```

- [ ] **Step 5: AnnouncementBar dark restyle**

Open `AnnouncementBar.tsx`. Replace background and text colors so it appears as a top strip on the dark page:

```tsx
<div className="bg-ink-900 border-b border-ink-700">
  <p className="text-center text-caption text-ink-300 py-2">
    FREE SHIPPING ACROSS INDONESIA OVER RP 500.000 · NEW DROP NOW LIVE
  </p>
</div>
```

Keep any existing visibility-toggle / dismiss logic.

- [ ] **Step 6: Smoke test + commit**

```bash
pnpm --filter storefront typecheck
pnpm --filter storefront lint
git add apps/storefront
git commit -m "feat(redesign): FAQ, slug pages, prose styling, AnnouncementBar"
```

---

## Task 20: New pages — Size Guide + Terms

**Files:**
- Create: `apps/storefront/src/app/(store)/size-guide/page.tsx`
- Create: `apps/storefront/src/app/(store)/terms/page.tsx`

- [ ] **Step 1: Size Guide page**

```tsx
import { getSizeGuide } from '@/lib/sanity'

export const revalidate = 60
export const metadata = { title: 'Size Guide' }

export default async function SizeGuidePage() {
  const data = await getSizeGuide()

  return (
    <div className="mx-auto max-w-3xl px-8 pt-32 lg:pt-40 pb-32">
      <h1 className="text-display uppercase font-bold tracking-tighter text-ink-100 mb-12">SIZE GUIDE</h1>
      {data?.intro && <p className="text-sm text-ink-300 leading-relaxed mb-12">{data.intro}</p>}

      {(data?.sections ?? []).map((section: any, i: number) => (
        <section key={i} className="mt-16 border-t border-ink-700 pt-8">
          <h2 className="text-display-sm uppercase font-bold tracking-tighter text-ink-100">
            {section.garmentType}
          </h2>
          {section.note && <p className="mt-3 text-sm text-ink-300">{section.note}</p>}
          {section.measurements?.length > 0 && (
            <table className="mt-6 w-full text-sm">
              <thead>
                <tr className="border-b border-ink-700">
                  <th className="text-left py-3 text-caption text-ink-300">SIZE</th>
                  <th className="text-left py-3 text-caption text-ink-300">CHEST</th>
                  <th className="text-left py-3 text-caption text-ink-300">LENGTH</th>
                  <th className="text-left py-3 text-caption text-ink-300">SLEEVE</th>
                </tr>
              </thead>
              <tbody>
                {section.measurements.map((m: any, j: number) => (
                  <tr key={j} className="border-b border-ink-700/50">
                    <td className="py-3 text-ink-100 font-bold">{m.size}</td>
                    <td className="py-3 text-ink-300">{m.chest}</td>
                    <td className="py-3 text-ink-300">{m.length}</td>
                    <td className="py-3 text-ink-300">{m.sleeve}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Terms page**

```tsx
import { getTerms } from '@/lib/sanity'
import SanityContent from '@/components/sanity/SanityContent'

export const revalidate = 60
export const metadata = { title: 'Terms' }

export default async function TermsPage() {
  const data = await getTerms()
  return (
    <article className="mx-auto max-w-2xl px-8 pt-32 lg:pt-40 pb-32">
      <h1 className="text-display uppercase font-bold tracking-tighter text-ink-100 mb-12">
        {data?.title || 'TERMS'}
      </h1>
      {data?.body && <SanityContent value={data.body} />}
    </article>
  )
}
```

- [ ] **Step 3: Smoke test + commit**

```bash
pnpm --filter storefront typecheck
git add apps/storefront/src/app/\(store\)/size-guide apps/storefront/src/app/\(store\)/terms
git commit -m "feat(redesign): Size Guide + Terms pages"
```

---

## Task 21: Cleanup — delete deprecated components, drop legacy brand alias

**Files:**
- Delete: `apps/storefront/src/components/layout/Header.tsx`
- Delete: `apps/storefront/src/components/layout/Footer.tsx`
- Delete: `apps/storefront/src/components/layout/MobileNav.tsx`
- Delete: `apps/storefront/src/components/home/HomeContent.tsx`
- Delete: `apps/storefront/src/components/home/HeroBanner.tsx`
- Delete: `apps/storefront/src/components/product/ProductFilters.tsx`
- Delete: `apps/storefront/src/components/product/MobileFilterButton.tsx`
- Modify: `packages/config/tailwind/index.js`

- [ ] **Step 1: Confirm no references to deprecated files**

Use the Grep tool to search the storefront source for each filename without extension:

```
Grep pattern: from '@/components/layout/Header'
Grep pattern: from '@/components/layout/Footer'
Grep pattern: from '@/components/layout/MobileNav'
Grep pattern: from '@/components/home/HomeContent'
Grep pattern: from '@/components/home/HeroBanner'
Grep pattern: from '@/components/product/ProductFilters'
Grep pattern: from '@/components/product/MobileFilterButton'
```

Each must return zero matches. If any return a match, fix the consumer first.

- [ ] **Step 2: Delete the files**

```bash
rm apps/storefront/src/components/layout/Header.tsx \
   apps/storefront/src/components/layout/Footer.tsx \
   apps/storefront/src/components/layout/MobileNav.tsx \
   apps/storefront/src/components/home/HomeContent.tsx \
   apps/storefront/src/components/home/HeroBanner.tsx \
   apps/storefront/src/components/product/ProductFilters.tsx \
   apps/storefront/src/components/product/MobileFilterButton.tsx
```

- [ ] **Step 3: Find any remaining `brand-*` class usage**

```
Grep pattern: brand-(?:50|100|200|300|400|500|600|700|800|900|950)
```

For every remaining hit, replace with the corresponding `ink-*` token (use the mapping from the legacy alias in Task 1's config). After cleanup, no `brand-` class strings should remain in the source tree.

- [ ] **Step 4: Remove the legacy `brand` alias from Tailwind config**

In `packages/config/tailwind/index.js`, delete the `brand: { … }` block. Keep `ink` and `accent`.

- [ ] **Step 5: Run typecheck + lint + build**

```bash
pnpm --filter storefront typecheck
pnpm --filter storefront lint
pnpm --filter storefront build
```

All three must pass.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore(redesign): drop legacy components + brand-* alias after migration"
```

---

## Task 22: Final verification + manual smoke walk

**No file changes. Verification only.**

- [ ] **Step 1: Boot dev server**

Run: `pnpm --filter storefront dev`

- [ ] **Step 2: Walk every route in a clean browser session**

Visit each in order; confirm visual integrity, no console errors, chrome stays fixed:

1. `/` — hero plays / shows fallback image; SHOP HERE breathes; sections appear or are gracefully hidden
2. `/products` — 3-column grid on desktop; FILTER drawer opens; SORT works
3. `/products?category=hoodies` — filter applied
4. `/products/[some-handle]` — magazine stack + sticky info column; ADD TO BAG
5. `/cart` — line items, leader-row totals
6. `/checkout` — single-column with section numbers; underline inputs
7. `/login`, `/register` — centered single-column forms
8. `/account`, `/account/orders`
9. `/gallery`, `/faq`, `/size-guide`, `/terms`, `/tentang-kami`, `/cara-order`, `/kebijakan-privasi`
10. Mobile width: chrome shows MENU + BAG, vertical stack hidden, mobile menu opens with embedded search

- [ ] **Step 3: Run the full check suite**

```bash
pnpm --filter storefront typecheck
pnpm --filter storefront lint
pnpm --filter storefront build
```

All three green.

- [ ] **Step 4: Spec self-check**

Open the spec at `docs/superpowers/specs/2026-05-05-draven-brokenplanet-redesign-design.md`. Check each section's requirements are reflected in the running site. List any drift in a separate followup commit if needed.

- [ ] **Step 5: Final commit if any drift fixes**

```bash
git add -A
git commit -m "chore(redesign): final polish from manual smoke walk"
```

---

## Self-review notes (resolved during plan authoring)

- **Spec coverage:** every spec section maps to at least one task. Tokens → T1; fonts → T2; globals → T3; CMS schema → T4; queries → T5; primitives → T6; chrome → T7–T10; ProductCard → T11; shop grid → T12; PDP → T13; homepage → T14; cart → T15; checkout → T16; account → T17; auth + order pages → T18; static pages + AnnouncementBar → T19; new pages → T20; cleanup → T21; verification → T22.
- **Type / property consistency:** `useCart()` is consumed in chrome (`totalItems`, `lastAddedAt`), cart page (`items`, `removeItem`, `updateQty`, `subtotal`), and PDP (`addItem`). Tasks 15 and 13 instruct the engineer to verify the actual provider shape before writing — this avoids inventing API names.
- **Legacy `brand-*` alias:** introduced in Task 1, removed in Task 21 — bridges the migration without breaking intermediate commits.
- **Logo invert:** chrome applies `filter: invert(1) brightness(2)` per spec (Task 9). White SVG export deferred per spec.
- **Search relocation:** salvaged into standalone `SearchOverlay` (Task 7), wired to chrome (Task 9), embedded in mobile menu (Task 8) — covers both desktop and mobile flows.
- **No backend changes:** confirmed — all tasks touch storefront, studio, or shared config only.
