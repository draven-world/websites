import { NextRequest, NextResponse } from 'next/server'
import { getShippingCost } from '@/lib/rajaongkir'

// Kota asal pengiriman (default: Jakarta Selatan)
const ORIGIN_CITY_ID = process.env.ORIGIN_CITY_ID || '152'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { destination, weight, courier } = body

    if (!destination || !courier) {
      return NextResponse.json(
        { error: 'destination dan courier wajib diisi' },
        { status: 400 },
      )
    }

    const costs = await getShippingCost(
      ORIGIN_CITY_ID,
      destination,
      Math.max(weight || 100, 100),
      courier,
    )

    return NextResponse.json({ costs })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Gagal menghitung ongkir'
    return NextResponse.json({ error: message, costs: [] }, { status: 500 })
  }
}
