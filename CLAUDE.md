# Draven - MVP E-Commerce Indonesia

## Project Overview

Platform e-commerce MVP untuk pasar Indonesia. Stack: **Medusa.js** (commerce backend) + **Sanity.io** (CMS) + **Next.js 14** (storefront) + **Supabase** (database).

## Tech Stack

| Layer | Technology |
|---|---|
| Storefront | Next.js 14 (App Router, TypeScript, Tailwind CSS) |
| Commerce Engine | Medusa.js v2 |
| CMS | Sanity.io |
| Database | Supabase (PostgreSQL) |
| Cache | Upstash Redis |
| Hosting Frontend | Vercel |
| Hosting Backend | Railway |
| Payment | Midtrans (Snap) |
| Shipping | RajaOngkir API |
| Notifications | Fonnte (WhatsApp API) |
| Analytics | Metabase |

## Project Structure

```
draven/
├── apps/
│   ├── storefront/          # Next.js 14 App Router (deployed to Vercel)
│   └── medusa/              # Medusa.js backend (deployed to Railway)
├── packages/
│   ├── ui/                  # Shared UI components
│   └── config/              # Shared configs (ESLint, TypeScript, Tailwind)
├── studio/                  # Sanity.io Studio
├── CLAUDE.md
├── IMPLEMENTATION_PLAN.md
└── package.json             # Monorepo root (pnpm workspaces)
```

## Development Conventions

### General
- Language: **TypeScript** (strict mode) untuk semua kode
- Package manager: **pnpm** dengan workspaces
- Monorepo structure menggunakan **Turborepo**
- Formatting: **Prettier** (2 spaces, single quotes, trailing commas)
- Linting: **ESLint** dengan Next.js + TypeScript configs

### Next.js Storefront (`apps/storefront/`)
- Gunakan **App Router** (bukan Pages Router)
- Server Components by default, Client Components hanya saat perlu interaktivitas
- Styling dengan **Tailwind CSS** - jangan pakai CSS modules atau styled-components
- Data fetching via Server Components + `fetch` atau Medusa JS SDK
- Gunakan `next/image` untuk semua gambar
- Route groups: `(store)` untuk public pages, `(account)` untuk authenticated pages

### Medusa.js Backend (`apps/medusa/`)
- Custom API routes di `src/api/`
- Custom services di `src/services/`
- Subscribers (event handlers) di `src/subscribers/`
- Semua konfigurasi via environment variables

### Sanity Studio (`studio/`)
- Schema files di `schemas/`
- Gunakan bahasa Indonesia untuk field titles (user-facing)
- Gunakan bahasa Inggris untuk field names (code-facing)

### Indonesia-Specific
- Currency: IDR (Rupiah), format: `Rp 100.000`
- Locale: `id-ID`
- Timezone: `Asia/Jakarta` (WIB) as default
- Phone format: `+62xxx` atau `08xxx`
- Semua teks UI dalam Bahasa Indonesia
- Weight units: gram (untuk kalkulasi ongkir)

## Key Commands

```bash
# Install dependencies
pnpm install

# Development (all services)
pnpm dev

# Development (specific)
pnpm dev --filter storefront
pnpm dev --filter medusa
pnpm dev --filter studio

# Build
pnpm build

# Lint
pnpm lint

# Type check
pnpm typecheck
```

## Environment Variables

Jangan pernah commit file `.env`. Referensi env vars:

**Storefront** (`apps/storefront/.env.local`):
- `NEXT_PUBLIC_MEDUSA_URL` - Medusa API endpoint
- `NEXT_PUBLIC_SANITY_PROJECT_ID` - Sanity project ID
- `NEXT_PUBLIC_SANITY_DATASET` - Sanity dataset name
- `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY` - Midtrans client key

**Medusa** (`apps/medusa/.env`):
- `DATABASE_URL` - Supabase PostgreSQL connection string
- `REDIS_URL` - Upstash Redis URL
- `JWT_SECRET` - JWT secret (min 32 chars)
- `COOKIE_SECRET` - Cookie secret (min 32 chars)
- `STORE_CORS` - Storefront URL for CORS
- `ADMIN_CORS` - Admin panel URL for CORS
- `MIDTRANS_SERVER_KEY` - Midtrans server key
- `MIDTRANS_CLIENT_KEY` - Midtrans client key
- `RAJAONGKIR_API_KEY` - RajaOngkir API key
- `FONNTE_TOKEN` - Fonnte WhatsApp API token

## Important Notes

- Ini adalah **MVP** — prioritaskan fungsionalitas over performa/skalabilitas
- Target user: pembeli online Indonesia yang familiar dengan Tokopedia/Shopee UX
- Admin panel Medusa dipakai langsung oleh non-developer untuk manage produk & order
- Sanity Studio dipakai oleh non-developer untuk manage konten marketing
- Semua 3rd party services mulai dari tier gratis/sandbox dulu
