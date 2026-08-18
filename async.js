function fakeFetchTasks() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(['Task 1', 'Task 2']), 1000)
  })
}

function fakeFetchProfile() {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ name: 'Preetham', role: 'developer' }), 800)
  })
}

function fakeFetchStats() {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ total: 10, done: 6 }), 600)
  })
}

// YOUR JOB — use Promise.all to load all three at once
async function loadDashboard() {
  try {
    const result = await Promise.all([
        // use Promise.all here
        fakeFetchTasks(),
        fakeFetchProfile(),
        fakeFetchStats()
        
        
    ])
    
    // destructure the results into tasks, profile, stats
    const [tasks, profile, stats] = result;
    console.log('Tasks:', tasks);
    console.log('Profile:', profile);
    console.log('Stats:', stats);   
  } catch (error) {
    console.log('Failed:', error.message)
  }
}

loadDashboard()