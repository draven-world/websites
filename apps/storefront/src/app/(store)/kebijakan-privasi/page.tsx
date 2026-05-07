import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kebijakan Privasi — DRAVEN',
  description: 'Kebijakan privasi DRAVEN',
}

export default function KebijakanPrivasiPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-16 lg:px-8 lg:py-24">
      <h1 className="text-2xl font-medium tracking-tightest text-ink-950 md:text-3xl">
        Kebijakan Privasi
      </h1>
      <p className="mt-4 text-sm text-ink-500">
        Terakhir diperbarui: 1 April 2026
      </p>

      <div className="mt-10 space-y-8">
        <section>
          <h2 className="text-[13px] font-semibold uppercase tracking-widest text-ink-500">
            Informasi yang Kami Kumpulkan
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-700">
            Saat kamu berbelanja di DRAVEN, kami mengumpulkan informasi yang
            diperlukan untuk memproses pesanan: nama, alamat email, nomor
            telepon (WhatsApp), dan alamat pengiriman. Informasi pembayaran
            diproses secara aman oleh Midtrans dan tidak disimpan di server kami.
          </p>
        </section>

        <section>
          <h2 className="text-[13px] font-semibold uppercase tracking-widest text-ink-500">
            Penggunaan Informasi
          </h2>
          <ul className="mt-3 list-inside list-disc space-y-2 text-sm leading-relaxed text-ink-700">
            <li>Memproses dan mengirim pesananmu</li>
            <li>Mengirim update status pesanan via WhatsApp</li>
            <li>Merespons pertanyaan dan permintaan bantuan</li>
            <li>Meningkatkan layanan dan pengalaman belanja</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[13px] font-semibold uppercase tracking-widest text-ink-500">
            Keamanan Data
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-700">
            Kami menggunakan langkah keamanan standar industri untuk melindungi
            data pribadimu. Pembayaran diproses melalui Midtrans yang telah
            tersertifikasi PCI-DSS. Kami tidak menyimpan informasi kartu kredit
            atau debit.
          </p>
        </section>

        <section>
          <h2 className="text-[13px] font-semibold uppercase tracking-widest text-ink-500">
            Berbagi Data
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-700">
            Kami tidak menjual atau menyewakan data pribadimu kepada pihak
            ketiga. Data hanya dibagikan kepada penyedia layanan yang diperlukan
            untuk memproses pesanan: jasa pengiriman (JNE, J&T, SiCepat, dll)
            dan payment gateway (Midtrans).
          </p>
        </section>

        <section>
          <h2 className="text-[13px] font-semibold uppercase tracking-widest text-ink-500">
            Cookies
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-700">
            Website kami menggunakan cookies untuk menyimpan preferensi dan data
            sesi belanja (keranjang). Cookies ini tidak mengumpulkan informasi
            pribadi tambahan.
          </p>
        </section>

        <section>
          <h2 className="text-[13px] font-semibold uppercase tracking-widest text-ink-500">
            Hak Kamu
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-700">
            Kamu berhak untuk mengakses, memperbarui, atau menghapus data
            pribadimu kapan saja. Hubungi kami via WhatsApp atau email untuk
            permintaan terkait data pribadi.
          </p>
        </section>

        <section className="border-t border-ink-100 pt-8">
          <h2 className="text-[13px] font-semibold uppercase tracking-widest text-ink-500">
            Kontak
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-700">
            Jika ada pertanyaan tentang kebijakan privasi ini, hubungi kami via
            DM Instagram{' '}
            <a
              href="https://instagram.com/dravenworldwide"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-950 underline underline-offset-4"
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
