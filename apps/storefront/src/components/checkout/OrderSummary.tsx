'use client'

import Image from 'next/image'
import { formatRupiah } from '@/lib/utils'
import type { ShippingCost } from '@/app/(store)/checkout/page'
import type { CartItem } from '@/providers/cart-provider'

type Cart = {
  items: CartItem[]
  subtotal: number
  total: number
}

export default function OrderSummary({
  cart,
  shippingCost,
}: {
  cart: Cart
  shippingCost: ShippingCost | null
}) {
  const grandTotal = cart.total + (shippingCost?.cost || 0)

  return (
    <div className="border-t border-brand-950 pt-6">
      <h2 className="text-[13px] uppercase tracking-widest text-brand-950">
        Order Summary
      </h2>

      <div className="mt-5 space-y-4">
        {cart.items.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div className="relative h-16 w-12 flex-shrink-0 overflow-hidden bg-brand-100">
              {item.thumbnail ? (
                <Image src={item.thumbnail} alt={item.title} fill className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-[8px] uppercase tracking-widest text-brand-300">No img</span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm text-brand-950">{item.title}</p>
              <p className="text-xs text-brand-400">
                {item.variant} × {item.quantity}
              </p>
            </div>
            <p className="text-sm text-brand-950">{formatRupiah(item.price * item.quantity)}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-2 border-t border-brand-200 pt-5">
        <div className="flex justify-between text-sm">
          <span className="text-brand-400">Subtotal</span>
          <span className="text-brand-950">{formatRupiah(cart.subtotal)}</span>
        </div>

        {shippingCost && (
          <div className="flex justify-between text-sm">
            <span className="text-brand-400">
              Shipping ({shippingCost.courier} {shippingCost.service})
            </span>
            <span className="text-brand-950">{formatRupiah(shippingCost.cost)}</span>
          </div>
        )}

        <div className="border-t border-brand-200 pt-3">
          <div className="flex justify-between">
            <span className="text-sm font-medium text-brand-950">Total</span>
            <span className="text-lg font-medium text-brand-950">{formatRupiah(grandTotal)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
