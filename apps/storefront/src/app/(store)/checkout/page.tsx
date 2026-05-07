'use client'

import { useState } from 'react'
import { useCart } from '@/providers/cart-provider'
import ShippingForm from '@/components/checkout/ShippingForm'
import ShippingOptions from '@/components/checkout/ShippingOptions'
import OrderSummary from '@/components/checkout/OrderSummary'
import PaymentSection from '@/components/checkout/PaymentSection'
import Link from 'next/link'
import { formatRupiah } from '@/lib/utils'

export type ShippingAddress = {
  first_name: string
  last_name: string
  phone: string
  address_1: string
  city: string
  city_id: string
  district: string
  district_id: string
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

function Section({
  number,
  title,
  children,
}: {
  number: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="mt-16 pt-8 border-t border-ink-700">
      <div className="flex items-baseline gap-4 mb-6">
        <span className="text-[clamp(1.5rem,3.5vw,2.5rem)] font-bold text-ink-500 leading-none">
          {number}
        </span>
        <span className="text-[0.75rem] uppercase tracking-[0.15em] text-ink-300">
          / {title}
        </span>
      </div>
      {children}
    </section>
  )
}

export default function CheckoutPage() {
  const { cart, totalItems, loading } = useCart()
  const [step, setStep] = useState<CheckoutStep>('shipping')
  const [address, setAddress] = useState<ShippingAddress | null>(null)
  const [shippingCost, setShippingCost] = useState<ShippingCost | null>(null)

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-5 w-5 animate-spin border-2 border-ink-100 border-t-transparent" />
      </div>
    )
  }

  if (totalItems === 0) {
    return (
      <div className="mx-auto max-w-2xl px-8 pt-32 lg:pt-40 pb-32 text-center">
        <h1 className="text-2xl font-bold tracking-tighter uppercase text-ink-100">
          Your bag is empty
        </h1>
        <p className="mt-3 text-sm text-ink-500">
          Add something before checking out.
        </p>
        <Link href="/products" className="btn-primary mt-8 inline-flex">
          Shop Now
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl px-8 pt-32 lg:pt-40 pb-32 mx-auto">
      <h1
        className="font-bold uppercase tracking-tighter text-ink-100"
        style={{ fontSize: 'clamp(2rem,5vw,4rem)' }}
      >
        CHECKOUT
      </h1>

      {/* Collapsible order summary */}
      <div className="mt-8">
        <OrderSummary cart={cart} shippingCost={shippingCost} collapsible />
      </div>

      {/* 01 / CONTACT */}
      <Section number="01" title="CONTACT">
        {step === 'shipping' ? (
          <ShippingForm
            onSubmit={(addr) => {
              setAddress(addr)
              setStep('delivery')
            }}
          />
        ) : address ? (
          <div className="flex items-start justify-between">
            <div className="text-sm text-ink-300 space-y-0.5">
              <p className="text-ink-100">
                {address.first_name} {address.last_name}
              </p>
              <p>{address.phone}</p>
              <p>{address.address_1}</p>
              <p>
                {address.district}, {address.city}, {address.province}{' '}
                {address.postal_code}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setStep('shipping')}
              className="text-[0.75rem] uppercase tracking-[0.15em] text-ink-500 hover:text-ink-100 transition-colors ml-8 flex-shrink-0"
            >
              Edit
            </button>
          </div>
        ) : null}
      </Section>

      {/* 02 / SHIPPING METHOD — shown after address is confirmed */}
      {(step === 'delivery' || step === 'payment') && address && (
        <Section number="02" title="SHIPPING METHOD">
          {step === 'delivery' ? (
            <ShippingOptions
              address={address}
              destinationId={address.district_id}
              cartWeight={
                cart.items.reduce((sum, item) => sum + 200 * item.quantity, 0) ||
                1000
              }
              onSelect={(cost) => {
                setShippingCost(cost)
                setStep('payment')
              }}
              onBack={() => setStep('shipping')}
              hideBack
            />
          ) : shippingCost ? (
            <div className="flex items-start justify-between">
              <div className="text-sm text-ink-300">
                <p className="text-ink-100">{shippingCost.description}</p>
                <p className="mt-0.5 text-ink-500">
                  {formatRupiah(shippingCost.cost)} · Est. {shippingCost.etd}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setStep('delivery')}
                className="text-[0.75rem] uppercase tracking-[0.15em] text-ink-500 hover:text-ink-100 transition-colors ml-8 flex-shrink-0"
              >
                Edit
              </button>
            </div>
          ) : null}
        </Section>
      )}

      {/* 03 / PAYMENT — shown after shipping method is selected */}
      {step === 'payment' && address && shippingCost && (
        <Section number="03" title="PAYMENT">
          <PaymentSection
            cart={cart}
            address={address}
            shippingCost={shippingCost}
            onBack={() => setStep('delivery')}
            hideBack
          />
        </Section>
      )}
    </div>
  )
}
