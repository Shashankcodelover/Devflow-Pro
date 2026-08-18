import { useState } from 'react'
import useJobStore, { type Job } from '../store/useJobStore'

const statusColors: Record<Job['status'], string> = {
  applied: '#E6F1FB', interview: '#FAEEDA',
  offer: '#E1F5EE', rejected: '#FAECE7'
}

function Jobs() {
  const { jobs, addJob, updateStatus, deleteJob } = useJobStore()
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')

  function handleAdd(): void {
    if (!company || !role) return
    addJob(company, role)
    setCompany(''); setRole('')
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Job Tracker</h1>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <input placeholder="Company" value={company}
          onChange={e => setCompany(e.target.value)}
          style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} />
        <input placeholder="Role" value={role}
          onChange={e => setRole(e.target.value)}
          style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} />
        <button onClick={handleAdd}
          style={{ padding: '8px 16px', background: '#534AB7', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
          Add Job
        </button>
      </div>
      {jobs.length === 0 && <p style={{ color: 'gray' }}>No jobs tracked yet.</p>}
      {jobs.map(job => (
        <div key={job.id} style={{
          padding: '12px 16px', marginBottom: '8px', borderRadius: '8px',
          border: '1px solid #ccc', background: statusColors[job.status],
          display: 'flex', alignItems: 'center', gap: '12px'
        }}>
          <div style={{ flex: 1 }}>
            <strong>{job.company}</strong>
            <span style={{ marginLeft: '8px', color: 'gray' }}>{job.role}</span>
          </div>
          <select value={job.status}
            onChange={e => updateStatus(job.id, e.target.value as Job['status'])}
            style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc' }}>
            <option value="applied">Applied</option>
            <option value="interview">Interview</option>
            <option value="offer">Offer</option>
            <option value="rejected">Rejected</option>
          </select>
          <button onClick={() => deleteJob(job.id)}
            style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>
            Delete
          </button>
        </div>
      ))}
    </div>
  )
}

export default Jobs
