'use client'

import { useEffect, useState } from 'react'

type OrderStats = {
  totalOrders: number
  totalRevenue: number
  statusCounts: Record<string, number>
} | null

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

type Order = {
  orderId: string
  status: string
  customerName: string
  customerPhone: string
  total: number
  shippingMethod: string
  _createdAt: string
}

function formatRupiah(n: number) {
  return `Rp ${n.toLocaleString('id-ID')}`
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const statusMap: Record<string, { label: string; color: string }> = {
  pending: { label: 'Menunggu', color: 'bg-yellow-100 text-yellow-800' },
  paid: { label: 'Dibayar', color: 'bg-green-100 text-green-800' },
  processing: { label: 'Diproses', color: 'bg-blue-100 text-blue-800' },
  shipped: { label: 'Dikirim', color: 'bg-purple-100 text-purple-800' },
  delivered: { label: 'Diterima', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Batal', color: 'bg-red-100 text-red-800' },
  refunded: { label: 'Refund', color: 'bg-gray-100 text-gray-800' },
}

export default function AdminDashboard() {
  const [orderStats, setOrderStats] = useState<OrderStats>(null)
  const [productStats, setProductStats] = useState<ProductStats>(null)
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/stats').then((r) => r.json()),
      fetch('/api/admin/orders?limit=10').then((r) => r.json()),
    ])
      .then(([stats, ordersData]) => {
        setOrderStats(stats.orders)
        setProductStats(stats.products)
        setRecentOrders(ordersData.orders || [])
      })
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
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Overview performa toko DRAVEN</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Pesanan"
          value={String(orderStats?.totalOrders || 0)}
          icon="📦"
        />
        <StatCard
          label="Revenue"
          value={formatRupiah(orderStats?.totalRevenue || 0)}
          icon="💰"
        />
        <StatCard
          label="Produk Aktif"
          value={String(productStats?.activeProducts || 0)}
          sub={`${productStats?.draftProducts || 0} draft`}
          icon="👕"
        />
        <StatCard
          label="Stok Menipis"
          value={String(productStats?.lowStock || 0)}
          sub={`${productStats?.outOfStock || 0} habis`}
          icon="⚠️"
          alert={!!productStats && (productStats.outOfStock > 0 || productStats.lowStock > 0)}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Order Status Breakdown */}
        <div className="rounded-lg border border-gray-200 bg-white p-5 lg:col-span-1">
          <h2 className="text-sm font-semibold text-gray-900">Status Pesanan</h2>
          <div className="mt-4 space-y-3">
            {Object.entries(orderStats?.statusCounts || {}).map(([key, count]) => {
              const s = statusMap[key]
              if (!s || count === 0) return null
              return (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${s.color}`}>
                      {s.label}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{count}</span>
                </div>
              )
            })}
            {!orderStats?.statusCounts && (
              <p className="text-sm text-gray-400">Belum ada data pesanan di Sanity.</p>
            )}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="rounded-lg border border-gray-200 bg-white p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold text-gray-900">Produk Stok Menipis</h2>
          {productStats?.lowStockItems && productStats.lowStockItems.length > 0 ? (
            <div className="mt-4">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-xs uppercase text-gray-400">
                    <th className="pb-2">Produk</th>
                    <th className="pb-2 text-right">Harga</th>
                    <th className="pb-2 text-right">Sisa Stok</th>
                  </tr>
                </thead>
                <tbody>
                  {productStats.lowStockItems.map((item) => (
                    <tr key={item.handle} className="border-b border-gray-50">
                      <td className="py-2.5">
                        <span className="font-medium text-gray-900">{item.title}</span>
                      </td>
                      <td className="py-2.5 text-right text-gray-600">
                        {formatRupiah(item.price)}
                      </td>
                      <td className="py-2.5 text-right">
                        <span
                          className={`inline-flex min-w-[2rem] justify-center rounded-full px-2 py-0.5 text-xs font-bold ${
                            item.stock <= 3
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {item.stock}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-4 text-sm text-gray-400">
              {productStats ? 'Semua produk stok aman.' : 'Belum ada data produk.'}
            </p>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="rounded-lg border border-gray-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Pesanan Terbaru</h2>
          <a href="/admin/orders" className="text-xs text-gray-400 hover:text-gray-600">
            Lihat Semua
          </a>
        </div>

        {recentOrders.length > 0 ? (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs uppercase text-gray-400">
                  <th className="pb-2">Order ID</th>
                  <th className="pb-2">Pelanggan</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2 text-right">Total</th>
                  <th className="pb-2 text-right">Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => {
                  const s = statusMap[order.status] || { label: order.status, color: 'bg-gray-100 text-gray-600' }
                  return (
                    <tr key={order.orderId} className="border-b border-gray-50">
                      <td className="py-2.5 font-mono text-xs font-medium text-gray-900">
                        {order.orderId}
                      </td>
                      <td className="py-2.5">
                        <div className="text-gray-900">{order.customerName}</div>
                        {order.customerPhone && (
                          <div className="text-xs text-gray-400">{order.customerPhone}</div>
                        )}
                      </td>
                      <td className="py-2.5">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${s.color}`}>
                          {s.label}
                        </span>
                      </td>
                      <td className="py-2.5 text-right font-medium text-gray-900">
                        {formatRupiah(order.total || 0)}
                      </td>
                      <td className="py-2.5 text-right text-xs text-gray-400">
                        {formatDate(order._createdAt)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-4 text-sm text-gray-400">
            Belum ada pesanan. Pesanan akan muncul setelah dibuat di Sanity.
          </p>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <QuickLink
          href="/admin/orders"
          title="Kelola Pesanan"
          desc="Lihat, update status & resi"
          icon="📦"
        />
        <QuickLink
          href={`https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'draven'}.sanity.studio`}
          title="Sanity Studio"
          desc="Kelola produk, konten, promo"
          icon="📝"
          external
        />
        <QuickLink
          href="/admin/products"
          title="Produk"
          desc="Stok, harga, kategori"
          icon="👕"
        />
        <QuickLink
          href="/products"
          title="Lihat Storefront"
          desc="Preview toko dari sisi pembeli"
          icon="🌐"
        />
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  sub,
  icon,
  alert,
}: {
  label: string
  value: string
  sub?: string
  icon: string
  alert?: boolean
}) {
  return (
    <div className={`rounded-lg border bg-white p-5 ${alert ? 'border-red-200' : 'border-gray-200'}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-gray-400">{label}</span>
        <span className="text-lg">{icon}</span>
      </div>
      <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-gray-400">{sub}</p>}
    </div>
  )
}

function QuickLink({
  href,
  title,
  desc,
  icon,
  external,
}: {
  href: string
  title: string
  desc: string
  icon: string
  external?: boolean
}) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="group rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        <span className="text-xl">{icon}</span>
        <div>
          <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600">{title}</p>
          <p className="text-xs text-gray-400">{desc}</p>
        </div>
      </div>
    </a>
  )
}
