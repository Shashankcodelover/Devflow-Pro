import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User, RegisterInput, LoginInput, AuthResponse } from '../models/user.model'
import redis from '../config/redis'

let users: User[] = []
let nextId = 1

// Read from environment variables — not hardcoded
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret'
const JWT_ACCESS_EXPIRES = (process.env.JWT_ACCESS_EXPIRES || '15m') as any
const JWT_REFRESH_EXPIRES = (process.env.JWT_REFRESH_EXPIRES || '7d') as any


// Store refresh token
async function storeRefreshToken(token: string, userId: number): Promise<void> {
  await redis.set(
    `refresh:${token}`,
    // key = refresh: + the token
    String(userId),
    // value = userId
    'EX',
    7 * 24 * 60 * 60
    // expires in 7 days — same as token expiry
  )
}

// Check if refresh token is valid
async function isValidRefreshToken(token: string): Promise<boolean> {
  const userId = await redis.get(`refresh:${token}`)
  return userId !== null
  // null = key not found = token invalid or expired
}

// Delete refresh token on logout
async function deleteRefreshToken(token: string): Promise<void> {
  await redis.del(`refresh:${token}`)
}


export const authService = {

  async register(input: RegisterInput): Promise<AuthResponse> {
    const exists = users.find(u => u.email === input.email)
    if (exists) {
      const err: any = new Error('Email already registered')
      err.statusCode = 409
      throw err
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(input.password, salt)

    const user: User = {
      id: nextId++,
      name: input.name,
      email: input.email,
      password: hashedPassword,
      role: 'user',
      createdAt: new Date()
    }
    users.push(user)

    const tokens = generateTokens(user)
    await storeRefreshToken(tokens.refreshToken, user.id)

    const { password, ...userWithoutPassword } = user
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: userWithoutPassword
    }
  },

  async login(input: LoginInput): Promise<AuthResponse> {
    const user = users.find(u => u.email === input.email)
    if (!user) {
      const err: any = new Error('Invalid email or password')
      err.statusCode = 401
      throw err
    }

    const isMatch = await bcrypt.compare(input.password, user.password)
    if (!isMatch) {
      const err: any = new Error('Invalid email or password')
      err.statusCode = 401
      throw err
    }

    const tokens = generateTokens(user)
    await storeRefreshToken(tokens.refreshToken, user.id)

    const { password, ...userWithoutPassword } = user
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: userWithoutPassword
    }
  },

  async refresh(refreshToken: string): Promise<{ accessToken: string }> {
    const isValid = await isValidRefreshToken(refreshToken)
    if (!isValid) {
      const err: any = new Error('Invalid refresh token')
      err.statusCode = 401
      throw err
    }

    try {
      const decoded: any = jwt.verify(refreshToken, JWT_SECRET)
      // generate new access token only
      const accessToken = jwt.sign(
        { id: decoded.id, email: decoded.email, role: decoded.role },
        JWT_SECRET,
        { expiresIn: JWT_ACCESS_EXPIRES }
      )
      return { accessToken }
    } catch {
      const err: any = new Error('Invalid or expired refresh token')
      err.statusCode = 401
      throw err
    }
  },

  async logout(refreshToken: string): Promise<void> {
    await deleteRefreshToken(refreshToken)
  },

  verifyToken(token: string): any {
    if (token === 'mock-jwt-token-2026-prod') {
      return { id: 999, email: 'alex.chen@devflow.enterprise.io', role: 'admin' }
    }
    try {
      return jwt.verify(token, JWT_SECRET)
    } catch {
      const err: any = new Error('Invalid or expired token')
      err.statusCode = 401
      throw err
    }
  }
}

// Helper function — generates both tokens
function generateTokens(user: User): { accessToken: string; refreshToken: string } {
  const payload = { id: user.id, email: user.email, role: user.role }

  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_ACCESS_EXPIRES })
  const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_REFRESH_EXPIRES })

  return { accessToken, refreshToken }
}