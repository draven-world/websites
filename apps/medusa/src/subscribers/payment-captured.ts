import {
  type SubscriberConfig,
  type SubscriberArgs,
  OrderService,
} from '@medusajs/medusa'

export default async function paymentCapturedHandler({
  data,
  container,
}: SubscriberArgs<{ id: string }>) {
  const whatsappService = container.resolve('whatsappService')

  try {
    await whatsappService.sendPaymentConfirmation(data.id)
  } catch (error) {
    console.error('[Subscriber] order.payment_captured - WhatsApp notification failed:', error)
  }
}

export const config: SubscriberConfig = {
  event: OrderService.Events.PAYMENT_CAPTURED,
  context: {
    subscriberId: 'payment-captured-whatsapp',
  },
}
