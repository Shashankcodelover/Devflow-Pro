// src/controllers/taskController.ts
import { Request, Response, NextFunction } from 'express';
import { taskService } from '../services/taskService';
import { NewTask, UpdateTask } from '../models/task.model';
import { topologyService } from '../services/topologyService';
import { getIO } from '../socket';

export const taskController = {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tasks = await taskService.getAll();
      res.json({ success: true, data: tasks, count: tasks.length });
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const task = await taskService.getById(id);
      if (!task) {
        res.status(404).json({ success: false, error: `Task not found` });
        return;
      }
      res.json({ success: true, data: task });
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { title, priority, status } = req.body;
      if (!title || typeof title !== 'string' || !title.trim()) {
        res.status(400).json({ success: false, error: 'title is required' });
        return;
      }
      const newTask = await taskService.create({
        title: title.trim(),
        priority,
        status: status || 'pending',
      });
      getIO()?.emit('task:new', newTask);
      res.status(201).json({ success: true, data: newTask });
    } catch (err) {
      next(err);
    }
  },

  async upload(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const contentType = req.headers['content-type'] || '';
      let parsedTasks: NewTask[] = [];

      if (contentType.includes('application/json')) {
        const body = req.body;
        const items = Array.isArray(body) ? body : body.tasks || [];
        parsedTasks = items.map((i: any) => ({
          title: i.title || 'Ingested Sprint Task',
          priority: i.priority || 'medium',
          status: i.status || 'pending',
        }));
      } else {
        const rawText = typeof req.body === 'string' ? req.body : '';
        const rows = topologyService.parseCSV(rawText);
        parsedTasks = rows.map((r: any) => ({
          title: r.title || r.task || 'CSV Ingested Task',
          priority: (r.priority as any) || 'medium',
          status: (r.status as any) || 'pending',
        }));
      }

      if (parsedTasks.length === 0) {
        res.status(400).json({ success: false, error: 'No valid task records found in payload' });
        return;
      }

      const result = await taskService.bulkCreate(parsedTasks);
      getIO()?.emit('task:bulk', result);
      res.json({
        success: true,
        message: `Successfully ingested ${result.added} sprint tasks into active backlog`,
        addedCount: result.added,
        totalCount: result.total,
        tasks: parsedTasks.slice(0, 5),
      });
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const task = await taskService.update(id, req.body);
      if (!task) {
        res.status(404).json({ success: false, error: `Task not found` });
        return;
      }
      res.json({ success: true, data: task });
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const deleted = await taskService.delete(id);
      if (!deleted) {
        res.status(404).json({ success: false, error: `Task not found` });
        return;
      }
      res.json({
        success: true,
        message: `Task ${id} permanently deleted with sprint dependency cascading cleanup`,
        deletedId: id,
      });
    } catch (err) {
      next(err);
    }
  },

  async deleteAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const count = await taskService.deleteAll();
      res.json({ success: true, message: `Purged ${count} tasks from backlog`, count });
    } catch (err) {
      next(err);
    }
  },

  async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await taskService.getStats();
      res.json({ success: true, data: stats });
    } catch (err) {
      next(err);
    }
  },
};
