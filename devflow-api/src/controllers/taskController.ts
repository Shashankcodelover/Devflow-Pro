// src/controllers/taskController.ts
import { Request, Response, NextFunction } from 'express'
import { taskService } from '../services/taskService'
import { NewTask, UpdateTask } from '../models/task.model'
import { io } from '../index'
// import the Socket.io instance

export const taskController = {

  // GET /api/tasks
  getAll(req: Request, res: Response): void {
    const tasks = taskService.getAll()
    res.json({ success: true, data: tasks, count: tasks.length })
  },

  // GET /api/tasks/:id
  getById(req: Request, res: Response, next: NextFunction): void {
    const id = parseInt(req.params.id as string)

    if (isNaN(id)) {
      res.status(400).json({ success: false, error: 'Invalid ID format' })
      return
    }

    const task = taskService.getById(id)

    if (!task) {
      res.status(404).json({ success: false, error: `Task ${id} not found` })
      return
    }

    res.json({ success: true, data: task })
  },

  // POST /api/tasks


// Inside create method — after task created:
  create(req: Request, res: Response): void {
    const { title, priority, status } = req.body

    if (!title || typeof title !== 'string' || title.trim() === '') {
      res.status(400).json({ success: false, error: 'title is required' })
      return
    }

    if (!priority || !['high', 'medium', 'low'].includes(priority)) {
      res.status(400).json({ success: false, error: 'priority must be high, medium or low' })
      return
    }

    const newTask = taskService.create({
      title: title.trim(),
      priority,
      status: status || 'pending'
    })

    // Emit to ALL connected clients
    io.emit('task:new', newTask)
    // everyone sees new task in real time

    res.status(201).json({ success: true, data: newTask })
  },

  // PATCH /api/tasks/:id
  update(req: Request, res: Response): void {
    const id = parseInt(req.params.id as string)

    const task = taskService.update(id, req.body as UpdateTask)

    if (!task) {
      res.status(404).json({ success: false, error: `Task ${id} not found` })
      return
    }

    res.json({ success: true, data: task })
  },

  // DELETE /api/tasks/:id
  delete(req: Request, res: Response): void {
    const id = parseInt(req.params.id as string)
    const deleted = taskService.delete(id)

    if (!deleted) {
      res.status(404).json({ success: false, error: `Task ${id} not found` })
      return
    }

    res.status(204).send()
  }
}