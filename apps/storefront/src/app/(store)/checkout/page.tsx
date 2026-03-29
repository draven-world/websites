'use client'

import { useState } from 'react'
import { useCart } from '@/providers/cart-provider'
import ShippingForm from '@/components/checkout/ShippingForm'
import ShippingOptions from '@/components/checkout/ShippingOptions'
import OrderSummary from '@/components/checkout/OrderSummary'
import PaymentSection from '@/components/checkout/PaymentSection'
import Link from 'next/link'

export type ShippingAddress = {
  first_name: string
  last_name: string
  phone: string
  address_1: string
  city: string
  city_id: string
  province: string
  province_id: string
  postal_code: string
}

export type ShippingCost = {
  service: string
  description: string
  cost: number
  etd: string
  courier: string
}

type CheckoutStep = 'shipping' | 'delivery' | 'payment'

export default function CheckoutPage() {
  const { cart, totalItems } = useCart()
  const [step, setStep] = useState<CheckoutStep>('shipping')
  const [address, setAddress] = useState<ShippingAddress | null>(null)
  const [shippingCost, setShippingCost] = useState<ShippingCost | null>(null)

  if (totalItems === 0) {
    return (
      <div className="mx-auto max-w-[1400px] px-5 py-24 text-center lg:px-8">
        <h1 className="text-xl font-bold uppercase tracking-wide text-brand-900">
          Keranjang Kosong
        </h1>
        <p className="mt-2 text-sm text-brand-400">
          Tambahkan produk ke keranjang sebelum checkout
        </p>
        <Link href="/products" className="btn-primary mt-8 inline-flex">
          BELANJA SEKARANG
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-8 lg:px-8 lg:py-12">
      <h1 className="mb-8 text-2xl font-bold text-brand-900">Checkout</h1>

      {/* Progress Steps */}
      <div className="mb-10 flex items-center gap-3 text-xs">
        {(['shipping', 'delivery', 'payment'] as const).map((s, i) => {
          const labels = ['ALAMAT', 'PENGIRIMAN', 'PEMBAYARAN']
          const isActive = s === step
          const isDone =
            (s === 'shipping' && (step === 'delivery' || step === 'payment')) ||
            (s === 'delivery' && step === 'payment')

          return (
            <div key={s} className="flex items-center gap-3">
              {i > 0 && <div className="h-px w-8 bg-brand-200" />}
              <span
                className={`flex h-7 w-7 items-center justify-center text-[11px] font-bold ${
                  isDone
                    ? 'bg-brand-900 text-white'
                    : isActive
                      ? 'border-2 border-brand-900 text-brand-900'
                      : 'border border-brand-200 text-brand-400'
                }`}
              >
                {isDone ? '\u2713' : i + 1}
              </span>
              <span
                className={`font-semibold uppercase tracking-wider ${
                  isActive || isDone ? 'text-brand-900' : 'text-brand-300'
                }`}
              >
                {labels[i]}
              </span>
            </div>
          )
        })}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {step === 'shipping' && (
            <ShippingForm
              onSubmit={(addr) => {
                setAddress(addr)
                setStep('delivery')
              }}
            />
          )}

          {step === 'delivery' && address && (
            <ShippingOptions
              address={address}
              cartWeight={cart?.items?.reduce(
                (sum: number, item: any) => sum + (item.variant?.product?.weight || 200) * item.quantity,
                0,
              ) || 1000}
              onSelect={(cost) => {
                setShippingCost(cost)
                setStep('payment')
              }}
              onBack={() => setStep('shipping')}
            />
          )}

          {step === 'payment' && address && shippingCost && cart && (
            <PaymentSection
              cart={cart}
              address={address}
              shippingCost={shippingCost}
              onBack={() => setStep('delivery')}
            />
          )}
        </div>

        <div>
          <OrderSummary cart={cart} shippingCost={shippingCost} />
        </div>
      </div>
    </div>
  )
}
