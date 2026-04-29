'use client'

import { useState } from 'react'
import { useCart } from '@/providers/cart-provider'
import { useAuth } from '@/providers/auth-provider'
import { formatRupiah } from '@/lib/utils'
import type { ShippingAddress, ShippingCost } from '@/app/(store)/checkout/page'
import type { CartItem } from '@/providers/cart-provider'

type Cart = {
  items: CartItem[]
  subtotal: number
  total: number
}

const LAST_ORDER_KEY = 'draven_last_order'

function waitForSnap(timeout = 10000): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && (window as any).snap) {
      resolve(true)
      return
    }
    const start = Date.now()
    const interval = setInterval(() => {
      if ((window as any).snap) {
        clearInterval(interval)
        resolve(true)
      } else if (Date.now() - start > timeout) {
        clearInterval(interval)
        resolve(false)
      }
    }, 200)
  })
}

export default function PaymentSection({
  cart,
  address,
  shippingCost,
  onBack,
}: {
  cart: Cart
  address: ShippingAddress
  shippingCost: ShippingCost
  onBack: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { clearCart } = useCart()
  const { user, addOrder } = useAuth()

  const grandTotal = cart.total + shippingCost.cost

  async function handlePayment() {
    setLoading(true)
    setError('')

    try {
      // 1. Wait for Midtrans Snap to load
      const snapReady = await waitForSnap()
      if (!snapReady) {
        setError('Payment gateway not loaded. Please refresh the page.')
        setLoading(false)
        return
      }

      // 2. Create transaction on server
      const orderId = `DRV-${Date.now()}`

      const items = cart.items.map((item) => ({
        id: item.id,
        name: item.title,
        price: item.price,
        quantity: item.quantity,
      }))

      items.push({
        id: 'shipping',
        name: `Shipping ${shippingCost.courier} ${shippingCost.service}`,
        price: shippingCost.cost,
        quantity: 1,
      })

      const res = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: orderId,
          gross_amount: grandTotal,
          customer_name: `${address.first_name} ${address.last_name}`.trim(),
          customer_phone: address.phone,
          items,
          // Full order data for Sanity persistence
          order_items: cart.items.map((item) => ({
            productTitle: item.title,
            variant: item.variant,
            quantity: item.quantity,
            price: item.price,
            thumbnail: item.thumbnail,
          })),
          subtotal: cart.subtotal,
          shipping_cost: shippingCost.cost,
          shipping_address: address.address_1,
          shipping_district: address.district,
          shipping_city: address.city,
          shipping_province: address.province,
          shipping_postal_code: address.postal_code,
          shipping_method: `${shippingCost.courier} ${shippingCost.service}`,
        }),
      })

      const data = await res.json()

      if (!data.token) {
        throw new Error(data.error || 'Failed to create transaction')
      }

      // 3. Save order BEFORE opening Snap (so it persists even if browser closes)
      if (user) {
        addOrder({
          items: cart.items.map((item) => ({
            title: item.title,
            variant: item.variant,
            quantity: item.quantity,
            price: item.price,
            thumbnail: item.thumbnail,
          })),
          subtotal: cart.subtotal,
          shipping_cost: shippingCost.cost,
          total: grandTotal,
          shipping_address: {
            name: `${address.first_name} ${address.last_name}`.trim(),
            address: address.address_1,
            city: address.city,
            province: address.province,
            phone: address.phone,
          },
          shipping_method: `${shippingCost.courier} ${shippingCost.service}`,
          status: 'pending',
        })
      }

      // 4. Store last order ID for success/pending pages
      localStorage.setItem(LAST_ORDER_KEY, orderId)

      // 5. Clear cart (order is already saved)
      clearCart()

      // 6. Open Snap popup
      ;(window as any).snap.pay(data.token, {
        onSuccess: () => {
          // Update order status to paid
          if (user) {
            updateLastOrderStatus('paid')
          }
          window.location.href = `/order/success?id=${orderId}`
        },
        onPending: () => {
          window.location.href = `/order/pending?id=${orderId}`
        },
        onError: () => {
          // Update order status to failed
          if (user) {
            updateLastOrderStatus('processing')
          }
          setError('Payment failed. Check your order status in Account > Orders.')
        },
        onClose: () => {
          // User closed popup — payment may or may not have been completed
          setError('Payment window closed. Check your order status in Account > Orders, or try again from your orders page.')
        },
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  function updateLastOrderStatus(status: 'paid' | 'pending' | 'processing') {
    if (!user) return
    // Get orders from localStorage and update the most recent one
    const key = `draven_orders_${user.id}`
    try {
      const raw = localStorage.getItem(key)
      if (!raw) return
      const orders = JSON.parse(raw)
      if (orders.length > 0) {
        orders[0].status = status
        localStorage.setItem(key, JSON.stringify(orders))
      }
    } catch {
      // Ignore
    }
  }

  return (
    <div>
      <h2 className="text-[13px] uppercase tracking-widest text-brand-950">
        Payment
      </h2>

      {/* Address & Shipping Summary */}
      <div className="mt-6 border-t border-brand-200 pt-6">
        <p className="text-[11px] uppercase tracking-widest text-brand-400">Shipping to</p>
        <div className="mt-2 text-sm text-brand-500">
          <p>{address.first_name} {address.last_name}</p>
          <p>{address.address_1}</p>
          <p>{address.district}, {address.city}, {address.province} {address.postal_code}</p>
          <p>{address.phone}</p>
        </div>

        <div className="mt-4 text-sm text-brand-500">
          <p>{shippingCost.description} · {formatRupiah(shippingCost.cost)}</p>
          <p className="text-xs text-brand-400">Est. {shippingCost.etd}</p>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="mt-8 border-t border-brand-200 pt-6">
        <p className="text-[11px] uppercase tracking-widest text-brand-400">Metode Pembayaran</p>

        <div className="mt-4 border border-brand-100 bg-brand-50/50 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center bg-brand-950 text-white">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-brand-950">Pembayaran Aman via Midtrans</p>
              <p className="mt-1.5 text-xs leading-relaxed text-brand-400">
                Setelah klik &quot;Pay Now&quot;, kamu akan memilih metode pembayaran di jendela Midtrans yang aman:
              </p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-brand-500">
                <span>QRIS (recommended)</span>
                <span>GoPay</span>
                <span>ShopeePay</span>
                <span>BCA VA</span>
                <span>BNI VA</span>
                <span>Mandiri</span>
                <span>Indomaret</span>
                <span>Alfamart</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Total */}
      <div className="mt-8 border-t border-brand-950 pt-6">
        <div className="flex items-baseline justify-between">
          <span className="text-[11px] uppercase tracking-widest text-brand-400">Total</span>
          <span className="text-xl font-medium text-brand-950">{formatRupiah(grandTotal)}</span>
        </div>
      </div>

      {error && (
        <div className="mt-4 border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="mt-8 flex gap-3">
        <button onClick={onBack} className="btn-secondary flex-1 py-4">
          Back
        </button>
        <button
          onClick={handlePayment}
          disabled={loading}
          className="btn-primary flex-1 py-4"
        >
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
      </div>
    </div>
  )
}
