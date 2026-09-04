import redis from './config/redis'

async function testRedis() {

  // 1. SET — store a value
  await redis.set('name', 'Preetham')
  // key = 'name', value = 'Preetham'

  // 2. GET — retrieve a value
  const name = await redis.get('name')
  console.log('GET name:', name)  // Preetham

  // 3. SET with expiry — auto delete after seconds
  await redis.set('session', 'abc123', 'EX', 10)
  // EX 10 = expires after 10 seconds

  // 4. TTL — how many seconds left
  const ttl = await redis.ttl('session')
  console.log('TTL session:', ttl)  // 9 or 10

  // 5. DEL — delete a key
  await redis.del('name')
  const deleted = await redis.get('name')
  console.log('After delete:', deleted)  // null

  // 6. EXISTS — check if key exists
  const exists = await redis.exists('session')
  console.log('Session exists:', exists)  // 1 (true) or 0 (false)

  // 7. INCR — increment a number
  await redis.set('count', '0')
  await redis.incr('count')
  await redis.incr('count')
  await redis.incr('count')
  const count = await redis.get('count')
  console.log('Count:', count)  // 3
  // INCR is atomic — safe for concurrent requests
  // Used for rate limiting — count requests per user

  process.exit(0)
}

testRedis()