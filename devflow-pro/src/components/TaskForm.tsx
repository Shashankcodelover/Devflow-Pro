import { useState } from 'react'

interface TaskFormProps {
  onAddTask: (title: string, priority: string) => void
}

export default function TaskForm({ onAddTask }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('medium')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onAddTask(title.trim(), priority)
    setTitle('')
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
      <input
        type="text"
        placeholder="New task title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc', flex: 1 }}
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
      >
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
      <button
        type="submit"
        style={{ padding: '8px 16px', background: '#534AB7', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
      >
        Add Task
      </button>
    </form>
  )
}
