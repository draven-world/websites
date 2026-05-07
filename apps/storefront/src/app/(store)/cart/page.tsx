'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/providers/cart-provider'
import { formatRupiah } from '@/lib/utils'
import LeaderRow from '@/components/ui/LeaderRow'

export default function CartPage() {
  const { cart, loading, updateQuantity, removeItem } = useCart()
  const items = cart.items

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-5 w-5 animate-spin border-2 border-ink-100 border-t-transparent" />
      </div>
    )
  }

  if (!items?.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-8">
        <h1 className="text-[clamp(2rem,5vw,4rem)] uppercase font-bold tracking-tighter text-ink-100 leading-none">
          BAG IS EMPTY
        </h1>
        <Link
          href="/products"
          className="mt-8 text-[0.8125rem] uppercase tracking-[0.18em] text-ink-300 hover:text-accent-lime transition-colors"
        >
          CONTINUE SHOPPING →
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-8 pt-32 lg:pt-40 pb-32">
      <h1 className="text-[clamp(2rem,5vw,4rem)] uppercase font-bold tracking-tighter text-ink-100 leading-none">
        BAG
      </h1>
      <p className="mt-2 text-[0.75rem] uppercase tracking-[0.15em] text-ink-500">
        {items.length} ITEM{items.length !== 1 ? 'S' : ''}
      </p>

      <div className="mt-12 border-t border-ink-700">
        {items.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-[80px_1fr_auto] lg:grid-cols-[100px_1fr_auto] gap-6 py-6 border-b border-ink-700"
          >
            {/* Thumbnail */}
            <div className="relative aspect-[4/5] bg-ink-900">
              {item.thumbnail && (
                <Image
                  src={item.thumbnail}
                  alt={item.title}
                  fill
                  className="object-contain"
                  sizes="100px"
                />
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col gap-2">
              <p className="text-sm font-bold uppercase text-ink-100">{item.title}</p>
              {item.variant && (
                <p className="text-[0.75rem] uppercase tracking-[0.15em] text-ink-300">
                  {item.variant}
                </p>
              )}
              <button
                onClick={() => removeItem(item.id)}
                className="text-[0.75rem] uppercase tracking-[0.15em] text-ink-500 hover:text-accent-lime transition-colors mt-auto self-start"
              >
                REMOVE
              </button>
            </div>

            {/* Quantity + Price */}
            <div className="flex flex-col items-end justify-between gap-2">
              <div className="flex items-center gap-3 text-sm text-ink-100 font-bold">
                <button
                  onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                  aria-label="Decrease quantity"
                  className="hover:text-accent-lime transition-colors w-4 text-center"
                >
                  −
                </button>
                <span className="w-6 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  aria-label="Increase quantity"
                  className="hover:text-accent-lime transition-colors w-4 text-center"
                >
                  +
                </button>
              </div>
              <p className="text-sm font-bold text-ink-100">
                {formatRupiah(item.price * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="mt-12 flex flex-col gap-3">
        <LeaderRow label="Subtotal" value={formatRupiah(cart.subtotal)} />
        <LeaderRow label="Shipping" value="CALCULATED AT CHECKOUT" />
        <LeaderRow label="Total" value={formatRupiah(cart.total)} emphasis />
      </div>

      <Link href="/checkout" className="mt-12 btn-primary w-full block text-center">
        CHECKOUT
      </Link>

      <Link
        href="/products"
        className="mt-6 block text-center text-[0.75rem] uppercase tracking-[0.15em] text-ink-500 hover:text-accent-lime transition-colors"
      >
        CONTINUE SHOPPING →
      </Link>
    </div>
  )
}
