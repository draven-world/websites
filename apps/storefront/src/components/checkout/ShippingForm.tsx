'use client'

import { useState, useEffect } from 'react'
import type { ShippingAddress } from '@/app/(store)/checkout/page'

type Province = { province_id: string; province: string }
type City = { city_id: string; city_name: string; type: string; postal_code: string }

export default function ShippingForm({
  onSubmit,
}: {
  onSubmit: (address: ShippingAddress) => void
}) {
  const [provinces, setProvinces] = useState<Province[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [loadingCities, setLoadingCities] = useState(false)

  const [form, setForm] = useState<ShippingAddress>({
    first_name: '',
    last_name: '',
    phone: '',
    address_1: '',
    city: '',
    city_id: '',
    province: '',
    province_id: '',
    postal_code: '',
  })

  const [errors, setErrors] = useState<Partial<Record<keyof ShippingAddress, string>>>({})

  useEffect(() => {
    fetch('/api/shipping/provinces')
      .then((r) => r.json())
      .then((data) => setProvinces(data.provinces || []))
      .catch(() => {
        setProvinces([
          { province_id: '6', province: 'DKI Jakarta' },
          { province_id: '9', province: 'Jawa Barat' },
          { province_id: '10', province: 'Jawa Tengah' },
          { province_id: '11', province: 'Jawa Timur' },
          { province_id: '1', province: 'Bali' },
          { province_id: '34', province: 'Yogyakarta' },
        ])
      })
  }, [])

  async function handleProvinceChange(provinceId: string) {
    const prov = provinces.find((p) => p.province_id === provinceId)
    setForm((f) => ({
      ...f,
      province_id: provinceId,
      province: prov?.province || '',
      city_id: '',
      city: '',
    }))
    setCities([])

    if (!provinceId) return
    setLoadingCities(true)
    try {
      const res = await fetch(`/api/shipping/cities?province_id=${provinceId}`)
      const data = await res.json()
      setCities(data.cities || [])
    } catch {
      setCities([])
    } finally {
      setLoadingCities(false)
    }
  }

  function handleCityChange(cityId: string) {
    const city = cities.find((c) => c.city_id === cityId)
    setForm((f) => ({
      ...f,
      city_id: cityId,
      city: city ? `${city.type} ${city.city_name}` : '',
      postal_code: city?.postal_code || f.postal_code,
    }))
  }

  function validate(): boolean {
    const e: Partial<Record<keyof ShippingAddress, string>> = {}
    if (!form.first_name.trim()) e.first_name = 'Required'
    if (!form.phone.trim()) e.phone = 'Required'
    if (!form.address_1.trim()) e.address_1 = 'Required'
    if (!form.province_id) e.province = 'Select province'
    if (!form.city_id) e.city = 'Select city'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (validate()) {
      onSubmit(form)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-[13px] uppercase tracking-widest text-brand-950">
        Shipping Address
      </h2>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-[11px] uppercase tracking-widest text-brand-400">
            First Name *
          </label>
          <input
            type="text"
            value={form.first_name}
            onChange={(e) => setForm((f) => ({ ...f, first_name: e.target.value }))}
            className="input-field"
            placeholder="First name"
          />
          {errors.first_name && <p className="mt-1 text-xs text-red-500">{errors.first_name}</p>}
        </div>

        <div>
          <label className="mb-2 block text-[11px] uppercase tracking-widest text-brand-400">
            Last Name
          </label>
          <input
            type="text"
            value={form.last_name}
            onChange={(e) => setForm((f) => ({ ...f, last_name: e.target.value }))}
            className="input-field"
            placeholder="Last name"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-[11px] uppercase tracking-widest text-brand-400">
            Phone (WhatsApp) *
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            className="input-field"
            placeholder="08xxxxxxxxxx"
          />
          {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-[11px] uppercase tracking-widest text-brand-400">
            Full Address *
          </label>
          <textarea
            value={form.address_1}
            onChange={(e) => setForm((f) => ({ ...f, address_1: e.target.value }))}
            rows={3}
            className="input-field"
            placeholder="Street, house number, RT/RW, kelurahan, kecamatan"
          />
          {errors.address_1 && <p className="mt-1 text-xs text-red-500">{errors.address_1}</p>}
        </div>

        <div>
          <label className="mb-2 block text-[11px] uppercase tracking-widest text-brand-400">
            Province *
          </label>
          <select
            value={form.province_id}
            onChange={(e) => handleProvinceChange(e.target.value)}
            className="input-field"
          >
            <option value="">Select Province</option>
            {provinces.map((p) => (
              <option key={p.province_id} value={p.province_id}>
                {p.province}
              </option>
            ))}
          </select>
          {errors.province && <p className="mt-1 text-xs text-red-500">{errors.province}</p>}
        </div>

        <div>
          <label className="mb-2 block text-[11px] uppercase tracking-widest text-brand-400">
            City *
          </label>
          <select
            value={form.city_id}
            onChange={(e) => handleCityChange(e.target.value)}
            disabled={!form.province_id || loadingCities}
            className="input-field disabled:opacity-30"
          >
            <option value="">{loadingCities ? 'Loading...' : 'Select City'}</option>
            {cities.map((c) => (
              <option key={c.city_id} value={c.city_id}>
                {c.type} {c.city_name}
              </option>
            ))}
          </select>
          {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
        </div>

        <div>
          <label className="mb-2 block text-[11px] uppercase tracking-widest text-brand-400">
            Postal Code
          </label>
          <input
            type="text"
            value={form.postal_code}
            onChange={(e) => setForm((f) => ({ ...f, postal_code: e.target.value }))}
            className="input-field"
            placeholder="Postal code"
          />
        </div>
      </div>

      <button type="submit" className="btn-primary mt-8 w-full py-4">
        Continue to Shipping
      </button>
    </form>
  )
}
