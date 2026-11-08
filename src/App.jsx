import { useMemo, useState } from 'react'
import { useTasks } from './TasksContext.jsx'
import { sortTasks, todayISO } from './utils.js'
import TaskForm from './components/TaskForm.jsx'
import Toolbar from './components/Toolbar.jsx'
import TaskItem from './components/TaskItem.jsx'
import ConfirmDialog from './components/ConfirmDialog.jsx'

export default function App() {
  const { tasks, status, error, retry, addTask, toggleTask, renameTask, deleteTask } =
    useTasks()

  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState('none')
  const [pendingDelete, setPendingDelete] = useState(null)

  const today = todayISO()
  const activeCount = tasks.filter((t) => !t.completed).length

  // Filter tab + search are combined, then sorted.
  const visibleTasks = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = tasks.filter((t) => {
      if (filter === 'active' && t.completed) return false
      if (filter === 'completed' && !t.completed) return false
      return q === '' || t.title.toLowerCase().includes(q)
    })
    return sortTasks(filtered, sortBy)
  }, [tasks, filter, query, sortBy])

  function confirmDelete() {
    deleteTask(pendingDelete.id)
    setPendingDelete(null)
  }

  let emptyMessage = null
  if (tasks.length === 0) emptyMessage = 'No tasks yet. Add your first one above.'
  else if (visibleTasks.length === 0) emptyMessage = 'No tasks match your filter or search.'

  return (
    <main className="app">
      <h1>Task Manager</h1>

      {status === 'loading' && (
        <div className="state" role="status">
          <span className="spinner" aria-hidden="true" />
          <p>Loading tasks…</p>
        </div>
      )}

      {status === 'error' && (
        <div className="state state--error" role="alert">
          <p>Couldn’t load tasks: {error}</p>
          <button type="button" className="btn btn--primary" onClick={retry}>
            Retry
          </button>
        </div>
      )}

      {status === 'ready' && (
        <>
          <TaskForm onAdd={addTask} />

          <Toolbar
            filter={filter}
            onFilterChange={setFilter}
            query={query}
            onQueryChange={setQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
            activeCount={activeCount}
          />

          {emptyMessage ? (
            <p className="empty">{emptyMessage}</p>
          ) : (
            <ul className="task-list">
              {visibleTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  today={today}
                  onToggle={toggleTask}
                  onRename={renameTask}
                  onDelete={setPendingDelete}
                />
              ))}
            </ul>
          )}
        </>
      )}

      {pendingDelete && (
        <ConfirmDialog
          title="Delete task?"
          message={`“${pendingDelete.title}” will be removed permanently.`}
          confirmLabel="Delete"
          onConfirm={confirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </main>
  )
}
