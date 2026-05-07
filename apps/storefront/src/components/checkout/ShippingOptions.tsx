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
  hideBack = false,
}: {
  address: ShippingAddress
  destinationId: string
  cartWeight: number
  onSelect: (cost: ShippingCost) => void
  onBack: () => void
  hideBack?: boolean
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
        const sorted = [...data.costs].sort(
          (a: CostOption, b: CostOption) => a.cost - b.cost,
        )
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
      <p className="text-sm text-ink-500 mb-6">
        Deliver to: {address.district}, {address.city}, {address.province}
      </p>

      {loading ? (
        <div className="flex items-center gap-3 py-12">
          <div className="h-5 w-5 animate-spin border-2 border-ink-100 border-t-transparent" />
          <span className="text-sm text-ink-500">Checking rates...</span>
        </div>
      ) : options.length > 0 ? (
        <div>
          {options.map((opt) => {
            const key = `${opt.code}-${opt.service}`
            const isSelected =
              selected && `${selected.courier}-${selected.service}` === key
            return (
              <button
                key={key}
                onClick={() =>
                  setSelected({
                    courier: opt.code,
                    service: opt.service,
                    description: `${opt.name} — ${opt.description}`,
                    cost: opt.cost,
                    etd: opt.etd,
                  })
                }
                className={`flex w-full items-center justify-between py-4 text-left cursor-pointer transition-colors border-b ${
                  isSelected
                    ? 'border-accent-lime'
                    : 'border-ink-700 hover:border-ink-300'
                }`}
              >
                <div>
                  <p
                    className={`text-sm ${isSelected ? 'text-ink-100' : 'text-ink-300'}`}
                  >
                    {opt.name} — {opt.service}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-500">
                    {opt.description} · Est. {opt.etd}
                  </p>
                </div>
                <p
                  className={`text-sm ml-4 flex-shrink-0 ${isSelected ? 'text-accent-lime' : 'text-ink-300'}`}
                >
                  {formatRupiah(opt.cost)}
                </p>
              </button>
            )
          })}
        </div>
      ) : (
        <div className="py-12">
          <p className="text-sm text-ink-500">
            {error || 'No shipping options available. Try a different address.'}
          </p>
          <button
            type="button"
            onClick={loadShippingCosts}
            className="mt-4 text-[0.75rem] uppercase tracking-[0.15em] text-ink-300 underline underline-offset-4 transition-opacity hover:opacity-60"
          >
            Retry
          </button>
        </div>
      )}

      <div className="mt-8 flex gap-3">
        {!hideBack && (
          <button onClick={onBack} className="btn-ghost flex-1 py-4">
            Back
          </button>
        )}
        <button
          onClick={handleSubmit}
          disabled={!selected}
          className={`btn-primary py-4 ${hideBack ? 'w-full' : 'flex-1'}`}
        >
          Continue to Payment
        </button>
      </div>
    </div>
  )
}
