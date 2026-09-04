import pool from '../config/postgres'

export interface Job {
  id: number
  company: string
  role: string
  status: 'applied' | 'interview' | 'offer' | 'rejected'
  salary_min?: number
  salary_max?: number
  location?: string
  created_at?: Date
  updated_at?: Date
}

export type NewJob = Omit<Job, 'id' | 'created_at' | 'updated_at'>
export type UpdateJob = Partial<NewJob>

// Auto-initialize jobs table and columns in PostgreSQL if they do not exist yet
async function initJobsTable(): Promise<void> {
  const queryText = `
    CREATE TABLE IF NOT EXISTS jobs (
      id SERIAL PRIMARY KEY,
      company VARCHAR(255) NOT NULL,
      role VARCHAR(255) NOT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'applied',
      salary_min NUMERIC,
      salary_max NUMERIC,
      location VARCHAR(255),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    ALTER TABLE jobs ADD COLUMN IF NOT EXISTS salary_min NUMERIC;
    ALTER TABLE jobs ADD COLUMN IF NOT EXISTS salary_max NUMERIC;
    ALTER TABLE jobs ADD COLUMN IF NOT EXISTS location VARCHAR(255);
    ALTER TABLE jobs ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
  `
  try {
    await pool.query(queryText)
  } catch (err) {
    console.warn('Unable to verify/create jobs table in PostgreSQL:', (err as Error).message)
  }
}

// Trigger initial table setup
initJobsTable()

export const jobService = {
  async getAll(): Promise<Job[]> {
    const result = await pool.query(
      'SELECT * FROM jobs ORDER BY created_at DESC'
    )
    return result.rows
  },

  async getById(id: number | string): Promise<Job | null> {
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id
    if (isNaN(numericId)) return null
    const result = await pool.query(
      'SELECT * FROM jobs WHERE id = $1',
      [numericId]
    )
    return result.rows[0] || null
  },

  async create(data: {
    company: string
    role: string
    status?: string
    salary_min?: number
    salary_max?: number
    location?: string
  }): Promise<Job> {
    const result = await pool.query(
      `INSERT INTO jobs (company, role, status, salary_min, salary_max, location)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        data.company,
        data.role,
        data.status || 'applied',
        data.salary_min ?? null,
        data.salary_max ?? null,
        data.location ?? null
      ]
    )
    return result.rows[0]
  },

  async update(id: number | string, data: UpdateJob | string): Promise<Job | null> {
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id
    if (isNaN(numericId)) return null

    if (typeof data === 'string') {
      const result = await pool.query(
        `UPDATE jobs SET status = $1, updated_at = NOW()
         WHERE id = $2 RETURNING *`,
        [data, numericId]
      )
      return result.rows[0] || null
    }

    const result = await pool.query(
      `UPDATE jobs 
       SET company = COALESCE($1, company), 
           role = COALESCE($2, role), 
           status = COALESCE($3, status),
           salary_min = COALESCE($4, salary_min),
           salary_max = COALESCE($5, salary_max),
           location = COALESCE($6, location),
           updated_at = NOW()
       WHERE id = $7 
       RETURNING *`,
      [
        data.company ?? null,
        data.role ?? null,
        data.status ?? null,
        data.salary_min ?? null,
        data.salary_max ?? null,
        data.location ?? null,
        numericId
      ]
    )
    return result.rows[0] || null
  },

  async delete(id: number | string): Promise<boolean> {
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id
    if (isNaN(numericId)) return false
    const result = await pool.query('DELETE FROM jobs WHERE id = $1 RETURNING *', [numericId])
    return (result.rowCount ?? 0) > 0
  },

  async getStats() {
    const result = await pool.query(`
      SELECT
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'applied'   THEN 1 END) as applied,
        COUNT(CASE WHEN status = 'interview' THEN 1 END) as interview,
        COUNT(CASE WHEN status = 'offer'     THEN 1 END) as offer,
        COUNT(CASE WHEN status = 'rejected'  THEN 1 END) as rejected,
        AVG(salary_min) as avg_salary
      FROM jobs
    `)
    return result.rows[0]
  }
}
