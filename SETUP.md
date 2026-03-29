# Panduan Setup & Penggunaan — Draven MVP E-Commerce

## Prasyarat

Pastikan sudah terinstall di komputer kamu:

- **Node.js** >= 18 ([nodejs.org](https://nodejs.org))
- **pnpm** >= 9 (`npm install -g pnpm`)
- **Git**
- **PostgreSQL** (lokal atau gunakan Supabase)

---

## 1. Clone & Install

```bash
git clone <repo-url> draven
cd draven
pnpm install
```

---

## 2. Setup Environment Variables

### Storefront (`apps/storefront/.env.local`)

```bash
cp .env.example apps/storefront/.env.local
```

Edit file tersebut:

```env
# Wajib — alamat Medusa API
NEXT_PUBLIC_MEDUSA_URL=http://localhost:9000

# Opsional — isi setelah buat project di sanity.io
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production

# Opsional — isi setelah daftar Midtrans
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=
```

### Medusa Backend (`apps/medusa/.env`)

```bash
cp apps/medusa/.env.example apps/medusa/.env
```

Edit file tersebut:

```env
# Wajib — PostgreSQL connection string
# Lokal: postgres://postgres:password@localhost:5432/medusa-draven
# Supabase: postgresql://postgres:xxx@db.xxx.supabase.co:5432/postgres
DATABASE_URL=postgres://postgres:password@localhost:5432/medusa-draven

# Opsional — Upstash Redis (bisa dikosongkan untuk development)
REDIS_URL=

# Secret keys (ganti dengan random string 32+ karakter)
JWT_SECRET=supersecret-jwt-change-this-in-production!!
COOKIE_SECRET=supersecret-cookie-change-this-in-prod!!

# CORS
STORE_CORS=http://localhost:3000
ADMIN_CORS=http://localhost:7001

# Opsional — isi setelah daftar masing-masing
MIDTRANS_SERVER_KEY=
MIDTRANS_CLIENT_KEY=
RAJAONGKIR_API_KEY=
FONNTE_TOKEN=
```

---

## 3. Setup Database

### Opsi A: PostgreSQL Lokal

```bash
# Buat database
createdb medusa-draven

# Masuk ke folder medusa
cd apps/medusa

# Jalankan migrasi
npx medusa migrations run

# Seed data (10 produk Indonesia, region IDR, shipping options)
npx medusa seed --seed-file=data/seed.json
```

### Opsi B: Supabase (Recommended)

1. Buat project di [supabase.com](https://supabase.com) (region: **Singapore**)
2. Buka **Settings → Database → Connection String (URI)**
3. Copy connection string ke `DATABASE_URL` di `.env`
4. Jalankan migrasi & seed seperti di atas

---

## 4. Jalankan Development Server

```bash
# Dari root folder — jalankan semua services sekaligus
pnpm dev
```

Atau jalankan per service:

```bash
# Terminal 1: Medusa backend
pnpm dev --filter medusa

# Terminal 2: Next.js storefront
pnpm dev --filter storefront

# Terminal 3: Sanity Studio (opsional)
pnpm dev --filter studio
```

### URL Development

| Service       | URL                   |
| ------------- | --------------------- |
| Storefront    | http://localhost:3000 |
| Medusa API    | http://localhost:9000 |
| Medusa Admin  | http://localhost:7001 |
| Sanity Studio | http://localhost:3333 |

---

## 5. Setup Services Pihak Ketiga (Opsional)

### Supabase (Database)

1. Buat project di [supabase.com](https://supabase.com)
2. Pilih region Singapore
3. Copy connection string ke `DATABASE_URL`

### Upstash Redis (Cache)

1. Buat database di [upstash.com](https://upstash.com)
2. Copy Redis URL ke `REDIS_URL`

### Midtrans (Payment)

1. Daftar di [midtrans.com](https://midtrans.com)
2. Masuk ke **Sandbox** environment
3. Copy Server Key → `MIDTRANS_SERVER_KEY`
4. Copy Client Key → `MIDTRANS_CLIENT_KEY` & `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY`

### RajaOngkir (Ongkos Kirim)

1. Daftar di [rajaongkir.com](https://rajaongkir.com)
2. Pilih plan **Starter** (gratis)
3. Copy API Key → `RAJAONGKIR_API_KEY`

### Fonnte (WhatsApp Notification)

1. Daftar di [fonnte.com](https://fonnte.com)
2. Hubungkan nomor WhatsApp
3. Copy token → `FONNTE_TOKEN`

### Sanity.io (CMS)

1. Buat project di [sanity.io](https://sanity.io)
2. Copy Project ID → `NEXT_PUBLIC_SANITY_PROJECT_ID`
3. Deploy studio: `cd studio && npx sanity deploy`

---

## 6. Struktur Project

```
draven/
├── apps/
│   ├── storefront/              # Next.js 14 — toko online
│   │   ├── src/app/(store)/     # Halaman publik (home, produk, cart, checkout)
│   │   ├── src/components/      # UI components
│   │   ├── src/lib/             # Medusa & Sanity client
│   │   └── src/providers/       # React context (cart)
│   └── medusa/                  # Medusa.js — backend e-commerce
│       ├── src/api/routes/      # Custom API (midtrans, shipping, whatsapp)
│       ├── src/services/        # Business logic services
│       ├── src/subscribers/     # Event handlers (auto WA notification)
│       └── data/seed.json       # Data awal (produk, region, shipping)
├── packages/
│   ├── ui/                      # Shared UI components
│   └── config/                  # Shared TypeScript, ESLint, Tailwind configs
├── studio/                      # Sanity.io CMS Studio
│   └── schemas/                 # Content schemas (banner, promo)
├── CLAUDE.md                    # Project context
├── IMPLEMENTATION_PLAN.md       # Rencana implementasi
└── SETUP.md                     # File ini
```

---

## 7. Perintah Penting

```bash
# Install dependencies
pnpm install

# Development semua services
pnpm dev

# Development per service
pnpm dev --filter storefront
pnpm dev --filter medusa
pnpm dev --filter studio

# Build production
pnpm build

# Lint
pnpm lint

# Format kode
pnpm format

# Medusa: jalankan migrasi
cd apps/medusa && npx medusa migrations run

# Medusa: seed data
cd apps/medusa && npx medusa seed --seed-file=data/seed.json

# Sanity: deploy studio
cd studio && npx sanity deploy
```

---

## 8. Alur Kerja (Workflow)

### Developer: Menambah Fitur Baru

1. Buat branch: `git checkout -b fitur/nama-fitur`
2. Code di folder yang relevan (`apps/storefront/`, `apps/medusa/`, dll)
3. Test lokal: `pnpm dev`
4. Build check: `pnpm build`
5. Commit & push

### Non-Developer: Mengelola Toko

| Tugas             | Caranya                                               |
| ----------------- | ----------------------------------------------------- |
| Tambah produk     | Buka Medusa Admin → Products → Create                 |
| Update harga/stok | Medusa Admin → Products → pilih produk → Edit variant |
| Proses order      | Medusa Admin → Orders → pilih order → Fulfill         |
| Buat banner promo | Buka Sanity Studio → Banner Homepage → Create         |
| Edit konten       | Sanity Studio → pilih tipe konten → Edit              |

---

## 9. Alur Checkout Customer

```
1. Browse produk → tambah ke keranjang
2. Buka keranjang → klik "Lanjut ke Checkout"
3. Isi alamat pengiriman (provinsi, kota, alamat lengkap, HP)
4. Pilih kurir & layanan (JNE/TIKI/POS — dari RajaOngkir)
5. Klik "Bayar Sekarang" → Midtrans Snap popup muncul
6. Pilih metode bayar (QRIS, GoPay, ShopeePay, VA bank, dll)
7. Selesaikan pembayaran
8. Notifikasi WhatsApp dikirim otomatis ke customer
```

---

## 10. Troubleshooting

### Storefront build error: "Configuration must contain projectId"

→ Sudah di-handle. Sanity akan skip jika `NEXT_PUBLIC_SANITY_PROJECT_ID` kosong.

### Medusa: "Database connection error"

→ Pastikan PostgreSQL running dan `DATABASE_URL` benar.

### Medusa: "Redis connection error"

→ `REDIS_URL` bisa dikosongkan untuk development. Event bus & cache akan fallback ke in-memory.

### Port sudah dipakai

→ Kill proses lama atau ganti port:

```bash
# Storefront di port lain
PORT=3001 pnpm dev --filter storefront

# Medusa di port lain
PORT=9001 pnpm dev --filter medusa
```
