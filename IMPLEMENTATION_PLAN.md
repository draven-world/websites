# Implementation Plan — Draven MVP E-Commerce Indonesia

## Fase 0: Project Scaffolding (Monorepo Setup)

### 0.1 — Inisialisasi Monorepo
- [ ] `pnpm init` di root, setup `pnpm-workspace.yaml`
- [ ] Install & configure **Turborepo** (`turbo.json`)
- [ ] Buat folder structure: `apps/`, `packages/`, `studio/`
- [ ] Setup shared TypeScript config di `packages/config/tsconfig/`
- [ ] Setup shared ESLint config di `packages/config/eslint/`
- [ ] Setup shared Tailwind config di `packages/config/tailwind/`
- [ ] Buat `.gitignore`, `.env.example`, `.prettierrc`
- [ ] `git init` + initial commit

### 0.2 — Shared UI Package
- [ ] Buat `packages/ui/` dengan komponen dasar
- [ ] Setup Tailwind + TypeScript build pipeline
- [ ] Export komponen: Button, Input, Card, Badge, Modal, Spinner

**Output:** Monorepo bisa `pnpm install` dan `pnpm build` tanpa error.

---

## Fase 1: Commerce Backend (Medusa.js)

### 1.1 — Setup Medusa
- [ ] Scaffold Medusa project di `apps/medusa/`
- [ ] Konfigurasi `medusa-config.js` dengan env variables
- [ ] Setup `.env` dengan Supabase DATABASE_URL placeholder
- [ ] Verify `medusa develop` runs successfully
- [ ] Verify Admin Panel accessible di `localhost:7001`

### 1.2 — Database (Supabase)
- [ ] Buat Supabase project (region: Singapore)
- [ ] Ambil connection string, masukkan ke `.env`
- [ ] Run `medusa migrations run`
- [ ] Seed database dengan `medusa seed --seed-file=data/seed.json`
- [ ] Buat seed data produk contoh (minimal 10 produk Indonesia)

### 1.3 — Cache (Upstash Redis)
- [ ] Buat Upstash Redis instance
- [ ] Tambahkan `REDIS_URL` ke `.env`
- [ ] Verify Medusa connects ke Redis

### 1.4 — Custom Seed Data Indonesia
- [ ] Buat `data/seed.json` dengan:
  - Region: Indonesia (IDR, ID)
  - Shipping options: JNE, J&T, SiCepat
  - Produk contoh dengan harga Rupiah
  - Tax rate: PPN 11%

**Output:** Medusa running, admin panel accessible, database seeded dengan data Indonesia.

---

## Fase 2: Storefront (Next.js 14)

### 2.1 — Scaffold Next.js
- [ ] `create-next-app` di `apps/storefront/` (TypeScript, Tailwind, App Router, src dir)
- [ ] Konfigurasi Tailwind dengan warna brand Draven
- [ ] Install dependencies: `@medusajs/medusa-js`, `@sanity/client`, `@sanity/image-url`
- [ ] Setup path aliases (`@/components`, `@/lib`, dll)
- [ ] Buat `lib/medusa.ts` — Medusa client setup
- [ ] Buat `lib/sanity.ts` — Sanity client setup

### 2.2 — Layout & Navigation
- [ ] `app/layout.tsx` — Root layout dengan metadata Indonesia
- [ ] `components/layout/Header.tsx` — Navbar dengan logo, search, cart icon, account
- [ ] `components/layout/Footer.tsx` — Footer dengan info toko, links, contact
- [ ] `components/layout/MobileNav.tsx` — Bottom navigation mobile-first
- [ ] `app/(store)/layout.tsx` — Store layout wrapper

### 2.3 — Homepage
- [ ] `app/(store)/page.tsx` — Homepage
- [ ] `components/home/HeroBanner.tsx` — Banner carousel (data dari Sanity)
- [ ] `components/home/CategoryGrid.tsx` — Grid kategori produk
- [ ] `components/home/FeaturedProducts.tsx` — Produk unggulan (data dari Medusa)
- [ ] `components/home/PromoSection.tsx` — Section promo (data dari Sanity)

### 2.4 — Product Listing & Detail
- [ ] `app/(store)/products/page.tsx` — Halaman daftar produk
- [ ] `app/(store)/products/[handle]/page.tsx` — Detail produk
- [ ] `components/product/ProductCard.tsx` — Card produk (gambar, nama, harga)
- [ ] `components/product/ProductDetail.tsx` — Detail lengkap produk
- [ ] `components/product/ProductGallery.tsx` — Gallery gambar produk
- [ ] `components/product/VariantSelector.tsx` — Pilih varian (ukuran, warna)
- [ ] `components/product/PriceDisplay.tsx` — Format harga Rupiah
- [ ] Filter & sort: kategori, harga, terbaru

### 2.5 — Cart
- [ ] `app/(store)/cart/page.tsx` — Halaman keranjang
- [ ] `components/cart/CartDrawer.tsx` — Slide-over cart drawer
- [ ] `components/cart/CartItem.tsx` — Item di keranjang
- [ ] `components/cart/CartSummary.tsx` — Ringkasan total + tombol checkout
- [ ] Cart context/provider menggunakan Medusa Cart API
- [ ] Simpan cart ID di cookie/localStorage

### 2.6 — Checkout
- [ ] `app/(store)/checkout/page.tsx` — Halaman checkout
- [ ] `components/checkout/ShippingForm.tsx` — Form alamat pengiriman
- [ ] `components/checkout/ShippingOptions.tsx` — Pilih kurir & service (dari RajaOngkir)
- [ ] `components/checkout/OrderSummary.tsx` — Ringkasan order
- [ ] `components/checkout/PaymentSection.tsx` — Integrasi Midtrans Snap
- [ ] Validasi form: nama, alamat, kota, kode pos, no HP

### 2.7 — Account (Opsional untuk MVP)
- [ ] `app/(account)/login/page.tsx` — Login page
- [ ] `app/(account)/register/page.tsx` — Register page
- [ ] `app/(account)/orders/page.tsx` — Riwayat order
- [ ] `app/(account)/profile/page.tsx` — Edit profil

**Output:** Storefront fully functional — browse products, add to cart, checkout.

---

## Fase 3: CMS Konten (Sanity.io)

### 3.1 — Setup Sanity Studio
- [ ] Scaffold Sanity project di `studio/`
- [ ] Konfigurasi `sanity.config.ts`
- [ ] Deploy ke Sanity hosted studio

### 3.2 — Content Schemas
- [ ] `schemas/banner.ts` — Banner homepage (judul, gambar, link, aktif, urutan)
- [ ] `schemas/promo.ts` — Halaman promo (nama, deskripsi, tanggal mulai/selesai, banner)
- [ ] `schemas/page.ts` — Halaman statis (tentang kami, FAQ, kebijakan)
- [ ] `schemas/category-highlight.ts` — Kategori unggulan di homepage
- [ ] `schemas/announcement.ts` — Announcement bar (teks, link, warna background)
- [ ] Register semua schemas di `schema.ts`

### 3.3 — Integrasi dengan Storefront
- [ ] Fetch banners di homepage
- [ ] Fetch promo content
- [ ] Fetch halaman statis
- [ ] Setup ISR (Incremental Static Regeneration) atau webhook revalidation

**Output:** Non-developer bisa manage konten via Sanity Studio, tampil di storefront.

---

## Fase 4: Integrasi Lokal Indonesia

### 4.1 — Payment Gateway (Midtrans)
- [ ] Daftar akun Midtrans Sandbox
- [ ] Install `midtrans-client`
- [ ] Buat `lib/midtrans.ts` — helper create transaction token
- [ ] Buat API route `app/api/payment/create/route.ts` — generate Snap token
- [ ] Buat API route `app/api/payment/notification/route.ts` — webhook handler
- [ ] Integrasi Snap.js di checkout page (popup payment)
- [ ] Handle payment status: pending, success, failed, expired
- [ ] Update order status di Medusa berdasarkan payment notification
- [ ] Metode bayar: GoPay, ShopeePay, DANA, OVO, VA (BCA/BNI/Mandiri), QRIS, Indomaret/Alfamart
- [ ] Test full flow di sandbox

### 4.2 — Ongkos Kirim (RajaOngkir)
- [ ] Daftar akun RajaOngkir (Starter / gratis)
- [ ] Buat `lib/rajaongkir.ts` — helper cek ongkir
- [ ] Buat API route `app/api/shipping/cost/route.ts` — cek ongkir
- [ ] Buat API route `app/api/shipping/cities/route.ts` — list kota
- [ ] Integrasi di checkout: pilih provinsi → kota → kurir → service
- [ ] Kurir yang didukung: JNE (REG/OKE/YES), J&T, SiCepat
- [ ] Tampilkan estimasi hari & biaya kirim
- [ ] Cache daftar kota di Redis/memory

### 4.3 — Notifikasi WhatsApp (Fonnte)
- [ ] Daftar akun Fonnte
- [ ] Buat `lib/whatsapp.ts` — helper kirim pesan WA
- [ ] Trigger notifikasi saat:
  - Order berhasil dibuat (ke customer)
  - Payment confirmed (ke customer + admin)
  - Order shipped/dikirim (ke customer dengan no resi)
- [ ] Template pesan dalam Bahasa Indonesia
- [ ] Buat API route `app/api/notifications/whatsapp/route.ts`

**Output:** Payment, shipping calculation, dan WhatsApp notifications berfungsi end-to-end.

---

## Fase 5: Testing & Polish

### 5.1 — End-to-End Testing
- [ ] Test flow: browse → add to cart → checkout → payment → notifikasi WA
- [ ] Test responsive design (mobile, tablet, desktop)
- [ ] Test edge cases: empty cart, out of stock, payment timeout
- [ ] Test Midtrans sandbox semua metode bayar
- [ ] Test RajaOngkir untuk berbagai kota

### 5.2 — SEO & Performance
- [ ] Metadata per halaman (`generateMetadata`)
- [ ] Open Graph images
- [ ] Structured data (JSON-LD) untuk produk
- [ ] Optimasi gambar dengan `next/image`
- [ ] Loading states & skeletons
- [ ] Error boundaries

### 5.3 — UI Polish
- [ ] Toast notifications untuk add to cart, error, dll
- [ ] Empty states (keranjang kosong, tidak ada produk)
- [ ] 404 page custom
- [ ] Loading spinner global
- [ ] Animasi transisi halaman (opsional)

**Output:** Aplikasi siap untuk deployment production.

---

## Fase 6: Deployment

### 6.1 — Deploy Medusa ke Railway
- [ ] Push Medusa code ke GitHub
- [ ] Buat Railway project
- [ ] Deploy dari GitHub repo
- [ ] Set semua env vars di Railway
- [ ] Verify API + Admin Panel accessible
- [ ] Setup custom domain (opsional)

### 6.2 — Deploy Storefront ke Vercel
- [ ] Push storefront code ke GitHub
- [ ] Connect repo ke Vercel
- [ ] Set env vars di Vercel dashboard
- [ ] Verify production build
- [ ] Setup custom domain (opsional)

### 6.3 — Deploy Sanity Studio
- [ ] `sanity deploy` ke hosted studio
- [ ] Invite non-developer team ke project
- [ ] Buat konten awal (banners, pages)

### 6.4 — Go Live
- [ ] Switch Midtrans dari sandbox ke production
- [ ] Verify production payment flow
- [ ] Setup Metabase + connect ke Supabase database
- [ ] Buat dashboard dasar di Metabase (penjualan harian, top produk)
- [ ] Brief tim non-developer cara pakai Admin Panel + Sanity Studio

**Output:** MVP live dan bisa menerima order nyata.

---

## Urutan Pengerjaan yang Direkomendasikan

```
Fase 0 (Scaffolding)     ████░░░░░░░░░░░░░░░░  ~1 hari
Fase 1 (Medusa Backend)  ████████░░░░░░░░░░░░  ~2 hari
Fase 2 (Storefront)      ████████████████░░░░  ~5 hari
Fase 3 (Sanity CMS)      ████░░░░░░░░░░░░░░░░  ~1 hari
Fase 4 (Integrasi ID)    ████████████░░░░░░░░  ~3 hari
Fase 5 (Testing/Polish)  ████████░░░░░░░░░░░░  ~2 hari
Fase 6 (Deployment)      ████░░░░░░░░░░░░░░░░  ~1 hari
```

## Prioritas MVP (Harus Ada)

1. Browse produk + detail produk
2. Keranjang belanja
3. Checkout + Midtrans payment
4. Cek ongkir RajaOngkir
5. WhatsApp notifikasi order
6. Admin panel (Medusa bawaan)
7. Homepage dengan banner (Sanity)

## Nice-to-Have (Setelah MVP)

- User authentication & order history
- Search produk (Typesense/Meilisearch)
- Wishlist
- Product reviews
- Coupon/discount codes
- Email notifications (Brevo/SendGrid)
- Multi-kurir via Shipper.id
- Google Analytics 4 + Meta Pixel
