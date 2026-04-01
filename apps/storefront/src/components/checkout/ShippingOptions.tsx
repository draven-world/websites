'use client'

import { useState, useEffect } from 'react'
import { formatRupiah } from '@/lib/utils'
import type { ShippingAddress, ShippingCost } from '@/app/(store)/checkout/page'

type CostOption = {
  name: string
  code: string
  service: string
  description: string
  cost: number
  etd: string
}

export default function ShippingOptions({
  address,
  destinationId,
  cartWeight,
  onSelect,
  onBack,
}: {
  address: ShippingAddress
  destinationId: string
  cartWeight: number
  onSelect: (cost: ShippingCost) => void
  onBack: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [options, setOptions] = useState<CostOption[]>([])
  const [selected, setSelected] = useState<ShippingCost | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    loadShippingCosts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadShippingCosts() {
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/shipping/cost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: destinationId,
          weight: Math.max(cartWeight, 100),
          courier: 'jne:tiki:pos:sicepat:jnt:anteraja',
        }),
      })
      const data = await res.json()

      if (data.costs && data.costs.length > 0) {
        const sorted = [...data.costs].sort((a: CostOption, b: CostOption) => a.cost - b.cost)
        setOptions(sorted)
      } else {
        setError(data.error || 'No shipping options available')
      }
    } catch {
      setError('Failed to load shipping options')
    } finally {
      setLoading(false)
    }
  }

  function handleSubmit() {
    if (selected) onSelect(selected)
  }

  return (
    <div>
      <h2 className="text-[13px] uppercase tracking-widest text-brand-950">
        Select Shipping
      </h2>
      <p className="mt-2 text-sm text-brand-400">
        Deliver to: {address.district}, {address.city}, {address.province}
      </p>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-5 w-5 animate-spin border-2 border-brand-950 border-t-transparent" />
          <span className="ml-3 text-sm text-brand-400">Checking rates...</span>
        </div>
      ) : options.length > 0 ? (
        <div className="mt-6 space-y-2">
          {options.map((opt) => {
            const key = `${opt.code}-${opt.service}`
            const isSelected = selected && `${selected.courier}-${selected.service}` === key
            return (
              <button
                key={key}
                onClick={() => setSelected({
                  courier: opt.code,
                  service: opt.service,
                  description: `${opt.name} — ${opt.description}`,
                  cost: opt.cost,
                  etd: opt.etd,
                })}
                className={`flex w-full items-center justify-between p-4 text-left transition-colors ${
                  isSelected
                    ? 'border border-brand-950 bg-brand-50'
                    : 'border border-brand-100 hover:border-brand-300'
                }`}
              >
                <div>
                  <p className="text-sm text-brand-950">
                    {opt.name} — {opt.service}
                  </p>
                  <p className="mt-0.5 text-xs text-brand-400">
                    {opt.description} · Est. {opt.etd}
                  </p>
                </div>
                <p className="text-sm text-brand-950">{formatRupiah(opt.cost)}</p>
              </button>
            )
          })}
        </div>
      ) : (
        <div className="mt-6 py-12 text-center">
          <p className="text-sm text-brand-400">
            {error || 'No shipping options available. Try a different address.'}
          </p>
          <button
            type="button"
            onClick={loadShippingCosts}
            className="mt-4 text-[11px] uppercase tracking-widest text-brand-950 underline underline-offset-4 transition-opacity hover:opacity-60"
          >
            Retry
          </button>
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
