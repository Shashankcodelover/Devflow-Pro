import mongoose, { Schema, Document } from 'mongoose'

// Document extends our Task with Mongoose fields (_id, __v)
export interface ITask extends Document {
  title: string
  status: 'done' | 'pending'
  priority: 'high' | 'medium' | 'low'
  createdBy: mongoose.Types.ObjectId  // reference to User
  createdAt: Date
  updatedAt: Date
}

const TaskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [1, 'Title cannot be empty'],
      maxlength: [200, 'Title too long']
    },
    status: {
      type: String,
      enum: ['done', 'pending'],
      default: 'pending'
    },
    priority: {
      type: String,
      enum: ['high', 'medium', 'low'],
      required: [true, 'Priority is required']
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
      // ref tells Mongoose which model to use for populate()
    }
  },
  {
    timestamps: true
    // automatically adds createdAt and updatedAt fields
    // updates updatedAt on every save
  }
)

// Index — makes queries by status and priority fast
TaskSchema.index({ status: 1 })
TaskSchema.index({ priority: 1 })
TaskSchema.index({ createdBy: 1 })
// 1 = ascending index, -1 = descending

// Virtual — computed property, not stored in DB
TaskSchema.virtual('isOverdue').get(function() {
  return this.status === 'pending' &&
    Date.now() - this.createdAt.getTime() > 7 * 24 * 60 * 60 * 1000
  // pending for more than 7 days = overdue
})

// Pre-save hook — runs before every save
TaskSchema.pre('save', async function() {
  console.log(`Saving task: ${this.title}`)
})

export const TaskModel = mongoose.model<ITask>('Task', TaskSchema)
// 'Task' = collection name in MongoDB will be 'tasks' (pluralized automatically)