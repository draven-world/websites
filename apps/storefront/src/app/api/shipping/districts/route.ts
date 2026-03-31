import { NextRequest, NextResponse } from 'next/server'
import { getDistricts } from '@/lib/rajaongkir'

export async function GET(req: NextRequest) {
  const cityId = req.nextUrl.searchParams.get('city_id')

  if (!cityId) {
    return NextResponse.json({ error: 'city_id required' }, { status: 400 })
  }

  try {
    const districts = await getDistricts(cityId)
    return NextResponse.json({ districts })
  } catch (err) {
    console.error('Districts API error:', err)
    return NextResponse.json({ districts: [], error: 'Failed to load districts' })
  }
}
