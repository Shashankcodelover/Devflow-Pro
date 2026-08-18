import { Request, Response, NextFunction } from 'express'
import { authService } from '../services/authService'

const COOKIE_OPTIONS = {
  httpOnly: true,
  // JavaScript cannot read this cookie
  // protects against XSS attacks

  secure: process.env.NODE_ENV === 'production',
  // only send over HTTPS in production
  // false in development (no HTTPS locally)

  sameSite: 'strict' as const,
  // only send cookie to same site
  // protects against CSRF attacks

  maxAge: 7 * 24 * 60 * 60 * 1000
  // 7 days in milliseconds
  // 7 days × 24 hours × 60 mins × 60 secs × 1000ms
}

export const authController = {

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, email, password } = req.body

      if (!name || !email || !password) {
        res.status(400).json({ success: false, error: 'name, email and password required' })
        return
      }

      if (password.length < 6) {
        res.status(400).json({ success: false, error: 'password must be at least 6 characters' })
        return
      }

      const result = await authService.register({ name, email, password })

      // Send refresh token in httpOnly cookie
      res.cookie('refreshToken', result.refreshToken, COOKIE_OPTIONS)

      // Send access token in response body
      res.status(201).json({
        success: true,
        data: {
          accessToken: result.accessToken,
          user: result.user
        }
      })
    } catch (err) {
      next(err)
    }
  },

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body

      if (!email || !password) {
        res.status(400).json({ success: false, error: 'email and password required' })
        return
      }

      const result = await authService.login({ email, password })

      res.cookie('refreshToken', result.refreshToken, COOKIE_OPTIONS)

      res.json({
        success: true,
        data: {
          accessToken: result.accessToken,
          user: result.user
        }
      })
    } catch (err) {
      next(err)
    }
  },

  async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const refreshToken = req.cookies.refreshToken
      // read from httpOnly cookie
      // browser sends automatically

      if (!refreshToken) {
        res.status(401).json({ success: false, error: 'No refresh token' })
        return
      }

      const result = authService.refresh(refreshToken)

      res.json({ success: true, data: result })
    } catch (err) {
      next(err)
    }
  },

  logout(req: Request, res: Response): void {
    const refreshToken = req.cookies.refreshToken

    if (refreshToken) {
      authService.logout(refreshToken)
    }

    res.clearCookie('refreshToken')
    // removes the cookie from browser

    res.json({ success: true, message: 'Logged out successfully' })
  }
}