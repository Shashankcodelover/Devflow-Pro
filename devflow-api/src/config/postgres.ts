import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.SUPABASE_URL,
  ssl: { rejectUnauthorized: false }
  // ssl required for Supabase connection
  // rejectUnauthorized: false = accept Supabase's certificate
})

// Test connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('PostgreSQL connection failed:', err.message)
    return
  }
  console.log('PostgreSQL connected successfully')
  release()
  // release() returns connection back to pool
  // connection pooling — shared connections, not one per request
})

export default pool