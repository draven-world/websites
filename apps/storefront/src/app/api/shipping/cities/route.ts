import { NextRequest, NextResponse } from 'next/server'
import { getCities } from '@/lib/rajaongkir'

export async function GET(req: NextRequest) {
  const provinceId = req.nextUrl.searchParams.get('province_id')

  if (!provinceId) {
    return NextResponse.json({ error: 'province_id wajib diisi' }, { status: 400 })
  }

  try {
    const cities = await getCities(provinceId)
    return NextResponse.json({ cities })
  } catch {
    return NextResponse.json({ cities: [] })
  }
}
