export interface Task {
  id: number
  title: string
  status: 'done' | 'pending'
  priority: 'high' | 'medium' | 'low'
  createdAt: Date
}

export type NewTask = Omit<Task, 'id' | 'createdAt'>
export type UpdateTask = Partial<NewTask>
