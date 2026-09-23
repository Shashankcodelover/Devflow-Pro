import React, { useState } from 'react'
import { X, PlusCircle, AlertCircle } from 'lucide-react'
import { useTaskStore } from '../store/useTaskStore'

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
}

export const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose }) => {
  const { addTask } = useTaskStore()
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium')
  const [status, setStatus] = useState<'pending' | 'done'>('pending')
  const [errorMsg, setErrorMsg] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setErrorMsg('Task title is required.')
      return
    }

    setErrorMsg('')
    setIsSubmitting(true)

    const success = await addTask({
      title: title.trim(),
      priority,
      status
    })

    setIsSubmitting(false)

    if (success) {
      setTitle('')
      setPriority('medium')
      setStatus('pending')
      onClose()
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PlusCircle size={22} style={{ color: '#3b82f6' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#fff' }}>Create New Task</h3>
          </div>
          <button onClick={onClose} className="btn-icon">
            <X size={20} />
          </button>
        </div>

        {errorMsg && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 14px',
            borderRadius: '8px',
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            color: '#f43f5e',
            fontSize: '0.88rem',
            marginBottom: '16px'
          }}>
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#9ca3af', marginBottom: '6px' }}>
              Task Title
            </label>
            <input
              type="text"
              placeholder="e.g. Implement WebSockets handler"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              autoFocus
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#9ca3af', marginBottom: '6px' }}>
                Priority Level
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="input-field"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#9ca3af', marginBottom: '6px' }}>
                Initial Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="input-field"
              >
                <option value="pending">Pending</option>
                <option value="done">Completed</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
              {isSubmitting ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
