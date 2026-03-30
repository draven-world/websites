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
  const { cart, totalItems, loading } = useCart()
  const [step, setStep] = useState<CheckoutStep>('shipping')
  const [address, setAddress] = useState<ShippingAddress | null>(null)
  const [shippingCost, setShippingCost] = useState<ShippingCost | null>(null)

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
          Add something before checking out.
        </p>
        <Link href="/products" className="btn-primary mt-8 inline-flex">
          Shop Now
        </Link>
      </div>
    )
  }

  const stepLabels = ['Address', 'Shipping', 'Payment'] as const
  const steps = ['shipping', 'delivery', 'payment'] as const

  return (
    <div className="mx-auto max-w-container px-5 py-10 lg:px-8 lg:py-16">
      <h1 className="text-2xl font-medium tracking-tightest text-brand-950 md:text-3xl">
        Checkout
      </h1>

      {/* Progress */}
      <div className="mt-8 flex items-center gap-4 text-[11px] uppercase tracking-widest">
        {steps.map((s, i) => {
          const isActive = s === step
          const isDone =
            (s === 'shipping' && (step === 'delivery' || step === 'payment')) ||
            (s === 'delivery' && step === 'payment')

          return (
            <div key={s} className="flex items-center gap-4">
              {i > 0 && <div className="h-px w-6 bg-brand-200" />}
              <span
                className={`flex h-6 w-6 items-center justify-center text-[10px] ${
                  isDone
                    ? 'bg-brand-950 text-white'
                    : isActive
                      ? 'border border-brand-950 text-brand-950'
                      : 'border border-brand-200 text-brand-300'
                }`}
              >
                {isDone ? '✓' : i + 1}
              </span>
              <span className={isDone || isActive ? 'text-brand-950' : 'text-brand-300'}>
                {stepLabels[i]}
              </span>
            </div>
          )
        })}
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-3">
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
              cartWeight={cart.items.reduce(
                (sum, item) => sum + 200 * item.quantity,
                0,
              ) || 1000}
              onSelect={(cost) => {
                setShippingCost(cost)
                setStep('payment')
              }}
              onBack={() => setStep('shipping')}
            />
          )}

          {step === 'payment' && address && shippingCost && (
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
