# UX Audit Report — DRAVEN Storefront

**Date:** 2026-04-01
**Auditor:** Claude Code
**Scope:** Full user flow — landing to checkout, account, order status

---

## Summary

| Severity | Count | Status |
|----------|-------|--------|
| Critical | 6 | Pending |
| High | 6 | Pending |
| Medium | 4 | Pending |
| Low | 3 | Pending |

---

## Critical

### 1. Cart — No feedback saat remove item

**File:** `apps/storefront/src/app/(store)/cart/page.tsx`

Item hilang tanpa toast notification atau opsi undo. User tidak yakin apakah item benar-benar terhapus atau ada error.

**Fix:**
- Tampilkan toast "Item removed from bag"
- Tambahkan opsi "Undo" di toast (simpan item di state selama 3 detik)

---

### 2. Search tidak live

**File:** `apps/storefront/src/components/layout/Header.tsx`

Search hanya berfungsi saat tekan Enter. Tidak ada instant results, debouncing, atau pesan "no results found".

**Fix:**
- Implementasi live search dengan debounce 300ms
- Tampilkan instant results di bawah input
- Tampilkan jumlah hasil: "25 results for 'hoodie'"
- Tampilkan "No results found" jika kosong

---

### 3. Shipping cost baru muncul setelah isi form lengkap

**File:** `apps/storefront/src/components/checkout/ShippingForm.tsx`

User tidak tahu ongkir sampai step 2. Banyak yang abandon kalau ongkir ternyata mahal.

**Fix:**
- Tambah tombol "Estimasi Ongkir" di ShippingForm
- Tampilkan modal estimasi tanpa pindah ke step berikutnya
- User bisa lihat harga sebelum commit

---

### 4. Form validation hanya saat submit

**Files:**
- `apps/storefront/src/components/checkout/ShippingForm.tsx`
- `apps/storefront/src/app/(store)/login/page.tsx`
- `apps/storefront/src/app/(store)/register/page.tsx`

Tidak ada real-time feedback. Error baru muncul setelah user klik submit.

**Fix:**
- Real-time validation dengan debounce 500ms
- Inline error/success states (border merah + error text, atau checkmark hijau)
- Validasi spesifik Indonesia:
  - Phone: harus dimulai `08`, 10-13 digit
  - Helper text: "Format: 08xxxxxxxxxx"
- Email: validasi format sebelum submit

---

### 5. Accessibility: missing ARIA labels

**Files:** Multiple

| Element | File | Issue |
|---------|------|-------|
| Search input | `Header.tsx` | Tidak ada `<label>` atau `aria-label` |
| Quantity buttons (-/+) | `cart/page.tsx` | Tidak ada `aria-label` |
| Cart badge count | `MobileNav.tsx` | Tidak ada `aria-label` |
| Sort dropdown | `ProductFilters.tsx` | Tidak ada visible label |
| Category filter buttons | `ProductFilters.tsx` | Tidak ada `aria-current` untuk active state |

**Fix:**
- Tambah `aria-label` untuk setiap interactive element
- Tambah `<label className="sr-only">` untuk input tanpa visible label
- Tambah `aria-current="page"` untuk active category

---

### 6. Footer link mati (404)

**File:** `apps/storefront/src/components/layout/Footer.tsx`

Link `/cara-order` dan `/kebijakan-privasi` belum ada halamannya.

**Fix:**
- Buat halaman `/cara-order` (How to Order)
- Buat halaman `/kebijakan-privasi` (Privacy Policy)
- Atau hapus link dari footer sampai halaman siap

---

## High

### 7. Tidak ada loading skeleton

**Files:**
- `apps/storefront/src/app/(store)/products/page.tsx`
- `apps/storefront/src/app/(store)/products/[handle]/page.tsx`

Blank flash sebelum konten muncul. Tidak ada loading.tsx atau Suspense boundary.

**Fix:**
- Buat `products/loading.tsx` dengan skeleton grid (aspect-ratio 3:4 placeholder)
- Buat `products/[handle]/loading.tsx` dengan skeleton 2-column layout

---

### 8. Add to Cart tidak ada animasi

**File:** `apps/storefront/src/components/product/ProductDetail.tsx`

Button berubah ke "Added" tapi tidak ada visual feedback yang kuat. Cart badge di header tidak animate.

**Fix:**
- Pastikan toast provider berfungsi dan visible
- Tambah animasi bounce/scale pada cart badge saat item ditambah
- Perpanjang "Added" state dari 3 detik ke 5 detik

---

### 9. Payment methods terlihat clickable tapi bukan

**File:** `apps/storefront/src/components/checkout/PaymentSection.tsx`

Grid payment methods (QRIS, BCA, dll) terlihat seperti button tapi hanya display. User mencoba klik dan bingung.

**Fix:**
- Perjelas bahwa payment methods dipilih di popup Midtrans
- Ubah text menjadi: "Pilih metode pembayaran di jendela pembayaran setelah klik Pay Now"
- Atau sederhanakan: hanya tampilkan QRIS sebagai recommended + text "8+ metode tersedia"

---

### 10. Order success page terlalu minim

**File:** `apps/storefront/src/app/(store)/order/success/page.tsx`

Hanya menampilkan order ID dan pesan generic. Tidak ada ringkasan pesanan, estimasi pengiriman, atau langkah selanjutnya.

**Fix:**
- Tampilkan ringkasan order (items, total, metode pengiriman)
- Tambah estimasi pengiriman: "Est. 2-4 hari kerja"
- Tambah langkah selanjutnya: "Cek WhatsApp untuk update"
- Tambah link ke halaman orders

---

### 11. Tidak ada "Back to Shop" di product detail

**File:** `apps/storefront/src/app/(store)/products/[handle]/page.tsx`

Hanya breadcrumb, tidak ada tombol kembali yang jelas di desktop.

**Fix:**
- Tambah `← Back to Shop` link di atas product detail
- Link harus mempertahankan filter/kategori yang sedang aktif jika memungkinkan

---

### 12. Shipping options tidak ada retry button kalau gagal

**File:** `apps/storefront/src/components/checkout/ShippingOptions.tsx`

Error message tampil tanpa aksi. User harus refresh halaman.

**Fix:**
- Tambah tombol "Retry" di error state
- Tampilkan pesan spesifik: "Gagal menghitung ongkir. Cek koneksi internet."

---

## Medium

### 13. Tidak ada trust badges

**Files:** Multiple (checkout, footer, product detail)

Tidak ada indikator keamanan ("Secure Payment", "SSL", garansi). Penting untuk buyer Indonesia yang belum familiar dengan brand.

**Fix:**
- Tambah trust badges di checkout: "Pembayaran aman via Midtrans"
- Tambah di footer: "100% Secure Payment"
- Pertimbangkan tambah review/rating di product card (jika data tersedia)

---

### 14. Register form helper text kurang

**File:** `apps/storefront/src/app/(store)/register/page.tsx`

- Password minimum 6 karakter hanya di placeholder
- WhatsApp field tidak ditandai optional
- Tidak ada password strength indicator

**Fix:**
- Tambah helper text di bawah input: "Min. 6 karakter"
- Tandai field optional: "Phone (WhatsApp) — optional"

---

### 15. Filter — tidak ada "Clear filter" button

**File:** `apps/storefront/src/components/product/ProductFilters.tsx`

Reset filter hanya bisa lewat klik "All". Tidak ada tombol clear yang eksplisit.

**Fix:**
- Tambah "Clear filter" button saat kategori aktif
- Tampilkan active filter sebagai tag yang bisa di-dismiss

---

### 16. Hero banner auto-advance terlalu cepat

**File:** `apps/storefront/src/components/home/HeroBanner.tsx`

Auto-advance setiap 6 detik. Untuk editorial imagery dengan big pictures, 8-10 detik lebih sesuai.

**Fix:**
- Ubah interval dari 6000ms ke 8000ms
- Pause auto-advance saat user hover (desktop)

---

## Low

### 17. Image tidak ada blur placeholder

**Files:**
- `apps/storefront/src/components/product/ProductCard.tsx`
- `apps/storefront/src/components/product/ProductDetail.tsx`

Gambar muncul langsung tanpa loading state. Bisa tambah blur-up effect.

---

### 18. Gallery product detail tidak ada keyboard navigation

**File:** `apps/storefront/src/components/product/ProductDetail.tsx`

Tidak bisa navigasi gambar dengan arrow keys (left/right).

---

### 19. Tidak ada dark mode

Tidak critical untuk pasar Indonesia saat ini. Low-effort jika Tailwind dark mode sudah dikonfigurasi.

---

## Indonesian Market Recommendations

### Yang sudah baik:
- WhatsApp prominently featured
- Format Rupiah (IDR) benar
- Form alamat lengkap (provinsi/kota/kecamatan)
- COD via Indomaret/Alfamart tersedia
- Midtrans payment gateway (trusted)
- Metadata bahasa Indonesia (`lang="id"`, `locale: 'id_ID'`)

### Peluang tambahan:
- **WhatsApp live chat button** — Tambah floating button untuk support instan
- **Cicilan 0%** — Tampilkan opsi cicilan di product detail
- **Testimonial lokal** — Review/foto dari customer Indonesia di homepage
- **Notifikasi stok** — "Notify me" untuk produk yang habis

---

## Implementation Priority

**Week 1 — Critical:**
1. Form validation real-time
2. ARIA labels untuk accessibility
3. Buat halaman yang missing (`/cara-order`, `/kebijakan-privasi`)
4. Toast feedback untuk cart actions

**Week 2 — High:**
1. Loading skeletons untuk products & product detail
2. Perbaiki payment methods clarity
3. Order success page dengan ringkasan
4. Retry button di shipping options

**Week 3 — Medium:**
1. Trust badges di checkout & footer
2. Register form helper text
3. Clear filter button
4. Hero banner timing

**Ongoing:**
- Monitor cart abandonment rate
- Test checkout flow dengan real users
- Gather feedback untuk area yang unclear
- Optimize images untuk koneksi lambat
