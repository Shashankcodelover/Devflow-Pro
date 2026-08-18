import { useState, useEffect } from 'react'

export default function SessionTimer() {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60)
    const secs = sec % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div style={{ fontSize: '13px', color: 'gray', marginBottom: '12px' }}>
      Session duration: <strong>{formatTime(seconds)}</strong>
    </div>
  )
}
