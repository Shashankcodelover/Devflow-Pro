import { createContext, useContext, useReducer, type ReactNode } from 'react'
import { taskReducer, initialState, type TaskState, type TaskAction } from './taskReducer'

interface TaskContextType {
  state: TaskState
  dispatch: React.Dispatch<TaskAction>
}

const TaskContext = createContext<TaskContextType | null>(null)

export function TaskProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(taskReducer, initialState)
  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  )
}

export function useTaskContext(): TaskContextType {
  const context = useContext(TaskContext)
  if (!context) throw new Error('useTaskContext must be inside TaskProvider')
  return context
}
