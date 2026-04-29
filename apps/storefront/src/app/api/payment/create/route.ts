import { NextRequest, NextResponse } from 'next/server'
import { createSnapTransaction } from '@/lib/midtrans'
import { createOrderInSanity } from '@/lib/sanity'
import { sendWhatsApp, orderCreatedMessage } from '@/lib/whatsapp'
import { formatRupiah } from '@/lib/utils'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      order_id,
      gross_amount,
      customer_name,
      customer_phone,
      customer_email,
      items,
      // Order data for Sanity
      order_items,
      subtotal,
      shipping_cost,
      shipping_address,
      shipping_district,
      shipping_city,
      shipping_province,
      shipping_postal_code,
      shipping_method,
    } = body

    if (!order_id || !gross_amount || !customer_name || !customer_phone) {
      return NextResponse.json(
        { error: 'Data transaksi tidak lengkap' },
        { status: 400 },
      )
    }

    // 1. Create Midtrans Snap transaction
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
      custom_field1: `${customer_name}|${customer_phone}`,
    })

    // 2. Save order to Sanity (fire-and-forget, don't block payment)
    if (order_items) {
      const fullAddress = [shipping_address, shipping_district]
        .filter(Boolean)
        .join(', ')

      createOrderInSanity({
        orderId: order_id,
        customerName: customer_name,
        customerPhone: customer_phone,
        customerEmail: customer_email,
        items: order_items,
        subtotal: subtotal || 0,
        shippingCost: shipping_cost || 0,
        total: gross_amount,
        shippingAddress: fullAddress,
        shippingCity: shipping_city || '',
        shippingProvince: shipping_province || '',
        shippingPostalCode: shipping_postal_code,
        shippingDistrict: shipping_district,
        shippingMethod: shipping_method || '',
      }).catch((err) => console.error('[Order] Failed to save to Sanity:', err))
    }

    // 3. Send WhatsApp notification (fire-and-forget)
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
