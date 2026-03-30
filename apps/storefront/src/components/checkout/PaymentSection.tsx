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
        }),
      })

      const data = await res.json()

      if (!data.token) {
        throw new Error(data.error || 'Failed to create transaction')
      }

      if (typeof window !== 'undefined' && (window as any).snap) {
        ;(window as any).snap.pay(data.token, {
          onSuccess: () => {
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
                status: 'paid',
              })
            }
            clearCart()
            window.location.href = '/order/success'
          },
          onPending: () => {
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
            window.location.href = '/order/pending'
          },
          onError: () => {
            setError('Payment failed. Please try again.')
          },
          onClose: () => {
            setError('Payment window closed. Try again if you haven\'t paid.')
          },
        })
      } else {
        setError('Payment gateway not loaded. Refresh the page and try again.')
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setError(message)
    } finally {
      setLoading(false)
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
          <p>{address.city}, {address.province} {address.postal_code}</p>
          <p>{address.phone}</p>
        </div>

        <div className="mt-4 text-sm text-brand-500">
          <p>{shippingCost.courier} — {shippingCost.service} · {formatRupiah(shippingCost.cost)}</p>
          <p className="text-xs text-brand-400">Est. {shippingCost.etd} days</p>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="mt-8 border-t border-brand-200 pt-6">
        <p className="text-[11px] uppercase tracking-widest text-brand-400">Available Methods</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {['QRIS', 'GoPay', 'ShopeePay', 'BCA VA', 'BNI VA', 'Mandiri VA', 'OVO', 'DANA', 'Indomaret'].map((m) => (
            <span key={m} className="border border-brand-200 px-3 py-1.5 text-[11px] tracking-wider text-brand-400">
              {m}
            </span>
          ))}
        </div>
        <p className="mt-3 text-xs text-brand-400">
          Select payment method after clicking &quot;Pay Now&quot;
        </p>
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
