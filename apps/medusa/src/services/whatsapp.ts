import { TransactionBaseService } from '@medusajs/medusa'

class WhatsappService extends TransactionBaseService {
  private token_: string
  private orderService_: any

  constructor(container: Record<string, unknown>) {
    super(container)
    this.token_ = process.env.FONNTE_TOKEN || ''
    this.orderService_ = container.orderService
  }

  /**
   * Kirim pesan WhatsApp via Fonnte API
   */
  async sendMessage(phone: string, message: string): Promise<void> {
    if (!this.token_) {
      console.log('[WhatsApp] FONNTE_TOKEN belum diset, skip kirim pesan')
      return
    }

    // Normalisasi nomor telepon ke format 62xxx
    const normalizedPhone = this.normalizePhone(phone)

    await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: {
        Authorization: this.token_,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        target: normalizedPhone,
        message,
      }),
    })
  }

  /**
   * Kirim notifikasi konfirmasi order ke customer
   */
  async sendOrderConfirmation(orderId: string): Promise<void> {
    const order = await this.orderService_.retrieve(orderId, {
      relations: ['items', 'shipping_address', 'payments'],
    })

    const phone = order.shipping_address?.phone
    if (!phone) {
      console.log(`[WhatsApp] Order ${orderId}: no phone number found`)
      return
    }

    const itemList = order.items
      .map((item: any) => `  - ${item.title} (x${item.quantity})`)
      .join('\n')

    const total = this.formatRupiah(order.total)

    const message = [
      `*Pesanan Berhasil!*`,
      ``,
      `Nomor Order: ${order.display_id || orderId}`,
      ``,
      `Produk:`,
      itemList,
      ``,
      `Total: ${total}`,
      ``,
      `Terima kasih sudah belanja di Draven Store!`,
      `Pesanan kamu sedang kami proses.`,
    ].join('\n')

    await this.sendMessage(phone, message)
  }

  /**
   * Kirim notifikasi pembayaran diterima
   */
  async sendPaymentConfirmation(orderId: string): Promise<void> {
    const order = await this.orderService_.retrieve(orderId, {
      relations: ['shipping_address'],
    })

    const phone = order.shipping_address?.phone
    if (!phone) return

    const total = this.formatRupiah(order.total)
    const message = [
      `*Pembayaran Diterima*`,
      ``,
      `Nomor Order: ${order.display_id || orderId}`,
      `Total: ${total}`,
      ``,
      `Pembayaran kamu sudah dikonfirmasi.`,
      `Pesanan akan segera dikirim!`,
    ].join('\n')

    await this.sendMessage(phone, message)
  }

  /**
   * Kirim notifikasi pengiriman dengan nomor resi
   */
  async sendShippingNotification(orderId: string, trackingNumber: string, courier: string): Promise<void> {
    const order = await this.orderService_.retrieve(orderId, {
      relations: ['shipping_address'],
    })

    const phone = order.shipping_address?.phone
    if (!phone) return

    const message = [
      `*Pesanan Dikirim!*`,
      ``,
      `Nomor Order: ${order.display_id || orderId}`,
      `Kurir: ${courier.toUpperCase()}`,
      `No. Resi: ${trackingNumber}`,
      ``,
      `Kamu bisa lacak pesanan melalui website kurir.`,
      `Terima kasih sudah belanja di Draven Store!`,
    ].join('\n')

    await this.sendMessage(phone, message)
  }

  private normalizePhone(phone: string): string {
    let cleaned = phone.replace(/[\s\-\(\)]/g, '')
    if (cleaned.startsWith('+')) {
      cleaned = cleaned.substring(1)
    }
    if (cleaned.startsWith('08')) {
      cleaned = '62' + cleaned.substring(1)
    }
    return cleaned
  }

  private formatRupiah(amount: number): string {
    return `Rp ${amount.toLocaleString('id-ID')}`
  }
}

export default WhatsappService
