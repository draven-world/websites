'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('id')

  return (
    <div className="mx-auto max-w-md px-5 py-32 text-center">
      <div className="mx-auto mb-8 flex h-14 w-14 items-center justify-center bg-brand-950">
        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-2xl font-medium tracking-tightest text-brand-950">
        Order Confirmed
      </h1>

      {orderId && (
        <p className="mt-3 font-mono text-sm text-brand-400">{orderId}</p>
      )}

      <p className="mt-4 text-sm leading-relaxed text-brand-400">
        Thank you for shopping with DRAVEN. Your payment has been confirmed and we&apos;re processing your order.
      </p>
      <p className="mt-2 text-sm text-brand-400">
        You&apos;ll receive a WhatsApp notification with order updates.
      </p>

      <div className="mt-12 flex flex-col gap-4">
        <Link href="/products" className="btn-primary py-4">
          Continue Shopping
        </Link>
        <Link
          href="/account/orders"
          className="text-[11px] uppercase tracking-widest text-brand-400 transition-colors hover:text-brand-950"
        >
          View Orders
        </Link>
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-5 w-5 animate-spin border-2 border-brand-950 border-t-transparent" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
