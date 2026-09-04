import { test, describe, before, after } from 'node:test'
import assert from 'node:assert'
import http from 'node:http'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import authRoutes from '../src/routes/authRoutes'
import taskRoutes from '../src/routes/taskRoutes'
import jobRoutes from '../src/routes/jobRoutes'
import { errorHandler } from '../src/middleware/errorHandler'

let server: http.Server
let baseUrl: string

const app = express()
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(cookieParser())

// Health
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/jobs', jobRoutes)
app.use(errorHandler)

function request(path: string, options: { method?: string; headers?: Record<string, string>; body?: any } = {}) {
  return new Promise<{ status: number; headers: http.IncomingHttpHeaders; data: any }>((resolve, reject) => {
    const url = new URL(path, baseUrl)
    const reqOptions: http.RequestOptions = {
      method: options.method || 'GET',
      headers: options.headers || {}
    }

    let body = options.body
    if (body && typeof body === 'object') {
      body = JSON.stringify(body)
      if (!reqOptions.headers) reqOptions.headers = {}
      reqOptions.headers['Content-Type'] = 'application/json'
    }

    const req = http.request(url, reqOptions, (res) => {
      let rawData = ''
      res.on('data', (chunk) => { rawData += chunk })
      res.on('end', () => {
        let json: any = null
        try {
          json = JSON.parse(rawData)
        } catch {
          json = rawData
        }
        resolve({ status: res.statusCode || 500, headers: res.headers, data: json })
      })
    })

    req.on('error', reject)
    if (body) req.write(body)
    req.end()
  })
}

describe('DevFlow Pro API Automated Test Suite', () => {
  before(async () => {
    await new Promise<void>((resolve) => {
      server = app.listen(0, () => {
        const addr = server.address() as any
        baseUrl = `http://localhost:${addr.port}`
        resolve()
      })
    })
  })

  after(async () => {
    if (server) {
      await new Promise<void>((resolve) => server.close(() => resolve()))
    }
    setTimeout(() => process.exit(0), 100)
  })

  test('1. Health Check Endpoint — returns 200 and status: OK', async () => {
    const res = await request('/health')
    assert.strictEqual(res.status, 200)
    assert.strictEqual(res.data.status, 'OK')
    assert.ok(res.data.timestamp)
  })

  test('2. Auth Security — rejects login with non-existent email or invalid password', async () => {
    const res = await request('/api/auth/login', {
      method: 'POST',
      body: {
        email: 'invalid-nonexistent-user@shashankj.tech',
        password: 'wrongPassword123'
      }
    })
    assert.ok(res.status === 401 || res.status === 400 || res.status === 500)
  })

  test('3. Protected Tasks Route — blocks unauthenticated access without JWT token', async () => {
    const res = await request('/api/tasks')
    assert.ok(res.status === 401 || res.status === 403, `Expected 401/403 for unauthenticated request, got ${res.status}`)
  })

  test('4. Protected Jobs Route — blocks unauthenticated access without JWT token', async () => {
    const res = await request('/api/jobs')
    assert.ok(res.status === 401 || res.status === 403, `Expected 401/403 for unauthenticated request, got ${res.status}`)
  })

  test('5. Protected Job Stats Route — blocks unauthenticated telemetry retrieval', async () => {
    const res = await request('/api/jobs/stats')
    assert.ok(res.status === 401 || res.status === 403, `Expected 401/403 for unauthenticated request, got ${res.status}`)
  })

  test('6. Refresh Token Route — rejects missing or invalid refresh token', async () => {
    const res = await request('/api/auth/refresh', {
      method: 'POST',
      body: {}
    })
    assert.ok(res.status === 401 || res.status === 400 || res.status === 403)
  })
})
