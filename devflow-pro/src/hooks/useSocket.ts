import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'

const SOCKET_URL = 'http://localhost:3001'

function useSocket(userId?: string) {
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    // Connect to Socket.io server
    socketRef.current = io(SOCKET_URL)

    socketRef.current.on('connect', () => {
      console.log('Connected to server:', socketRef.current?.id)

      // Join personal room if userId provided
      if (userId) {
        socketRef.current?.emit('join', userId)
      }
    })

    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from server')
    })

    // Cleanup — disconnect when component unmounts
    return () => {
      socketRef.current?.disconnect()
      // prevents memory leak
      // connection closes when component leaves screen
    }
  }, [userId])

  return socketRef.current
}

export default useSocket