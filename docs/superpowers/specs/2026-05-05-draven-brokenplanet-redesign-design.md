# Draven × Brokenplanet — Storefront Redesign Spec

**Date:** 2026-05-05
**Author:** brainstorming session
**Status:** approved by user, awaiting final spec review

## 1. Goal

Redesign the Draven storefront to adopt the visual language and layout
structure of brokenplanet.com while keeping Draven's brand identity (logo)
intact. The result should feel like a premium streetwear brand, dark and
editorial, with massive negative space, bold uppercase typography, and a
distinctive corner-chrome navigation pattern that replaces the traditional
header/footer model.

This is a full storefront reskin — homepage, shop, product detail, cart,
checkout, account, auth, and all static content pages. No backend (Medusa)
changes. CMS gets targeted schema additions.

## 2. Direction decisions (locked)

| Topic | Decision |
|---|---|
| Scope | Full storefront reskin (option C from brainstorm) |
| Brand identity | Keep Draven logo only; everything else follows brokenplanet |
| Theme | Fully dark site-wide (option A) — every page on near-black |
| Layout chrome | Faithful brokenplanet clone — logo top-left, BAG top-right, vertical nav stacked bottom-left, **no traditional footer** |
| Search | Kept in chrome as small `SEARCH` text-link next to BAG |
| Language | All content in English (overrides project default of Bahasa Indonesia) |
| Fonts | PP Neue Machina (display) + PP Neue Montreal (body), self-hosted |
| Hero medium | Hybrid — Sanity `heroVideo` field optional, falls back to `heroImage`; single `SHOP HERE` CTA centered |
| About page | Kept (existing `/tentang-kami`) |
| New value pages | None (no Sustainability, no Foundation) |
| New utility pages | Size Guide, Terms (both Sanity-driven, can ship with stub content) |

## 3. Foundation — design tokens, fonts, motion

### 3.1 Colors

Replace the current `brand-*` scale with a dark-first system. Old `brand-*`
references migrate to `ink-*` via a global find-replace.

```js
ink: {
  950: '#0a0a0a',  // page background
  900: '#111111',  // surface raise (cards, modals, drawer bg, input bg)
  800: '#1a1a1a',  // surface raise +1 (hover)
  700: '#262626',  // hairline borders
  500: '#737373',  // muted text
  300: '#a3a3a3',  // secondary text
  100: '#e5e5e5',  // primary text on dark
  50:  '#fafafa',  // hard accents, badges, pure-white moments
},
accent: {
  lime: '#c6ff3d',  // singular pop color — pill badges, primary CTAs, focus rings
},
```

Single-accent rule: `accent.lime` is the only non-monochrome color in the
system. Use it sparingly and intentionally — pill badges, primary CTAs,
focus rings, and small status indicators (paid order, etc.). No gradients.

### 3.2 Typography

- **Display:** PP Neue Machina (Plain Ultrabold, Plain Regular)
- **Body:** PP Neue Montreal (Regular, Medium, Bold)
- Both Pangram Pangram, free for commercial use, self-hosted via
  `next/font/local`. Font files vendored under
  `apps/storefront/public/fonts/`.
- Fallbacks: `Helvetica Neue, Arial, sans-serif`.
- Existing Work Sans + Fraunces removed from the build.

**Type scale:**

| Token | Size | Line | Tracking | Case |
|---|---|---|---|---|
| `display-xxl` | clamp(4.5rem, 12vw, 11rem) | 0.9 | -0.04em | UPPERCASE |
| `display-xl`  | clamp(3rem, 8vw, 7rem)     | 0.95 | -0.03em | UPPERCASE |
| `display`     | clamp(2rem, 5vw, 4rem)     | 1.0 | -0.025em | UPPERCASE |
| `display-sm`  | clamp(1.5rem, 3.5vw, 2.5rem) | 1.05 | -0.02em | UPPERCASE |
| `title`       | 1.25rem                     | 1.1 | -0.01em | UPPERCASE |
| `body`        | 0.9375rem                   | 1.5 | 0       | sentence |
| `caption`     | 0.75rem                     | 1.3 | 0.15em  | UPPERCASE |
| `nav`         | 0.8125rem                   | 1.0 | 0.18em  | UPPERCASE / bold |

### 3.3 Motion

- **Page load:** staggered text reveal — `translateY(24px) → 0`,
  `opacity 0 → 1`, 700ms `cubic-bezier(0.22, 1, 0.36, 1)`,
  `delay = i * 80ms`.
- **Hover:** 200ms standard. 500ms for image scale. No image-swap on
  product cards by default.
- **Hero:** keep existing scroll-driven scale-up on the media; add a
  persistent breathing scale on the SHOP HERE CTA (1.0 ↔ 1.02, 4s loop).
- **Reduced motion:** `prefers-reduced-motion: reduce` disables transforms
  and parallax; opacity transitions are kept at 200ms.

### 3.4 Spacing & layout

- Container max width: `1400px` on shop and PDP. Homepage runs full-bleed
  (no container — corner chrome eats the edges).
- Edge padding: `px-5 lg:px-8` for contained pages; `px-8 lg:px-16` for
  the shop grid (more breathing room around floating products).
- Hairline border treatment: `1px solid theme(ink.700)`; semantically
  represents a divider, never a "card edge."
- Shop grid gap: `gap-x-12 md:gap-x-24 lg:gap-x-32 gap-y-24 lg:gap-y-32`.
  Products float in space; cards have no background, no border.
- z-index layers: chrome `z-50`, mobile menu / search overlay `z-60`,
  modals & drawers `z-70`.

## 4. Global chrome — replaces header AND footer

A single `<SiteChrome>` wraps every page in `(store)/layout.tsx`. It is
fixed-position on desktop and occupies the four corners of the viewport.
Page content scrolls underneath; chrome stays put. There is no `<footer>`
element rendered anywhere on the site.

### 4.1 Top-left — Draven wordmark

- Position: `fixed top-5 left-5 lg:top-8 lg:left-8 z-50`.
- Renders existing `/images/logo.png` (per "follow the brand logo only"),
  height 16px mobile / 20px desktop, `object-contain`.
- Logo asset is currently black-on-white; chrome applies
  `filter: invert(1) brightness(2)` so it shows white on dark without
  re-export. A purpose-built white SVG can replace this later — not
  blocking.
- Wraps `<Link href="/">`.

### 4.2 Top-right — search + bag

- Position: `fixed top-5 right-5 lg:top-8 lg:right-8 z-50`.
- Renders two text-links side by side, separated by `gap-5`:
  - `SEARCH` — opens fullscreen search overlay (existing logic salvaged
    from current `Header.tsx` into a standalone `SearchOverlay.tsx`).
  - `BAG⁰` — uppercase, `nav` token, count rendered as `<sup>`. Live-bound
    to `useCart().totalItems`. Animates a 600ms pulse on count change
    (reuse existing `badgeBounce`). Wraps `<Link href="/cart">`. No icon.

### 4.3 Bottom-left — vertical nav stack

- Position: `fixed bottom-5 left-5 lg:bottom-8 lg:left-8 z-50`.
- Vertical stack of `<Link>`s: `flex flex-col gap-2.5`, `nav` token,
  uppercase bold, white at 100% / hover 50% opacity.
- Items, in this exact order:

  ```
  SHOP          → /products
  SIZE GUIDE    → /size-guide          (new)
  GALLERY       → /gallery
  ABOUT         → /tentang-kami        (slug stays for now)
  HOW TO ORDER  → /cara-order
  FAQ           → /faq
  SIGN UP       → /register            (hidden when user is authenticated)
  ACCOUNT       → /account             (shown only when authenticated)
  TERMS         → /terms               (new)
  PRIVACY       → /kebijakan-privasi
  ```

- Active route: `accent-lime` underline `4px` below the link.
- Hidden below `lg` breakpoint.

### 4.4 Bottom-right

Empty by default. Reserved slot for a future small element (e.g. live
cart subtotal). Do not fill in this redesign.

### 4.5 Mobile chrome (< lg)

- Top-left: Draven wordmark (same).
- Top-right: `MENU` (text-link, opens fullscreen overlay) + `BAG⁰`.
  `SEARCH` is **not** surfaced on mobile chrome; instead the menu overlay
  includes a search input at the top.
- No vertical bottom-left stack.
- Menu overlay: full-viewport `bg-ink-950`, slides in from right.
  Contents (top → bottom):
  1. Search input (underline style, autofocus)
  2. Same nav items as desktop stack at `display` size (4rem each),
     one per row, hairline `ink-700` dividers between items.

### 4.6 Accessibility

- All chrome links get `focus-visible:ring-2 ring-accent-lime
  ring-offset-2 ring-offset-ink-950`.
- `aria-label` on logo link, on `SEARCH` and `BAG⁰` triggers, on mobile
  `MENU` button.
- Mobile menu overlay is a focus trap; ESC key closes.

## 5. Homepage

Total page = 4 sections, scrolling under the fixed chrome. Full-bleed; no
container.

### 5.1 Hero (`100vh`)

- `<section class="relative h-screen w-screen overflow-hidden bg-ink-950">`.
- Media: if `homepage.heroVideo` URL is present, render
  `<video autoplay muted loop playsinline preload="metadata">`,
  `object-cover`. Otherwise fall back to `homepage.heroImage` from the
  existing `banner` schema. Both get a `bg-black/30` scrim overlay.
- Foreground: a single centered `SHOP HERE` link at `display` size
  (clamp 2–4rem), uppercase, white. Links to `/products`. Persistent
  breathing scale (1.0 ↔ 1.02, 4s loop, `ease-in-out`). No eyebrow,
  no headline, no scroll cue.
- Keep the existing scroll-driven scale-up on the media (`useScrollProgress`).

### 5.2 Latest Drop (`auto-height, ~70vh`)

- Pulled from `homepage.featuredCollection` (Sanity reference).
- Renders the first 3 products of that collection in the shop-grid style
  (Section 6.1).
- Above the grid: eyebrow `LATEST DROP / ${collection.title}` and a
  `${count} PIECES` counter — both at `caption` token, white at 50%.
- Below the grid: text-link `VIEW ALL →` at `nav` token, hover lime.
- If `featuredCollection` is unset or empty, the entire section is omitted.

### 5.3 Lookbook strip (full-bleed)

- Source: `homepage.lookbookImages` (new array, max 8).
- Layout: horizontal scroll-snap row.
  `flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-1`.
- Tile: `aspect-[3/4]`, `w-[80vw] md:w-[50vw] lg:w-[35vw]`, `flex-shrink-0`.
- Hover (desktop): caption appears at bottom of tile in `caption` token.
  Captions stored alongside images in Sanity.
- No CTA — purely atmospheric. Section omitted if no images.

### 5.4 Closing statement (`50vh`)

- Single oversize wordmark at `display-xxl`, 50% opacity, centered, on
  `bg-ink-950`. Content: `homepage.closingStatement` (default
  `BUILT FOR THOSE WHO MOVE DIFFERENTLY`).
- Below it: `caption`-token line `JAKARTA, INDONESIA` plus three text-links
  (`INSTAGRAM`, `WHATSAPP`, `TIKTOK`), opacity 50% / hover lime.

### 5.5 Removed from current homepage

- "Philosophy" middle section ("Streetwear is not about the clothes")
- "Built different" 3-column values grid
- Scroll indicator on hero
- Orchestrated `useInView` per-section reveals — replaced with simpler
  first-paint stagger

## 6. Shop grid + Product detail page

### 6.1 Shop grid (`/products`)

**Layout shift:** the current 1400px container with a 220px left sidebar
becomes a single-column dark page with floating products. Filters move to
a slide-in drawer.

**Header strip (top of page):**
- Title at `display`, uppercase, white. `SHOP` by default; `"HOODIES"` (or
  similar) when category-filtered.
- Right-aligned: `${N} PIECES` counter (caption, 50% white)
  + `FILTER` text-link (opens drawer) + `SORT ▾` (dropdown).
- Hairline `ink-700` divider underneath, 24px below.

**Grid:**
- Columns: 3 desktop, 2 tablet, 2 mobile.
- Gap: `gap-x-12 md:gap-x-24 lg:gap-x-32 gap-y-24 lg:gap-y-32`.
- Edge padding: `px-8 lg:px-16`.
- No card backgrounds, no borders.

**ProductCard (redesigned):**
- Image area: `aspect-[4/5]`, `bg-transparent` (with `bg-ink-900` fallback
  if no image). `object-contain` (not cover) to show full garment.
- Hover: 600ms scale `1.0 → 1.04`. Secondary image swap kept as opt-in
  only (off by default).
- Below image, **center-aligned**:
  - Optional pill badge (lime) above title
  - Title at `title` token, uppercase, white, `mt-3`
  - Price at `text-sm`, bold, white, `mt-1.5`. Format `Rp 100.000`.
- No size hover-reveal.
- Sold out: 50% opacity overall (no greyscale filter), small `SOLD OUT`
  text-only label below title in `caption` token.

**Filter drawer:**
- Slides in from left, `380px` wide, `bg-ink-900`, hairline `ink-700`
  border on right edge.
- Same filter facets as today: category, price, size, color. White-on-dark
  inputs, hairline dividers, accent-lime active state.
- Mobile: same drawer, full viewport.
- The desktop `ProductFilters` sidebar component is deleted; the drawer
  is the single source of truth.

**Empty state:** "No products found" copy unchanged, restyled white-on-dark.

### 6.2 Product detail page (`/products/[handle]`)

**Layout (desktop):**
- Two-column, no sidebar:
  - Left (60% width): vertical image stack — magazine layout
  - Right (40% width): info column, sticky
- Container: `max-w-container px-8 lg:px-16 py-32`.

**Image gallery (left):**
- Stacked vertical column of all product images, full column width,
  `aspect-[4/5]` each, no gaps. No carousel, no thumbnails.
- Mobile: same vertical stack.

**Info column (right, `sticky top-32 self-start` on desktop):**
1. Optional pill badge
2. Title — `display-sm`, uppercase, white
3. Price — `text-lg`, bold, `mt-2`
4. Short description — body token, `ink-300`, `mt-6`, `line-clamp-3`
5. Color selector — 28px circle swatches, hairline border, accent-lime
   ring on active
6. Size selector — pill buttons
   `border border-ink-700 text-ink-100 px-5 py-2.5`, uppercase,
   sold-out variants struck through and `ink-500`
7. **Add to cart button** — full-width `bg-accent-lime text-ink-950`,
   uppercase bold, `py-4`. Hover inverts to `bg-ink-50`. Disabled state
   when no size selected: `bg-ink-700 text-ink-500`.
8. Below button: text-link row — `SHIPPING & RETURNS`, `SIZE GUIDE`,
   `MATERIALS` — accordions (existing `Accordion.tsx` restyled).

**Below the two columns (full-width):**
- `YOU MIGHT ALSO LIKE` — 3-product grid, same shop-grid styling, sourced
  from same collection or tag-matched.
- No reviews block, no newsletter inline, no related-content rail.

**Variant logic:** existing `VariantSelector.tsx` data flow unchanged —
visual reskin only.

## 7. Cart, checkout, account, auth

All forms share one input style: `bg-ink-900` filled inputs are reserved
for the filter drawer; checkout/auth use **underline-only inputs**:
`border-0 border-b border-ink-700 bg-transparent px-0 py-3
focus:border-accent-lime`. Apple-store editorial style.

### 7.1 Cart (`/cart`)

- Centered `max-w-3xl px-8 py-32`. No two-column.
- Title: `BAG` at `display`. Below: `${N} ITEMS` in caption.
- Each line item: `py-6 grid grid-cols-[100px_1fr_auto] gap-6` with
  hairline `ink-700` dividers top + bottom.
  - Left: thumbnail `aspect-[4/5]`, `object-contain` on `bg-ink-900`.
  - Middle: title (uppercase, white), variant line (size/color, caption,
    `ink-300`), `REMOVE` text-link (caption, hover lime).
  - Right: qty stepper (three text glyphs `−  2  +`, gap 12px) + price.
- Empty state: `BAG IS EMPTY` at `display`, single text-link
  `CONTINUE SHOPPING →`.
- Subtotal block (full width, leader-row pattern):
  ```
  SUBTOTAL ........ Rp 850.000
  SHIPPING ........ CALCULATED AT CHECKOUT
  TOTAL ........... Rp 850.000   ← display-sm, bold
  ```
- Single full-width `CHECKOUT` button, `bg-accent-lime text-ink-950`,
  `py-5`.

### 7.2 Checkout (`/checkout`)

- Single column, `max-w-2xl px-8 py-32`. Summary collapses into a sticky
  bottom strip on mobile; on desktop, an inline collapsible block at top.
- Sticky summary header (desktop):
  `${N} ITEMS · TOTAL Rp 850.000 · SHOW DETAILS ▾` — accordion expands
  to show line items inline.
- Form sections, hairline-separated, each prefixed with caption-token
  numeric label:
  1. `01 / CONTACT` — email + phone (Indonesian phone validator stays)
  2. `02 / SHIPPING` — name, address, city, postal code, province
  3. `03 / SHIPPING METHOD` — RajaOngkir-driven radio rows, restyled
  4. `04 / PAYMENT` — Midtrans Snap (`PaymentSection` logic unchanged,
     chrome restyled)
- Section number animates from `ink-500` → white when reached
  (IntersectionObserver, same primitive as current home).
- Inputs: underline-only style.
- `PLACE ORDER` final button: full-width lime.

### 7.3 Account (`/account` + `/account/orders`)

- `/account` landing, single column `max-w-2xl`:
  - `HELLO, ${name}` at `display-sm`
  - Three large text-link rows, hairline-separated, `py-6`, hover
    opacity 50% / lime:
    ```
    ORDERS .............. ${N}   →
    ADDRESS BOOK ........ ${N}   →
    LOG OUT ..................   →
    ```
- `/account/orders`: hairline-separated rows.
  - Order number (bold), date, status pill (lime = paid, white = pending,
    `ink-500` = cancelled), total. Click row to expand line items inline.

### 7.4 Auth (`/login`, `/register`)

- `min-h-screen flex items-center justify-center px-8`.
- Single column `max-w-md`:
  - Title: `LOG IN` / `SIGN UP` at `display-sm`
  - Underline inputs
  - Full-width lime submit
  - Cross-link in caption: `NO ACCOUNT? CREATE ONE →` /
    `ALREADY A MEMBER? LOG IN →`
- No social login. No imagery. Pure dark intermission.

### 7.5 Order success / pending

- Centered single column. Big `display-sm` headline (`ORDER CONFIRMED` /
  `PAYMENT PENDING`), order number, expected delivery, single
  `BACK TO SHOP` CTA. No celebratory imagery.

### 7.6 FAQ, How to Order, About, Privacy, Terms, Size Guide

- Shared template: title at `display`, content at `body` with `max-w-2xl`,
  hairline-separated section breaks. Custom `prose-invert` override for
  Sanity-rendered rich text — white text, lime links, hairline `<hr>`.
- Existing About content stays; reskinned.
- Size Guide and Terms are new pages, Sanity-driven, can ship with stub
  content.

## 8. CMS — Sanity schema deltas

**`schemas/homepage.ts` — augment existing doc:**
```ts
defineField({ name: 'heroVideo', type: 'url',
  title: 'Hero Video (optional, falls back to image)' }),
defineField({ name: 'featuredCollection', type: 'reference',
  to: [{ type: 'collection' }] }),
defineField({ name: 'lookbookImages', type: 'array',
  validation: r => r.max(8),
  of: [{ type: 'object', fields: [
    defineField({ name: 'image', type: 'image' }),
    defineField({ name: 'caption', type: 'string' }),
  ]}],
}),
defineField({ name: 'closingStatement', type: 'string',
  initialValue: 'BUILT FOR THOSE WHO MOVE DIFFERENTLY' }),
```

**`schemas/product.ts` — augment existing doc:**
```ts
defineField({ name: 'badge', type: 'string',
  options: { list: ['NEW', 'GLOW IN THE DARK', 'LAST PIECES', 'COMING SOON'] } }),
```

**`schemas/sizeGuide.ts` — new singleton doc:**
```ts
{
  name: 'sizeGuide', type: 'document',
  fields: [
    defineField({ name: 'intro', type: 'text' }),
    defineField({ name: 'sections', type: 'array', of: [{
      type: 'object', fields: [
        defineField({ name: 'garmentType', type: 'string' }),
        defineField({ name: 'note', type: 'text' }),
        defineField({ name: 'measurements', type: 'array', of: [{
          type: 'object', fields: [
            defineField({ name: 'size', type: 'string' }),
            defineField({ name: 'chest', type: 'string' }),
            defineField({ name: 'length', type: 'string' }),
            defineField({ name: 'sleeve', type: 'string' }),
          ],
        }]}),
      ],
    }]}),
  ],
}
```

**`schemas/terms.ts` — new singleton doc:** `{ title: string,
body: portableText }`.

**Studio structure (`studio/structure.ts`):** expose Homepage, Size Guide,
Terms in the Konten section (next to existing Galeri).

## 9. File plan — storefront

### 9.1 New files

- `src/components/layout/SiteChrome.tsx`
- `src/components/layout/MobileMenuOverlay.tsx`
- `src/components/layout/SearchOverlay.tsx` (extracted from current `Header.tsx`)
- `src/components/home/HeroSilent.tsx`
- `src/components/home/LatestDrop.tsx`
- `src/components/home/LookbookStrip.tsx`
- `src/components/home/ClosingStatement.tsx`
- `src/components/product/FilterDrawer.tsx`
- `src/components/ui/PillBadge.tsx`
- `src/components/ui/UnderlineInput.tsx`
- `src/components/ui/LeaderRow.tsx`
- `src/app/(store)/size-guide/page.tsx`
- `src/app/(store)/terms/page.tsx`
- `src/styles/fonts.ts` — `next/font/local` for PP Neue Machina + Montreal
- `apps/storefront/public/fonts/` — vendored woff2 files (4 weights total)

### 9.2 Edited files

- `packages/config/tailwind/index.js` — replace `brand-*` with `ink-*`,
  add `accent-lime`, replace type scale, add `nav` token
- `apps/storefront/src/app/(store)/layout.tsx` — `<SiteChrome>` wrapper,
  drop `<Header>` and `<Footer>`
- `apps/storefront/src/app/globals.css` — load PP fonts, dark default
  body bg, scrollbar styling
- `apps/storefront/src/app/(store)/page.tsx` — fetch new homepage fields,
  compose new sections
- `apps/storefront/src/app/(store)/products/page.tsx` — drop sidebar, add
  `FilterDrawer`
- `apps/storefront/src/app/(store)/products/[handle]/page.tsx` — magazine
  stack gallery + sticky info column
- `apps/storefront/src/app/(store)/cart/page.tsx`
- `apps/storefront/src/app/(store)/checkout/page.tsx`
- `apps/storefront/src/app/(store)/login/page.tsx` + `/register/page.tsx`
  + `/account/page.tsx` + `/account/orders/page.tsx`
- `apps/storefront/src/components/product/ProductCard.tsx`
- `apps/storefront/src/components/product/ProductDetail.tsx`
- `apps/storefront/src/components/checkout/*`
- `apps/storefront/src/lib/sanity.ts` — extend `getHomepage()` and
  `getProduct()` queries

### 9.3 Deleted files

- `apps/storefront/src/components/layout/Header.tsx`
- `apps/storefront/src/components/layout/Footer.tsx`
- `apps/storefront/src/components/layout/MobileNav.tsx`
- `apps/storefront/src/components/home/HomeContent.tsx`
- `apps/storefront/src/components/home/HeroBanner.tsx`
- `apps/storefront/src/components/product/ProductFilters.tsx` (sidebar)
- `apps/storefront/src/components/product/MobileFilterButton.tsx`

## 10. Migration & risk

- **Logo asset:** `/images/logo.png` is black-on-white. Plan A: CSS
  `filter: invert(1) brightness(2)` in chrome. Plan B (later): export a
  white SVG. Not blocking.
- **Sanity content backfill:** `featuredCollection`, `lookbookImages`, and
  product `badge` fields will be empty after schema migration. All new
  homepage sections fall back gracefully — section is skipped when its
  source data is empty.
- **`brand-*` → `ink-*` rename:** one Tailwind config change + global
  find-replace across `apps/storefront/src/**/*.{ts,tsx}`. All
  `bg-brand-*`, `text-brand-*`, `border-brand-*` get the rename. Color
  values map almost 1:1, but the page default flips from white to
  `ink-950` — every page gets re-touched as part of the redesign so this
  is not a hidden hazard.
- **Search relocation:** `/api/search` endpoint stays. Overlay component
  moves intact from `Header.tsx` into `SearchOverlay.tsx`, triggered from
  the chrome's `SEARCH` link.
- **No Medusa backend changes.**
- **Breakpoints:** Tailwind defaults. Vertical bottom-left nav appears at
  `lg` and up.
- **Accessibility:** focus rings on all chrome elements, mobile menu is a
  focus trap, ESC closes overlays, contrast ratios pass AAA for body text
  (white on `ink-950` = 19.6:1; `ink-300` on `ink-950` = 7.4:1).
  `prefers-reduced-motion` disables transforms.
- **Verification:** `pnpm typecheck` + `pnpm lint` after each subsystem.
  Manual smoke test of homepage, shop, PDP, cart, checkout, auth in the
  browser before completion.

## 11. Out of scope

- New Sustainability page
- New Foundation page
- Backend (Medusa) changes
- Admin panel reskin
- White-SVG logo export (deferred)
- Renaming legacy slugs (`/tentang-kami`, `/kebijakan-privasi`,
  `/cara-order`) to English equivalents — deferred to a later sweep
- New product imagery / re-shooting on dark backgrounds — deferred
