import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { TaskProvider } from './store/TaskContext'
import { Navbar } from './components/Navbar'
import { TaskModal } from './components/TaskModal'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import { TasksPage } from './pages/TasksPage'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { SettingsPage } from './pages/SettingsPage'
import Login from './pages/Login'
import Jobs from './pages/Jobs'

export function App() {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)

  return (
    <TaskProvider>
      <Router>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#0f1117' }}>
          <Navbar onOpenTaskModal={() => setIsTaskModalOpen(true)} />
          
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/tasks" element={<ProtectedRoute><TasksPage onOpenTaskModal={() => setIsTaskModalOpen(true)} /></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
              <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
            </Routes>
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
