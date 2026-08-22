import { TaskModel, ITask } from '../models/task.schema'
import { NewTask, UpdateTask } from '../models/task.model'

export const taskService = {
  async getAll(): Promise<ITask[]> {
    return TaskModel.find().sort({ createdAt: -1 })
    // find() = get all documents
    // sort({ createdAt: -1 }) = newest first
  },

  async getById(id: string): Promise<ITask | null> {
    return TaskModel.findById(id)
    // findById = find by _id field
    // returns null if not found
  },

  async create(data: NewTask, userId?: string): Promise<ITask> {
    const task = new TaskModel({
      ...data,
      createdBy: userId
    })
    return task.save()
    // save() triggers pre-save hooks
    // validates against schema
    // saves to MongoDB
  },

  async update(id: string, data: UpdateTask): Promise<ITask | null> {
    return TaskModel.findByIdAndUpdate(
      id,
      { $set: data },
      // $set = only update specified fields
      // without $set = replaces entire document
      { new: true, runValidators: true }
      // new: true = return updated document
      // runValidators = validate against schema on update
    )
  },

  async delete(id: string): Promise<boolean> {
    const result = await TaskModel.findByIdAndDelete(id)
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