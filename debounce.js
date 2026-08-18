const tasks = [
  { id: 1, title: 'Learn closures',   status: 'done',    priority: 'high'   },
  { id: 2, title: 'Build REST API',   status: 'pending', priority: 'high'   },
  { id: 3, title: 'Setup MongoDB',    status: 'done',    priority: 'medium' },
  { id: 4, title: 'Write tests',      status: 'pending', priority: 'low'    },
  { id: 5, title: 'Deploy to server', status: 'pending', priority: 'medium' }
]

function searchTasks(tasks, query) {
  return tasks.filter(task =>
    task.title.toLowerCase().includes(query.toLowerCase())
  )
}

function debounce(fn, delay) {
  let timer

  return function(...args) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}

const debouncedSearch = debounce((query) => {
  const results = searchTasks(tasks, query)
  console.log('Search ran for "' + query + '" → found', results.length, 'tasks')
}, 300)

// simulating user typing "mongo" fast
debouncedSearch("m")
debouncedSearch("mo")
debouncedSearch("mon")
debouncedSearch("mong")
debouncedSearch("mongo")