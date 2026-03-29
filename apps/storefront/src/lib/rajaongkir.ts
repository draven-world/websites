const API_KEY = process.env.RAJAONGKIR_API_KEY || ''
const BASE_URL = 'https://api.rajaongkir.com/starter'

type Province = {
  province_id: string
  province: string
}

type City = {
  city_id: string
  province_id: string
  province: string
  type: string
  city_name: string
  postal_code: string
}

type CostService = {
  service: string
  description: string
  cost: Array<{ value: number; etd: string; note: string }>
}

// Cache provinces in memory (rarely changes)
let provincesCache: Province[] | null = null

export async function getProvinces(): Promise<Province[]> {
  if (provincesCache) return provincesCache

  const res = await fetch(`${BASE_URL}/province`, {
    headers: { key: API_KEY },
  })

  if (!res.ok) throw new Error('Gagal memuat data provinsi')

  const data = await res.json()
  provincesCache = data.rajaongkir.results as Province[]
  return provincesCache
}

export async function getCities(provinceId?: string): Promise<City[]> {
  const url = provinceId
    ? `${BASE_URL}/city?province=${provinceId}`
    : `${BASE_URL}/city`

  const res = await fetch(url, {
    headers: { key: API_KEY },
  })

  if (!res.ok) throw new Error('Gagal memuat data kota')

  const data = await res.json()
  return data.rajaongkir.results as City[]
}

export async function getShippingCost(
  origin: string,
  destination: string,
  weight: number,
  courier: string,
): Promise<CostService[]> {
  const res = await fetch(`${BASE_URL}/cost`, {
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
    }),
  })

  if (!res.ok) throw new Error('Gagal menghitung ongkos kirim')

  const data = await res.json()
  const results = data.rajaongkir.results
  if (results?.[0]?.costs) {
    return results[0].costs as CostService[]
  }
  return []
}
