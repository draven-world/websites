import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cara Order — DRAVEN',
  description: 'Panduan cara berbelanja di DRAVEN',
}

export default function CaraOrderPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-16 lg:px-8 lg:py-24">
      <h1 className="text-2xl font-medium tracking-tightest text-brand-950 md:text-3xl">
        Cara Order
      </h1>

      <div className="mt-10 space-y-10">
        <section>
          <h2 className="text-[13px] font-semibold uppercase tracking-widest text-brand-400">
            1. Pilih Produk
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-brand-600">
            Telusuri koleksi kami di halaman Shop. Pilih produk yang kamu suka,
            tentukan ukuran dan warna, lalu klik &ldquo;Add to Bag&rdquo;.
          </p>
        </section>

        <section>
          <h2 className="text-[13px] font-semibold uppercase tracking-widest text-brand-400">
            2. Cek Bag
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-brand-600">
            Buka halaman Bag untuk review pesananmu. Kamu bisa mengubah jumlah
            atau menghapus item sebelum checkout.
          </p>
        </section>

        <section>
          <h2 className="text-[13px] font-semibold uppercase tracking-widest text-brand-400">
            3. Isi Alamat Pengiriman
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-brand-600">
            Masukkan nama, nomor WhatsApp, dan alamat lengkap. Pilih provinsi,
            kota, dan kecamatan untuk menghitung ongkos kirim secara otomatis.
          </p>
        </section>

        <section>
          <h2 className="text-[13px] font-semibold uppercase tracking-widest text-brand-400">
            4. Pilih Pengiriman
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-brand-600">
            Pilih jasa pengiriman yang tersedia (JNE, J&T, SiCepat, dll).
            Estimasi ongkir dan waktu pengiriman akan ditampilkan.
          </p>
        </section>

        <section>
          <h2 className="text-[13px] font-semibold uppercase tracking-widest text-brand-400">
            5. Bayar
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-brand-600">
            Klik &ldquo;Pay Now&rdquo; dan pilih metode pembayaran di jendela
            Midtrans. Kami menerima QRIS, transfer bank (BCA, BRI, BNI, Mandiri,
            dll), e-wallet (OVO, GoPay, DANA, ShopeePay), dan pembayaran di
            minimarket (Alfamart, Indomaret).
          </p>
        </section>

        <section>
          <h2 className="text-[13px] font-semibold uppercase tracking-widest text-brand-400">
            6. Konfirmasi & Pengiriman
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-brand-600">
            Setelah pembayaran berhasil, kamu akan mendapat konfirmasi. Pesanan
            akan diproses dan dikirim dalam 1-2 hari kerja. Update pengiriman
            akan dikirim via WhatsApp.
          </p>
        </section>

        <section className="border-t border-brand-100 pt-10">
          <h2 className="text-[13px] font-semibold uppercase tracking-widest text-brand-400">
            Butuh Bantuan?
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-brand-600">
            Hubungi kami via WhatsApp atau DM Instagram{' '}
            <a
              href="https://instagram.com/dravenworldwide"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-950 underline underline-offset-4"
            >
              @dravenworldwide
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  )
}
