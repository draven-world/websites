import { Router } from 'express'
import { MedusaRequest, MedusaResponse } from '@medusajs/medusa'

const router = Router()

/**
 * GET /store/shipping/provinces
 * Ambil daftar provinsi dari RajaOngkir
 */
router.get('/provinces', async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const rajaOngkirService = req.scope.resolve('rajaOngkirService')
    const provinces = await rajaOngkirService.getProvinces()
    return res.json({ provinces })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal mengambil daftar provinsi'
    return res.status(500).json({ message })
  }
})

/**
 * GET /store/shipping/cities?province_id=1
 * Ambil daftar kota berdasarkan provinsi
 */
router.get('/cities', async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const rajaOngkirService = req.scope.resolve('rajaOngkirService')
    const { province_id } = req.query as { province_id: string }
    const cities = await rajaOngkirService.getCities(province_id)
    return res.json({ cities })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal mengambil daftar kota'
    return res.status(500).json({ message })
  }
})

/**
 * POST /store/shipping/cost
 * Cek ongkos kirim
 */
router.post('/cost', async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const rajaOngkirService = req.scope.resolve('rajaOngkirService')
    const { origin, destination, weight, courier } = req.body as {
      origin: string
      destination: string
      weight: number
      courier: string
    }

    if (!origin || !destination || !weight || !courier) {
      return res.status(400).json({
        message: 'origin, destination, weight, dan courier diperlukan',
      })
    }

    const costs = await rajaOngkirService.checkCost(origin, destination, weight, courier)
    return res.json({ costs })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal cek ongkir'
    return res.status(500).json({ message })
  }
})

export default router
