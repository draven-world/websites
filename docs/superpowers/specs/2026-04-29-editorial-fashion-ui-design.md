# Editorial Fashion UI — Design Spec

**Date:** 2026-04-29
**Project:** DRAVEN Storefront
**Goal:** Elevate the storefront from "functional minimalist" to a distinctive editorial fashion aesthetic (SSENSE / Aimé Leon Dore / COS reference points), without changing existing commerce/payment/shipping logic.

---

## Decisions (locked)

1. **Display typeface:** Fraunces (Google Font, variable; opsz + SOFT + WONK axes for editorial feel)
2. **Body typeface:** Work Sans (existing — unchanged)
3. **Palette:** strict monochrome — `brand.50` → `brand.950` (existing). No accent colors.
4. **Scope:** all 8 areas listed below
5. **Out of scope:** dark mode, custom cursor, scroll-jacking, cart drawer redesign, admin UI

---

## Type system

Add Fraunces alongside existing Work Sans:

```ts
// apps/storefront/src/app/layout.tsx
import { Fraunces, Work_Sans } from 'next/font/google'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['opsz', 'SOFT', 'WONK'],
})
```

Tailwind extension (`packages/config/tailwind/index.js`):

```js
fontFamily: {
  sans: ['var(--font-work-sans)', 'Helvetica Neue', 'Arial', 'sans-serif'],
  serif: ['var(--font-fraunces)', 'Georgia', 'serif'],
},
fontSize: {
  // editorial display scale (clamp for fluid sizing)
  'display-xl': ['clamp(3.5rem, 9vw, 7rem)', { lineHeight: '0.95', letterSpacing: '-0.03em' }],
  'display':    ['clamp(2.5rem, 6vw, 4.5rem)', { lineHeight: '1.0',  letterSpacing: '-0.025em' }],
  'display-sm': ['clamp(1.75rem, 4vw, 2.75rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
  'eyebrow':    ['11px', { lineHeight: '1', letterSpacing: '0.2em' }],
},
```

**Usage rules:**
- `font-serif` → hero titles, section headings (h1/h2), PDP product title, pull-quotes, large numerics
- `font-sans` (default) → nav, buttons, body, prices, captions, form fields
- `text-eyebrow uppercase tracking-[0.2em]` → eyebrow lines above headings

---

## Module 1 — Announcement bar

New component: `components/layout/AnnouncementBar.tsx`

- Black background, 32px tall
- Centered text: "Free shipping over Rp 500.000 · Pengiriman ke seluruh Indonesia"
- Dismiss button right-aligned (X icon)
- Dismissed state stored in `localStorage` key `draven_announce_dismissed_v1`
- Above `<Header>` — Header's `top-0` becomes `top-8` when bar visible
- Mobile: same height, smaller text (11px)

---

## Module 2 — Hero (HeroBanner.tsx)

Refactor existing component, keep timer/pause logic.

Changes:
- Pull `slide.title` and `slide.subtitle` from Sanity (already typed, currently unused)
- Add eyebrow (top-left of content area): "SS26 — CHAPTER 01" or `slide.eyebrow` if added to schema
- Add Fraunces title (display-xl, white, italic optional based on slide config) — bottom-left
- Add subtitle below title (max-w-md, text-sm, white/80)
- Existing "Shop Collection" CTA — keep position, keep arrow
- **Letter-stagger reveal** on title using CSS animation (per-letter span with delay 30ms × index, fade-up 12px). Reset on slide change.
- Progress bar — keep existing, but make active segment animate fill from 0→100% over 8s (auto-advance interval)
- Fallback when `title` is empty: render no eyebrow/title/subtitle, only the CTA (graceful)

Sanity schema addition (optional, non-blocking): `eyebrow` field on banner type. If absent, hero renders without eyebrow.

---

## Module 3 — Featured collection strip

New component: `components/home/FeaturedCollection.tsx` rendered on homepage below Hero.

- Full-bleed 100vw, two-column grid on desktop (50/50), stacked on mobile
- Left: full-bleed image (aspect-[4/5])
- Right: vertical-center text block with generous padding (~10vw)
  - Eyebrow: "FEATURED COLLECTION"
  - Title (font-serif, text-display): "Tailoring, reimagined."
  - Body paragraph (max-w-sm): editorial copy
  - CTA: existing `btn-secondary` style with arrow → `/products?category=...`
- Reverses order on every other instance via `reverse` prop (so we can drop in a 2nd collection further down)
- Data source: hardcoded on homepage for MVP, can move to Sanity later

---

## Module 4 — Product grid — Latest

Homepage section:
- Wrapper: `max-w-container mx-auto px-5 lg:px-8 py-20 lg:py-32`
- Header row: eyebrow "JUST DROPPED" + serif heading "Latest" + right-aligned text link "View all →"
- Grid: `grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12`
- Reuses new ProductCard variant (Module 5)
- Pulls latest 8 products from Medusa (already wired in `lib/medusa.ts` — add `getLatestProducts(limit)` if not present)

---

## Module 5 — ProductCard (editorial variant)

Refactor `components/product/ProductCard.tsx`:

- Keep aspect-[3/4] and existing structure
- **Image hover swap:** if `product.images[1]` exists, render a second `<Image>` absolutely positioned, opacity-0 by default, fade to opacity-100 on group-hover. Crossfade 500ms.
- **Eyebrow line** above title: `<p className="text-[10px] uppercase tracking-[0.2em] text-brand-400 mb-1">{category}</p>` — pulled from `product.collection.title` or fallback to first tag
- **Title:** keep `text-[13px] font-medium` (sans) — restraint matters; serif here would be too much
- **Size dots:** desktop only, appear on hover under price
  - Render as horizontal row of size labels (XS S M L XL) extracted from variants
  - Available size: `text-brand-950`. Sold-out size: `text-brand-300 line-through`.
  - Hide on mobile (clutters card)
- **Sold-out treatment:** replace overlay with `grayscale opacity-70` on image and a small bottom-left badge: `<span className="absolute bottom-3 left-3 bg-white px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-brand-950">Sold Out</span>`
- Add `priority` prop (default false) so above-the-fold cards on homepage can pass `priority`

---

## Module 6 — Lookbook tiles

New component: `components/home/LookbookTiles.tsx`

- Three asymmetric tiles in a CSS grid:
  - Tile A: `col-span-2 row-span-2` aspect-[4/5]
  - Tile B: `col-span-1 row-span-1` aspect-[1/1]
  - Tile C: `col-span-1 row-span-1` aspect-[1/1]
- Each tile: image background + bottom-left text overlay
  - Eyebrow + serif label (e.g. "Outerwear", "Knitwear", "Accessories")
  - White text with subtle gradient overlay for legibility
  - Entire tile is a Link to `/products?category=<slug>`
- Hover: image scale 1.03 / 700ms
- Mobile: stacks vertically, all aspect-[4/5]

---

## Module 7 — Editorial quote / journal teaser

New component: `components/home/EditorialQuote.tsx`

- Full-width section, white background, generous py-32
- Centered, max-w-3xl
- Eyebrow: "JOURNAL"
- Big serif pull-quote (text-display, italic) — short editorial copy or quote
- Attribution line below in small sans
- Optional CTA below: "Read the journal →" → `/journal` (link can be inert if route not built; render only if `href` prop passed)

---

## Module 8 — Footer

Refactor `components/layout/Footer.tsx`:

**Top band — Newsletter:**
- White background, py-20, border-y `border-brand-100`
- Centered: eyebrow "NEWSLETTER" → serif heading "Stay in the loop." → subtitle → inline email form (border-bottom only, button = arrow icon)
- Privacy line: "By subscribing you agree to our Privacy Policy."

**Main footer:**
- Black (`bg-brand-950`) text-white, py-16
- 4 columns desktop / accordion mobile:
  1. **Shop** — All Products / New Arrivals / Sale
  2. **Help** — FAQ / Cara Order / Shipping / Returns / Contact
  3. **About** — Tentang Kami / Komunitas / Journal
  4. **Connect** — Instagram / TikTok / WhatsApp Support / Email
- Below columns, full-width row:
  - Left: small DRAVEN wordmark
  - Right: trust line: "Pembayaran aman via Midtrans · Pengiriman seluruh Indonesia"
- Bottom row (border-top white/10): copyright + Privacy / Terms links

---

## Module 9 — ProductDetail (PDP)

Refactor `components/product/ProductDetail.tsx`:

**Desktop (lg+):**
- Two-column: `grid-cols-12`
- Left col-span-7: vertical-scroll gallery — each image stacks at full width, `aspect-[3/4]`, no thumbnails. Lazy-load all but first.
- Right col-span-5: **sticky** info panel (`sticky top-24 self-start`), pl-8 lg:pl-16
  - Eyebrow: category
  - Serif title (text-display-sm)
  - Price (text-lg, sans, mt-4)
  - Size selector (square buttons grid, 60px each, sold-out = strikethrough + disabled)
  - Quantity selector (existing — keep)
  - Primary CTA: existing `btn-primary` "Add to Bag"
  - Below CTA: small links "Size guide" / "Notify when restocked" (latter only when sold out)
  - **Accordions** (3): Description / Materials & Care / Shipping & Returns
    - Border-top + border-bottom `border-brand-100`
    - Plus/minus icon, smooth height animation
    - All collapsed by default

**Mobile:**
- Stacked
- Gallery → horizontal snap carousel `overflow-x-auto snap-x snap-mandatory`, full-bleed; tiny dot indicator below
- Sticky bottom bar (existing — keep) with CTA

**You may also like:** 4-up strip below PDP using new ProductCard variant.

---

## Motion

- Page enter: existing fade-up on first viewport — keep
- Image hover scale 1.03 / 700ms — keep
- Hero title letter-stagger reveal — new (CSS only, no JS framework)
- Accordion height — pure CSS `grid-template-rows: 0fr → 1fr` transition (no JS measurement)
- Cart badge bounce — existing — keep

No scroll-jacking, no parallax, no GSAP, no Framer Motion. CSS-only.

---

## File-level changes

**New files:**
- `apps/storefront/src/components/layout/AnnouncementBar.tsx`
- `apps/storefront/src/components/home/FeaturedCollection.tsx`
- `apps/storefront/src/components/home/LookbookTiles.tsx`
- `apps/storefront/src/components/home/EditorialQuote.tsx`
- `apps/storefront/src/components/home/ProductGridSection.tsx`
- `apps/storefront/src/components/ui/Accordion.tsx` (used by PDP and Footer mobile)
- `apps/storefront/src/components/ui/NewsletterForm.tsx`

**Modified files:**
- `apps/storefront/src/app/layout.tsx` (add Fraunces font)
- `apps/storefront/src/app/(store)/page.tsx` (compose new homepage modules)
- `apps/storefront/src/app/globals.css` (add letter-stagger keyframes, accordion transitions)
- `apps/storefront/src/components/layout/Header.tsx` (top offset for announcement bar)
- `apps/storefront/src/components/layout/Footer.tsx` (full restructure)
- `apps/storefront/src/components/home/HeroBanner.tsx` (add eyebrow/title/subtitle, letter-stagger)
- `apps/storefront/src/components/product/ProductCard.tsx` (hover swap, eyebrow, size dots, sold-out treatment)
- `apps/storefront/src/components/product/ProductDetail.tsx` (two-column sticky layout, accordions)
- `packages/config/tailwind/index.js` (add `serif` family + display scale + eyebrow)

---

## Acceptance criteria

1. Fraunces loads with no layout shift (font-display: swap, fallback metrics adjusted by Next/Font automatically)
2. Hero title and subtitle display when present in Sanity; CTA-only when absent
3. ProductCard hover swap works only when a second image exists; degrades gracefully
4. Size dots are visible on desktop hover only; not on mobile
5. PDP right panel stays sticky during gallery scroll; accordions toggle smoothly
6. Footer mobile collapses to accordions; desktop shows 4 columns
7. Newsletter form submits to existing endpoint or shows "Coming soon" if endpoint absent
8. No regressions in checkout, cart, search, or auth flows
9. All existing UX audit fixes (toast feedback, ARIA labels, real-time validation, etc.) remain functional
10. Lighthouse score ≥ 85 (perf) on homepage, no CLS regression

---

## Risks

- **Font weight:** Fraunces variable font is ~50KB; mitigated by `display: swap` and Next/Font subsetting
- **Hover swap on slow connections:** second image lazy-loaded, may flash on first hover; acceptable
- **Sticky PDP panel:** may overflow viewport on shorter screens — fallback to non-sticky below 800px height
- **Sanity schema:** banner `eyebrow` field optional, no migration needed
