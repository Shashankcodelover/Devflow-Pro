import { useState, lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { TaskProvider } from './store/TaskContext'
import { Navbar } from './components/Navbar'
import { TaskModal } from './components/TaskModal'
import ProtectedRoute from './components/ProtectedRoute'

// Route-level code splitting with React.lazy
const Dashboard = lazy(() => import('./pages/Dashboard'))
const TasksPage = lazy(() => import('./pages/TasksPage'))
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Jobs = lazy(() => import('./pages/Jobs'))
const SprintCopilot = lazy(() => import('./pages/SprintCopilot'))

export function App() {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)

  return (
    <TaskProvider>
      <Router>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#0f1117' }}>
          <Navbar onOpenTaskModal={() => setIsTaskModalOpen(true)} />
          
          <main style={{ flex: 1 }}>
            <Suspense fallback={
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '50vh',
                color: '#9ca3af',
                gap: '12px'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  border: '3px solid rgba(255, 255, 255, 0.1)',
                  borderTopColor: '#6366f1',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite'
                }} />
                <span style={{ fontSize: '0.9rem' }}>Loading page...</span>
              </div>
            }>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/copilot" element={<ProtectedRoute><SprintCopilot /></ProtectedRoute>} />
                <Route path="/tasks" element={<ProtectedRoute><TasksPage onOpenTaskModal={() => setIsTaskModalOpen(true)} /></ProtectedRoute>} />
                <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
                <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
              </Routes>
            </Suspense>
          </main>

          <TaskModal
            isOpen={isTaskModalOpen}
            onClose={() => setIsTaskModalOpen(false)}
          />
        </div>
      </Router>
    </TaskProvider>
  )
}

export default App
