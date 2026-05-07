import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <h1 className="text-7xl font-bold tracking-tight text-ink-900">404</h1>
      <h2 className="mt-4 text-lg font-semibold uppercase tracking-wider text-ink-900">
        Halaman Tidak Ditemukan
      </h2>
      <p className="mt-2 text-sm text-ink-500">
        Halaman yang kamu cari tidak ada atau sudah dipindahkan.
      </p>
      <Link href="/" className="btn-primary mt-8">
        KEMBALI KE BERANDA
      </Link>
    </div>
  )
}
