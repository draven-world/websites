import { NextRequest, NextResponse } from 'next/server'
import { searchSanityProducts } from '@/lib/sanity'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') || ''
  if (!q.trim()) return NextResponse.json([])

  const results = await searchSanityProducts(q, 6)
  return NextResponse.json(results)
}
