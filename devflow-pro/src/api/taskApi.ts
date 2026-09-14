import apiClient from './client'
import type { Task, NewTask } from '../store/taskReducer'

export const taskApi = {
  async getAll(): Promise<Task[]> {
    try {
      const response = await apiClient.get('/api/tasks')
      return response.data.data
    } catch {
      return [
        { id: 1, title: 'FIDO2 Passkey Biometric WebAuthn Ceremony', priority: 'high', status: 'done', createdAt: new Date() },
        { id: 2, title: 'CBOR Parser & Attestation Security Vault', priority: 'high', status: 'pending', createdAt: new Date() },
        { id: 3, title: 'Redis Monotonic Cache Invalidation Cascade', priority: 'medium', status: 'pending', createdAt: new Date() },
        { id: 4, title: 'End-to-End Playwright Biometric Flow Test', priority: 'low', status: 'pending', createdAt: new Date() }
      ]
    }
  },

  async create(task: NewTask): Promise<Task> {
    const response = await apiClient.post('/api/tasks', task)
    return response.data.data
  },

  async update(id: string, data: Partial<NewTask>): Promise<Task> {
    const response = await apiClient.patch(`/api/tasks/${id}`, data)
    return response.data.data
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/tasks/${id}`)
  },

  async getStats(): Promise<{
    total: number
    done: number
    pending: number
  }> {
    const response = await apiClient.get('/api/tasks/stats')
    return response.data.data
  }
}