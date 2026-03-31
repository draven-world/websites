'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState, useCallback, Suspense } from 'react'
import Link from 'next/link'

function PendingContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams.get('id') || getLastOrderId()
  const [status, setStatus] = useState<string>('pending')
  const [checking, setChecking] = useState(false)

  const checkStatus = useCallback(async () => {
    if (!orderId) return
    setChecking(true)
    try {
      const res = await fetch(`/api/payment/status?order_id=${orderId}`)
      const data = await res.json()

      if (data.status === 'paid') {
        setStatus('paid')
        // Update local order if user is logged in
        updateLocalOrderStatus(orderId, 'paid')
        setTimeout(() => router.push(`/order/success?id=${orderId}`), 1500)
      } else if (data.status === 'failed') {
        setStatus('failed')
        updateLocalOrderStatus(orderId, 'pending')
      } else if (data.status === 'expired') {
        setStatus('expired')
        updateLocalOrderStatus(orderId, 'pending')
      }
    } catch {
      // Ignore errors, keep polling
    } finally {
      setChecking(false)
    }
  }, [orderId, router])

  // Poll every 10 seconds
  useEffect(() => {
    if (!orderId) return
    checkStatus()
    const interval = setInterval(checkStatus, 10000)
    return () => clearInterval(interval)
  }, [orderId, checkStatus])

  return (
    <div className="mx-auto max-w-md px-5 py-32 text-center">
      {status === 'paid' ? (
        <>
          <div className="mx-auto mb-8 flex h-14 w-14 items-center justify-center bg-brand-950">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-medium tracking-tightest text-brand-950">
            Payment Confirmed
          </h1>
          <p className="mt-4 text-sm text-brand-400">Redirecting...</p>
        </>
      ) : status === 'expired' ? (
        <>
          <div className="mx-auto mb-8 flex h-14 w-14 items-center justify-center border border-brand-300">
            <svg className="h-6 w-6 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-medium tracking-tightest text-brand-950">
            Payment Expired
          </h1>
          {orderId && <p className="mt-3 font-mono text-sm text-brand-400">{orderId}</p>}
          <p className="mt-4 text-sm text-brand-400">
            The payment deadline has passed. Please place a new order.
          </p>
          <div className="mt-12 flex flex-col gap-4">
            <Link href="/products" className="btn-primary py-4">
              Shop Again
            </Link>
          </div>
        </>
      ) : status === 'failed' ? (
        <>
          <div className="mx-auto mb-8 flex h-14 w-14 items-center justify-center border border-red-300">
            <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-medium tracking-tightest text-brand-950">
            Payment Failed
          </h1>
          {orderId && <p className="mt-3 font-mono text-sm text-brand-400">{orderId}</p>}
          <p className="mt-4 text-sm text-brand-400">
            Your payment could not be processed. Please try again.
          </p>
          <div className="mt-12 flex flex-col gap-4">
            <Link href="/products" className="btn-primary py-4">
              Back to Shop
            </Link>
          </div>
        </>
      ) : (
        <>
          <div className="mx-auto mb-8 flex h-14 w-14 items-center justify-center border border-brand-950">
            <svg className="h-6 w-6 text-brand-950 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <h1 className="text-2xl font-medium tracking-tightest text-brand-950">
            Awaiting Payment
          </h1>

          {orderId && <p className="mt-3 font-mono text-sm text-brand-400">{orderId}</p>}

          <p className="mt-4 text-sm leading-relaxed text-brand-400">
            Your order has been created. Please complete payment before the deadline.
          </p>
          <p className="mt-2 text-sm text-brand-400">
            Once confirmed, you&apos;ll receive a WhatsApp notification.
          </p>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-brand-400">
            {checking ? (
              <>
                <div className="h-3 w-3 animate-spin border border-brand-400 border-t-transparent rounded-full" />
                Checking payment status...
              </>
            ) : (
              <>
                <div className="h-1.5 w-1.5 rounded-full bg-brand-300 animate-pulse" />
                Auto-checking every 10 seconds
              </>
            )}
          </div>

          <div className="mt-12 flex flex-col gap-4">
            <button
              onClick={checkStatus}
              disabled={checking}
              className="btn-primary py-4"
            >
              {checking ? 'Checking...' : 'Check Status Now'}
            </button>
            <Link href="/products" className="btn-secondary py-4">
              Continue Shopping
            </Link>
            <Link
              href="/account/orders"
              className="text-[11px] uppercase tracking-widest text-brand-400 transition-colors hover:text-brand-950"
            >
              View Orders
            </Link>
          </div>
        </>
      )}
    </div>
  )
}

function getLastOrderId(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('draven_last_order')
}

function updateLocalOrderStatus(orderId: string, status: string) {
  if (typeof window === 'undefined') return
  try {
    const sessionEmail = localStorage.getItem('draven_session')
    if (!sessionEmail) return
    const usersRaw = localStorage.getItem('draven_users')
    if (!usersRaw) return
    const users = JSON.parse(usersRaw)
    const user = users.find((u: any) => u.email === sessionEmail)
    if (!user) return
    const key = `draven_orders_${user.id}`
    const ordersRaw = localStorage.getItem(key)
    if (!ordersRaw) return
    const orders = JSON.parse(ordersRaw)
    const order = orders.find((o: any) => o.id === orderId)
    if (order) {
      order.status = status
      localStorage.setItem(key, JSON.stringify(orders))
    }
  } catch {
    // Ignore
  }
}

export default function OrderPendingPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-5 w-5 animate-spin border-2 border-brand-950 border-t-transparent" />
      </div>
    }>
      <PendingContent />
    </Suspense>
  )
}
