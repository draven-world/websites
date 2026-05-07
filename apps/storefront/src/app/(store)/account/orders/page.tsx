'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/providers/auth-provider'
import { formatRupiah } from '@/lib/utils'

export default function OrdersPage() {
  const { user, loading, orders } = useAuth()
  const router = useRouter()

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-5 w-5 animate-spin border-2 border-ink-100 border-t-transparent" />
      </div>
    )
  }

  if (!user) {
    router.replace('/login')
    return null
  }

  return (
    <div className="mx-auto max-w-2xl px-8 pt-32 lg:pt-40 pb-32">
      <h1 className="text-[clamp(2rem,5vw,4rem)] uppercase font-bold tracking-tighter text-ink-100 leading-none">ORDERS</h1>
      <p className="mt-2 text-[0.75rem] uppercase tracking-[0.15em] text-ink-500">
        {orders.length} ORDER{orders.length !== 1 ? 'S' : ''}
      </p>

      {orders.length === 0 ? (
        <div className="mt-16">
          <p className="text-sm text-ink-300">No orders yet.</p>
          <Link
            href="/products"
            className="mt-6 inline-block text-[0.8125rem] uppercase tracking-[0.18em] text-ink-300 hover:text-accent-lime transition-colors"
          >
            START SHOPPING →
          </Link>
        </div>
      ) : (
        <div className="mt-12 border-t border-ink-700">
          {orders.map((order) => (
            <details key={order.id} className="border-b border-ink-700 py-4">
              <summary className="cursor-pointer grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center text-sm">
                <span className="font-bold text-ink-100">#{order.id}</span>
                <span className="text-ink-300">
                  {new Date(order.created_at).toLocaleDateString('en-US')}
                </span>
                <span className={`text-[0.75rem] uppercase tracking-[0.15em] ${
                  order.status === 'delivered' || order.status === 'paid'
                    ? 'text-accent-lime'
                    : order.status === 'shipped' || order.status === 'processing'
                    ? 'text-ink-100'
                    : 'text-ink-500'
                }`}>
                  {order.status.toUpperCase()}
                </span>
                <span className="font-bold text-ink-100">{formatRupiah(order.total)}</span>
              </summary>
              <div className="mt-4 flex flex-col gap-2 text-sm text-ink-300">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{item.title} × {item.quantity}</span>
                    <span>{formatRupiah(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  )
}
