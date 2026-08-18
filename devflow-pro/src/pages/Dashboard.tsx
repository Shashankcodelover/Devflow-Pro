import { useMemo, useCallback, useEffect } from 'react'
import { io } from 'socket.io-client'
import { useTaskContext } from '../store/TaskContext'
import type { Task, NewTask } from '../store/taskReducer'
import TaskForm from '../components/TaskForm'
import SessionTimer from '../components/SessionTimer'

function Dashboard() {
  const { state, dispatch } = useTaskContext()
  const { tasks, filter, loading } = state

  // Load initial tasks
  useEffect(() => {
    async function loadTasks() {
      dispatch({ type: 'SET_LOADING', payload: true })
      await new Promise(r => setTimeout(r, 800))
      dispatch({ type: 'LOAD_TASKS', payload: [
        { id: 1, title: 'Learn React',    status: 'pending', priority: 'high',   createdAt: new Date() },
        { id: 2, title: 'Build REST API', status: 'done',    priority: 'high',   createdAt: new Date() },
        { id: 3, title: 'Setup MongoDB',  status: 'pending', priority: 'medium', createdAt: new Date() }
      ]})
    }
    loadTasks()
  }, [dispatch])

  // Socket.io — real-time updates
  useEffect(() => {
    const socket = io('http://localhost:3001')

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id)
    })

    // When ANY user creates a task — update UI automatically
    socket.on('task:new', (newTask: Task) => {
      console.log('Real-time task received:', newTask.title)
      dispatch({ type: 'ADD_TASK', payload: newTask })
    })

    // Cleanup — disconnect when Dashboard unmounts
    return () => {
      socket.disconnect()
      console.log('Socket disconnected')
    }
  }, [dispatch])

  const addTask = useCallback((title: string, priority: string): void => {
    const newTask: NewTask = {
      title,
      priority: priority as Task['priority'],
      status: 'pending'
    }
    dispatch({
      type: 'ADD_TASK',
      payload: {
        ...newTask,
        id: Math.floor(Math.random() * 1000),
        createdAt: new Date()
      }
    })
  }, [dispatch])

  const visibleTasks = useMemo(() =>
    tasks.filter(t => filter === 'all' || t.status === filter)
  , [tasks, filter])

  const stats = useMemo(() => ({
    total: tasks.length,
    done: tasks.filter(t => t.status === 'done').length,
    pending: tasks.filter(t => t.status === 'pending').length
  }), [tasks])

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard</h1>
      <SessionTimer />

      {/* Stats */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
        <span>Total: {stats.total}</span>
        <span style={{ color: 'green' }}>Done: {stats.done}</span>
        <span style={{ color: 'orange' }}>Pending: {stats.pending}</span>
      </div>

      <TaskForm onAddTask={addTask} />

      {/* Filter buttons */}
      <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
        {['all', 'pending', 'done'].map(f => (
          <button key={f}
            onClick={() => dispatch({ type: 'SET_FILTER', payload: f })}
            style={{
              padding: '6px 14px', borderRadius: '20px',
              border: '1px solid #ccc',
              background: filter === f ? '#534AB7' : 'white',
              color: filter === f ? 'white' : 'black',
              cursor: 'pointer'
            }}
          >{f.toUpperCase()}</button>
        ))}
      </div>

      {loading && <p>Loading tasks...</p>}

      {/* Task list */}
      {visibleTasks.map(task => (
        <div key={task.id} style={{
          padding: '12px 14px', marginBottom: '8px',
          border: '1px solid #ccc', borderRadius: '8px',
          display: 'flex', alignItems: 'center', gap: '10px'
        }}>
          <span>{task.status === 'done' ? '✅' : '⬜'}</span>
          <strong style={{ flex: 1 }}>{task.title}</strong>
          <span style={{ fontSize: '12px', color: 'gray' }}>
            [{task.priority.toUpperCase()}]
          </span>
          {task.status !== 'done' && (
            <button
              onClick={() => dispatch({ type: 'MARK_DONE', payload: task.id })}
              style={{ padding: '4px 10px', cursor: 'pointer' }}>
              Mark Done
            </button>
          )}
          <button
            onClick={() => dispatch({ type: 'DELETE_TASK', payload: task.id })}
            style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>
            Delete
          </button>
        </div>
      ))}
    </div>
  )
}

export default Dashboard
