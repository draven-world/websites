import { NextResponse } from 'next/server'
import { getProvinces } from '@/lib/rajaongkir'

export async function GET() {
  try {
    const provinces = await getProvinces()
    return NextResponse.json({ provinces })
  } catch (err) {
    console.error('Provinces API error:', err)
    return NextResponse.json({ provinces: [], error: 'Failed to load provinces' })
  }
}
