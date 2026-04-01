import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard — DRAVEN',
  robots: 'noindex, nofollow',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <span className="text-sm font-bold uppercase tracking-widest text-gray-900">
              DRAVEN Admin
            </span>
            <nav className="hidden items-center gap-4 sm:flex">
              <a href="/admin" className="text-sm text-gray-600 hover:text-gray-900">Dashboard</a>
              <a href="/admin/orders" className="text-sm text-gray-600 hover:text-gray-900">Pesanan</a>
              <a href="/admin/products" className="text-sm text-gray-600 hover:text-gray-900">Produk</a>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              Ke Storefront
            </a>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">{children}</main>
    </div>
  )
}
