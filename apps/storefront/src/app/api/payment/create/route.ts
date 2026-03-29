import { NextRequest, NextResponse } from 'next/server'
import { createSnapTransaction } from '@/lib/midtrans'
import { sendWhatsApp, orderCreatedMessage } from '@/lib/whatsapp'
import { formatRupiah } from '@/lib/utils'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { order_id, gross_amount, customer_name, customer_phone, customer_email, items } = body

    if (!order_id || !gross_amount || !customer_name || !customer_phone) {
      return NextResponse.json(
        { error: 'Data transaksi tidak lengkap' },
        { status: 400 },
      )
    }

    const result = await createSnapTransaction({
      order_id,
      gross_amount,
      customer_name,
      customer_phone,
      customer_email,
      items: items || [
        {
          id: order_id,
          name: 'Pesanan DRAVEN',
          price: gross_amount,
          quantity: 1,
        },
      ],
    })

    // Send WhatsApp notification (fire-and-forget)
    sendWhatsApp(
      customer_phone,
      orderCreatedMessage(order_id, customer_name, formatRupiah(gross_amount)),
    ).catch(() => {})

    return NextResponse.json({
      token: result.token,
      redirect_url: result.redirect_url,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Gagal membuat transaksi'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
