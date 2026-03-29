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
    if (!form.first_name.trim()) e.first_name = 'Nama depan wajib diisi'
    if (!form.phone.trim()) e.phone = 'No. HP wajib diisi'
    if (!form.address_1.trim()) e.address_1 = 'Alamat wajib diisi'
    if (!form.province_id) e.province = 'Pilih provinsi'
    if (!form.city_id) e.city = 'Pilih kota'
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
    <form onSubmit={handleSubmit} className="border border-brand-100 bg-white p-6 md:p-8">
      <h2 className="mb-6 text-sm font-bold uppercase tracking-wider text-brand-900">
        Alamat Pengiriman
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-brand-700">Nama Depan *</label>
          <input
            type="text"
            value={form.first_name}
            onChange={(e) => setForm((f) => ({ ...f, first_name: e.target.value }))}
            className="input-field"
            placeholder="Nama depan"
          />
          {errors.first_name && <p className="mt-1 text-xs text-red-600">{errors.first_name}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-brand-700">Nama Belakang</label>
          <input
            type="text"
            value={form.last_name}
            onChange={(e) => setForm((f) => ({ ...f, last_name: e.target.value }))}
            className="input-field"
            placeholder="Nama belakang"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-brand-700">No. HP (WhatsApp) *</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            className="input-field"
            placeholder="08xxxxxxxxxx"
          />
          {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-brand-700">Alamat Lengkap *</label>
          <textarea
            value={form.address_1}
            onChange={(e) => setForm((f) => ({ ...f, address_1: e.target.value }))}
            rows={3}
            className="input-field"
            placeholder="Nama jalan, no. rumah, RT/RW, kelurahan, kecamatan"
          />
          {errors.address_1 && <p className="mt-1 text-xs text-red-600">{errors.address_1}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-brand-700">Provinsi *</label>
          <select
            value={form.province_id}
            onChange={(e) => handleProvinceChange(e.target.value)}
            className="input-field"
          >
            <option value="">Pilih Provinsi</option>
            {provinces.map((p) => (
              <option key={p.province_id} value={p.province_id}>
                {p.province}
              </option>
            ))}
          </select>
          {errors.province && <p className="mt-1 text-xs text-red-600">{errors.province}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-brand-700">Kota / Kabupaten *</label>
          <select
            value={form.city_id}
            onChange={(e) => handleCityChange(e.target.value)}
            disabled={!form.province_id || loadingCities}
            className="input-field disabled:bg-brand-50"
          >
            <option value="">{loadingCities ? 'Memuat...' : 'Pilih Kota'}</option>
            {cities.map((c) => (
              <option key={c.city_id} value={c.city_id}>
                {c.type} {c.city_name}
              </option>
            ))}
          </select>
          {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-brand-700">Kode Pos</label>
          <input
            type="text"
            value={form.postal_code}
            onChange={(e) => setForm((f) => ({ ...f, postal_code: e.target.value }))}
            className="input-field"
            placeholder="Kode pos"
          />
        </div>
      </div>

      <button type="submit" className="btn-primary mt-8 w-full py-4">
        LANJUT PILIH PENGIRIMAN
      </button>
    </form>
  )
}
