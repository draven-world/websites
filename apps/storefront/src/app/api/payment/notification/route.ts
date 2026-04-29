import { NextRequest, NextResponse } from 'next/server'
import { verifySignature } from '@/lib/midtrans'
import { updateOrderStatus } from '@/lib/sanity'
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
      payment_type,
      transaction_id,
      settlement_time,
    } = body

    // Verify signature
    const isValid = verifySignature(order_id, status_code, gross_amount, signature_key)
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 })
    }

    // Determine payment status
    let status: 'pending' | 'paid' | 'cancelled' = 'pending'

    if (transaction_status === 'capture') {
      status = fraud_status === 'accept' ? 'paid' : 'pending'
    } else if (transaction_status === 'settlement') {
      status = 'paid'
    } else if (['cancel', 'deny', 'expire'].includes(transaction_status)) {
      status = 'cancelled'
    }

    console.log(`[Midtrans] Order ${order_id}: ${transaction_status} → ${status}`)

    // Update order in Sanity
    updateOrderStatus(order_id, status, {
      paymentMethod: payment_type || undefined,
      midtransId: transaction_id || undefined,
      paidAt: status === 'paid' ? (settlement_time || new Date().toISOString()) : undefined,
    }).catch((err) => console.error('[Webhook] Failed to update Sanity:', err))

    // Send WhatsApp on successful payment
    if (status === 'paid' && body.custom_field1) {
      const [customerName, customerPhone] = body.custom_field1.split('|')
      if (customerPhone) {
        sendWhatsApp(
          customerPhone,
          paymentConfirmedMessage(order_id, customerName || 'Pelanggan'),
        ).catch(() => {})
      }
    }

    return NextResponse.json({ status: 'ok' })
  } catch (err) {
    console.error('[Midtrans Webhook] Error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
