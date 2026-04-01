import { NextResponse } from 'next/server'
import { getOrderStats, getProductStats } from '@/lib/sanity'

export async function GET() {
  const [orderStats, productStats] = await Promise.all([
    getOrderStats(),
    getProductStats(),
  ])

  return NextResponse.json({
    orders: orderStats,
    products: productStats,
  })
}
