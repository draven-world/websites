'use client'

import { useState, useEffect } from 'react'
import { formatRupiah } from '@/lib/utils'
import type { ShippingAddress, ShippingCost } from '@/app/(store)/checkout/page'

const couriers = [
  { id: 'jne', name: 'JNE' },
  { id: 'tiki', name: 'TIKI' },
  { id: 'pos', name: 'POS Indonesia' },
]

type CostResult = {
  service: string
  description: string
  cost: Array<{ value: number; etd: string; note: string }>
}

export default function ShippingOptions({
  address,
  cartWeight,
  onSelect,
  onBack,
}: {
  address: ShippingAddress
  cartWeight: number
  onSelect: (cost: ShippingCost) => void
  onBack: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<Map<string, CostResult[]>>(new Map())
  const [selected, setSelected] = useState<ShippingCost | null>(null)

  useEffect(() => {
    loadAllCouriers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadAllCouriers() {
    setLoading(true)
    const allResults = new Map<string, CostResult[]>()

    for (const courier of couriers) {
      try {
        const res = await fetch('/api/shipping/cost', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            destination: address.city_id,
            weight: Math.max(cartWeight, 100),
            courier: courier.id,
          }),
        })
        const data = await res.json()
        if (data.costs?.length > 0) {
          allResults.set(courier.id, data.costs)
        }
      } catch {
        // Skip failed courier
      }
    }

    setResults(allResults)
    setLoading(false)
  }

  function handleSubmit() {
    if (selected) onSelect(selected)
  }

  const allOptions: ShippingCost[] = []
  results.forEach((costs, courierId) => {
    const courierName = couriers.find((c) => c.id === courierId)?.name || courierId
    costs.forEach((c) => {
      if (c.cost[0]) {
        allOptions.push({
          courier: courierName,
          service: c.service,
          description: c.description,
          cost: c.cost[0].value,
          etd: c.cost[0].etd,
        })
      }
    })
  })

  allOptions.sort((a, b) => a.cost - b.cost)

  return (
    <div className="border border-brand-100 bg-white p-6 md:p-8">
      <h2 className="mb-2 text-sm font-bold uppercase tracking-wider text-brand-900">
        Pilih Pengiriman
      </h2>
      <p className="mb-6 text-sm text-brand-400">
        Kirim ke: {address.city}, {address.province}
      </p>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-6 w-6 animate-spin border-2 border-brand-900 border-t-transparent" />
          <span className="ml-3 text-sm text-brand-400">Mengecek ongkos kirim...</span>
        </div>
      ) : allOptions.length > 0 ? (
        <div className="space-y-2">
          {allOptions.map((opt) => {
            const key = `${opt.courier}-${opt.service}`
            const isSelected = selected && `${selected.courier}-${selected.service}` === key
            return (
              <button
                key={key}
                onClick={() => setSelected(opt)}
                className={`flex w-full items-center justify-between border p-4 text-left transition-colors ${
                  isSelected
                    ? 'border-brand-900 bg-brand-50'
                    : 'border-brand-200 hover:border-brand-400'
                }`}
              >
                <div>
                  <p className="text-sm font-semibold text-brand-900">
                    {opt.courier} — {opt.service}
                  </p>
                  <p className="text-xs text-brand-400">
                    {opt.description} &middot; Estimasi {opt.etd} hari
                  </p>
                </div>
                <p className="text-sm font-bold text-brand-900">{formatRupiah(opt.cost)}</p>
              </button>
            )
          })}
        </div>
      ) : (
        <div className="py-8 text-center text-sm text-brand-400">
          Tidak ada opsi pengiriman tersedia. Coba ubah alamat tujuan.
        </div>
      )}

      <div className="mt-8 flex gap-3">
        <button onClick={onBack} className="btn-secondary flex-1 py-4">
          KEMBALI
        </button>
        <button
          onClick={handleSubmit}
          disabled={!selected}
          className="btn-primary flex-1 py-4"
        >
          LANJUT BAYAR
        </button>
      </div>
    </div>
  )
}
