import apiClient from './client'
import type { Task, NewTask } from '../store/taskReducer'

export const taskApi = {
  async getAll(): Promise<Task[]> {
    const response = await apiClient.get('/api/tasks')
    return response.data.data
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