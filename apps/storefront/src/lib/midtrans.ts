const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || ''
const IS_PRODUCTION = process.env.NODE_ENV === 'production'

const BASE_URL = IS_PRODUCTION
  ? 'https://app.midtrans.com/snap/v1'
  : 'https://app.sandbox.midtrans.com/snap/v1'

type TransactionParams = {
  order_id: string
  gross_amount: number
  customer_name: string
  customer_email?: string
  customer_phone: string
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
  }>
}

export async function createSnapTransaction(params: TransactionParams) {
  const auth = Buffer.from(`${MIDTRANS_SERVER_KEY}:`).toString('base64')

  const payload = {
    transaction_details: {
      order_id: params.order_id,
      gross_amount: params.gross_amount,
    },
    customer_details: {
      first_name: params.customer_name,
      email: params.customer_email || '',
      phone: params.customer_phone,
    },
    item_details: params.items,
    callbacks: {
      finish: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/order/success`,
    },
  }

  const res = await fetch(`${BASE_URL}/transactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.error_messages?.[0] || 'Gagal membuat transaksi Midtrans')
  }

  return res.json() as Promise<{ token: string; redirect_url: string }>
}

export function verifySignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  signatureKey: string,
): boolean {
  // Midtrans signature: SHA512(order_id + status_code + gross_amount + server_key)
  const crypto = require('crypto')
  const input = `${orderId}${statusCode}${grossAmount}${MIDTRANS_SERVER_KEY}`
  const hash = crypto.createHash('sha512').update(input).digest('hex')
  return hash === signatureKey
}
