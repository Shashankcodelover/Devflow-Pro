import { useMemo, useEffect } from 'react'
import { io } from 'socket.io-client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { taskApi } from '../api/taskApi'
import type { Task, NewTask } from '../store/taskReducer'
import TaskForm from '../components/TaskForm'
import SessionTimer from '../components/SessionTimer'

function Dashboard() {
  const queryClient = useQueryClient()

  // React Query — fetch real tasks from API
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: taskApi.getAll
  })

  // Mutation — create task via API
  const createTask = useMutation({
    mutationFn: taskApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    }
  })

  // Mutation — mark done via API
  const markDone = useMutation({
    mutationFn: (id: string) => taskApi.update(id, { status: 'done' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    }
  })

  // Mutation — delete via API
  const deleteTask = useMutation({
    mutationFn: taskApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    }
  })

  // Socket.io — real-time updates
  useEffect(() => {
    const socket = io('http://localhost:3001')
    socket.on('task:new', () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    })
    return () => { socket.disconnect() }
  }, [queryClient])

  function handleAddTask(title: string, priority: string): void {
    const newTask: NewTask = {
      title,
      priority: priority as Task['priority'],
      status: 'pending'
    }
    createTask.mutate(newTask)
  }

  const stats = useMemo(() => ({
    total: tasks.length,
    done: tasks.filter((t: Task) => t.status === 'done').length,
    pending: tasks.filter((t: Task) => t.status === 'pending').length
  }), [tasks])

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard</h1>
      <SessionTimer />

      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
        <span>Total: {stats.total}</span>
        <span style={{ color: 'green' }}>Done: {stats.done}</span>
        <span style={{ color: 'orange' }}>Pending: {stats.pending}</span>
      </div>

      <TaskForm onAddTask={handleAddTask} />

      {isLoading && <p>Loading tasks from API...</p>}

      {tasks.map((task: Task) => (
        <div key={task.id} style={{
          padding: '12px 14px', marginBottom: '8px',
          border: '1px solid #ccc', borderRadius: '8px',
          display: 'flex', alignItems: 'center', gap: '10px'
        }}>
          <span>{task.status === 'done' ? '✅' : '⬜'}</span>
          <strong style={{ flex: 1 }}>{task.title}</strong>
          <span style={{ fontSize: '12px', color: 'gray' }}>
            [{task.priority?.toUpperCase()}]
          </span>
          {task.status !== 'done' && (
            <button onClick={() => markDone.mutate(String(task.id))}>
              Mark Done
            </button>
          )}
          <button
            onClick={() => deleteTask.mutate(String(task.id))}
            style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>
            Delete
          </button>
        </div>
      ))}
    </div>
  )
}

export default Dashboard