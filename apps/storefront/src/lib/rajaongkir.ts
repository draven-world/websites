const API_KEY = process.env.RAJAONGKIR_API_KEY || ''
const BASE_URL = 'https://rajaongkir.komerce.id/api/v1'

type Province = {
  id: number
  name: string
}

type City = {
  id: number
  name: string
  zip_code: string
}

type District = {
  id: number
  name: string
  zip_code: string
}

type CostResult = {
  name: string
  code: string
  service: string
  description: string
  cost: number
  etd: string
}

let provincesCache: Province[] | null = null

export async function getProvinces(): Promise<Province[]> {
  if (provincesCache) return provincesCache

  const res = await fetch(`${BASE_URL}/destination/province`, {
    headers: { key: API_KEY },
  })

  if (!res.ok) throw new Error('Failed to load provinces')

  const data = await res.json()
  if (data.meta?.status !== 'success') throw new Error(data.meta?.message || 'API error')
  provincesCache = data.data as Province[]
  return provincesCache
}

export async function getCities(provinceId: string): Promise<City[]> {
  const res = await fetch(`${BASE_URL}/destination/city/${provinceId}`, {
    headers: { key: API_KEY },
  })

  if (!res.ok) throw new Error('Failed to load cities')

  const data = await res.json()
  if (data.meta?.status !== 'success') throw new Error(data.meta?.message || 'API error')
  return data.data as City[]
}

export async function getDistricts(cityId: string): Promise<District[]> {
  const res = await fetch(`${BASE_URL}/destination/district/${cityId}`, {
    headers: { key: API_KEY },
  })

  if (!res.ok) throw new Error('Failed to load districts')

  const data = await res.json()
  if (data.meta?.status !== 'success') throw new Error(data.meta?.message || 'API error')
  return data.data as District[]
}

export async function getShippingCost(
  origin: string,
  destination: string,
  weight: number,
  courier: string,
): Promise<CostResult[]> {
  const res = await fetch(`${BASE_URL}/calculate/district/domestic-cost`, {
    method: 'POST',
    headers: {
      key: API_KEY,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      origin,
      destination,
      weight: String(weight),
      courier,
      price: 'lowest',
    }),
  })

  if (!res.ok) throw new Error('Failed to calculate shipping cost')

  const data = await res.json()
  if (data.meta?.status !== 'success') throw new Error(data.meta?.message || 'API error')
  return (data.data || []) as CostResult[]
}
