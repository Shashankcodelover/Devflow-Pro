import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { TaskProvider } from './store/TaskContext'
import { Navbar } from './components/Navbar'
import { TaskModal } from './components/TaskModal'
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
              <Route path="/" element={<Dashboard />} />
              <Route path="/tasks" element={<TasksPage onOpenTaskModal={() => setIsTaskModalOpen(true)} />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/jobs" element={<Jobs />} />
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
