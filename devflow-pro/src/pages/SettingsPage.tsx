import React, { useState } from 'react'
import { 
  Server, 
  Bell, 
  Save, 
  Check 
} from 'lucide-react'
import { useTaskStore } from '../store/useTaskStore'

export const SettingsPage: React.FC = () => {
  const { fetchTasks, error } = useTaskStore()
  const [apiUrl, setApiUrl] = useState('http://localhost:3001/api/tasks')
  const [autoSync, setAutoSync] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [isSaved, setIsSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    fetchTasks()
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff', margin: 0 }}>System Settings</h1>
        <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginTop: '4px' }}>
          Configure API endpoints, background synchronization, and preferences.
        </p>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* API Settings */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#a855f7' }}>
            <Server size={20} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff' }}>Backend API Connection</h3>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#9ca3af', marginBottom: '6px' }}>
              Express API Base Endpoint
            </label>
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              className="input-field"
            />
            <div style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: '6px' }}>
              Status: {error ? <span style={{ color: '#f59e0b' }}>Offline (Local Fallback Active)</span> : <span style={{ color: '#10b981' }}>Live & Connected</span>}
            </div>
          </div>
        </div>

        {/* Sync & Notifications */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#3b82f6' }}>
            <Bell size={20} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff' }}>Preferences & Sync</h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 600, color: '#f3f4f6', fontSize: '0.95rem' }}>Auto-Sync Tasks</div>
              <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Automatically poll Express backend for changes</div>
            </div>
            <input
              type="checkbox"
              checked={autoSync}
              onChange={(e) => setAutoSync(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: '#a855f7', cursor: 'pointer' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 600, color: '#f3f4f6', fontSize: '0.95rem' }}>Desktop Notifications</div>
              <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Get notified when high-priority tasks are added</div>
            </div>
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: '#a855f7', cursor: 'pointer' }}
            />
          </div>
        </div>

        {/* Save Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn btn-primary" style={{ padding: '12px 24px' }}>
            {isSaved ? <Check size={18} /> : <Save size={18} />}
            <span>{isSaved ? 'Settings Saved!' : 'Save Changes'}</span>
          </button>
        </div>

      </form>

    </div>
  )
}

export default SettingsPage
