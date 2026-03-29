import { TransactionBaseService } from '@medusajs/medusa'
import midtransClient from 'midtrans-client'

type MidtransNotification = {
  order_id: string
  transaction_status: string
  fraud_status: string
  status_code: string
  gross_amount: string
  payment_type: string
}

class MidtransService extends TransactionBaseService {
  private snap_: midtransClient.Snap
  private orderService_: any

  constructor(container: Record<string, unknown>) {
    super(container)
    this.orderService_ = container.orderService

    this.snap_ = new midtransClient.Snap({
      isProduction: process.env.NODE_ENV === 'production',
      serverKey: process.env.MIDTRANS_SERVER_KEY || '',
      clientKey: process.env.MIDTRANS_CLIENT_KEY || '',
    })
  }

  /**
   * Buat Snap transaction token dari cart
   */
  async createTransaction(cartId: string): Promise<string> {
    const cartService = this.manager_.getRepository('Cart') as any
    const cart = await (this as any).container_.cartService.retrieve(cartId, {
      relations: ['items', 'shipping_address', 'region'],
    })

    const parameter = {
      transaction_details: {
        order_id: `DRAVEN-${cartId}-${Date.now()}`,
        gross_amount: cart.total,
      },
      customer_details: {
        first_name: cart.shipping_address?.first_name || 'Customer',
        last_name: cart.shipping_address?.last_name || '',
        email: cart.email || '',
        phone: cart.shipping_address?.phone || '',
      },
      item_details: cart.items.map((item: any) => ({
        id: item.variant_id,
        price: item.unit_price,
        quantity: item.quantity,
        name: item.title.substring(0, 50),
      })),
      enabled_payments: [
        'gopay',
        'shopeepay',
        'dana',
        'ovo',
        'bca_va',
        'bni_va',
        'bri_va',
        'mandiri_va',
        'permata_va',
        'qris',
        'other_qris',
        'indomaret',
        'alfamart',
      ],
      callbacks: {
        finish: `${process.env.STORE_CORS}/order/success`,
      },
    }

    const token = await this.snap_.createTransactionToken(parameter)
    return token
  }

  /**
   * Handle notifikasi dari Midtrans webhook
   */
  async handleNotification(notification: MidtransNotification): Promise<void> {
    const statusResponse = await this.snap_.transaction.notification(notification)
    const orderId = statusResponse.order_id
    const transactionStatus = statusResponse.transaction_status
    const fraudStatus = statusResponse.fraud_status

    // Mapping Midtrans status ke Medusa order status
    if (transactionStatus === 'capture') {
      if (fraudStatus === 'accept') {
        await this.capturePayment_(orderId)
      }
    } else if (transactionStatus === 'settlement') {
      await this.capturePayment_(orderId)
    } else if (
      transactionStatus === 'cancel' ||
      transactionStatus === 'deny' ||
      transactionStatus === 'expire'
    ) {
      await this.cancelPayment_(orderId)
    } else if (transactionStatus === 'pending') {
      // Payment pending — no action needed
    }
  }

  private async capturePayment_(orderId: string): Promise<void> {
    try {
      await this.orderService_.capturePayment(orderId)
    } catch (e) {
      // Order mungkin belum dibuat, log saja
      console.log(`[Midtrans] Capture payment for ${orderId}:`, e)
    }
  }

  private async cancelPayment_(orderId: string): Promise<void> {
    try {
      await this.orderService_.cancelOrder(orderId)
    } catch (e) {
      console.log(`[Midtrans] Cancel payment for ${orderId}:`, e)
    }
  }
}

export default MidtransService
