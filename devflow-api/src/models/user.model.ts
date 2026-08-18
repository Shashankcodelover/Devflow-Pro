export interface User {
  id: number
  name: string
  email: string
  password: string  // stored as bcrypt hash — never plain text
  role: 'admin' | 'user'
  createdAt: Date
}

export type RegisterInput = Pick<User, 'name' | 'email' | 'password'>
export type LoginInput = Pick<User, 'email' | 'password'>

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: Omit<User, 'password'>  // never send password back
}