import { TaskModel, ITask } from '../models/task.schema'
import { NewTask, UpdateTask } from '../models/task.model'
import { cacheService } from './cacheService'

export const taskService = {
  async getAll(): Promise<ITask[]> {
    const cacheKey = 'tasks:all'

    // Step 1 — check cache first
    const cached = await cacheService.get<ITask[]>(cacheKey)
    if (cached) {
      console.log('Cache HIT — returning from Redis')
      return cached
    }

    // Step 2 — cache miss — query MongoDB
    console.log('Cache MISS — querying MongoDB')
    const tasks = await TaskModel.find().sort({ createdAt: -1 })

    // Step 3 — store in Redis for 5 minutes
    await cacheService.set(cacheKey, tasks, 300)

    return tasks
  },

  async getById(id: string): Promise<ITask | null> {
    return TaskModel.findById(id)
    // findById = find by _id field
    // returns null if not found
  },

  async create(data: NewTask, userId?: string): Promise<ITask> {
    const task = new TaskModel({ ...data, createdBy: userId })
    const saved = await task.save()

    // Invalidate cache — data changed
    await cacheService.delete('tasks:all')
    // next GET will fetch fresh from MongoDB

    return saved
  },

  async update(id: string, data: UpdateTask): Promise<ITask | null> {
    const task = await TaskModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    )
    await cacheService.delete('tasks:all')
    return task
  },

  async delete(id: string): Promise<boolean> {
    const result = await TaskModel.findByIdAndDelete(id)
    await cacheService.delete('tasks:all')
    return result !== null
  },

  // Aggregation pipeline — advanced query
  async getStats(): Promise<{
    total: number
    done: number
    pending: number
    byPriority: { _id: string; count: number }[]
  }> {
    const stats = await TaskModel.aggregate([
      // Stage 1 — group all documents
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          done: {
            $sum: { $cond: [{ $eq: ['$status', 'done'] }, 1, 0] }
          },
          pending: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          }
        }
      }
    ])

    const byPriority = await TaskModel.aggregate([
      // Stage 1 — group by priority
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      },
      // Stage 2 — sort by count
      { $sort: { count: -1 } }
    ])

    return {
      total: stats[0]?.total || 0,
      done: stats[0]?.done || 0,
      pending: stats[0]?.pending || 0,
      byPriority
    }
  }
}