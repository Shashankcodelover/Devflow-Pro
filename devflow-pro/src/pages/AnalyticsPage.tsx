import React from 'react'
import { 
  TrendingUp, 
  AlertCircle, 
  PieChart, 
  Zap 
} from 'lucide-react'
import { useTaskStore } from '../store/useTaskStore'

export const AnalyticsPage: React.FC = () => {
  const { tasks } = useTaskStore()

  const total = tasks.length
  const completed = tasks.filter((t) => t.status === 'done').length

  const highPriority = tasks.filter((t) => t.priority === 'high').length
  const mediumPriority = tasks.filter((t) => t.priority === 'medium').length
  const lowPriority = tasks.filter((t) => t.priority === 'low').length

  const completionPct = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff', margin: 0 }}>Workflow Analytics</h1>
        <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginTop: '4px' }}>
          Deep insights into your development velocity and task distribution.
        </p>
      </div>

      {/* Analytics Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
        
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ color: '#9ca3af', fontSize: '0.9rem', fontWeight: 600 }}>Sprint Velocity</span>
            <TrendingUp size={20} style={{ color: '#10b981' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>{completionPct}%</div>
          <div style={{ color: '#10b981', fontSize: '0.8rem', marginTop: '4px' }}>+12% vs last sprint</div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ color: '#9ca3af', fontSize: '0.9rem', fontWeight: 600 }}>High Priority Ratio</span>
            <AlertCircle size={20} style={{ color: '#f43f5e' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>
            {total > 0 ? Math.round((highPriority / total) * 100) : 0}%
          </div>
          <div style={{ color: '#9ca3af', fontSize: '0.8rem', marginTop: '4px' }}>{highPriority} high priority tasks</div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ color: '#9ca3af', fontSize: '0.9rem', fontWeight: 600 }}>Average Lead Time</span>
            <Zap size={20} style={{ color: '#3b82f6' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>1.4 Days</div>
          <div style={{ color: '#3b82f6', fontSize: '0.8rem', marginTop: '4px' }}>Optimal resolution speed</div>
        </div>

      </div>

      {/* Priority Distribution Chart Mock */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <PieChart size={20} style={{ color: '#3b82f6' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff' }}>Priority Distribution Breakdown</h3>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* High Priority Bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '6px' }}>
              <span style={{ color: '#f43f5e', fontWeight: 600 }}>High Priority</span>
              <span style={{ color: '#9ca3af' }}>{highPriority} tasks ({total > 0 ? Math.round((highPriority / total) * 100) : 0}%)</span>
            </div>
            <div style={{ height: '8px', width: '100%', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${total > 0 ? (highPriority / total) * 100 : 0}%`, background: '#f43f5e', borderRadius: '4px' }} />
            </div>
          </div>

          {/* Medium Priority Bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '6px' }}>
              <span style={{ color: '#f59e0b', fontWeight: 600 }}>Medium Priority</span>
              <span style={{ color: '#9ca3af' }}>{mediumPriority} tasks ({total > 0 ? Math.round((mediumPriority / total) * 100) : 0}%)</span>
            </div>
            <div style={{ height: '8px', width: '100%', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${total > 0 ? (mediumPriority / total) * 100 : 0}%`, background: '#f59e0b', borderRadius: '4px' }} />
            </div>
          </div>

          {/* Low Priority Bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '6px' }}>
              <span style={{ color: '#3b82f6', fontWeight: 600 }}>Low Priority</span>
              <span style={{ color: '#9ca3af' }}>{lowPriority} tasks ({total > 0 ? Math.round((lowPriority / total) * 100) : 0}%)</span>
            </div>
            <div style={{ height: '8px', width: '100%', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${total > 0 ? (lowPriority / total) * 100 : 0}%`, background: '#3b82f6', borderRadius: '4px' }} />
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}

export default AnalyticsPage
