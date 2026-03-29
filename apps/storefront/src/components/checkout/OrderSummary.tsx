'use client'

import Image from 'next/image'
import { formatRupiah } from '@/lib/utils'
import type { ShippingCost } from '@/app/(store)/checkout/page'

type Cart = {
  items: Array<{
    id: string
    title: string
    thumbnail: string | null
    variant: { title: string }
    quantity: number
    unit_price: number
    subtotal: number
  }>
  subtotal: number
  tax_total: number
  total: number
}

export default function OrderSummary({
  cart,
  shippingCost,
}: {
  cart: Cart | null
  shippingCost: ShippingCost | null
}) {
  if (!cart) return null

  const grandTotal = cart.total + (shippingCost?.cost || 0)

  return (
    <div className="border border-brand-100 bg-brand-50 p-6">
      <h2 className="mb-5 text-sm font-bold uppercase tracking-wider text-brand-900">
        Ringkasan Pesanan
      </h2>

      <div className="space-y-3">
        {cart.items.map((item: any) => (
          <div key={item.id} className="flex gap-3">
            <div className="relative h-14 w-11 flex-shrink-0 overflow-hidden bg-white">
              {item.thumbnail ? (
                <Image src={item.thumbnail} alt={item.title} fill className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-brand-300 text-xs">
                  IMG
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-semibold uppercase tracking-wide text-brand-900 truncate">
                {item.title}
              </p>
              <p className="text-xs text-brand-400">
                {item.variant.title} &times; {item.quantity}
              </p>
            </div>
            <p className="text-sm font-bold text-brand-900">{formatRupiah(item.subtotal)}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 space-y-2 border-t border-brand-200 pt-5">
        <div className="flex justify-between text-sm">
          <span className="text-brand-500">Subtotal</span>
          <span className="text-brand-900">{formatRupiah(cart.subtotal)}</span>
        </div>

        {shippingCost && (
          <div className="flex justify-between text-sm">
            <span className="text-brand-500">
              Ongkir ({shippingCost.courier} {shippingCost.service})
            </span>
            <span className="text-brand-900">{formatRupiah(shippingCost.cost)}</span>
          </div>
        )}

        {cart.tax_total > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-brand-500">PPN</span>
            <span className="text-brand-900">{formatRupiah(cart.tax_total)}</span>
          </div>
        )}

        <div className="border-t border-brand-200 pt-3">
          <div className="flex justify-between">
            <span className="text-sm font-bold text-brand-900">Total</span>
            <span className="text-lg font-bold text-brand-900">{formatRupiah(grandTotal)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
