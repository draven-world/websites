import Link from 'next/link'

export const metadata = {
  title: 'Pesanan Berhasil',
}

export default function OrderSuccessPage() {
  return (
    <div className="mx-auto max-w-lg px-5 py-24 text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center bg-brand-900">
        <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-2xl font-bold uppercase tracking-wide text-brand-900">
        Pesanan Berhasil!
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-brand-500">
        Terima kasih sudah belanja di DRAVEN. Pembayaran kamu sudah dikonfirmasi dan pesanan sedang kami proses.
      </p>
      <p className="mt-2 text-sm text-brand-400">
        Kamu akan menerima notifikasi WhatsApp untuk update status pesanan.
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
