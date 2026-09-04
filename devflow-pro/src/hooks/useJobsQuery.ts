import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export interface Job {
  id: number
  company: string
  role: string
  status: 'applied' | 'interview' | 'offer' | 'rejected'
  created_at?: string
}

const API_URL = 'http://localhost:3001/api/jobs'

// Helper for HTTP requests
async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || `API error: ${response.statusText}`)
  }

  const json = await response.json()
  return json.data !== undefined ? json.data : json
}

// Fetch all jobs from backend API
export function useJobsQuery() {
  return useQuery<Job[], Error>({
    queryKey: ['jobs'],
    queryFn: () => fetchApi<Job[]>(API_URL),
    staleTime: 1000 * 30, // 30 seconds
  })
}

// Mutation to create a new job
export function useAddJobMutation() {
  const queryClient = useQueryClient()

  return useMutation<Job, Error, { company: string; role: string; status?: Job['status'] }>({
    mutationFn: (newJob) =>
      fetchApi<Job>(API_URL, {
        method: 'POST',
        body: JSON.stringify(newJob),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
    },
  })
}

// Mutation to update job status or details
export function useUpdateJobStatusMutation() {
  const queryClient = useQueryClient()

  return useMutation<Job, Error, { id: number; status: Job['status'] }>({
    mutationFn: ({ id, status }) =>
      fetchApi<Job>(`${API_URL}/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
    },
  })
}

// Mutation to delete a job
export function useDeleteJobMutation() {
  const queryClient = useQueryClient()

  return useMutation<{ success: boolean }, Error, number>({
    mutationFn: (id) =>
      fetchApi<{ success: boolean }>(`${API_URL}/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
    },
  })
}
