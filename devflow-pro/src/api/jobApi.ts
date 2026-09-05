import apiClient from './client'

export interface Job {
  id: number
  company: string
  role: string
  status: 'applied' | 'interview' | 'offer' | 'rejected'
  salary_min?: number
  salary_max?: number
  location?: string
}

export const jobApi = {
  async getAll(): Promise<Job[]> {
    const response = await apiClient.get('/api/jobs')
    return response.data.data
  },

  async create(job: Omit<Job, 'id'>): Promise<Job> {
    const response = await apiClient.post('/api/jobs', job)
    return response.data.data
  },

  async updateStatus(id: number, status: string): Promise<Job> {
    const response = await apiClient.patch(`/api/jobs/${id}`, { status })
    return response.data.data
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/api/jobs/${id}`)
  },

  async getStats(): Promise<any> {
    const response = await apiClient.get('/api/jobs/stats')
    return response.data.data
  }
}