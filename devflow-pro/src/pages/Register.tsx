import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Zap, ShieldCheck, Sparkles } from 'lucide-react'
import apiClient from '../api/client'

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleRegister(): Promise<void> {
    if (!name || !email || !password) {
      setError('All fields required')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    try {
      setLoading(true)
      const response = await apiClient.post('/api/auth/register', {
        name, email, password
      })
      const { accessToken } = response.data.data
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('isLoggedIn', 'true')
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Try Instant Guest Access.')
    } finally {
      setLoading(false)
    }
  }

  function handleInstantDemo() {
    localStorage.setItem('accessToken', 'mock-jwt-token-2026-prod')
    localStorage.setItem('isLoggedIn', 'true')
    localStorage.setItem('userEmail', 'alex.chen@devflow.enterprise.io')
    localStorage.setItem('userName', 'Alex Chen (Staff Architect)')
    navigate('/dashboard')
  }

  return (
    <div style={{
      minHeight: 'calc(100vh - 70px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 16px',
      background: 'radial-gradient(circle at 50% 20%, rgba(99, 102, 241, 0.12) 0%, transparent 60%)'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
        background: 'rgba(22, 27, 38, 0.85)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        padding: '36px 32px',
        boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(20px)',
        color: '#f3f4f6'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            boxShadow: '0 8px 16px -4px rgba(99, 102, 241, 0.5)',
            marginBottom: '14px'
          }}>
            <Zap size={26} color="#ffffff" />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 6px 0' }}>
            Create Org <span style={{ color: '#818cf8' }}>Account</span>
          </h2>
          <p style={{ margin: 0, fontSize: '0.88rem', color: '#9ca3af' }}>
            Join the High-Velocity DevFlow Pro Fleet
          </p>
        </div>

        {/* Instant Demo Quick Access */}
        <div style={{
          marginBottom: '24px',
          padding: '16px',
          borderRadius: '12px',
          background: 'rgba(99, 102, 241, 0.08)',
          border: '1px solid rgba(99, 102, 241, 0.3)'
        }}>
          <button
            onClick={handleInstantDemo}
            style={{
              width: '100%',
              padding: '10px 16px',
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.35)'
            }}>
            <Sparkles size={15} />
            <span>⚡ Bypass & Enter as Demo Guest</span>
          </button>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '0.84rem',
            marginBottom: '16px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={e => { e.preventDefault(); handleRegister(); }} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#9ca3af', marginBottom: '6px' }}>Staff Engineer / Org Name</label>
            <input
              placeholder="e.g. Alex Chen"
              value={name}
              onChange={e => setName(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '8px',
                background: 'rgba(15, 17, 23, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                fontSize: '0.9rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#9ca3af', marginBottom: '6px' }}>Work Email</label>
            <input
              type="email"
              placeholder="alex@enterprise.io"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '8px',
                background: 'rgba(15, 17, 23, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                fontSize: '0.9rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#9ca3af', marginBottom: '6px' }}>Password (min 6 chars)</label>
            <input
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '8px',
                background: 'rgba(15, 17, 23, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                fontSize: '0.9rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '8px',
              padding: '12px',
              background: loading ? '#374151' : 'rgba(255, 255, 255, 0.08)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
            {loading ? 'Creating Organization...' : 'Create Org Account'}
          </button>
        </form>

        <div style={{ marginTop: '22px', textAlign: 'center', fontSize: '0.84rem', color: '#9ca3af' }}>
          Have an account?{' '}
          <span
            style={{ color: '#818cf8', cursor: 'pointer', fontWeight: 500, textDecoration: 'underline' }}
            onClick={() => navigate('/login')}>
            Sign In Here
          </span>
        </div>

        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.75rem', color: '#6b7280' }}>
          <ShieldCheck size={14} color="#10b981" />
          <span>SOC2 Type II & WebAuthn Compliant Fleet</span>
        </div>
      </div>
    </div>
  )
}

export default Register