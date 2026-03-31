import { NextRequest, NextResponse } from 'next/server'
import { getShippingCost } from '@/lib/rajaongkir'

// District ID kota asal pengiriman
// Set via env var or default Jakarta Selatan district
const ORIGIN_DISTRICT_ID = process.env.ORIGIN_DISTRICT_ID || '1360'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { destination, weight, courier } = body

    if (!destination) {
      return NextResponse.json({ error: 'destination required' }, { status: 400 })
    }

    // Support multiple couriers separated by colon
    const courierStr = courier || 'jne:tiki:pos:sicepat:jnt:anteraja'

    const costs = await getShippingCost(
      ORIGIN_DISTRICT_ID,
      destination,
      Math.max(weight || 1000, 100),
      courierStr,
    )

    return NextResponse.json({ costs })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to calculate shipping'
    console.error('Shipping cost error:', message)
    return NextResponse.json({ error: message, costs: [] }, { status: 500 })
  }
}
