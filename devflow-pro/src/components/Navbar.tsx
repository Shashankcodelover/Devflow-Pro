import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  CheckSquare, 
  BarChart3, 
  Settings, 
  Briefcase,
  Plus, 
  Zap, 
  Wifi, 
  WifiOff,
  LogOut,
  LogIn,
  Network,
  UploadCloud
} from 'lucide-react'
import { useTaskStore } from '../store/useTaskStore'

interface NavbarProps {
  onOpenTaskModal: () => void
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenTaskModal }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { error } = useTaskStore()
  const isBackendConnected = !error
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    navigate('/login')
  }

  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: '🧠 Sprint Copilot', path: '/copilot', icon: Zap },
    { label: 'Topology Mesh', path: '/topology', icon: Network },
    { label: 'Bulk Ingestion', path: '/ingestion', icon: UploadCloud },
    { label: 'Tasks', path: '/tasks', icon: CheckSquare },
    { label: 'Jobs', path: '/jobs', icon: Briefcase },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Settings', path: '/settings', icon: Settings },
  ]

  return (
    <header style={{
      background: 'rgba(22, 25, 34, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '0 24px'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 0 15px rgba(168, 85, 247, 0.4)'
          }}>
            <Zap size={22} />
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>
              DevFlow<span style={{ color: '#a855f7' }}>.Pro</span>
            </span>
            <div style={{ fontSize: '0.68rem', color: '#9ca3af', marginTop: '-2px' }}>
              Developer Workflow Suite
            </div>
          </div>
        </Link>

        {/* Navigation Links (Visible when logged in) */}
        {isLoggedIn && (
          <nav style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="btn"
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    background: isActive ? 'rgba(168, 85, 247, 0.15)' : 'transparent',
                    color: isActive ? '#a855f7' : '#9ca3af',
                    fontWeight: isActive ? 600 : 500,
                    border: isActive ? '1px solid rgba(168, 85, 247, 0.3)' : '1px solid transparent',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        )}

        {/* Right Section: API Status, Action & Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div 
            title={isBackendConnected ? 'Connected to express API at http://localhost:3001' : 'Backend offline - using local store'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 10px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 500,
              background: isBackendConnected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
              color: isBackendConnected ? '#10b981' : '#f59e0b',
              border: `1px solid ${isBackendConnected ? 'rgba(16, 185, 129, 0.25)' : 'rgba(245, 158, 11, 0.25)'}`
            }}
          >
            {isBackendConnected ? <Wifi size={14} /> : <WifiOff size={14} />}
            <span>{isBackendConnected ? 'API Live (3001)' : 'Offline Store'}</span>
          </div>

          {isLoggedIn ? (
            <>
              <button onClick={onOpenTaskModal} className="btn btn-primary">
                <Plus size={18} />
                <span>New Task</span>
              </button>
              <button onClick={handleLogout} className="btn btn-secondary" title="Logout">
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary">
              <LogIn size={18} />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
