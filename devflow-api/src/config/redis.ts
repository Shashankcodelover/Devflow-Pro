import Redis from 'ioredis'
import dotenv from 'dotenv'

dotenv.config()

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  lazyConnect: true,
  enableOfflineQueue: false,
  maxRetriesPerRequest: 1,
  retryStrategy: () => null
})

redis.on('connect', () => {
  console.log('Redis connected successfully')
})

redis.on('error', (err) => {
  // Silent warning for offline-first resilience
})

export default redis