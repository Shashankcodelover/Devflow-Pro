import React, { useState, useEffect } from 'react'
import { 
  Search, 
  Plus, 
  CheckCircle2, 
  Trash2, 
  Calendar, 
  ListFilter,
  Layers
} from 'lucide-react'
import { useTaskStore } from '../store/useTaskStore'

interface TasksPageProps {
  onOpenTaskModal: () => void
}

export const TasksPage: React.FC<TasksPageProps> = ({ onOpenTaskModal }) => {
  const { 
    tasks, 
    fetchTasks, 
    toggleTaskStatus, 
    deleteTask,
    filterStatus, 
    setFilterStatus, 
    searchQuery, 
    setSearchQuery 
  } = useTaskStore()

  const [selectedPriority, setSelectedPriority] = useState<string>('all')

  useEffect(() => {
    fetchTasks()
  }, [])

  // Filter tasks based on status, search, and priority
  const filteredTasks = tasks.filter((t) => {
    const matchesStatus =
      filterStatus === 'all' ? true : filterStatus === 'done' ? t.status === 'done' : t.status === 'pending'
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPriority = selectedPriority === 'all' ? true : t.priority === selectedPriority
    return matchesStatus && matchesSearch && matchesPriority
  })

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff', margin: 0 }}>Task Management</h1>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginTop: '4px' }}>
            Manage, filter, and track all developer tasks in real-time.
          </p>
        </div>

        <button onClick={onOpenTaskModal} className="btn btn-primary">
          <Plus size={18} />
          <span>Add New Task</span>
        </button>
      </div>

      {/* Toolbar: Search & Filters */}
      <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Search Bar */}
        <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field"
            style={{ paddingLeft: '38px' }}
          />
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          
          {/* Status Filter Tabs */}
          <div style={{ display: 'flex', background: 'rgba(15, 17, 23, 0.6)', padding: '4px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            {(['all', 'pending', 'done'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: filterStatus === status ? '#a855f7' : 'transparent',
                  color: filterStatus === status ? '#fff' : '#9ca3af',
                  transition: 'all 0.15s ease',
                  textTransform: 'capitalize'
                }}
              >
                {status === 'all' ? 'All Tasks' : status}
              </button>
            ))}
          </div>

          {/* Priority Select */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ListFilter size={16} style={{ color: '#6b7280' }} />
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="input-field"
              style={{ width: '150px', padding: '6px 12px', fontSize: '0.85rem' }}
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>

        </div>

      </div>

      {/* Task List Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredTasks.length === 0 ? (
          <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', color: '#9ca3af' }}>
            <Layers size={36} style={{ color: '#6b7280', marginBottom: '12px' }} />
            <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '6px' }}>No tasks found</h4>
            <p style={{ fontSize: '0.9rem' }}>Try tweaking your search or filter settings.</p>
          </div>
        ) : (
          filteredTasks.map((task, idx) => {
            const taskId = task.id || (task as any)._id || `task-${idx}`
            return (
              <div
                key={taskId}
                className="glass-panel"
                style={{
                padding: '18px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px'
              }}
            >
              {/* Checkbox & Title */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                <button
                  onClick={() => toggleTaskStatus(task.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: task.status === 'done' ? '#10b981' : '#6b7280',
                    transition: 'transform 0.15s ease'
                  }}
                  title={task.status === 'done' ? 'Mark as Pending' : 'Mark as Completed'}
                >
                  <CheckCircle2 size={24} />
                </button>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: task.status === 'done' ? '#9ca3af' : '#f3f4f6',
                    textDecoration: task.status === 'done' ? 'line-through' : 'none'
                  }}>
                    {task.title}
                  </span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.78rem', color: '#6b7280' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={13} />
                      {new Date(task.createdAt).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span>ID #{task.id}</span>
                  </div>
                </div>
              </div>

              {/* Status & Priority Badges */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className={`badge badge-${task.status}`}>
                  {task.status}
                </span>

                <span className={`badge badge-${task.priority}`}>
                  {task.priority}
                </span>

                <button
                  onClick={() => deleteTask(task.id)}
                  className="btn-icon"
                  title="Delete Task"
                  style={{ color: '#f43f5e' }}
                >
                  <Trash2 size={18} />
                </button>
              </div>

            </div>
          )})
        )}
      </div>

    </div>
  )
}

export default TasksPage
