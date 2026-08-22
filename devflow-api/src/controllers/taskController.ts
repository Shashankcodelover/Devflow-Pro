// src/controllers/taskController.ts
import { Request, Response, NextFunction } from 'express'
import { taskService } from '../services/taskService'
import { NewTask, UpdateTask } from '../models/task.model'
import { io } from '../index'
// import the Socket.io instance

export const taskController = {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tasks = await taskService.getAll()
      res.json({ success: true, data: tasks, count: tasks.length })
    } catch (err) { next(err) }
  },

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string // 👈 No parseInt!
      const task = await taskService.getById(id)
      if (!task) {
        res.status(404).json({ success: false, error: `Task not found` })
        return
      }
      res.json({ success: true, data: task })
    } catch (err) { next(err) }
  },

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { title, priority, status } = req.body
      if (!title || typeof title !== 'string' || !title.trim()) {
        res.status(400).json({ success: false, error: 'title is required' })
        return
      }
      const newTask = await taskService.create({
        title: title.trim(),
        priority,
        status: status || 'pending'
      })
      io.emit('task:new', newTask)
      res.status(201).json({ success: true, data: newTask })
    } catch (err) { next(err) }
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string
      const task = await taskService.update(id, req.body)
      if (!task) {
        res.status(404).json({ success: false, error: `Task not found` })
        return
      }
      res.json({ success: true, data: task })
    } catch (err) { next(err) }
  },

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string
      const deleted = await taskService.delete(id)
      if (!deleted) {
        res.status(404).json({ success: false, error: `Task not found` })
        return
      }
      res.status(204).send()
    } catch (err) { next(err) }
  },

  async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await taskService.getStats()
      res.json({ success: true, data: stats })
    } catch (err) { next(err) }
  }
}
