const FONNTE_TOKEN = process.env.FONNTE_TOKEN || ''
const FONNTE_URL = 'https://api.fonnte.com/send'

export async function sendWhatsApp(phone: string, message: string): Promise<boolean> {
  if (!FONNTE_TOKEN) {
    console.warn('[WhatsApp] FONNTE_TOKEN not set, skipping notification')
    return false
  }

  // Normalize phone: 08xxx → 628xxx
  const normalized = phone.startsWith('0')
    ? `62${phone.slice(1)}`
    : phone.startsWith('+')
      ? phone.slice(1)
      : phone

  try {
    const res = await fetch(FONNTE_URL, {
      method: 'POST',
      headers: {
        Authorization: FONNTE_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        target: normalized,
        message,
        countryCode: '62',
      }),
    })

    const data = await res.json()
    return data.status === true
  } catch (err) {
    console.error('[WhatsApp] Failed to send:', err)
    return false
  }
}

// --- Message Templates ---

export function orderCreatedMessage(orderId: string, customerName: string, total: string): string {
  return [
    `Hai ${customerName}! 👋`,
    ``,
    `Pesanan kamu *#${orderId}* sudah kami terima.`,
    `Total: *${total}*`,
    ``,
    `Silakan selesaikan pembayaran agar pesanan segera diproses.`,
    ``,
    `Terima kasih sudah belanja di *DRAVEN*! 🖤`,
  ].join('\n')
}

export function paymentConfirmedMessage(orderId: string, customerName: string): string {
  return [
    `Hai ${customerName}! ✅`,
    ``,
    `Pembayaran untuk pesanan *#${orderId}* sudah dikonfirmasi.`,
    `Pesanan kamu sedang kami proses dan akan segera dikirim.`,
    ``,
    `Terima kasih! — *DRAVEN*`,
  ].join('\n')
}

export function orderShippedMessage(
  orderId: string,
  customerName: string,
  courier: string,
  trackingNumber: string,
): string {
  return [
    `Hai ${customerName}! 📦`,
    ``,
    `Pesanan *#${orderId}* sudah dikirim!`,
    `Kurir: *${courier}*`,
    `No. Resi: *${trackingNumber}*`,
    ``,
    `Kamu bisa lacak pengiriman melalui kurir terkait.`,
    ``,
    `Terima kasih! — *DRAVEN*`,
  ].join('\n')
}
