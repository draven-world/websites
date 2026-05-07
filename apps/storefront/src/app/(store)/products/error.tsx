'use client'

import Link from 'next/link'

export default function ProductsError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-5 text-center">
      <svg className="mb-4 h-14 w-14 text-ink-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
      </svg>
      <h2 className="text-lg font-bold uppercase tracking-wide text-ink-900">
        Gagal Memuat Produk
      </h2>
      <p className="mt-2 text-sm text-ink-500">
        Tidak dapat terhubung ke server. Pastikan koneksi internet kamu stabil.
      </p>
      <div className="mt-8 flex gap-3">
        <button onClick={reset} className="btn-primary">
          COBA LAGI
        </button>
        <Link href="/" className="btn-secondary">
          KEMBALI
        </Link>
      </div>
    </div>
  )
}
