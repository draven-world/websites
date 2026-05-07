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
    <div className="min-h-screen flex items-center justify-center px-8">
      <div className="w-full max-w-md text-center">
        {status === 'paid' ? (
          <>
            <h1 className="text-[clamp(1.5rem,3.5vw,2.5rem)] uppercase font-bold tracking-tighter text-ink-100 leading-[1.05]">
              PAYMENT CONFIRMED
            </h1>
            {orderId && <p className="mt-4 text-sm text-ink-300">Order #{orderId}</p>}
            <p className="mt-4 text-[0.75rem] uppercase tracking-[0.15em] text-ink-500">
              REDIRECTING…
            </p>
          </>
        ) : status === 'expired' ? (
          <>
            <h1 className="text-[clamp(1.5rem,3.5vw,2.5rem)] uppercase font-bold tracking-tighter text-ink-100 leading-[1.05]">
              PAYMENT EXPIRED
            </h1>
            {orderId && <p className="mt-4 text-sm text-ink-300">Order #{orderId}</p>}
            <p className="mt-3 text-[0.75rem] uppercase tracking-[0.15em] text-ink-500">
              BATAS WAKTU PEMBAYARAN TELAH BERLALU. SILAKAN BUAT PESANAN BARU.
            </p>
            <div className="mt-12">
              <Link href="/products" className="btn-primary inline-flex">
                SHOP AGAIN
              </Link>
            </div>
          </>
        ) : status === 'failed' ? (
          <>
            <h1 className="text-[clamp(1.5rem,3.5vw,2.5rem)] uppercase font-bold tracking-tighter text-ink-100 leading-[1.05]">
              PAYMENT FAILED
            </h1>
            {orderId && <p className="mt-4 text-sm text-ink-300">Order #{orderId}</p>}
            <p className="mt-3 text-[0.75rem] uppercase tracking-[0.15em] text-ink-500">
              PEMBAYARAN GAGAL DIPROSES. SILAKAN COBA LAGI.
            </p>
            <div className="mt-12">
              <Link href="/products" className="btn-primary inline-flex">
                BACK TO SHOP
              </Link>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-[clamp(1.5rem,3.5vw,2.5rem)] uppercase font-bold tracking-tighter text-ink-100 leading-[1.05]">
              PAYMENT PENDING
            </h1>
            {orderId && <p className="mt-4 text-sm text-ink-300">Order #{orderId}</p>}
            <p className="mt-3 text-[0.75rem] uppercase tracking-[0.15em] text-ink-500">
              PESANAN TELAH DIBUAT. SELESAIKAN PEMBAYARAN SEBELUM BATAS WAKTU.
            </p>
            <p className="mt-2 text-[0.75rem] uppercase tracking-[0.15em] text-ink-500">
              KONFIRMASI AKAN DIKIRIM VIA WHATSAPP.
            </p>

            <div className="mt-6 flex items-center justify-center gap-2 text-[0.75rem] uppercase tracking-[0.15em] text-ink-400">
              {checking ? (
                <>
                  <div className="h-3 w-3 animate-spin border border-ink-400 border-t-transparent rounded-full" />
                  CHECKING STATUS…
                </>
              ) : (
                <>
                  <div className="h-1.5 w-1.5 rounded-full bg-ink-500 animate-pulse" />
                  AUTO-CHECK EVERY 10 SECONDS
                </>
              )}
            </div>

            <div className="mt-12 flex flex-col gap-4 items-center">
              <button
                onClick={checkStatus}
                disabled={checking}
                className="btn-primary w-full"
              >
                {checking ? 'CHECKING…' : 'CHECK STATUS NOW'}
              </button>
              <Link href="/products" className="btn-ghost w-full">
                CONTINUE SHOPPING
              </Link>
              <Link
                href="/account/orders"
                className="text-[0.75rem] uppercase tracking-[0.15em] text-ink-400 hover:text-accent-lime transition-colors"
              >
                VIEW ORDERS →
              </Link>
            </div>
          </>
        )}
      </div>
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
    const user = users.find((u: { email: string }) => u.email === sessionEmail)
    if (!user) return
    const key = `draven_orders_${user.id}`
    const ordersRaw = localStorage.getItem(key)
    if (!ordersRaw) return
    const orders = JSON.parse(ordersRaw)
    const order = orders.find((o: { id: string }) => o.id === orderId)
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
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-5 w-5 animate-spin border-2 border-ink-100 border-t-transparent" />
        </div>
      }
    >
      <PendingContent />
    </Suspense>
  )
}
