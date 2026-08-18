// src/services/taskService.ts
import { Task, NewTask, UpdateTask } from '../models/task.model'

// In-memory storage — MongoDB replaces this Day 13
let tasks: Task[] = [
  { id: 1, title: 'Learn Node',    status: 'pending', priority: 'high',   createdAt: new Date() },
  { id: 2, title: 'Build API',     status: 'pending', priority: 'high',   createdAt: new Date() },
  { id: 3, title: 'Setup MongoDB', status: 'pending', priority: 'medium', createdAt: new Date() }
]
let nextId = 4

export const taskService = {
  // get all tasks
  getAll(): Task[] {
    return tasks
  },

  // get one task by id — returns undefined if not found
  getById(id: number): Task | undefined {
    return tasks.find(t => t.id === id)
  },

  // create new task — server generates id and createdAt
  create(data: NewTask): Task {
    const task: Task = {
      id: nextId++,
      ...data,
      createdAt: new Date()
    }
    tasks.push(task)
    return task
  },

  // update task — only fields sent get updated
  update(id: number, data: UpdateTask): Task | undefined {
    const index = tasks.findIndex(t => t.id === id)
    if (index === -1) return undefined
    tasks[index] = { ...tasks[index], ...data }
    return tasks[index]
  },

  // delete task — returns true if deleted, false if not found
  delete(id: number): boolean {
    const index = tasks.findIndex(t => t.id === id)
    if (index === -1) return false
    tasks.splice(index, 1)
    return true
  }
}