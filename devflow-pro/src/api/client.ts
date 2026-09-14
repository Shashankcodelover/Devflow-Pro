import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// Create axios instance with base config
const apiClient = axios.create({
  baseURL: API_URL,
  // every request automatically prefixed with this
  // axios.get('/api/tasks') → http://localhost:3001/api/tasks

  headers: {
    'Content-Type': 'application/json'
  },

  withCredentials: true
  // send cookies with every request
  // needed for httpOnly refresh token cookie
})

// REQUEST INTERCEPTOR — runs before every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    // get access token from localStorage

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      // attach token to every request automatically
      // no need to manually add it anywhere
    }

    return config
    // must return config to continue request
  },
  (error) => Promise.reject(error)
)

// RESPONSE INTERCEPTOR — runs after every response
apiClient.interceptors.response.use(
  (response) => response,
  // success → pass through unchanged

  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      // 401 = token expired
      // _retry flag prevents infinite loop
      originalRequest._retry = true

      try {
        // Try to get new access token using refresh token
        const response = await axios.post(
          `${API_URL}/api/auth/refresh`,
          {},
          { withCredentials: true }
          // sends httpOnly cookie automatically
        )

        const newToken = response.data.data.accessToken
        localStorage.setItem('accessToken', newToken)
        // save new token

        originalRequest.headers.Authorization = `Bearer ${newToken}`
        // retry original request with new token

        return apiClient(originalRequest)
        // resend the failed request

      } catch {
        // refresh token also expired → logout if not in mock/demo mode
        if (localStorage.getItem('accessToken') !== 'mock-jwt-token-2026-prod') {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('isLoggedIn')
          window.location.href = '/login'
        }
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient