import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'

function ProtectedRoute({ children }: { children: ReactNode }) {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
  if (!isLoggedIn) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default ProtectedRoute
