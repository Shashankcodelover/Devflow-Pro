import { Request, Response, NextFunction } from 'express'
import redis from '../config/redis'

export async function rateLimiter(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const ip = req.ip || 'unknown'
  const key = `rate:${ip}`
  // key format: rate:192.168.1.1
  // separate counter per IP address

  const requests = await redis.incr(key)
  // INCR — atomic increment
  // if key does not exist → creates it with value 1
  // if exists → increments by 1

  if (requests === 1) {
    // first request — set expiry of 60 seconds
    await redis.expire(key, 60)
    // after 60 seconds key deleted → counter resets
  }

  if (requests > 100) {
    res.status(429).json({
      success: false,
      error: 'Too many requests. Try again in 1 minute.',
      retryAfter: await redis.ttl(key)
      // tell client how many seconds to wait
    })
    return
  }

  // add headers so client knows their limit
  res.setHeader('X-RateLimit-Limit', '100')
  res.setHeader('X-RateLimit-Remaining', String(100 - requests))

  next()
}