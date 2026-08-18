export interface Task {
  id: number
  title: string
  status: 'done' | 'pending'
  priority: 'high' | 'medium' | 'low'
  createdAt: Date
}

export type NewTask = Omit<Task, 'id' | 'createdAt'>
export type UpdateTask = Partial<NewTask>

export interface TaskState {
  tasks: Task[]
  filter: string
  loading: boolean
}

export type TaskAction =
  | { type: 'ADD_TASK';    payload: Task }
  | { type: 'DELETE_TASK'; payload: number }
  | { type: 'MARK_DONE';   payload: number }
  | { type: 'SET_FILTER';  payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOAD_TASKS';  payload: Task[] }

export const initialState: TaskState = {
  tasks: [],
  filter: 'all',
  loading: true
}

export function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] }
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter(t => t.id !== action.payload) }
    case 'MARK_DONE':
      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.id === action.payload ? { ...t, status: 'done' as const } : t
        )
      }
    case 'SET_FILTER':
      return { ...state, filter: action.payload }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'LOAD_TASKS':
      return { ...state, tasks: action.payload, loading: false }
    default:
      return state
  }
}
