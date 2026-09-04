import { useState } from 'react'
import {
  useJobsQuery,
  useAddJobMutation,
  useUpdateJobStatusMutation,
  useDeleteJobMutation,
  type Job,
} from '../hooks/useJobsQuery'
import useJobStore from '../store/useJobStore'
import { Briefcase, Building2, Plus, Trash2, RefreshCw, AlertCircle } from 'lucide-react'

const statusBadges: Record<Job['status'], { label: string; bg: string; color: string; border: string }> = {
  applied: { label: 'Applied', bg: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: 'rgba(59, 130, 246, 0.3)' },
  interview: { label: 'Interview', bg: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: 'rgba(245, 158, 11, 0.3)' },
  offer: { label: 'Offer', bg: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: 'rgba(16, 185, 129, 0.3)' },
  rejected: { label: 'Rejected', bg: 'rgba(244, 63, 94, 0.15)', color: '#f87171', border: 'rgba(244, 63, 94, 0.3)' },
}

function Jobs() {
  const { data: apiJobs, isLoading, isError, error, refetch } = useJobsQuery()
  const addJobMutation = useAddJobMutation()
  const updateStatusMutation = useUpdateJobStatusMutation()
  const deleteJobMutation = useDeleteJobMutation()

  // Zustand local store fallback if backend is offline
  const { jobs: localJobs, addJob: addLocalJob, updateStatus: updateLocalStatus, deleteJob: deleteLocalJob } = useJobStore()

  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')

  // Determine active jobs list: API data if available, fallback to local Zustand store
  const jobs: Job[] = apiJobs ?? localJobs

  function handleAdd(e?: React.FormEvent): void {
    if (e) e.preventDefault()
    if (!company.trim() || !role.trim()) return

    const companyVal = company.trim()
    const roleVal = role.trim()

    addJobMutation.mutate(
      { company: companyVal, role: roleVal, status: 'applied' },
      {
        onError: () => {
          // Offline fallback
          addLocalJob(companyVal, roleVal)
        },
      }
    )

    setCompany('')
    setRole('')
  }

  function handleStatusChange(id: number, newStatus: Job['status']): void {
    updateStatusMutation.mutate(
      { id, status: newStatus },
      {
        onError: () => {
          updateLocalStatus(id, newStatus)
        },
      }
    )
  }

  function handleDelete(id: number): void {
    deleteJobMutation.mutate(id, {
      onError: () => {
        deleteLocalJob(id)
      },
    })
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Header section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Briefcase style={{ color: '#a855f7' }} size={28} />
            Job Applications Tracker
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginTop: '4px' }}>
            Track, manage, and optimize your job applications in real-time.
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="btn btn-secondary"
          style={{ fontSize: '0.85rem' }}
          title="Refresh jobs from API"
        >
          <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} />
          Sync API
        </button>
      </div>

      {/* Add Job Form Panel */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px' }}>
        <h3 style={{ color: '#f3f4f6', fontSize: '1rem', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} style={{ color: '#a855f7' }} />
          Add New Application
        </h3>
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 240px' }}>
            <input
              placeholder="Company (e.g. Google, Stripe)"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="input-field"
            />
          </div>
          <div style={{ flex: '1 1 240px' }}>
            <input
              placeholder="Role (e.g. Senior Frontend Engineer)"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="input-field"
            />
          </div>
          <button
            type="submit"
            disabled={addJobMutation.isPending || !company.trim() || !role.trim()}
            className="btn btn-primary"
            style={{ opacity: !company.trim() || !role.trim() ? 0.6 : 1 }}
          >
            <Plus size={16} />
            {addJobMutation.isPending ? 'Adding...' : 'Add Application'}
          </button>
        </form>
      </div>

      {/* API Notice / Status Banner */}
      {isError && (
        <div style={{
          padding: '12px 16px', borderRadius: '10px', background: 'rgba(244, 63, 94, 0.12)',
          border: '1px solid rgba(244, 63, 94, 0.25)', color: '#f43f5e', fontSize: '0.85rem',
          display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px'
        }}>
          <AlertCircle size={18} />
          <span>Notice: Could not connect to API server ({error?.message}). Displaying cached/local applications.</span>
        </div>
      )}

      {/* Applications List */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff' }}>
            Applications ({jobs.length})
          </h2>
        </div>

        {isLoading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
            <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite', marginBottom: '12px' }} />
            <p>Loading jobs from API...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div style={{ padding: '48px 20px', textAlign: 'center', color: '#6b7280' }}>
            <Building2 size={40} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
            <p style={{ fontSize: '1rem', fontWeight: 500 }}>No job applications tracked yet.</p>
            <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>Add a company above to start tracking your interviews and offers!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {jobs.map((job) => {
              const badge = statusBadges[job.status] || statusBadges.applied
              return (
                <div
                  key={job.id}
                  style={{
                    padding: '16px 20px',
                    borderRadius: '12px',
                    background: 'rgba(15, 17, 23, 0.45)',
                    border: '1px solid rgba(255, 255, 255, 0.07)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {/* Left: Company & Role */}
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Building2 size={16} style={{ color: '#a855f7' }} />
                      <strong style={{ color: '#f3f4f6', fontSize: '1.05rem', fontWeight: 600 }}>
                        {job.company}
                      </strong>
                    </div>
                    <p style={{ color: '#9ca3af', fontSize: '0.88rem', marginTop: '2px', marginLeft: '24px' }}>
                      {job.role}
                    </p>
                  </div>

                  {/* Middle: Status Badge + Selector */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span
                      style={{
                        padding: '4px 12px',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        background: badge.bg,
                        color: badge.color,
                        border: `1px solid ${badge.border}`,
                      }}
                    >
                      {badge.label}
                    </span>

                    <select
                      value={job.status}
                      onChange={(e) => handleStatusChange(job.id, e.target.value as Job['status'])}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        background: 'rgba(22, 25, 34, 0.9)',
                        border: '1px solid var(--border-color)',
                        color: '#f3f4f6',
                        fontSize: '0.85rem',
                        outline: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <option value="applied">Applied</option>
                      <option value="interview">Interview</option>
                      <option value="offer">Offer</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  {/* Right: Delete button */}
                  <button
                    onClick={() => handleDelete(job.id)}
                    className="btn-icon"
                    style={{ color: '#f43f5e' }}
                    title="Delete Job Application"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Jobs
