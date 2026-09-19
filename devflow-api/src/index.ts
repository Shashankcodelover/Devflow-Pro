import dns from 'dns'
dns.setServers(['8.8.8.8', '8.8.4.4'])
import path from 'path'
import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import taskRoutes from './routes/taskRoutes'
import authRoutes from './routes/authRoutes'
import jobRoutes from './routes/jobRoutes'
import copilotRoutes from './routes/copilotRoutes'
import topologyRoutes from './routes/topologyRoutes'
import { errorHandler } from './middleware/errorHandler'
import { connectDatabase } from './config/database'
import { rateLimiter } from './middleware/rateLimiter'

dotenv.config()

const app = express()
const httpServer = createServer(app)
// createServer wraps Express app in Node HTTP server
// Socket.io needs direct access to HTTP server
// not just the Express app

import { setIO } from './socket'

const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:5173', 'http://shashankj.tech', 'https://shashankj.tech'],
    methods: ['GET', 'POST']
  }
})
setIO(io)
// Socket.io server attached to HTTP server
// cors allows React frontend to connect

const PORT = process.env.PORT || 3001

// Middleware
app.use(helmet())
app.use(cors({ 
  origin: ['http://localhost:5173', 'http://shashankj.tech', 'https://shashankj.tech'],
  credentials: true
}))
app.use(morgan('dev'))
app.use(express.json())
app.use(express.text({ limit: '15mb', type: ['text/plain', 'text/csv', 'application/csv'] }))
app.use(cookieParser())
app.use(rateLimiter)

// Routes
app.use('/api/tasks', taskRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/jobs', jobRoutes)
app.use('/api/copilot', copilotRoutes)
app.use('/api/topology', topologyRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Static frontend serving & SPA fallback
const frontendDist = path.resolve(__dirname, '../../devflow-pro/dist')
app.use(express.static(frontendDist))
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.startsWith('/socket.io') && req.path !== '/health') {
    return res.sendFile(path.join(frontendDist, 'index.html'))
  }
  next()
})

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`)
  // socket.id = unique ID for this connection
  // every browser tab gets different socket.id

  // Join a room — user joins their own room
  socket.on('join', (userId: string) => {
    socket.join(`user:${userId}`)
    console.log(`User ${userId} joined room user:${userId}`)
  })
  // socket.join() = subscribe to a room
  // rooms allow targeted messaging
  // instead of broadcasting to everyone

  // Listen for task created event from client
  socket.on('task:create', (task) => {
    // broadcast to ALL connected users
    io.emit('task:new', task)
    // io.emit = send to everyone
    // socket.emit = send only to this user
    // io.to('room').emit = send to specific room
  })

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`)
  })
})

// Export io so controllers can emit events
export { io }

// Call before starting server
connectDatabase().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`DevFlow API running on http://localhost:${PORT}`)
  })
})

app.use(errorHandler)