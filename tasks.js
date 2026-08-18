let tasks = [
  { id: 1, title: "Learn closures",   status: "done",    priority: "high"   },
  { id: 2, title: "Build REST API",   status: "pending", priority: "high"   },
  { id: 3, title: "Setup MongoDB",    status: "done",    priority: "medium" },
  { id: 4, title: "Write tests",      status: "pending", priority: "low"    },
  { id: 5, title: "Deploy to server", status: "pending", priority: "medium" }
]

// YOUR JOB — write these 3 functions:

// 1. filterByStatus(tasks, status)
//    Give it a status like "done" or "pending"
//    It should return only tasks with that status
function filterByStatus(tasks, status){
    return tasks.filter(task => task.status === status);
}

// 2. filterByPriority(tasks, priority)
//    Give it "high", "medium", or "low"
//    It should return only tasks with that priority
function filterByPriority(tasks, priority){
    return tasks.filter(task => task.priority === priority);
}

// 3. filterByBoth(tasks, status, priority)
//    Give it both status AND priority
//    It should return tasks that match BOTH conditions

function filterByBoth(tasks, status, priority){
    return tasks.filter(task => task.status === status && task.priority === priority);
}
// Test your functions like this:
console.log(filterByStatus(tasks, "pending"))   // should give 3 tasks
console.log(filterByPriority(tasks, "high"))    // should give 2 tasks
console.log(filterByBoth(tasks, "pending", "high")) // should give 1 task

const priorityOrder = {
  high:   1,
  medium: 2,
  low:    3
}

// YOUR JOB — write this function
function sortByPriority(tasks) {
  // use tasks.sort() with a comparator
  // use priorityOrder to look up the rank of each task's priority
  // return the sorted array
     return tasks.sort((taskA, taskB) => priorityOrder[taskA.priority] - priorityOrder[taskB.priority])
}

// Test it
const sorted = sortByPriority(tasks)
sorted.forEach(task => console.log(task.priority, '-', task.title))

// Expected output:
// high   - Learn closures
// high   - Build REST API
// medium - Setup MongoDB
// medium - Deploy to server
// low    - Write tests


function transformTasks(tasks) {

  return tasks.map(task => {
    return {
        ...task,
        icon: task.status === 'done' ? '✅' : '⬜',
        priorityLabel: task.priority.toUpperCase()
    }
  })
}

let transformed = transformTasks(tasks)
transformed.forEach(task =>
    { console.log(task.icon, task.title, '[' + task.priorityLabel + ']')}
)


// CHALLENGE — write this function
// getDisplayTasks(tasks, status)
// It should:
// 1. filter tasks by the given status
// 2. sort the filtered tasks by priority
// 3. transform them with icon and priorityLabel
// Return the final display-ready array

function getDisplayTasks(tasks, status) {
  // your code here
    const filtered = filterByStatus(tasks, status);
    const sorted = sortByPriority(filtered);
    const transfered = transformTasks(sorted);
    return transfered;
}

console.log("\n");
// Test it
const result = getDisplayTasks(tasks, 'pending')
result.forEach(t => console.log(t.icon, t.title, '[' + t.priorityLabel + ']'))

// Expected output — pending tasks, sorted high to low, with icons:
// ⬜ Build REST API [HIGH]
// ⬜ Deploy to server [MEDIUM]
// ⬜ Write tests [LOW]


function addTask(tasks, title, priority) {
  const newTask = {
    id:        Math.floor(Math.random() * 1000),           // Math.floor(Math.random() * 1000)
    title:     title,           // comes from the argument
    priority:  priority,           // comes from the argument
    status:    "pending",           // always "pending" — you decide this
    createdAt: new Date()            // new Date()
  }

  return [...tasks, newTask]  // add new task to end of array
}
tasks = removeTask(tasks, 2)
 tasks = [
  { id: 1, title: 'Learn closures', status: 'done',    priority: 'high' },
  { id: 2, title: 'Build REST API', status: 'pending', priority: 'high' }
]

tasks = addTask(tasks, 'Setup MongoDB', 'medium')
tasks = addTask(tasks, 'Write tests',   'low')

console.log(tasks)
// should show 4 tasks total — original 2 + 2 new ones

function removeTask(tasks, id) {
  return tasks.filter(task => task.id !== id)
}

tasks = removeTask(tasks, 2)
tasks = [ 
  { id: 1, title: 'Learn closures', status: 'done',    priority: 'high' },
  { id: 2, title: 'Build REST API', status: 'pending', priority: 'high' },
  { id: 3, title: 'Setup MongoDB',  status: 'done',    priority: 'medium' }
]

tasks = removeTask(tasks, 2)
console.log(tasks)
// should show 2 tasks — id 1 and id 3 remaining

function updateTasksStatus(tasks,id, newStatus) {
  return tasks.map(task => {
    if(task.id === id){
      return{
        ...task, status:newStatus
      }
    }
    return task;
  });
}

let myTasks = [
  { id: 1, title: 'Learn closures', status: 'pending', priority: 'high' },
  { id: 2, title: 'Build REST API', status: 'pending', priority: 'high' },
  { id: 3, title: 'Setup MongoDB',  status: 'pending', priority: 'medium' }
]

myTasks = updateTasksStatus(myTasks, 2, 'done')
myTasks.forEach(t => console.log(t.id, t.title, t.status))

// Expected:
// 1 Learn closures pending
// 2 Build REST API done      ← only this one changed
// 3 Setup MongoDB  pending

function getSummary(tasks) {
  return tasks.reduce((summary, task) => {
    summary.total+=1;
    if(task.status === 'done'){
      summary.done+=1;
    }else if(task.status === 'pending'){
      summary.pending+=1;
    }
    return summary;

  }, { total: 0, done: 0, pending:0  })
}

const summary = getSummary(tasks);
console.log(summary);


function debounce(fn, delay) {
  let timer        // this variable lives in the closure

  return function(...args) {
    clearTimeout(timer)           // cancel previous timer
    timer = setTimeout(() => {    // start new timer
      fn(...args)
    }, delay)
  }
}

// This is the real search function
function searchTasks(tasks, query) {
  return tasks.filter(task =>
    task.title.toLowerCase().includes(query.toLowerCase())
  )
}

tasks = [
  { id: 1, title: 'Learn closures',   status: 'done',    priority: 'high'   },
  { id: 2, title: 'Build REST API',   status: 'pending', priority: 'high'   },
  { id: 3, title: 'Setup MongoDB',    status: 'done',    priority: 'medium' },
  { id: 4, title: 'Write tests',      status: 'pending', priority: 'low'    },
  { id: 5, title: 'Deploy to server', status: 'pending', priority: 'medium' }
]

console.log(searchTasks(tasks, "mongo"))
// should return task id 3 — Setup MongoDB

console.log(searchTasks(tasks, "build"))
// should return task id 2 — Build REST API

console.log(searchTasks(tasks, "e"))
// should return tasks with "e" in title — how many do you think?


