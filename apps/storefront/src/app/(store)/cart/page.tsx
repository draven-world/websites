'use client'

import Link from 'next/link'
import CartItem from '@/components/cart/CartItem'
import CartSummary from '@/components/cart/CartSummary'
import { useCart } from '@/providers/cart-provider'

export default function CartPage() {
  const { cart, loading, totalItems } = useCart()

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-6 w-6 animate-spin border-2 border-brand-900 border-t-transparent" />
      </div>
    )
  }

  if (!cart || totalItems === 0) {
    return (
      <div className="mx-auto max-w-[1400px] px-5 py-24 text-center lg:px-8">
        <svg className="mx-auto mb-6 h-16 w-16 text-brand-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <h1 className="text-xl font-bold uppercase tracking-wide text-brand-900">
          Keranjang Kosong
        </h1>
        <p className="mt-2 text-sm text-brand-400">
          Belum ada produk di keranjang belanja kamu
        </p>
        <Link href="/products" className="btn-primary mt-8 inline-flex">
          MULAI BELANJA
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-8 lg:px-8 lg:py-12">
      <h1 className="mb-8 text-2xl font-bold text-brand-900">
        Cart ({totalItems})
      </h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="divide-y divide-brand-100 border border-brand-100 bg-white">
            {cart.items.map((item: any) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
        </div>
        <div>
          <CartSummary cart={cart} />
        </div>
      </div>
    </div>
  )
}
