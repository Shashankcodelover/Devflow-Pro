import { Request, Response, NextFunction } from 'express';
import { jobService, NewJob } from '../services/jobService';
import { topologyService } from '../services/topologyService';
import { getIO } from '../socket';

export const jobController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const jobs = await jobService.getAll();
      res.json({ success: true, data: jobs, count: jobs.length });
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const job = await jobService.getById(id);
      if (!job) {
        res.status(404).json({ success: false, error: 'Job not found' });
        return;
      }
      res.json({ success: true, data: job });
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { company, role, status, salary_min, salary_max, location } = req.body;
      if (!company || !role) {
        res.status(400).json({ error: 'company and role required' });
        return;
      }
      const job = await jobService.create({
        company,
        role,
        status: status || 'applied',
        salary_min,
        salary_max,
        location,
      });

      getIO()?.emit('job:new', job);
      res.status(201).json({ success: true, data: job });
    } catch (err) {
      next(err);
    }
  },

  async upload(req: Request, res: Response, next: NextFunction) {
    try {
      const contentType = req.headers['content-type'] || '';
      let parsedJobs: NewJob[] = [];

      if (contentType.includes('application/json')) {
        const body = req.body;
        const items = Array.isArray(body) ? body : body.jobs || [];
        parsedJobs = items.map((i: any) => ({
          company: i.company || 'Enterprise Employer',
          role: i.role || 'Staff Engineer',
          status: (i.status as any) || 'applied',
          salary_min: i.salary_min ? Number(i.salary_min) : undefined,
          salary_max: i.salary_max ? Number(i.salary_max) : undefined,
          location: i.location || 'Remote',
        }));
      } else {
        const rawText = typeof req.body === 'string' ? req.body : '';
        const rows = topologyService.parseCSV(rawText);
        parsedJobs = rows.map((r: any) => ({
          company: r.company || 'Enterprise Employer',
          role: r.role || 'Staff Engineer',
          status: (r.status as any) || 'applied',
          salary_min: r.salary_min ? parseInt(r.salary_min, 10) : undefined,
          salary_max: r.salary_max ? parseInt(r.salary_max, 10) : undefined,
          location: r.location || 'Remote',
        }));
      }

      if (parsedJobs.length === 0) {
        res.status(400).json({ success: false, error: 'No valid job records found in payload' });
        return;
      }

      const result = await jobService.bulkCreate(parsedJobs);
      getIO()?.emit('job:bulk', result);
      res.json({
        success: true,
        message: `Successfully ingested ${result.added} career opportunity leads into active pipeline`,
        addedCount: result.added,
        totalCount: result.total,
        jobs: parsedJobs.slice(0, 5),
      });
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string, 10);
      const { status } = req.body;
      const job = await jobService.update(id, status || req.body);
      if (!job) {
        res.status(404).json({ error: 'Job not found' });
        return;
      }

      getIO()?.emit('job:update', job);
      res.json({ success: true, data: job });
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string, 10);
      await jobService.delete(id);
      getIO()?.emit('job:delete', { id });

      res.json({
        success: true,
        message: `Job application ${id} permanently removed with interview history purged`,
        deletedId: id,
      });
    } catch (err) {
      next(err);
    }
  },

  async deleteAll(req: Request, res: Response, next: NextFunction) {
    try {
      const count = await jobService.deleteAll();
      res.json({ success: true, message: `Purged ${count} job records`, count });
    } catch (err) {
      next(err);
    }
  },

  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await jobService.getStats();
      res.json({ success: true, data: stats });
    } catch (err) {
      next(err);
    }
  },
};
