import { NextRequest, NextResponse } from 'next/server'
import {
  sendWhatsApp,
  orderCreatedMessage,
  paymentConfirmedMessage,
  orderShippedMessage,
} from '@/lib/whatsapp'
import { formatRupiah } from '@/lib/utils'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, phone, order_id, customer_name, total, courier, tracking_number } = body

    if (!type || !phone || !order_id) {
      return NextResponse.json(
        { error: 'type, phone, dan order_id wajib diisi' },
        { status: 400 },
      )
    }

    let message = ''

    switch (type) {
      case 'order_created':
        message = orderCreatedMessage(order_id, customer_name || 'Pelanggan', formatRupiah(total || 0))
        break
      case 'payment_confirmed':
        message = paymentConfirmedMessage(order_id, customer_name || 'Pelanggan')
        break
      case 'order_shipped':
        message = orderShippedMessage(
          order_id,
          customer_name || 'Pelanggan',
          courier || '-',
          tracking_number || '-',
        )
        break
      default:
        return NextResponse.json({ error: `Unknown type: ${type}` }, { status: 400 })
    }

    const sent = await sendWhatsApp(phone, message)

    return NextResponse.json({ sent })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Gagal kirim WhatsApp'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
