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
  collapsible = false,
}: {
  cart: Cart
  shippingCost: ShippingCost | null
  collapsible?: boolean
}) {
  const grandTotal = cart.total + (shippingCost?.cost || 0)

  if (collapsible) {
    return (
      <details className="bg-ink-900 border border-ink-700 px-5 py-4">
        <summary className="cursor-pointer flex items-center justify-between text-[0.75rem] uppercase tracking-[0.15em] text-ink-100">
          <span>
            {cart.items.length} ITEMS · TOTAL {formatRupiah(grandTotal)}
          </span>
          <span className="text-ink-500">SHOW DETAILS ▾</span>
        </summary>
        <div className="mt-4 flex flex-col gap-2">
          {cart.items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between text-sm text-ink-300"
            >
              <span>
                {item.title} × {item.quantity}
              </span>
              <span>{formatRupiah(item.price * item.quantity)}</span>
            </div>
          ))}
          {shippingCost && (
            <div className="flex justify-between text-sm text-ink-300 border-t border-ink-700 mt-2 pt-2">
              <span>
                Shipping ({shippingCost.courier} {shippingCost.service})
              </span>
              <span>{formatRupiah(shippingCost.cost)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm text-ink-100 border-t border-ink-700 mt-1 pt-2">
            <span className="uppercase tracking-[0.1em]">Total</span>
            <span className="font-bold">{formatRupiah(grandTotal)}</span>
          </div>
        </div>
      </details>
    )
  }

  return (
    <div className="bg-ink-900 border border-ink-700 p-6">
      <h2 className="text-[0.75rem] uppercase tracking-[0.15em] text-ink-300 mb-5">
        Order Summary
      </h2>

      <div className="space-y-4">
        {cart.items.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div className="relative h-16 w-12 flex-shrink-0 overflow-hidden bg-ink-800">
              {item.thumbnail ? (
                <Image
                  src={item.thumbnail}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-[8px] uppercase tracking-widest text-ink-500">
                    No img
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm text-ink-100">{item.title}</p>
              <p className="text-xs text-ink-500">
                {item.variant} × {item.quantity}
              </p>
            </div>
            <p className="text-sm text-ink-100">
              {formatRupiah(item.price * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-2 border-t border-ink-700 pt-5">
        <div className="flex justify-between text-sm">
          <span className="text-ink-500">Subtotal</span>
          <span className="text-ink-100">{formatRupiah(cart.subtotal)}</span>
        </div>

        {shippingCost && (
          <div className="flex justify-between text-sm">
            <span className="text-ink-500">
              Shipping ({shippingCost.courier} {shippingCost.service})
            </span>
            <span className="text-ink-100">{formatRupiah(shippingCost.cost)}</span>
          </div>
        )}

        <div className="border-t border-ink-700 pt-3">
          <div className="flex justify-between">
            <span className="text-sm font-medium text-ink-100">Total</span>
            <span className="text-lg font-bold text-ink-100">
              {formatRupiah(grandTotal)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
