import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
      setError(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '40px', maxWidth: '400px', margin: '60px auto' }}>
      <h2>Create Account</h2>
      {error && <p style={{ color: 'red', fontSize: '13px' }}>{error}</p>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
        <input placeholder="Full name" value={name}
          onChange={e => setName(e.target.value)}
          style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
        <input type="email" placeholder="Email" value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
        <input type="password" placeholder="Password (min 6 chars)" value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
        <button onClick={handleRegister} disabled={loading}
          style={{
            padding: '10px',
            background: loading ? '#ccc' : '#534AB7',
            color: 'white', border: 'none',
            borderRadius: '6px', cursor: 'pointer'
          }}>
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </div>
      <p style={{ marginTop: '16px', fontSize: '13px', color: 'gray' }}>
        Have account?{' '}
        <span style={{ color: '#534AB7', cursor: 'pointer' }}
          onClick={() => navigate('/login')}>
          Login
        </span>
      </p>
    </div>
  )
}

export default Register