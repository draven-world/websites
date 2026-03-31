import { NextRequest, NextResponse } from 'next/server'
import { getTransactionStatus } from '@/lib/midtrans'

export async function GET(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get('order_id')

  if (!orderId) {
    return NextResponse.json({ error: 'order_id required' }, { status: 400 })
  }

  try {
    const result = await getTransactionStatus(orderId)

    if (!result) {
      return NextResponse.json({ status: 'not_found' })
    }

    let status: 'paid' | 'pending' | 'failed' | 'expired' = 'pending'

    if (result.transaction_status === 'capture') {
      status = result.fraud_status === 'accept' ? 'paid' : 'pending'
    } else if (result.transaction_status === 'settlement') {
      status = 'paid'
    } else if (['cancel', 'deny'].includes(result.transaction_status)) {
      status = 'failed'
    } else if (result.transaction_status === 'expire') {
      status = 'expired'
    }

    return NextResponse.json({
      status,
      order_id: result.order_id,
      payment_type: result.payment_type || null,
      transaction_status: result.transaction_status,
    })
  } catch {
    return NextResponse.json({ status: 'error' }, { status: 500 })
  }
}
