import { create } from 'zustand'

export interface Job {
  id: number
  company: string
  role: string
  status: 'applied' | 'interview' | 'offer' | 'rejected'
}

interface JobStore {
  jobs: Job[]
  addJob: (company: string, role: string) => void
  updateStatus: (id: number, status: Job['status']) => void
  deleteJob: (id: number) => void
}

const useJobStore = create<JobStore>((set) => ({
  jobs: [],
  addJob: (company, role) => set((state) => ({
    jobs: [...state.jobs, {
      id: Math.floor(Math.random() * 1000),
      company, role, status: 'applied'
    }]
  })),
  updateStatus: (id, status) => set((state) => ({
    jobs: state.jobs.map(j => j.id === id ? { ...j, status } : j)
  })),
  deleteJob: (id) => set((state) => ({
    jobs: state.jobs.filter(j => j.id !== id)
  }))
}))

export default useJobStore
