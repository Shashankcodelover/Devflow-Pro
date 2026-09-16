import pool from '../config/postgres';

export interface Job {
  id: number;
  company: string;
  role: string;
  status: 'applied' | 'interview' | 'offer' | 'rejected';
  salary_min?: number;
  salary_max?: number;
  location?: string;
  created_at?: Date;
  updated_at?: Date;
}

export type NewJob = Omit<Job, 'id' | 'created_at' | 'updated_at'>;
export type UpdateJob = Partial<NewJob>;

let inMemoryJobs: Job[] = [
  {
    id: 1,
    company: 'Anthropic',
    role: 'Staff Distributed Systems Engineer',
    status: 'interview',
    salary_min: 240000,
    salary_max: 320000,
    location: 'San Francisco, CA (Hybrid)',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 2,
    company: 'Stripe',
    role: 'Senior Core Infrastructure Engineer',
    status: 'offer',
    salary_min: 210000,
    salary_max: 275000,
    location: 'Seattle, WA (Remote)',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 3,
    company: 'Linear',
    role: 'Full-Stack Performance Engineer',
    status: 'applied',
    salary_min: 190000,
    salary_max: 240000,
    location: 'Remote Global',
    created_at: new Date(),
    updated_at: new Date(),
  },
];

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
  `;
  try {
    await pool.query(queryText);
  } catch (err) {
    console.warn('PostgreSQL notice: using in-memory jobs fallback if connection unavailable');
  }
}

initJobsTable();

export const jobService = {
  async getAll(): Promise<Job[]> {
    try {
      const result = await pool.query('SELECT * FROM jobs ORDER BY created_at DESC');
      if (result.rows && result.rows.length > 0) return result.rows;
      return inMemoryJobs;
    } catch {
      return inMemoryJobs;
    }
  },

  async getById(id: number | string): Promise<Job | null> {
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    if (isNaN(numericId)) return null;
    try {
      const result = await pool.query('SELECT * FROM jobs WHERE id = $1', [numericId]);
      if (result.rows && result.rows.length > 0) return result.rows[0];
      return inMemoryJobs.find((j) => j.id === numericId) || null;
    } catch {
      return inMemoryJobs.find((j) => j.id === numericId) || null;
    }
  },

  async create(data: {
    company: string;
    role: string;
    status?: string;
    salary_min?: number;
    salary_max?: number;
    location?: string;
  }): Promise<Job> {
    try {
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
          data.location ?? null,
        ]
      );
      if (result.rows && result.rows[0]) return result.rows[0];
    } catch {
      // Fallback in memory
    }

    const newJob: Job = {
      id: inMemoryJobs.length > 0 ? Math.max(...inMemoryJobs.map((j) => j.id)) + 1 : 1,
      company: data.company,
      role: data.role,
      status: (data.status as any) || 'applied',
      salary_min: data.salary_min,
      salary_max: data.salary_max,
      location: data.location,
      created_at: new Date(),
      updated_at: new Date(),
    };
    inMemoryJobs = [newJob, ...inMemoryJobs];
    return newJob;
  },

  async bulkCreate(jobs: NewJob[]): Promise<{ added: number; total: number }> {
    const createdList: Job[] = [];
    for (const j of jobs) {
      const created = await this.create(j);
      createdList.push(created);
    }
    const all = await this.getAll();
    return { added: createdList.length, total: all.length };
  },

  async update(id: number | string, data: UpdateJob | string): Promise<Job | null> {
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    if (isNaN(numericId)) return null;

    try {
      if (typeof data === 'string') {
        const result = await pool.query(
          `UPDATE jobs SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
          [data, numericId]
        );
        if (result.rows && result.rows[0]) return result.rows[0];
      } else {
        const result = await pool.query(
          `UPDATE jobs 
           SET company = COALESCE($1, company), 
               role = COALESCE($2, role), 
               status = COALESCE($3, status),
               salary_min = COALESCE($4, salary_min),
               salary_max = COALESCE($5, salary_max),
               location = COALESCE($6, location),
               updated_at = NOW()
           WHERE id = $7 RETURNING *`,
          [
            data.company ?? null,
            data.role ?? null,
            data.status ?? null,
            data.salary_min ?? null,
            data.salary_max ?? null,
            data.location ?? null,
            numericId,
          ]
        );
        if (result.rows && result.rows[0]) return result.rows[0];
      }
    } catch {
      // Fallback in memory
    }

    const idx = inMemoryJobs.findIndex((j) => j.id === numericId);
    if (idx !== -1) {
      if (typeof data === 'string') {
        inMemoryJobs[idx].status = data as any;
      } else {
        inMemoryJobs[idx] = { ...inMemoryJobs[idx], ...data, updated_at: new Date() };
      }
      return inMemoryJobs[idx];
    }
    return null;
  },

  async delete(id: number | string): Promise<boolean> {
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    if (isNaN(numericId)) return false;

    let pgSuccess = false;
    try {
      const result = await pool.query('DELETE FROM jobs WHERE id = $1 RETURNING *', [numericId]);
      pgSuccess = (result.rowCount ?? 0) > 0;
    } catch {
      // ignore
    }

    const before = inMemoryJobs.length;
    inMemoryJobs = inMemoryJobs.filter((j) => j.id !== numericId);
    return pgSuccess || inMemoryJobs.length < before;
  },

  async deleteAll(): Promise<number> {
    try {
      await pool.query('DELETE FROM jobs');
    } catch {
      // ignore
    }
    const count = inMemoryJobs.length;
    inMemoryJobs = [];
    return count;
  },

  async getStats() {
    try {
      const result = await pool.query(`
        SELECT
          COUNT(*) as total,
          COUNT(CASE WHEN status = 'applied'   THEN 1 END) as applied,
          COUNT(CASE WHEN status = 'interview' THEN 1 END) as interview,
          COUNT(CASE WHEN status = 'offer'     THEN 1 END) as offer,
          COUNT(CASE WHEN status = 'rejected'  THEN 1 END) as rejected,
          AVG(salary_min) as avg_salary
        FROM jobs
      `);
      if (result.rows && result.rows[0] && Number(result.rows[0].total) > 0) {
        return result.rows[0];
      }
    } catch {
      // ignore
    }

    return {
      total: inMemoryJobs.length,
      applied: inMemoryJobs.filter((j) => j.status === 'applied').length,
      interview: inMemoryJobs.filter((j) => j.status === 'interview').length,
      offer: inMemoryJobs.filter((j) => j.status === 'offer').length,
      rejected: inMemoryJobs.filter((j) => j.status === 'rejected').length,
      avg_salary:
        inMemoryJobs.reduce((acc, j) => acc + (j.salary_min || 0), 0) /
        (inMemoryJobs.length || 1),
    };
  },
};
