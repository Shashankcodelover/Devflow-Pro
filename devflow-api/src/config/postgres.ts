import { Pool } from 'pg'

const connectionString = process.env.SUPABASE_URL || process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/devflow'

const pool = new Pool({
  connectionString,
  ssl: process.env.NODE_ENV === 'production' || process.env.SUPABASE_URL ? { rejectUnauthorized: false } : false
})

// Test connection
pool.connect((err, client, release) => {
  if (err) {
    console.warn('PostgreSQL connection notice:', err.message)
    return
  }
  console.log('PostgreSQL connected successfully')
  if (release) release()
})

export default pool