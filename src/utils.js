export const PRIORITIES = ['Low', 'Medium', 'High']

const PRIORITY_RANK = { High: 0, Medium: 1, Low: 2 }

const pad = (n) => String(n).padStart(2, '0')

// Today as a local YYYY-MM-DD string, so it can be compared with due dates
// as plain strings (ISO dates sort correctly as text).
export function todayISO() {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

// "2027-03-12" -> "12 Mar 2027". Built from parts to avoid timezone shifts.
export function formatDate(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function isOverdue(task, today) {
  return !task.completed && Boolean(task.dueDate) && task.dueDate < today
}

// Returns a new sorted array; never mutates the original.
export function sortTasks(tasks, sortBy) {
  const copy = [...tasks]
  if (sortBy === 'due') {
    copy.sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return 0
      if (!a.dueDate) return 1 // no date goes last
      if (!b.dueDate) return -1
      return a.dueDate.localeCompare(b.dueDate)
    })
  } else if (sortBy === 'priority') {
    copy.sort((a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority])
  }
  return copy
}
