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
    // Check draven_last_order first
    const lastOrderRaw = localStorage.getItem('draven_last_order')

    // Search through all user orders
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (!key?.startsWith('draven_orders_')) continue
      const orders: OrderData[] = JSON.parse(localStorage.getItem(key) || '[]')
      const found = orders.find((o) => o.id === orderId)
      if (found) return found
    }

    // Fallback: if orderId matches last order key, return null (no details)
    if (lastOrderRaw === orderId) return null
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
    <div className="mx-auto max-w-lg px-5 py-20 lg:py-28">
      {/* Success Icon */}
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center bg-brand-950">
          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-medium tracking-tightest text-brand-950">
          Pesanan Dikonfirmasi
        </h1>

        {orderId && (
          <p className="mt-2 font-mono text-sm text-brand-400">{orderId}</p>
        )}

        <p className="mt-4 text-sm leading-relaxed text-brand-400">
          Terima kasih sudah belanja di DRAVEN. Pembayaran kamu sudah dikonfirmasi dan pesanan sedang diproses.
        </p>
      </div>

      {/* Order Summary */}
      {order && (
        <div className="mt-10 space-y-6">
          {/* Items */}
          {order.items && order.items.length > 0 && (
            <div className="border border-brand-100 p-5">
              <p className="text-[11px] uppercase tracking-widest text-brand-400">Item Pesanan</p>
              <div className="mt-3 divide-y divide-brand-50">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2.5 text-sm">
                    <div>
                      <span className="text-brand-950">{item.title}</span>
                      {item.variant && item.variant !== 'Default' && (
                        <span className="text-brand-400"> — {item.variant}</span>
                      )}
                      <span className="text-brand-300"> x{item.quantity}</span>
                    </div>
                    <span className="font-medium text-brand-950">
                      {formatRupiah(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-3 space-y-1 border-t border-brand-100 pt-3 text-sm">
                <div className="flex justify-between text-brand-400">
                  <span>Subtotal</span>
                  <span>{formatRupiah(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-brand-400">
                  <span>Ongkir</span>
                  <span>{formatRupiah(order.shipping_cost)}</span>
                </div>
                <div className="flex justify-between font-medium text-brand-950">
                  <span>Total</span>
                  <span>{formatRupiah(order.total)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Shipping Info */}
          <div className="border border-brand-100 p-5">
            <p className="text-[11px] uppercase tracking-widest text-brand-400">Pengiriman</p>
            <div className="mt-3 text-sm text-brand-600">
              <p className="font-medium text-brand-950">{order.shipping_address?.name}</p>
              <p>{order.shipping_address?.address}</p>
              <p>{order.shipping_address?.city}, {order.shipping_address?.province}</p>
              {order.shipping_method && (
                <p className="mt-2 text-brand-400">Kurir: {order.shipping_method}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Next Steps */}
      <div className="mt-8 border border-brand-100 bg-brand-50/50 p-5">
        <p className="text-[11px] uppercase tracking-widest text-brand-400">Langkah Selanjutnya</p>
        <ul className="mt-3 space-y-2 text-sm text-brand-600">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-brand-950">1.</span>
            Pesanan akan diproses dalam 1-2 hari kerja
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-brand-950">2.</span>
            Nomor resi akan dikirim via WhatsApp
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-brand-950">3.</span>
            Estimasi pengiriman: 2-5 hari kerja (tergantung kurir & lokasi)
          </li>
        </ul>
      </div>

      {/* Actions */}
      <div className="mt-10 flex flex-col gap-4">
        <Link href="/products" className="btn-primary py-4">
          Lanjut Belanja
        </Link>
        <Link
          href="/account/orders"
          className="text-center text-[11px] uppercase tracking-widest text-brand-400 transition-colors hover:text-brand-950"
        >
          Lihat Pesanan Saya
        </Link>
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-5 w-5 animate-spin border-2 border-brand-950 border-t-transparent" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
