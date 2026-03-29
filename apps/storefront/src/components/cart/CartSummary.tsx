'use client'

import Link from 'next/link'
import { formatRupiah } from '@/lib/utils'

type Cart = {
  subtotal: number
  tax_total: number
  shipping_total: number
  discount_total: number
  total: number
}

export default function CartSummary({ cart }: { cart: Cart }) {
  return (
    <div className="border border-brand-100 bg-brand-50 p-6">
      <h2 className="mb-5 text-sm font-bold uppercase tracking-wider text-brand-900">
        Ringkasan Belanja
      </h2>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-brand-500">Subtotal</span>
          <span className="text-brand-900">{formatRupiah(cart.subtotal)}</span>
        </div>

        {cart.discount_total > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-brand-500">Diskon</span>
            <span className="text-green-600">-{formatRupiah(cart.discount_total)}</span>
          </div>
        )}

        {cart.shipping_total > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-brand-500">Ongkos Kirim</span>
            <span className="text-brand-900">{formatRupiah(cart.shipping_total)}</span>
          </div>
        )}

        {cart.tax_total > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-brand-500">PPN (11%)</span>
            <span className="text-brand-900">{formatRupiah(cart.tax_total)}</span>
          </div>
        )}

        <div className="border-t border-brand-200 pt-3">
          <div className="flex justify-between">
            <span className="text-sm font-bold text-brand-900">Total</span>
            <span className="text-lg font-bold text-brand-900">{formatRupiah(cart.total)}</span>
          </div>
        </div>
      </div>

      <Link href="/checkout" className="btn-primary mt-6 block w-full py-4 text-center">
        CHECKOUT
      </Link>

      <Link
        href="/products"
        className="mt-3 block w-full text-center text-xs font-semibold uppercase tracking-wider text-brand-400 transition-colors hover:text-brand-900"
      >
        Lanjut Belanja
      </Link>
    </div>
  )
}
