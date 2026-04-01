'use client'

import { useEffect, useState } from 'react'

type ProductStats = {
  totalProducts: number
  activeProducts: number
  draftProducts: number
  outOfStock: number
  lowStock: number
  lowStockItems: Array<{
    title: string
    handle: string
    stock: number
    price: number
  }>
} | null

function formatRupiah(n: number) {
  return `Rp ${n.toLocaleString('id-ID')}`
}

export default function ProductsAdminPage() {
  const [stats, setStats] = useState<ProductStats>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then((data) => setStats(data.products))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-900 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Produk</h1>
        <p className="mt-1 text-sm text-gray-500">Overview inventori produk</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Total</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{stats?.totalProducts || 0}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Aktif</p>
          <p className="mt-2 text-3xl font-bold text-green-600">{stats?.activeProducts || 0}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Draft</p>
          <p className="mt-2 text-3xl font-bold text-gray-400">{stats?.draftProducts || 0}</p>
        </div>
        <div className={`rounded-lg border bg-white p-5 ${(stats?.outOfStock || 0) > 0 ? 'border-red-200' : 'border-gray-200'}`}>
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Habis / Menipis</p>
          <p className="mt-2 text-3xl font-bold text-red-600">
            {stats?.outOfStock || 0}
            <span className="text-lg text-yellow-500"> / {stats?.lowStock || 0}</span>
          </p>
        </div>
      </div>

      {/* Low Stock Table */}
      <div className="rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-gray-900">Produk Perlu Restock</h2>
        <p className="mt-1 text-xs text-gray-400">Produk dengan stok kurang dari 10 unit</p>

        {stats?.lowStockItems && stats.lowStockItems.length > 0 ? (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs uppercase text-gray-400">
                  <th className="pb-2">Produk</th>
                  <th className="pb-2 text-right">Harga</th>
                  <th className="pb-2 text-right">Sisa Stok</th>
                  <th className="pb-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.lowStockItems.map((item) => (
                  <tr key={item.handle} className="border-b border-gray-50">
                    <td className="py-3">
                      <a
                        href={`/products/${item.handle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-gray-900 hover:text-blue-600"
                      >
                        {item.title}
                      </a>
                    </td>
                    <td className="py-3 text-right text-gray-600">
                      {formatRupiah(item.price)}
                    </td>
                    <td className="py-3 text-right">
                      <span
                        className={`inline-flex min-w-[2.5rem] justify-center rounded-full px-2 py-0.5 text-xs font-bold ${
                          item.stock === 0
                            ? 'bg-red-100 text-red-700'
                            : item.stock <= 3
                              ? 'bg-red-50 text-red-600'
                              : 'bg-yellow-50 text-yellow-700'
                        }`}
                      >
                        {item.stock}
                      </span>
                    </td>
                    <td className="py-3 text-right text-xs">
                      {item.stock === 0 ? (
                        <span className="font-medium text-red-600">HABIS</span>
                      ) : item.stock <= 3 ? (
                        <span className="font-medium text-red-500">SEGERA HABIS</span>
                      ) : (
                        <span className="text-yellow-600">MENIPIS</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-4 text-sm text-gray-400">
            {stats ? 'Semua produk stok aman (di atas 10 unit).' : 'Belum ada data produk.'}
          </p>
        )}
      </div>

      {/* CTA */}
      <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
        <p className="text-sm text-gray-500">
          Untuk menambah, edit, atau hapus produk, gunakan Sanity Studio.
        </p>
        <a
          href={`https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'draven'}.sanity.studio`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
        >
          Buka Sanity Studio
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
        </a>
      </div>
    </div>
  )
}
