import { Router } from 'express'
import bodyParser from 'body-parser'
import midtransRoutes from './routes/midtrans'
import shippingRoutes from './routes/shipping'
import whatsappRoutes from './routes/whatsapp'

export default (rootDirectory: string): Router | Router[] => {
  const router = Router()

  router.use(bodyParser.json())

  // Custom API routes
  router.use('/store/midtrans', midtransRoutes)
  router.use('/store/shipping', shippingRoutes)
  router.use('/store/whatsapp', whatsappRoutes)

  return router
}
