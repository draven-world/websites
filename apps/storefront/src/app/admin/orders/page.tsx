'use client'

import { useEffect, useState } from 'react'

type Order = {
  orderId: string
  status: string
  customerName: string
  customerPhone: string
  total: number
  subtotal: number
  shippingCost: number
  shippingMethod: string
  trackingNumber: string | null
  items: Array<{
    productTitle: string
    variant: string
    quantity: number
    price: number
  }> | null
  _createdAt: string
}

const statusMap: Record<string, { label: string; color: string }> = {
  pending: { label: 'Menunggu Bayar', color: 'bg-yellow-100 text-yellow-800' },
  paid: { label: 'Dibayar', color: 'bg-green-100 text-green-800' },
  processing: { label: 'Diproses', color: 'bg-blue-100 text-blue-800' },
  shipped: { label: 'Dikirim', color: 'bg-purple-100 text-purple-800' },
  delivered: { label: 'Diterima', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Dibatalkan', color: 'bg-red-100 text-red-800' },
  refunded: { label: 'Refund', color: 'bg-gray-100 text-gray-800' },
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

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/orders?limit=100')
      .then((r) => r.json())
      .then((data) => setOrders(data.orders || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter
    ? orders.filter((o) => o.status === filter)
    : orders

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
        <h1 className="text-2xl font-bold text-gray-900">Pesanan</h1>
        <p className="mt-1 text-sm text-gray-500">{orders.length} total pesanan</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <FilterButton active={filter === ''} onClick={() => setFilter('')}>
          Semua ({orders.length})
        </FilterButton>
        {Object.entries(statusMap).map(([key, s]) => {
          const count = orders.filter((o) => o.status === key).length
          if (count === 0) return null
          return (
            <FilterButton key={key} active={filter === key} onClick={() => setFilter(key)}>
              {s.label} ({count})
            </FilterButton>
          )
        })}
      </div>

      {/* Order List */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((order) => {
            const s = statusMap[order.status] || { label: order.status, color: 'bg-gray-100 text-gray-600' }
            const isExpanded = expanded === order.orderId
            return (
              <div
                key={order.orderId}
                className="rounded-lg border border-gray-200 bg-white"
              >
                <button
                  onClick={() => setExpanded(isExpanded ? null : order.orderId)}
                  className="flex w-full items-center justify-between p-4 text-left"
                >
                  <div className="flex flex-1 flex-wrap items-center gap-3">
                    <span className="font-mono text-xs font-bold text-gray-900">
                      {order.orderId}
                    </span>
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${s.color}`}>
                      {s.label}
                    </span>
                    <span className="text-sm text-gray-600">{order.customerName}</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatRupiah(order.total || 0)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="hidden text-xs text-gray-400 sm:block">
                      {formatDate(order._createdAt)}
                    </span>
                    <svg
                      className={`h-4 w-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-gray-100 px-4 pb-4 pt-3">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-xs font-medium uppercase text-gray-400">Pelanggan</p>
                        <p className="mt-1 text-sm text-gray-900">{order.customerName}</p>
                        {order.customerPhone && (
                          <a
                            href={`https://wa.me/${order.customerPhone.replace(/^0/, '62')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-green-600 hover:underline"
                          >
                            WhatsApp: {order.customerPhone}
                          </a>
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase text-gray-400">Pengiriman</p>
                        <p className="mt-1 text-sm text-gray-900">
                          {order.shippingMethod || '-'}
                        </p>
                        {order.trackingNumber && (
                          <p className="text-xs text-gray-600">
                            Resi: <span className="font-mono font-bold">{order.trackingNumber}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {order.items && order.items.length > 0 && (
                      <div className="mt-4">
                        <p className="text-xs font-medium uppercase text-gray-400">Item</p>
                        <div className="mt-2 space-y-1">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex items-center justify-between text-sm">
                              <span className="text-gray-700">
                                {item.productTitle}
                                {item.variant && ` — ${item.variant}`}
                                <span className="text-gray-400"> x{item.quantity}</span>
                              </span>
                              <span className="text-gray-900">
                                {formatRupiah(item.price * item.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-4 border-t border-gray-100 pt-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Subtotal</span>
                        <span>{formatRupiah(order.subtotal || 0)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Ongkir</span>
                        <span>{formatRupiah(order.shippingCost || 0)}</span>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-sm font-bold">
                        <span>Total</span>
                        <span>{formatRupiah(order.total || 0)}</span>
                      </div>
                    </div>

                    <p className="mt-3 text-xs text-gray-400">
                      Dibuat: {formatDate(order._createdAt)}
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="py-16 text-center">
          <p className="text-sm text-gray-400">
            {filter ? `Tidak ada pesanan dengan status "${statusMap[filter]?.label}"` : 'Belum ada pesanan.'}
          </p>
        </div>
      )}
    </div>
  )
}

function FilterButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
        active
          ? 'bg-gray-900 text-white'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      {children}
    </button>
  )
}
