import { create } from 'zustand'

export interface Task {
  id: number
  title: string
  status: 'done' | 'pending'
  priority: 'high' | 'medium' | 'low'
  createdAt: string | Date
}

export type NewTaskInput = Omit<Task, 'id' | 'createdAt'>

interface TaskStore {
  tasks: Task[]
  isLoading: boolean
  error: string | null
  filterStatus: 'all' | 'pending' | 'done'
  searchQuery: string
  setFilterStatus: (status: 'all' | 'pending' | 'done') => void
  setSearchQuery: (query: string) => void
  fetchTasks: () => Promise<void>
  addTask: (newTask: NewTaskInput) => Promise<boolean>
  toggleTaskStatus: (id: number) => Promise<void>
  updateTask: (id: number, updates: Partial<Task>) => Promise<boolean>
  deleteTask: (id: number) => Promise<void>
}

const API_BASE = 'http://localhost:3001/api/tasks'

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('accessToken') || 'mock-jwt-token-2026-prod'
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [
    { id: 1, title: 'Build Express REST API', status: 'done', priority: 'high', createdAt: new Date().toISOString() },
    { id: 2, title: 'Connect React Frontend to DevFlow API', status: 'pending', priority: 'high', createdAt: new Date().toISOString() },
    { id: 3, title: 'Implement Real-time WebSockets & Dashboard Analytics', status: 'pending', priority: 'medium', createdAt: new Date().toISOString() }
  ],
  isLoading: false,
  error: null,
  filterStatus: 'all',
  searchQuery: '',

  setFilterStatus: (filterStatus) => set({ filterStatus }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),

  fetchTasks: async () => {
    set({ isLoading: true, error: null })
    try {
      const res = await fetch(API_BASE, {
        headers: getAuthHeaders()
      })
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
      const json = await res.json()
      if (json.success && Array.isArray(json.data)) {
        set({ tasks: json.data, isLoading: false })
      } else {
        set({ isLoading: false })
      }
    } catch (err: any) {
      console.warn('Backend API offline or unreachable, using local store:', err)
      set({ isLoading: false, error: 'Using local task state (Backend offline)' })
    }
  },

  addTask: async (newTaskInput) => {
    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newTaskInput)
      })
      if (res.ok) {
        const json = await res.json()
        if (json.success) {
          set((state) => ({ tasks: [...state.tasks, json.data] }))
          return true
        }
      }
    } catch (err) {
      console.warn('Backend API offline, adding locally:', err)
    }

    // Local fallback
    const localTask: Task = {
      id: Date.now(),
      title: newTaskInput.title,
      priority: newTaskInput.priority,
      status: newTaskInput.status || 'pending',
      createdAt: new Date().toISOString()
    }
    set((state) => ({ tasks: [...state.tasks, localTask] }))
    return true
  },

  toggleTaskStatus: async (id) => {
    const target = get().tasks.find((t) => t.id === id)
    if (!target) return
    const newStatus = target.status === 'done' ? 'pending' : 'done'

    // Optimistic UI update
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    }))

    try {
      await fetch(`${API_BASE}/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus })
      })
    } catch (err) {
      console.warn('Backend API update failed, local optimistic update retained:', err)
    }
  },

  updateTask: async (id, updates) => {
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t))
    }))

    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates)
      })
      return res.ok
    } catch (err) {
      console.warn('Backend API update failed:', err)
      return true
    }
  },

  deleteTask: async (id) => {
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id)
    }))

    try {
      await fetch(`${API_BASE}/${id}`, { 
        method: 'DELETE',
        headers: getAuthHeaders()
      })
    } catch (err) {
      console.warn('Backend API delete failed:', err)
    }
  }
}))
