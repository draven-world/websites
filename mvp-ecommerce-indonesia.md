# 🛒 MVP E-Commerce Indonesia — Panduan Stack & Setup

> Panduan lengkap untuk **developer** membangun dan **non-developer** mengoperasikan platform e-commerce MVP yang siap scale.

---

## 📋 Daftar Isi

1. [Overview Stack](#overview-stack)
2. [Arsitektur MVP](#arsitektur-mvp)
3. [Setup: Medusa.js (Commerce Backend)](#1-medusajs--commerce-backend)
4. [Setup: Sanity.io (CMS Konten)](#2-sanityio--cms-konten)
5. [Setup: Next.js (Storefront)](#3-nextjs--storefront)
6. [Setup: Supabase (Database)](#4-supabase--database)
7. [Setup: Vercel + Railway (Hosting)](#5-vercel--railway--hosting)
8. [Integrasi Lokal Indonesia](#6-integrasi-lokal-indonesia)
9. [Siapa Mengerjakan Apa](#siapa-mengerjakan-apa)
10. [Estimasi Biaya MVP](#estimasi-biaya-mvp)
11. [Checklist Launch](#checklist-launch)

---

## Overview Stack

| Layer | Tool | Dikelola Oleh |
|---|---|---|
| Storefront | Next.js 14 (App Router) | Developer |
| Commerce Engine | Medusa.js | Non-dev via Admin UI |
| CMS Konten | Sanity.io | Non-dev via Studio |
| Database | Supabase (PostgreSQL) | Developer |
| Cache | Upstash Redis | Developer |
| Hosting Frontend | Vercel | Developer |
| Hosting Backend | Railway | Developer |
| Payment | Midtrans / Xendit | Developer (setup) |
| Logistik | RajaOngkir API | Developer (setup) |
| Notifikasi | Fonnte (WhatsApp) | Developer (setup) |
| Laporan | Metabase | Non-dev via Dashboard |

---

## Arsitektur MVP

```
[Customer Browser / Mobile]
         │
         ▼
  [Vercel CDN Edge]
         │
         ▼
  [Next.js 14 App]  ←──────────────┐
    /storefront                     │
    /checkout              [Sanity.io Studio]
    /account               (konten & banner)
         │
         ├──── GET /products ──────► [Medusa.js API]
         │                               │
         ├──── POST /orders ───────►     ├── PostgreSQL (Supabase)
         │                               ├── Redis (Upstash)
         └──── GET /content ───────►     └── [3rd Party]
                                              ├── Midtrans (payment)
                                              ├── RajaOngkir (ongkir)
                                              └── Fonnte (WhatsApp)
```

---

## 1. Medusa.js — Commerce Backend

### Apa itu?
Backend e-commerce open-source dengan **Admin Panel bawaan** yang bisa langsung dipakai tim non-developer untuk mengelola produk, stok, dan order.

### Instalasi

```bash
# Install Medusa CLI
npm install -g @medusajs/medusa-cli

# Buat project baru
medusa new my-store --seed

# Masuk ke direktori
cd my-store

# Jalankan development server
medusa develop
```

Server berjalan di:
- **API**: `http://localhost:9000`
- **Admin Panel**: `http://localhost:7001`

### Konfigurasi Database (Supabase)

Edit file `medusa-config.js`:

```javascript
module.exports = {
  projectConfig: {
    redis_url: process.env.REDIS_URL,
    database_url: process.env.DATABASE_URL,
    database_type: "postgres",
    store_cors: process.env.STORE_CORS,
    admin_cors: process.env.ADMIN_CORS,
    jwt_secret: process.env.JWT_SECRET,
    cookie_secret: process.env.COOKIE_SECRET,
  },
  plugins: [],
}
```

### Environment Variables

```env
DATABASE_URL=postgresql://user:password@db.supabase.co:5432/postgres
REDIS_URL=rediss://default:token@region.upstash.io:port
JWT_SECRET=your-jwt-secret-min-32-chars
COOKIE_SECRET=your-cookie-secret-min-32-chars
STORE_CORS=https://your-store.vercel.app
ADMIN_CORS=https://your-admin.railway.app
```

### Plugin yang Direkomendasikan

```bash
# File storage (foto produk)
npm install medusa-file-s3

# Search produk
npm install medusa-plugin-meilisearch

# Sendgrid email
npm install medusa-plugin-sendgrid
```

---

## 2. Sanity.io — CMS Konten

### Apa itu?
CMS headless untuk mengelola **konten marketing**: banner homepage, halaman promo, blog, kategori unggulan — semua bisa diedit teman non-developer via Sanity Studio tanpa coding.

### Instalasi

```bash
# Buat project Sanity baru
npm create sanity@latest -- --template clean --create-project "My Store CMS" --dataset production

# Masuk ke direktori
cd studio

# Jalankan Studio lokal
npm run dev
```

Studio berjalan di `http://localhost:3333`

### Schema Contoh: Banner Homepage

Buat file `schemas/banner.js`:

```javascript
export default {
  name: 'banner',
  title: 'Banner Homepage',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Judul Banner',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'image',
      title: 'Gambar Banner',
      type: 'image',
      options: { hotspot: true }
    },
    {
      name: 'link',
      title: 'Link Tujuan',
      type: 'url'
    },
    {
      name: 'aktif',
      title: 'Tampilkan?',
      type: 'boolean',
      initialValue: true
    },
    {
      name: 'urutan',
      title: 'Urutan Tampil',
      type: 'number'
    }
  ]
}
```

### Schema Contoh: Konten Promo

```javascript
export default {
  name: 'promo',
  title: 'Halaman Promo',
  type: 'document',
  fields: [
    {
      name: 'nama',
      title: 'Nama Promo',
      type: 'string'
    },
    {
      name: 'deskripsi',
      title: 'Deskripsi',
      type: 'text'
    },
    {
      name: 'tanggalMulai',
      title: 'Tanggal Mulai',
      type: 'datetime'
    },
    {
      name: 'tanggalSelesai',
      title: 'Tanggal Selesai',
      type: 'datetime'
    },
    {
      name: 'banner',
      title: 'Banner Promo',
      type: 'image'
    }
  ]
}
```

### Fetch Konten dari Next.js

```javascript
// lib/sanity.js
import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})

const builder = imageUrlBuilder(client)
export const urlFor = (source) => builder.image(source)

// Ambil semua banner aktif
export async function getBanners() {
  return client.fetch(`
    *[_type == "banner" && aktif == true] | order(urutan asc) {
      title,
      image,
      link
    }
  `)
}
```

---

## 3. Next.js — Storefront

### Instalasi

```bash
npx create-next-app@latest my-storefront \
  --typescript \
  --tailwind \
  --app \
  --src-dir

cd my-storefront

# Install Medusa JS client
npm install @medusajs/medusa-js

# Install Sanity
npm install @sanity/client @sanity/image-url
```

### Struktur Folder

```
src/
├── app/
│   ├── (store)/
│   │   ├── page.tsx          # Homepage
│   │   ├── products/
│   │   │   ├── page.tsx      # Daftar produk
│   │   │   └── [id]/page.tsx # Detail produk
│   │   ├── cart/page.tsx     # Keranjang
│   │   └── checkout/page.tsx # Checkout
│   └── layout.tsx
├── components/
│   ├── Banner.tsx
│   ├── ProductCard.tsx
│   └── CartDrawer.tsx
└── lib/
    ├── medusa.ts             # Medusa client
    └── sanity.ts             # Sanity client
```

### Medusa Client Setup

```typescript
// lib/medusa.ts
import Medusa from "@medusajs/medusa-js"

export const medusa = new Medusa({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000",
  maxRetries: 3,
})

// Ambil daftar produk
export async function getProducts() {
  const { products } = await medusa.products.list({
    limit: 20,
    expand: "variants,images,collection"
  })
  return products
}

// Buat order / cart
export async function createCart() {
  const { cart } = await medusa.carts.create()
  return cart
}
```

### Contoh Halaman Produk

```typescript
// app/(store)/products/page.tsx
import { getProducts } from "@/lib/medusa"
import ProductCard from "@/components/ProductCard"

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
```

---

## 4. Supabase — Database

### Setup

1. Buka [supabase.com](https://supabase.com) → buat project baru
2. Pilih region **Southeast Asia (Singapore)** untuk latency rendah ke Indonesia
3. Salin `DATABASE_URL` dari Settings → Database → Connection String (URI)

### Konfigurasi Medusa dengan Supabase

```bash
# Install dependency
npm install pg

# Jalankan migrasi Medusa
medusa migrations run
```

> **Catatan:** Supabase free tier memberikan database PostgreSQL 500MB — cukup untuk MVP dengan ribuan produk dan order.

---

## 5. Vercel + Railway — Hosting

### Deploy Next.js ke Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy dari direktori storefront
cd my-storefront
vercel

# Set environment variables
vercel env add NEXT_PUBLIC_MEDUSA_URL
vercel env add NEXT_PUBLIC_SANITY_PROJECT_ID
```

### Deploy Medusa ke Railway

1. Buka [railway.app](https://railway.app) → New Project
2. Deploy from GitHub → pilih repo Medusa
3. Tambahkan PostgreSQL service (atau gunakan Supabase external)
4. Set semua environment variables di Railway dashboard
5. Generate domain otomatis dari Railway

### Environment Variables Lengkap

**Vercel (Next.js):**
```env
NEXT_PUBLIC_MEDUSA_URL=https://your-medusa.up.railway.app
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
```

**Railway (Medusa):**
```env
DATABASE_URL=postgresql://...supabase...
REDIS_URL=rediss://...upstash...
JWT_SECRET=minimum-32-character-secret
COOKIE_SECRET=minimum-32-character-secret
STORE_CORS=https://your-store.vercel.app
ADMIN_CORS=https://your-medusa.up.railway.app
MIDTRANS_SERVER_KEY=SB-Mid-server-...
MIDTRANS_CLIENT_KEY=SB-Mid-client-...
RAJAONGKIR_API_KEY=your-rajaongkir-key
```

---

## 6. Integrasi Lokal Indonesia

### Payment: Midtrans

```bash
npm install midtrans-client
```

```typescript
// lib/midtrans.ts
import midtransClient from 'midtrans-client'

const snap = new midtransClient.Snap({
  isProduction: process.env.NODE_ENV === 'production',
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.MIDTRANS_CLIENT_KEY!,
})

export async function createPaymentToken(order: any) {
  const parameter = {
    transaction_details: {
      order_id: order.id,
      gross_amount: order.total,
    },
    customer_details: {
      first_name: order.customer.first_name,
      email: order.customer.email,
      phone: order.customer.phone,
    },
    enabled_payments: [
      "gopay", "shopeepay", "dana", "ovo",
      "bca_va", "bni_va", "mandiri_va",
      "qris", "other_qris", "indomaret", "alfamart"
    ],
  }

  const token = await snap.createTransactionToken(parameter)
  return token
}
```

### Logistik: RajaOngkir

```typescript
// lib/rajaongkir.ts
export async function checkOngkir(
  originCityId: string,
  destinationCityId: string,
  weight: number, // dalam gram
  courier: string // jne | j&t | sicepat
) {
  const res = await fetch('https://api.rajaongkir.com/starter/cost', {
    method: 'POST',
    headers: {
      'key': process.env.RAJAONGKIR_API_KEY!,
      'content-type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      origin: originCityId,
      destination: destinationCityId,
      weight: weight.toString(),
      courier
    })
  })

  const data = await res.json()
  return data.rajaongkir.results[0].costs
}
```

### Notifikasi: WhatsApp via Fonnte

```typescript
// lib/whatsapp.ts
export async function sendOrderNotification(
  phone: string,
  orderId: string,
  total: number
) {
  await fetch('https://api.fonnte.com/send', {
    method: 'POST',
    headers: { 'Authorization': process.env.FONNTE_TOKEN! },
    body: JSON.stringify({
      target: phone,
      message: `✅ *Order Berhasil!*\n\nNomor Order: ${orderId}\nTotal: Rp ${total.toLocaleString('id-ID')}\n\nTerima kasih sudah belanja! Pesanan kamu sedang kami proses.`
    })
  })
}
```

---

## Siapa Mengerjakan Apa

### 👨‍💻 Developer (Kamu)

- Setup dan deploy semua service (Medusa, Next.js, Supabase, Railway, Vercel)
- Konfigurasi integrasi payment (Midtrans), logistik (RajaOngkir), notifikasi (Fonnte)
- Buat schema konten di Sanity sesuai kebutuhan
- Setup Metabase dan sambungkan ke database
- Monitoring performa dan bug fix

### 🧑‍💼 Non-Developer (Teman)

| Kebutuhan | Tool yang Digunakan |
|---|---|
| Tambah / edit produk | Medusa Admin Panel → Products |
| Update harga & stok | Medusa Admin Panel → Products → Variants |
| Proses order masuk | Medusa Admin Panel → Orders |
| Lihat data customer | Medusa Admin Panel → Customers |
| Buat banner promo | Sanity Studio → Banner Homepage |
| Edit konten halaman | Sanity Studio → sesuai tipe konten |
| Lihat laporan penjualan | Metabase Dashboard |

> **URL yang perlu diakses teman:**
> - Admin Medusa: `https://your-medusa.up.railway.app/app`
> - Sanity Studio: `https://your-project.sanity.studio`
> - Metabase: `https://your-metabase.railway.app`

---

## Estimasi Biaya MVP

| Service | Paket | Biaya/Bulan |
|---|---|---|
| Vercel | Hobby (gratis) | Rp 0 |
| Railway | Starter $5 | ~Rp 80.000 |
| Supabase | Free tier | Rp 0 |
| Upstash Redis | Free tier (10k req/hari) | Rp 0 |
| Sanity.io | Free tier (3 user) | Rp 0 |
| Midtrans | Per transaksi (0.7% + Rp 2.000) | Pay as you go |
| RajaOngkir | Starter Rp 0 | Rp 0 |
| Fonnte WhatsApp | ~Rp 50.000/bulan | Rp 50.000 |
| **Total Infrastruktur** | | **~Rp 130.000/bulan** |

> 💡 Upgrade ke paket berbayar hanya saat traffic sudah signifikan. Stack ini bisa handle ribuan produk dan ratusan order per hari di tier gratis.

---

## Checklist Launch

### Developer ✅

- [ ] Medusa.js running di Railway dengan domain custom
- [ ] Database Supabase terhubung dan migrasi selesai
- [ ] Redis Upstash terhubung
- [ ] Next.js storefront live di Vercel
- [ ] Sanity Studio live dan teman bisa login
- [ ] Midtrans sandbox berjalan → switch ke production
- [ ] RajaOngkir API key aktif
- [ ] Fonnte WhatsApp aktif dan test kirim pesan
- [ ] Metabase setup dan dashboard dasar siap
- [ ] Domain custom (opsional) sudah terhubung ke Vercel

### Non-Developer ✅

- [ ] Bisa login ke Medusa Admin Panel
- [ ] Berhasil tambah 1 produk percobaan
- [ ] Bisa update stok dan harga
- [ ] Bisa lihat dan proses order test
- [ ] Bisa login ke Sanity Studio
- [ ] Berhasil upload banner homepage
- [ ] Bisa buka Metabase dan lihat laporan
- [ ] Test order end-to-end dari storefront → notifikasi WA masuk

---

## Langkah Selanjutnya (Setelah MVP)

Setelah validasi terbukti, upgrade bertahap:

1. **Search produk** → tambahkan Typesense untuk pencarian cepat
2. **CDN foto produk** → pindah ke Cloudflare R2 + Images
3. **Email marketing** → integrasikan Brevo (ex-Sendinblue)
4. **Multi-kurir** → upgrade ke Shipper.id untuk lebih banyak opsi
5. **Analytics lanjutan** → tambahkan Google Analytics 4 + Meta Pixel
6. **Mobile app** → React Native menggunakan Medusa API yang sama

---

*Dibuat untuk stack MVP e-commerce Indonesia — Medusa.js + Sanity.io + Next.js*
