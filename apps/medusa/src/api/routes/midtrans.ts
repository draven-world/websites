import { Router } from 'express'
import { MedusaRequest, MedusaResponse } from '@medusajs/medusa'

const router = Router()

/**
 * POST /store/midtrans/create-transaction
 * Generate Midtrans Snap token untuk checkout
 */
router.post('/create-transaction', async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const midtransService = req.scope.resolve('midtransService')
    const { cart_id } = req.body as { cart_id: string }

    if (!cart_id) {
      return res.status(400).json({ message: 'cart_id diperlukan' })
    }

    const token = await midtransService.createTransaction(cart_id)
    return res.json({ token })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal membuat transaksi'
    return res.status(500).json({ message })
  }
})

/**
 * POST /store/midtrans/notification
 * Webhook handler dari Midtrans untuk update status pembayaran
 */
router.post('/notification', async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const midtransService = req.scope.resolve('midtransService')
    const notification = req.body

    await midtransService.handleNotification(notification)
    return res.json({ status: 'ok' })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal memproses notifikasi'
    return res.status(500).json({ message })
  }
})

export default router
