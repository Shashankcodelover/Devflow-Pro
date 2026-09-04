import { Request, Response, NextFunction } from 'express'
import { jobService } from '../services/jobService'
import { getIO } from '../socket'

export const jobController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const jobs = await jobService.getAll()
      res.json({ success: true, data: jobs })
    } catch (err) { next(err) }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string
      const job = await jobService.getById(id)
      if (!job) {
        res.status(404).json({ success: false, error: 'Job not found' })
        return
      }
      res.json({ success: true, data: job })
    } catch (err) { next(err) }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { company, role, status, salary_min, salary_max, location } = req.body
      if (!company || !role) {
        res.status(400).json({ error: 'company and role required' })
        return
      }
      const job = await jobService.create({
        company,
        role,
        status: status || 'applied',
        salary_min,
        salary_max,
        location
      })

      getIO()?.emit('job:new', job)

      res.status(201).json({ success: true, data: job })
    } catch (err) { next(err) }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string, 10)
      const { status } = req.body
      const job = await jobService.update(id, status || req.body)
      if (!job) {
        res.status(404).json({ error: 'Job not found' })
        return
      }

      getIO()?.emit('job:update', job)
      res.json({ success: true, data: job })
    } catch (err) { next(err) }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string, 10)
      await jobService.delete(id)
      getIO()?.emit('job:delete', { id })

      res.status(204).send()
    } catch (err) { next(err) }
  },

  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await jobService.getStats()
      res.json({ success: true, data: stats })
    } catch (err) { next(err) }
  }
}
