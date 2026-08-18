import { Request, Response, NextFunction } from 'express'
import { authService } from '../services/authService'

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number
        email: string
        role: string
      }
    }
  }
}

export function protect(req: Request, res: Response, next: NextFunction): void {
  try {
    // Get token from header
    const authHeader = req.headers.authorization
    // authorization header format: "Bearer eyJhbGci..."

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, error: 'No token provided' })
      return
    }

    const token = authHeader.split(' ')[1]
    // "Bearer eyJhbGci..." → split by space → take index 1
    // gives just the token without "Bearer "

    const decoded = authService.verifyToken(token)
    req.user = decoded
    // attach user data to request
    // now any route handler can access req.user

    next()  // token valid — continue to route handler

  } catch (err) {
    next(err)  // token invalid — goes to error handler → 401
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (req.user?.role !== 'admin') {
    res.status(403).json({ success: false, error: 'Admin access required' })
    return
  }
  next()
}