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
    <div>
      <h2 className="text-[13px] uppercase tracking-widest text-brand-950">
        Select Shipping
      </h2>
      <p className="mt-2 text-sm text-brand-400">
        Deliver to: {address.city}, {address.province}
      </p>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-5 w-5 animate-spin border-2 border-brand-950 border-t-transparent" />
          <span className="ml-3 text-sm text-brand-400">Checking rates...</span>
        </div>
      ) : allOptions.length > 0 ? (
        <div className="mt-6 space-y-2">
          {allOptions.map((opt) => {
            const key = `${opt.courier}-${opt.service}`
            const isSelected = selected && `${selected.courier}-${selected.service}` === key
            return (
              <button
                key={key}
                onClick={() => setSelected(opt)}
                className={`flex w-full items-center justify-between p-4 text-left transition-colors ${
                  isSelected
                    ? 'border border-brand-950 bg-brand-50'
                    : 'border border-brand-100 hover:border-brand-300'
                }`}
              >
                <div>
                  <p className="text-sm text-brand-950">
                    {opt.courier} — {opt.service}
                  </p>
                  <p className="mt-0.5 text-xs text-brand-400">
                    {opt.description} · Est. {opt.etd} days
                  </p>
                </div>
                <p className="text-sm text-brand-950">{formatRupiah(opt.cost)}</p>
              </button>
            )
          })}
        </div>
      ) : (
        <div className="mt-6 py-12 text-center text-sm text-brand-400">
          No shipping options available. Try a different address.
        </div>
      )}

      <div className="mt-8 flex gap-3">
        <button onClick={onBack} className="btn-secondary flex-1 py-4">
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={!selected}
          className="btn-primary flex-1 py-4"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  )
}
