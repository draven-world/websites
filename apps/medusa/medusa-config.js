const dotenv = require('dotenv')

let ENV_FILE_NAME = ''
switch (process.env.NODE_ENV) {
  case 'production':
    ENV_FILE_NAME = '.env.production'
    break
  case 'staging':
    ENV_FILE_NAME = '.env.staging'
    break
  default:
    ENV_FILE_NAME = '.env'
    break
}

try {
  dotenv.config({ path: process.cwd() + '/' + ENV_FILE_NAME })
} catch (e) {}

const REDIS_URL = process.env.REDIS_URL

const plugins = [
  'medusa-fulfillment-manual',
  'medusa-payment-manual',
]

const modules = {}

if (REDIS_URL) {
  modules.eventBus = {
    resolve: '@medusajs/event-bus-redis',
    options: { redisUrl: REDIS_URL },
  }
  modules.cacheService = {
    resolve: '@medusajs/cache-redis',
    options: { redisUrl: REDIS_URL },
  }
}

/** @type {import('@medusajs/medusa').ConfigModule} */
module.exports = {
  projectConfig: {
    redis_url: REDIS_URL,
    database_url: process.env.DATABASE_URL || 'postgres://localhost/medusa-draven',
    database_type: 'postgres',
    store_cors: process.env.STORE_CORS || 'http://localhost:3000',
    admin_cors: process.env.ADMIN_CORS || 'http://localhost:7001',
    jwt_secret: process.env.JWT_SECRET || 'supersecret-jwt-min-32-chars-long!!',
    cookie_secret: process.env.COOKIE_SECRET || 'supersecret-cookie-min-32-chars-long!!',
    database_extra: process.env.NODE_ENV === 'production'
      ? { ssl: { rejectUnauthorized: false } }
      : {},
  },
  plugins,
  modules,
}
