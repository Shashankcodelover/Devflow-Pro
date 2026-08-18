import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  function handleLogin(): void {
    if (!email || !password) {
      setError('Please enter email and password')
      return
    }
    localStorage.setItem('isLoggedIn', 'true')
    navigate('/')
  }

  return (
    <div style={{ padding: '40px', maxWidth: '400px', margin: '60px auto' }}>
      <h2>Login to DevFlow</h2>
      {error && <p style={{ color: 'red', fontSize: '13px' }}>{error}</p>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
        <input
          type="email" placeholder="Email" value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
        />
        <input
          type="password" placeholder="Password" value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
        />
        <button onClick={handleLogin}
          style={{ padding: '10px', background: '#534AB7', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
          Login
        </button>
      </div>
    </div>
  )
}

export default Login
