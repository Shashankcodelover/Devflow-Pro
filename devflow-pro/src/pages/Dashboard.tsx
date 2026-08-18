import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Layers, 
  ArrowRight, 
  Plus, 
  Activity, 
  Sparkles 
} from 'lucide-react'
import { useTaskStore } from '../store/useTaskStore'

interface DashboardProps {
  onOpenTaskModal: () => void
}

export const Dashboard: React.FC<DashboardProps> = ({ onOpenTaskModal }) => {
  const { tasks, fetchTasks, toggleTaskStatus } = useTaskStore()

  useEffect(() => {
    fetchTasks()
  }, [])

  const totalCount = tasks.length
  const completedCount = tasks.filter((t) => t.status === 'done').length
  const pendingCount = tasks.filter((t) => t.status === 'pending').length
  const highPriorityCount = tasks.filter((t) => t.priority === 'high' && t.status === 'pending').length
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  const recentTasks = [...tasks].slice(0, 5)

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Hero Welcome Banner */}
      <div className="glass-panel" style={{
        padding: '32px',
        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(59, 130, 246, 0.1) 100%)',
        border: '1px solid rgba(168, 85, 247, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a855f7', fontSize: '0.88rem', fontWeight: 600, marginBottom: '6px' }}>
            <Sparkles size={18} />
            <span>Developer Workflow Dashboard</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#fff', margin: 0 }}>
            Welcome back to DevFlow Pro
          </h1>
          <p style={{ color: '#9ca3af', marginTop: '6px', fontSize: '1rem' }}>
            You have <strong style={{ color: '#f3f4f6' }}>{pendingCount} pending tasks</strong> requiring your attention today.
          </p>
        </div>

        <button onClick={onOpenTaskModal} className="btn btn-primary" style={{ padding: '12px 22px', fontSize: '0.95rem' }}>
          <Plus size={20} />
          <span>Create Task</span>
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        
        {/* Total Tasks */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ color: '#9ca3af', fontSize: '0.9rem', fontWeight: 600 }}>Total Tasks</span>
            <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
              <Layers size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff' }}>{totalCount}</div>
          <div style={{ color: '#6b7280', fontSize: '0.8rem', marginTop: '4px' }}>Active in current sprint</div>
        </div>

        {/* Completed */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ color: '#9ca3af', fontSize: '0.9rem', fontWeight: 600 }}>Completed</span>
            <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#10b981' }}>{completedCount}</div>
          <div style={{ color: '#6b7280', fontSize: '0.8rem', marginTop: '4px' }}>{completionRate}% completion rate</div>
        </div>

        {/* Pending */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ color: '#9ca3af', fontSize: '0.9rem', fontWeight: 600 }}>In Progress</span>
            <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(168, 85, 247, 0.15)', color: '#a855f7' }}>
              <Clock size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#a855f7' }}>{pendingCount}</div>
          <div style={{ color: '#6b7280', fontSize: '0.8rem', marginTop: '4px' }}>Awaiting code completion</div>
        </div>

        {/* High Priority */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ color: '#9ca3af', fontSize: '0.9rem', fontWeight: 600 }}>High Priority</span>
            <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e' }}>
              <AlertTriangle size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f43f5e' }}>{highPriorityCount}</div>
          <div style={{ color: '#6b7280', fontSize: '0.8rem', marginTop: '4px' }}>Urgent tasks remaining</div>
        </div>

      </div>

      {/* Main Grid: Recent Tasks & Progress Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        
        {/* Recent Tasks List */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff' }}>Recent Tasks</h3>
            <Link to="/tasks" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#a855f7', fontSize: '0.88rem', textDecoration: 'none', fontWeight: 600 }}>
              <span>View All</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {recentTasks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px', color: '#9ca3af' }}>No tasks created yet.</div>
            ) : (
              recentTasks.map((task) => (
                <div
                  key={task.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    background: 'rgba(15, 17, 23, 0.5)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: task.status === 'done' ? '#10b981' : '#6b7280'
                      }}
                    >
                      <CheckCircle2 size={22} />
                    </button>
                    <div>
                      <div style={{
                        color: task.status === 'done' ? '#9ca3af' : '#f3f4f6',
                        textDecoration: task.status === 'done' ? 'line-through' : 'none',
                        fontWeight: 500
                      }}>
                        {task.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '2px' }}>
                        ID #{task.id}
                      </div>
                    </div>
                  </div>

                  <span className={`badge badge-${task.priority}`}>
                    {task.priority}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sprint Completion Gauge & Activity Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Progress Box */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#fff', marginBottom: '16px' }}>Sprint Progress</h3>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Completion Rate</span>
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#a855f7' }}>{completionRate}%</span>
            </div>

            <div style={{ height: '10px', width: '100%', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '5px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${completionRate}%`,
                background: 'linear-gradient(90deg, #a855f7 0%, #10b981 100%)',
                borderRadius: '5px',
                transition: 'width 0.5s ease'
              }} />
            </div>
          </div>

          {/* Activity Feed */}
          <div className="glass-panel" style={{ padding: '24px', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Activity size={18} style={{ color: '#3b82f6' }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#fff' }}>Activity Log</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem', color: '#9ca3af' }}>
              <div style={{ paddingLeft: '12px', borderLeft: '2px solid #a855f7' }}>
                <div style={{ color: '#f3f4f6', fontWeight: 500 }}>System initialized</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Connected to Express API</div>
              </div>
              <div style={{ paddingLeft: '12px', borderLeft: '2px solid #3b82f6' }}>
                <div style={{ color: '#f3f4f6', fontWeight: 500 }}>{tasks.length} tasks synced</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>In-memory store synced</div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}
