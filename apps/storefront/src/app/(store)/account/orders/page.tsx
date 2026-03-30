'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/providers/auth-provider'
import { formatRupiah } from '@/lib/utils'

export default function OrdersPage() {
  const { user, loading, orders } = useAuth()
  const router = useRouter()

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-5 w-5 animate-spin border-2 border-brand-950 border-t-transparent" />
      </div>
    )
  }

  if (!user) {
    router.replace('/login')
    return null
  }

  return (
    <div className="mx-auto max-w-container px-5 py-10 lg:px-8 lg:py-16">
      <div className="flex items-baseline gap-3">
        <Link
          href="/account"
          className="text-[11px] uppercase tracking-widest text-brand-400 transition-colors hover:text-brand-950"
        >
          Account
        </Link>
        <span className="text-brand-300">/</span>
        <h1 className="text-2xl font-medium tracking-tightest text-brand-950">
          Orders
        </h1>
      </div>

      {orders.length > 0 ? (
        <div className="mt-10 space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border-t border-brand-200 pt-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-brand-950">{order.id}</p>
                  <p className="mt-1 text-xs text-brand-400">
                    {new Date(order.created_at).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-brand-950">{formatRupiah(order.total)}</p>
                  <span className={`mt-1 inline-block text-[10px] uppercase tracking-widest ${
                    order.status === 'delivered' ? 'text-green-600' :
                    order.status === 'shipped' ? 'text-blue-600' :
                    order.status === 'paid' || order.status === 'processing' ? 'text-brand-950' :
                    'text-brand-400'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="mt-4 space-y-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="relative h-14 w-10 flex-shrink-0 overflow-hidden bg-brand-100">
                      {item.thumbnail ? (
                        <Image src={item.thumbnail} alt={item.title} fill className="object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <span className="text-[7px] uppercase tracking-widest text-brand-300">IMG</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm text-brand-950">{item.title}</p>
                      <p className="text-xs text-brand-400">{item.variant} × {item.quantity}</p>
                    </div>
                    <p className="text-sm text-brand-950">{formatRupiah(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              {/* Shipping Info */}
              <div className="mt-4 text-xs text-brand-400">
                <p>{order.shipping_method} · {order.shipping_address.city}, {order.shipping_address.province}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-24 text-center">
          <p className="text-sm text-brand-400">No orders yet</p>
          <Link href="/products" className="btn-primary mt-6 inline-flex">
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  )
}
