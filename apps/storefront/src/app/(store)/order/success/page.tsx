'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense, useEffect, useState } from 'react'
import { formatRupiah } from '@/lib/utils'

type OrderData = {
  id: string
  items: Array<{
    title: string
    variant: string
    quantity: number
    price: number
  }>
  subtotal: number
  shipping_cost: number
  total: number
  shipping_address: {
    name: string
    address: string
    city: string
    province: string
    phone: string
  }
  shipping_method: string
  status: string
  created_at: string
}

function findOrder(orderId: string): OrderData | null {
  if (typeof window === 'undefined') return null
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (!key?.startsWith('draven_orders_')) continue
      const orders: OrderData[] = JSON.parse(localStorage.getItem(key) || '[]')
      const found = orders.find((o) => o.id === orderId)
      if (found) return found
    }
  } catch {
    // ignore
  }
  return null
}

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('id') || ''
  const [order, setOrder] = useState<OrderData | null>(null)

  useEffect(() => {
    if (orderId) {
      const found = findOrder(orderId)
      setOrder(found)
    }
  }, [orderId])

  return (
    <div className="min-h-screen flex items-start justify-center px-8 py-24">
      <div className="w-full max-w-md">
        {/* Headline */}
        <h1 className="text-[clamp(1.5rem,3.5vw,2.5rem)] uppercase font-bold tracking-tighter text-ink-100 leading-[1.05]">
          ORDER CONFIRMED
        </h1>

        {orderId && (
          <p className="mt-4 text-sm text-ink-300">Order #{orderId}</p>
        )}

        <p className="mt-3 text-[0.75rem] uppercase tracking-[0.15em] text-ink-500">
          TERIMA KASIH SUDAH BELANJA DI DRAVEN. PESANAN SEDANG DIPROSES.
        </p>

        {/* Order summary */}
        {order && (
          <div className="mt-10 flex flex-col gap-6">
            {order.items && order.items.length > 0 && (
              <div className="border border-ink-800 p-5">
                <p className="text-[0.75rem] uppercase tracking-[0.15em] text-ink-400">
                  Item Pesanan
                </p>
                <div className="mt-3 divide-y divide-ink-800">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-2.5 text-sm">
                      <div>
                        <span className="text-ink-100">{item.title}</span>
                        {item.variant && item.variant !== 'Default' && (
                          <span className="text-ink-400"> — {item.variant}</span>
                        )}
                        <span className="text-ink-500"> x{item.quantity}</span>
                      </div>
                      <span className="font-medium text-ink-100">
                        {formatRupiah(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 space-y-1 border-t border-ink-800 pt-3 text-sm">
                  <div className="flex justify-between text-ink-400">
                    <span>Subtotal</span>
                    <span>{formatRupiah(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-ink-400">
                    <span>Ongkir</span>
                    <span>{formatRupiah(order.shipping_cost)}</span>
                  </div>
                  <div className="flex justify-between font-medium text-ink-100">
                    <span>Total</span>
                    <span>{formatRupiah(order.total)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Shipping */}
            <div className="border border-ink-800 p-5">
              <p className="text-[0.75rem] uppercase tracking-[0.15em] text-ink-400">Pengiriman</p>
              <div className="mt-3 text-sm text-ink-300">
                <p className="font-medium text-ink-100">{order.shipping_address?.name}</p>
                <p>{order.shipping_address?.address}</p>
                <p>
                  {order.shipping_address?.city}, {order.shipping_address?.province}
                </p>
                {order.shipping_method && (
                  <p className="mt-2 text-ink-400">Kurir: {order.shipping_method}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Next steps */}
        <div className="mt-8 border border-ink-800 p-5">
          <p className="text-[0.75rem] uppercase tracking-[0.15em] text-ink-400">
            Langkah Selanjutnya
          </p>
          <ul className="mt-3 space-y-2 text-sm text-ink-300">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-ink-100">1.</span>
              Pesanan akan diproses dalam 1–2 hari kerja
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-ink-100">2.</span>
              Nomor resi akan dikirim via WhatsApp
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-ink-100">3.</span>
              Estimasi pengiriman: 2–5 hari kerja (tergantung kurir &amp; lokasi)
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="mt-10 flex flex-col gap-4">
          <Link href="/products" className="btn-primary w-full inline-flex justify-center">
            BACK TO SHOP
          </Link>
          <Link
            href="/account/orders"
            className="text-center text-[0.75rem] uppercase tracking-[0.15em] text-ink-400 hover:text-accent-lime transition-colors"
          >
            LIHAT PESANAN SAYA →
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-5 w-5 animate-spin border-2 border-ink-100 border-t-transparent" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  )
}
