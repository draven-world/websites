import {
  type SubscriberConfig,
  type SubscriberArgs,
  OrderService,
} from '@medusajs/medusa'

export default async function orderPlacedHandler({
  data,
  container,
}: SubscriberArgs<{ id: string }>) {
  const whatsappService = container.resolve('whatsappService')

  try {
    await whatsappService.sendOrderConfirmation(data.id)
  } catch (error) {
    console.error('[Subscriber] order.placed - WhatsApp notification failed:', error)
  }
}

export const config: SubscriberConfig = {
  event: OrderService.Events.PLACED,
  context: {
    subscriberId: 'order-placed-whatsapp',
  },
}
