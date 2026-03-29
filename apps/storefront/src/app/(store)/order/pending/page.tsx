import Link from 'next/link'

export const metadata = {
  title: 'Menunggu Pembayaran',
}

export default function OrderPendingPage() {
  return (
    <div className="mx-auto max-w-lg px-5 py-24 text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center border-2 border-brand-900">
        <svg className="h-8 w-8 text-brand-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <h1 className="text-2xl font-bold uppercase tracking-wide text-brand-900">
        Menunggu Pembayaran
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-brand-500">
        Pesanan kamu sudah dibuat. Segera selesaikan pembayaran sebelum batas waktu yang ditentukan.
      </p>
      <p className="mt-2 text-sm text-brand-400">
        Setelah pembayaran dikonfirmasi, kamu akan menerima notifikasi WhatsApp.
      </p>

      <div className="mt-10 flex flex-col gap-3">
        <Link href="/products" className="btn-primary py-4">
          LANJUT BELANJA
        </Link>
        <Link href="/" className="text-xs font-semibold uppercase tracking-wider text-brand-400 transition-colors hover:text-brand-900">
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  )
}
