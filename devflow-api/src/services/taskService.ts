import { TaskModel, ITask } from '../models/task.schema';
import { NewTask, UpdateTask } from '../models/task.model';
import { cacheService } from './cacheService';

let inMemoryTasks: any[] = [
  {
    _id: 'task-init-1',
    title: 'Implement WebAuthn FIDO2 Dual-Factor Authentication',
    status: 'pending',
    priority: 'high',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'task-init-2',
    title: 'Tune Redis rate-limiter bucket leaky algorithms',
    status: 'done',
    priority: 'medium',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'task-init-3',
    title: 'Profile Critical Path Method (CPM) DAG traversal latency',
    status: 'pending',
    priority: 'high',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const taskService = {
  async getAll(): Promise<ITask[]> {
    const cacheKey = 'tasks:all';

    // Step 1 — check cache first
    try {
      const cached = await cacheService.get<ITask[]>(cacheKey);
      if (cached) return cached;
    } catch {
      // cache miss / unavailable
    }

    // Step 2 — query MongoDB or fallback
    if (TaskModel.db?.readyState === 1) {
      try {
        const tasks = await TaskModel.find().sort({ createdAt: -1 });
        if (tasks && tasks.length > 0) {
          await cacheService.set(cacheKey, tasks, 300);
          return tasks;
        }
      } catch {
        // ignore
      }
    }

    return inMemoryTasks as ITask[];
  },

  async getById(id: string): Promise<ITask | null> {
    if (TaskModel.db?.readyState === 1) {
      try {
        const task = await TaskModel.findById(id);
        if (task) return task;
      } catch {
        // ignore
      }
    }
    const found = inMemoryTasks.find((t) => t._id === id || String(t.id) === id);
    return found ? (found as ITask) : null;
  },

  async create(data: NewTask, userId?: string): Promise<ITask> {
    if (TaskModel.db?.readyState === 1) {
      try {
        const task = new TaskModel({ ...data, createdBy: userId });
        const saved = await task.save();
        await cacheService.delete('tasks:all');
        return saved;
      } catch {
        // Fallback
      }
    }

    const newTask = {
      _id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title: data.title,
      priority: data.priority || 'medium',
      status: data.status || 'pending',
      createdBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    inMemoryTasks = [newTask, ...inMemoryTasks];
    return newTask as any;
  },

  async bulkCreate(tasks: NewTask[], userId?: string): Promise<{ added: number; total: number }> {
    const created: any[] = [];
    for (const t of tasks) {
      const c = await this.create(t, userId);
      created.push(c);
    }
    const all = await this.getAll();
    return { added: created.length, total: all.length };
  },

  async update(id: string, data: UpdateTask): Promise<ITask | null> {
    if (TaskModel.db?.readyState === 1) {
      try {
        const task = await TaskModel.findByIdAndUpdate(
          id,
          { $set: data },
          { new: true, runValidators: true }
        );
        if (task) {
          await cacheService.delete('tasks:all');
          return task;
        }
      } catch {
        // Fallback
      }
    }

    const idx = inMemoryTasks.findIndex((t) => t._id === id || String(t.id) === id);
    if (idx !== -1) {
      inMemoryTasks[idx] = { ...inMemoryTasks[idx], ...data, updatedAt: new Date() };
      return inMemoryTasks[idx] as ITask;
    }
    return null;
  },

  async delete(id: string): Promise<boolean> {
    let deleted = false;
    if (TaskModel.db?.readyState === 1) {
      try {
        const result = await TaskModel.findByIdAndDelete(id);
        deleted = result !== null;
        await cacheService.delete('tasks:all');
        if (deleted) return true;
      } catch {
        // Fallback
      }
    }

    const before = inMemoryTasks.length;
    inMemoryTasks = inMemoryTasks.filter((t) => t._id !== id && String(t.id) !== id);
    return deleted || inMemoryTasks.length < before;
  },

  async deleteAll(): Promise<number> {
    try {
      await TaskModel.deleteMany({});
      await cacheService.delete('tasks:all');
    } catch {
      // ignore
    }
    const count = inMemoryTasks.length;
    inMemoryTasks = [];
    return count;
  },

  async getStats(): Promise<{
    total: number;
    done: number;
    pending: number;
    byPriority: { _id: string; count: number }[];
  }> {
    try {
      const stats = await TaskModel.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            done: { $sum: { $cond: [{ $eq: ['$status', 'done'] }, 1, 0] } },
            pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          },
        },
      ]);

      const byPriority = await TaskModel.aggregate([
        { $group: { _id: '$priority', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]);

      if (stats && stats[0]) {
        return {
          total: stats[0].total || 0,
          done: stats[0].done || 0,
          pending: stats[0].pending || 0,
          byPriority,
        };
      }
    } catch {
      // ignore
    }

    const total = inMemoryTasks.length;
    const done = inMemoryTasks.filter((t) => t.status === 'done').length;
    const pending = inMemoryTasks.filter((t) => t.status === 'pending').length;
    const byPriority = [
      { _id: 'high', count: inMemoryTasks.filter((t) => t.priority === 'high').length },
      { _id: 'medium', count: inMemoryTasks.filter((t) => t.priority === 'medium').length },
      { _id: 'low', count: inMemoryTasks.filter((t) => t.priority === 'low').length },
    ];

    return { total, done, pending, byPriority };
  },
};