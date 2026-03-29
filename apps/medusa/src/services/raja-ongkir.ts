import { TransactionBaseService } from '@medusajs/medusa'

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

type ShippingCost = {
  service: string
  description: string
  cost: Array<{
    value: number
    etd: string
    note: string
  }>
}

const RAJAONGKIR_BASE_URL = 'https://api.rajaongkir.com/starter'

class RajaOngkirService extends TransactionBaseService {
  private apiKey_: string
  private provincesCache_: Province[] | null = null
  private citiesCache_: Map<string, City[]> = new Map()

  constructor(container: Record<string, unknown>) {
    super(container)
    this.apiKey_ = process.env.RAJAONGKIR_API_KEY || ''
  }

  private async fetchApi(endpoint: string, options: RequestInit = {}): Promise<any> {
    const res = await fetch(`${RAJAONGKIR_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        key: this.apiKey_,
        ...options.headers,
      },
    })
    const data = await res.json()
    return data.rajaongkir
  }

  /**
   * Ambil daftar provinsi
   */
  async getProvinces(): Promise<Province[]> {
    if (this.provincesCache_) {
      return this.provincesCache_
    }

    const result = await this.fetchApi('/province')
    this.provincesCache_ = result.results
    return result.results
  }

  /**
   * Ambil daftar kota berdasarkan provinsi
   */
  async getCities(provinceId?: string): Promise<City[]> {
    const cacheKey = provinceId || 'all'
    const cached = this.citiesCache_.get(cacheKey)
    if (cached) {
      return cached
    }

    const query = provinceId ? `?province=${provinceId}` : ''
    const result = await this.fetchApi(`/city${query}`)
    this.citiesCache_.set(cacheKey, result.results)
    return result.results
  }

  /**
   * Cek ongkos kirim
   * @param origin - ID kota asal
   * @param destination - ID kota tujuan
   * @param weight - berat dalam gram
   * @param courier - jne | pos | tiki (starter plan)
   */
  async checkCost(
    origin: string,
    destination: string,
    weight: number,
    courier: string,
  ): Promise<ShippingCost[]> {
    const result = await this.fetchApi('/cost', {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        origin,
        destination,
        weight: weight.toString(),
        courier,
      }).toString(),
    })

    return result.results[0]?.costs || []
  }
}

export default RajaOngkirService
