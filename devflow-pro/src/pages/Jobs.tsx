import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { jobApi, type Job } from '../api/jobApi'

const statusColors: Record<Job['status'], string> = {
  applied: '#E6F1FB', interview: '#FAEEDA',
  offer: '#E1F5EE', rejected: '#FAECE7'
}

function Jobs() {
  const queryClient = useQueryClient()
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [salaryMin, setSalaryMin] = useState('')

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: jobApi.getAll
  })

  const createJob = useMutation({
    mutationFn: jobApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['jobs'] })
  })

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      jobApi.updateStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['jobs'] })
  })

  const deleteJob = useMutation({
    mutationFn: jobApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['jobs'] })
  })

  function handleAdd(): void {
    if (!company || !role) return
    createJob.mutate({
      company, role,
      status: 'applied',
      salary_min: salaryMin ? parseInt(salaryMin) : undefined
    })
    setCompany(''); setRole(''); setSalaryMin('')
  }

  if (isLoading) return <p style={{ padding: '20px' }}>Loading jobs...</p>

  return (
    <div style={{ padding: '20px' }}>
      <h1>Job Tracker</h1>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input placeholder="Company" value={company}
          onChange={e => setCompany(e.target.value)}
          style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} />
        <input placeholder="Role" value={role}
          onChange={e => setRole(e.target.value)}
          style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} />
        <input placeholder="Min salary" value={salaryMin}
          onChange={e => setSalaryMin(e.target.value)}
          style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc', width: '120px' }} />
        <button onClick={handleAdd} disabled={createJob.isPending}
          style={{ padding: '8px 16px', background: '#534AB7', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
          {createJob.isPending ? 'Adding...' : 'Add Job'}
        </button>
      </div>

      {jobs.length === 0 && <p style={{ color: 'gray' }}>No jobs tracked yet.</p>}

      {jobs.map((job: Job) => (
        <div key={job.id} style={{
          padding: '12px 16px', marginBottom: '8px',
          borderRadius: '8px', border: '1px solid #ccc',
          background: statusColors[job.status],
          display: 'flex', alignItems: 'center', gap: '12px'
        }}>
          <div style={{ flex: 1 }}>
            <strong>{job.company}</strong>
            <span style={{ marginLeft: '8px', color: 'gray' }}>{job.role}</span>
            {job.salary_min && (
              <span style={{ marginLeft: '8px', fontSize: '12px', color: '#534AB7' }}>
                ₹{job.salary_min.toLocaleString()}
              </span>
            )}
          </div>
          <select value={job.status}
            onChange={e => updateStatus.mutate({ id: job.id, status: e.target.value })}
            style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc' }}>
            <option value="applied">Applied</option>
            <option value="interview">Interview</option>
            <option value="offer">Offer</option>
            <option value="rejected">Rejected</option>
          </select>
          <button onClick={() => deleteJob.mutate(job.id)}
            style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>
            Delete
          </button>
        </div>
      ))}
    </div>
  )
}

export default Jobs