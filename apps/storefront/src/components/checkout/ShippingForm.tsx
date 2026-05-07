'use client'

import { useState, useEffect } from 'react'
import { formatRupiah } from '@/lib/utils'
import type { ShippingAddress } from '@/app/(store)/checkout/page'

type Option = { id: number; name: string; zip_code?: string }
type EstimateResult = { name: string; service: string; cost: number; etd: string }

export default function ShippingForm({
  onSubmit,
  cartWeight = 500,
}: {
  onSubmit: (address: ShippingAddress) => void
  cartWeight?: number
}) {
  const [provinces, setProvinces] = useState<Option[]>([])
  const [cities, setCities] = useState<Option[]>([])
  const [districts, setDistricts] = useState<Option[]>([])
  const [loadingCities, setLoadingCities] = useState(false)
  const [loadingDistricts, setLoadingDistricts] = useState(false)

  const [form, setForm] = useState<ShippingAddress>({
    first_name: '',
    last_name: '',
    phone: '',
    address_1: '',
    city: '',
    city_id: '',
    district: '',
    district_id: '',
    province: '',
    province_id: '',
    postal_code: '',
  })

  const [errors, setErrors] = useState<Partial<Record<string, string>>>({})
  const [showEstimate, setShowEstimate] = useState(false)
  const [estimateLoading, setEstimateLoading] = useState(false)
  const [estimates, setEstimates] = useState<EstimateResult[]>([])

  useEffect(() => {
    fetch('/api/shipping/provinces')
      .then((r) => r.json())
      .then((data) => setProvinces(data.provinces || []))
      .catch(() => setProvinces([]))
  }, [])

  async function handleProvinceChange(val: string) {
    const prov = provinces.find((p) => String(p.id) === val)
    setForm((f) => ({
      ...f,
      province_id: val,
      province: prov?.name || '',
      city_id: '',
      city: '',
      district_id: '',
      district: '',
    }))
    setCities([])
    setDistricts([])

    if (!val) return
    setLoadingCities(true)
    try {
      const res = await fetch(`/api/shipping/cities?province_id=${val}`)
      const data = await res.json()
      setCities(data.cities || [])
    } catch {
      setCities([])
    } finally {
      setLoadingCities(false)
    }
  }

  async function handleCityChange(val: string) {
    const city = cities.find((c) => String(c.id) === val)
    setForm((f) => ({
      ...f,
      city_id: val,
      city: city?.name || '',
      district_id: '',
      district: '',
      postal_code: city?.zip_code && city.zip_code !== '0' ? city.zip_code : f.postal_code,
    }))
    setDistricts([])

    if (!val) return
    setLoadingDistricts(true)
    try {
      const res = await fetch(`/api/shipping/districts?city_id=${val}`)
      const data = await res.json()
      setDistricts(data.districts || [])
    } catch {
      setDistricts([])
    } finally {
      setLoadingDistricts(false)
    }
  }

  function handleDistrictChange(val: string) {
    const dist = districts.find((d) => String(d.id) === val)
    setForm((f) => ({
      ...f,
      district_id: val,
      district: dist?.name || '',
      postal_code: dist?.zip_code && dist.zip_code !== '0' ? dist.zip_code : f.postal_code,
    }))
  }

  function validatePhone(phone: string): string | null {
    if (!phone.trim()) return 'Required'
    if (!/^08\d{8,11}$/.test(phone.replace(/\s/g, ''))) return 'Format: 08xxxxxxxxxx (10-13 digit)'
    return null
  }

  function validate(): boolean {
    const e: Partial<Record<string, string>> = {}
    if (!form.first_name.trim()) e.first_name = 'Required'
    const phoneErr = validatePhone(form.phone)
    if (phoneErr) e.phone = phoneErr
    if (!form.address_1.trim()) e.address_1 = 'Required'
    if (!form.province_id) e.province = 'Select province'
    if (!form.city_id) e.city = 'Select city'
    if (!form.district_id) e.district = 'Select district'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleEstimate() {
    if (!form.district_id) return
    setEstimateLoading(true)
    setShowEstimate(true)
    setEstimates([])
    try {
      const res = await fetch('/api/shipping/cost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: form.district_id,
          weight: Math.max(cartWeight, 100),
          courier: 'jne:tiki:sicepat:jnt:anteraja',
        }),
      })
      const data = await res.json()
      if (data.costs?.length) {
        const sorted = [...data.costs].sort((a: EstimateResult, b: EstimateResult) => a.cost - b.cost)
        setEstimates(sorted.slice(0, 5))
      }
    } catch {
      // silent
    } finally {
      setEstimateLoading(false)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (validate()) {
      onSubmit(form)
    }
  }

  const selectClass =
    'bg-ink-900 border border-ink-700 text-ink-100 px-3 py-3 w-full focus:outline-none focus:border-accent-lime disabled:opacity-30'

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="block text-[0.75rem] uppercase tracking-[0.15em] text-ink-300 mb-2">
            First Name *
          </label>
          <input
            type="text"
            value={form.first_name}
            onChange={(e) => setForm((f) => ({ ...f, first_name: e.target.value }))}
            className="underline-input w-full"
            placeholder="First name"
          />
          {errors.first_name && (
            <p className="mt-1 text-xs text-red-500">{errors.first_name}</p>
          )}
        </div>

        <div>
          <label className="block text-[0.75rem] uppercase tracking-[0.15em] text-ink-300 mb-2">
            Last Name
          </label>
          <input
            type="text"
            value={form.last_name}
            onChange={(e) => setForm((f) => ({ ...f, last_name: e.target.value }))}
            className="underline-input w-full"
            placeholder="Last name"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-[0.75rem] uppercase tracking-[0.15em] text-ink-300 mb-2">
            Phone (WhatsApp) *
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => {
              setForm((f) => ({ ...f, phone: e.target.value }))
              if (errors.phone) {
                const err = validatePhone(e.target.value)
                setErrors((prev) =>
                  err
                    ? { ...prev, phone: err }
                    : (() => {
                        const { phone, ...rest } = prev
                        return rest
                      })(),
                )
              }
            }}
            onBlur={() => {
              if (form.phone.trim()) {
                const err = validatePhone(form.phone)
                if (err) setErrors((prev) => ({ ...prev, phone: err }))
              }
            }}
            className="underline-input w-full"
            placeholder="08xxxxxxxxxx"
          />
          <p className="mt-1 text-[0.65rem] text-ink-500">Format: 08xxxxxxxxxx</p>
          {errors.phone && (
            <p className="mt-0.5 text-xs text-red-500">{errors.phone}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-[0.75rem] uppercase tracking-[0.15em] text-ink-300 mb-2">
            Full Address *
          </label>
          <textarea
            value={form.address_1}
            onChange={(e) => setForm((f) => ({ ...f, address_1: e.target.value }))}
            rows={3}
            className="underline-input w-full resize-none"
            placeholder="Street, house number, RT/RW"
          />
          {errors.address_1 && (
            <p className="mt-1 text-xs text-red-500">{errors.address_1}</p>
          )}
        </div>

        <div>
          <label className="block text-[0.75rem] uppercase tracking-[0.15em] text-ink-300 mb-2">
            Province *
          </label>
          <select
            value={form.province_id}
            onChange={(e) => handleProvinceChange(e.target.value)}
            className={selectClass}
          >
            <option value="">Select Province</option>
            {provinces.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          {errors.province && (
            <p className="mt-1 text-xs text-red-500">{errors.province}</p>
          )}
        </div>

        <div>
          <label className="block text-[0.75rem] uppercase tracking-[0.15em] text-ink-300 mb-2">
            City *
          </label>
          <select
            value={form.city_id}
            onChange={(e) => handleCityChange(e.target.value)}
            disabled={!form.province_id || loadingCities}
            className={selectClass}
          >
            <option value="">{loadingCities ? 'Loading...' : 'Select City'}</option>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
        </div>

        <div>
          <label className="block text-[0.75rem] uppercase tracking-[0.15em] text-ink-300 mb-2">
            District *
          </label>
          <select
            value={form.district_id}
            onChange={(e) => handleDistrictChange(e.target.value)}
            disabled={!form.city_id || loadingDistricts}
            className={selectClass}
          >
            <option value="">{loadingDistricts ? 'Loading...' : 'Select District'}</option>
            {districts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
          {errors.district && (
            <p className="mt-1 text-xs text-red-500">{errors.district}</p>
          )}
        </div>

        <div>
          <label className="block text-[0.75rem] uppercase tracking-[0.15em] text-ink-300 mb-2">
            Postal Code
          </label>
          <input
            type="text"
            value={form.postal_code}
            onChange={(e) => setForm((f) => ({ ...f, postal_code: e.target.value }))}
            className="underline-input w-full"
            placeholder="Postal code"
          />
        </div>
      </div>

      {/* Shipping Cost Estimate */}
      {form.district_id && (
        <div className="mt-6">
          <button
            type="button"
            onClick={handleEstimate}
            className="text-[0.75rem] uppercase tracking-[0.15em] text-ink-500 underline underline-offset-4 transition-colors hover:text-ink-100"
          >
            Estimasi Ongkir
          </button>

          {showEstimate && (
            <div className="mt-4 border border-ink-700 bg-ink-900 p-4">
              <div className="flex items-center justify-between">
                <p className="text-[0.75rem] uppercase tracking-[0.15em] text-ink-300">
                  Estimasi ke {form.district}, {form.city}
                </p>
                <button
                  type="button"
                  onClick={() => setShowEstimate(false)}
                  className="text-ink-500 hover:text-ink-100"
                  aria-label="Close estimate"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              {estimateLoading ? (
                <div className="flex items-center gap-2 py-4">
                  <div className="h-4 w-4 animate-spin border-2 border-ink-100 border-t-transparent" />
                  <span className="text-xs text-ink-500">Menghitung...</span>
                </div>
              ) : estimates.length > 0 ? (
                <div className="mt-3 space-y-2">
                  {estimates.map((est, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-ink-300">
                        {est.name} {est.service}{' '}
                        <span className="text-xs text-ink-500">({est.etd})</span>
                      </span>
                      <span className="font-medium text-ink-100">
                        {formatRupiah(est.cost)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-xs text-ink-500">
                  Tidak dapat menghitung ongkir.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      <button type="submit" className="btn-primary mt-8 w-full py-4">
        Continue to Shipping
      </button>
    </form>
  )
}
