import { NextRequest, NextResponse } from 'next/server'
import { verifySignature } from '@/lib/midtrans'
import { sendWhatsApp, paymentConfirmedMessage } from '@/lib/whatsapp'

// Midtrans webhook — called by Midtrans server when payment status changes
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
    } = body

    // Verify signature
    const isValid = verifySignature(order_id, status_code, gross_amount, signature_key)
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 })
    }

    // Determine payment status
    let status: 'success' | 'pending' | 'failed' | 'expired' = 'pending'

    if (transaction_status === 'capture') {
      status = fraud_status === 'accept' ? 'success' : 'pending'
    } else if (transaction_status === 'settlement') {
      status = 'success'
    } else if (['cancel', 'deny'].includes(transaction_status)) {
      status = 'failed'
    } else if (transaction_status === 'expire') {
      status = 'expired'
    }

    // TODO: Update order status in Medusa when connected
    // await medusa.admin.orders.update(order_id, { status })

    console.log(`[Midtrans] Order ${order_id}: ${transaction_status} → ${status}`)

    // Send WhatsApp on successful payment
    if (status === 'success') {
      // TODO: Fetch customer details from order
      // For now, log the event
      console.log(`[Midtrans] Payment confirmed for order ${order_id}`)

      // If customer phone is included in metadata, send notification
      if (body.custom_field1) {
        const [customerName, customerPhone] = body.custom_field1.split('|')
        if (customerPhone) {
          sendWhatsApp(
            customerPhone,
            paymentConfirmedMessage(order_id, customerName || 'Pelanggan'),
          ).catch(() => {})
        }
      }
    }

    return NextResponse.json({ status: 'ok' })
  } catch (err) {
    console.error('[Midtrans Webhook] Error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
