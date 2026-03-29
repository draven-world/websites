import { Router } from 'express'
import { MedusaRequest, MedusaResponse } from '@medusajs/medusa'

const router = Router()

/**
 * POST /store/whatsapp/send-order-confirmation
 * Kirim notifikasi WhatsApp konfirmasi order
 */
router.post('/send-order-confirmation', async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const whatsappService = req.scope.resolve('whatsappService')
    const { order_id } = req.body as { order_id: string }

    if (!order_id) {
      return res.status(400).json({ message: 'order_id diperlukan' })
    }

    await whatsappService.sendOrderConfirmation(order_id)
    return res.json({ status: 'sent' })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal mengirim notifikasi'
    return res.status(500).json({ message })
  }
})

export default router
