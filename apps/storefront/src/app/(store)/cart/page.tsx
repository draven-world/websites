'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/providers/cart-provider'
import { formatRupiah } from '@/lib/utils'

export default function CartPage() {
  const { cart, loading, totalItems, updateQuantity, removeItem } = useCart()

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-5 w-5 animate-spin border-2 border-brand-950 border-t-transparent" />
      </div>
    )
  }

  if (totalItems === 0) {
    return (
      <div className="mx-auto max-w-container px-5 py-32 text-center lg:px-8">
        <h1 className="text-2xl font-medium tracking-tightest text-brand-950">
          Your bag is empty
        </h1>
        <p className="mt-3 text-sm text-brand-400">
          Add something you love.
        </p>
        <Link href="/products" className="btn-primary mt-8 inline-flex">
          Shop Now
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-container px-5 py-10 lg:px-8 lg:py-16">
      <h1 className="text-2xl font-medium tracking-tightest text-brand-950 md:text-3xl">
        Bag ({totalItems})
      </h1>

      <div className="mt-10 grid gap-12 lg:grid-cols-3">
        {/* Items */}
        <div className="lg:col-span-2">
          <div className="divide-y divide-brand-100">
            {cart.items.map((item) => (
              <div key={item.id} className="flex gap-5 py-6">
                {/* Thumbnail */}
                <Link href={`/products/${item.handle}`} className="relative h-28 w-22 flex-shrink-0 overflow-hidden bg-brand-100">
                  {item.thumbnail ? (
                    <Image src={item.thumbnail} alt={item.title} fill className="object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="text-[9px] uppercase tracking-widest text-brand-300">No img</span>
                    </div>
                  )}
                </Link>

                {/* Info */}
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between">
                    <div>
                      <Link href={`/products/${item.handle}`} className="text-sm font-medium tracking-tight text-brand-950 hover:opacity-60">
                        {item.title}
                      </Link>
                      <p className="mt-0.5 text-xs text-brand-400">{item.variant}</p>
                    </div>
                    <p className="text-sm text-brand-950">{formatRupiah(item.price * item.quantity)}</p>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-4">
                    {/* Quantity */}
                    <div className="flex items-center gap-0">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="px-3 py-1.5 text-sm text-brand-400 transition-colors hover:text-brand-950 disabled:opacity-20"
                      >
                        −
                      </button>
                      <span className="min-w-[2rem] text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-1.5 text-sm text-brand-400 transition-colors hover:text-brand-950"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-[11px] uppercase tracking-widest text-brand-400 transition-colors hover:text-brand-950"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div>
          <div className="border-t border-brand-950 pt-6">
            <div className="flex justify-between text-sm">
              <span className="text-brand-400">Subtotal</span>
              <span className="text-brand-950">{formatRupiah(cart.subtotal)}</span>
            </div>
            <div className="mt-2 flex justify-between text-sm">
              <span className="text-brand-400">Shipping</span>
              <span className="text-brand-400">Calculated at checkout</span>
            </div>

            <div className="mt-6 border-t border-brand-200 pt-4">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-brand-950">Total</span>
                <span className="text-lg font-medium text-brand-950">{formatRupiah(cart.total)}</span>
              </div>
            </div>

            <Link href="/checkout" className="btn-primary mt-6 block w-full py-4 text-center">
              Checkout
            </Link>

            <Link
              href="/products"
              className="mt-4 block text-center text-[11px] uppercase tracking-widest text-brand-400 transition-colors hover:text-brand-950"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
