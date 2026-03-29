'use client'

import { useState } from 'react'
import { formatRupiah } from '@/lib/utils'
import type { ShippingAddress, ShippingCost } from '@/app/(store)/checkout/page'

type Cart = {
  id: string
  items: Array<{
    id: string
    title: string
    quantity: number
    unit_price: number
  }>
  total: number
  subtotal: number
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

  const grandTotal = cart.total + shippingCost.cost

  async function handlePayment() {
    setLoading(true)
    setError('')

    try {
      const orderId = `DRV-${Date.now()}`

      const items = cart.items?.map((item) => ({
        id: item.id,
        name: item.title,
        price: item.unit_price,
        quantity: item.quantity,
      })) || []

      // Add shipping as item
      items.push({
        id: 'shipping',
        name: `Ongkir ${shippingCost.courier} ${shippingCost.service}`,
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
        throw new Error(data.error || 'Gagal membuat transaksi')
      }

      if (typeof window !== 'undefined' && (window as any).snap) {
        ;(window as any).snap.pay(data.token, {
          onSuccess: () => {
            window.location.href = '/order/success'
          },
          onPending: () => {
            window.location.href = '/order/pending'
          },
          onError: () => {
            setError('Pembayaran gagal. Silakan coba lagi.')
          },
          onClose: () => {
            setError('Popup pembayaran ditutup. Silakan coba lagi jika belum membayar.')
          },
        })
      } else {
        setError('Midtrans belum dimuat. Refresh halaman dan coba lagi.')
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border border-brand-100 bg-white p-6 md:p-8">
      <h2 className="mb-6 text-sm font-bold uppercase tracking-wider text-brand-900">
        Pembayaran
      </h2>

      {/* Address Summary */}
      <div className="mb-6 bg-brand-50 p-5">
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-brand-400">
          Alamat Pengiriman
        </h3>
        <p className="text-sm text-brand-700">
          {address.first_name} {address.last_name}
        </p>
        <p className="text-sm text-brand-700">{address.address_1}</p>
        <p className="text-sm text-brand-700">
          {address.city}, {address.province} {address.postal_code}
        </p>
        <p className="text-sm text-brand-700">{address.phone}</p>

        <div className="mt-4 border-t border-brand-200 pt-4">
          <p className="text-sm text-brand-700">
            <span className="font-semibold">Kurir:</span> {shippingCost.courier} — {shippingCost.service}
          </p>
          <p className="text-sm text-brand-700">
            <span className="font-semibold">Ongkir:</span> {formatRupiah(shippingCost.cost)}
          </p>
          <p className="text-sm text-brand-700">
            <span className="font-semibold">Estimasi:</span> {shippingCost.etd} hari
          </p>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="mb-6">
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-brand-400">
          Metode Pembayaran Tersedia
        </h3>
        <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-semibold text-brand-500">
          {['QRIS', 'GoPay', 'ShopeePay', 'BCA VA', 'BNI VA', 'Mandiri VA', 'OVO', 'DANA', 'Indomaret'].map((m) => (
            <div key={m} className="border border-brand-200 py-2.5">{m}</div>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-brand-400">
          Pilih metode pembayaran di jendela pembayaran setelah klik &quot;Bayar Sekarang&quot;
        </p>
      </div>

      {/* Total */}
      <div className="mb-6 bg-brand-900 p-5 text-center text-white">
        <p className="text-xs uppercase tracking-widest text-white/60">Total Pembayaran</p>
        <p className="mt-1 text-2xl font-bold">{formatRupiah(grandTotal)}</p>
      </div>

      {error && (
        <div className="mb-4 border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <button onClick={onBack} className="btn-secondary flex-1 py-4">
          KEMBALI
        </button>
        <button
          onClick={handlePayment}
          disabled={loading}
          className="btn-primary flex-1 py-4"
        >
          {loading ? 'MEMPROSES...' : 'BAYAR SEKARANG'}
        </button>
      </div>
    </div>
  )
}
