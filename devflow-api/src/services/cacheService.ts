import redis from '../config/redis'

export const cacheService = {
  async get<T>(key: string): Promise<T | null> {
    const data = await redis.get(key)
    if (!data) return null
    return JSON.parse(data) as T
    // Redis stores strings only
    // JSON.parse converts string back to object
  },

  async set(key: string, data: any, ttlSeconds: number = 300): Promise<void> {
    await redis.set(key, JSON.stringify(data), 'EX', ttlSeconds)
    // JSON.stringify converts object to string for storage
    // EX ttlSeconds = auto-expire after this many seconds
    // default 300 = 5 minutes
  },

  async delete(key: string): Promise<void> {
    await redis.del(key)
  },

  async deletePattern(pattern: string): Promise<void> {
    const keys = await redis.keys(pattern)
    // find all keys matching pattern
    // example: 'tasks:*' finds tasks:all, tasks:user:1 etc
    if (keys.length > 0) {
      await redis.del(...keys)
    }
  }
}