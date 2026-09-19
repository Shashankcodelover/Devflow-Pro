import { Request, Response, NextFunction } from 'express'
import redis from '../config/redis'

// In-memory rate limiting fallback if Redis is unreachable
const memoryRateMap = new Map<string, { count: number; expiresAt: number }>()

export async function rateLimiter(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const ip = req.ip || 'unknown'
  const key = `rate:${ip}`
  let requests = 1

  try {
    if (redis.status === 'ready') {
      requests = await redis.incr(key)
      if (requests === 1) {
        await redis.expire(key, 60)
      }
    } else {
      throw new Error('Redis not ready')
    }
  } catch {
    // In-memory token bucket fallback
    const now = Date.now()
    const entry = memoryRateMap.get(key)
    if (!entry || now > entry.expiresAt) {
      memoryRateMap.set(key, { count: 1, expiresAt: now + 60000 })
      requests = 1
    } else {
      entry.count += 1
      requests = entry.count
    }
  }

  if (requests > 100) {
    res.status(429).json({
      success: false,
      error: 'Too many requests. Try again in 1 minute.',
      retryAfter: 60
    })
    return
  }

  res.setHeader('X-RateLimit-Limit', '100')
  res.setHeader('X-RateLimit-Remaining', String(Math.max(0, 100 - requests)))

  next()
}