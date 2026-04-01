import { NextRequest, NextResponse } from 'next/server'
import { getOrdersFromSanity } from '@/lib/sanity'

export async function GET(req: NextRequest) {
  const limit = Number(req.nextUrl.searchParams.get('limit')) || 50
  const orders = await getOrdersFromSanity(limit)
  return NextResponse.json({ orders })
}
