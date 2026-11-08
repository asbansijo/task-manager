import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react'

const STORAGE_KEY = 'task-manager.tasks.v1'

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null) return null
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : null
  } catch {
    return null // corrupted or blocked storage: fall back to tasks.json
  }
}

const initialState = { tasks: [], status: 'loading', error: '' }

function reducer(state, action) {
  switch (action.type) {
    case 'load/start':
      return { ...state, status: 'loading', error: '' }
    case 'load/success':
      return { tasks: action.tasks, status: 'ready', error: '' }
    case 'load/error':
      return { ...state, status: 'error', error: action.message }
    case 'add': {
      const id = state.tasks.reduce((max, t) => Math.max(max, t.id), 0) + 1
      const task = { id, completed: false, ...action.task }
      return { ...state, tasks: [...state.tasks, task] }
    }
    case 'toggle':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.id ? { ...t, completed: !t.completed } : t,
        ),
      }
    case 'rename':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.id ? { ...t, title: action.title } : t,
        ),
      }
    case 'remove':
      return { ...state, tasks: state.tasks.filter((t) => t.id !== action.id) }
    default:
      return state
  }
}

const TasksContext = createContext(null)

export function TasksProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [attempt, setAttempt] = useState(0) // bump to retry loading

  // Load once: localStorage first, otherwise fetch the starter JSON.
  useEffect(() => {
    const controller = new AbortController()
    dispatch({ type: 'load/start' })

    const stored = readStored()
    if (stored) {
      dispatch({ type: 'load/success', tasks: stored })
      return
    }

    fetch(`${import.meta.env.BASE_URL}tasks.json`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Server responded with ${res.status}`)
        return res.json()
      })
      .then((data) => {
        if (!Array.isArray(data)) throw new Error('Unexpected data format')
        dispatch({ type: 'load/success', tasks: data })
      })
      .catch((err) => {
        if (err.name === 'AbortError') return
        dispatch({
          type: 'load/error',
          message: err.message || 'Could not load tasks.',
        })
      })

    return () => controller.abort()
  }, [attempt])

  // Persist every change, but only once the initial load has finished
  // (otherwise the empty initial list would overwrite saved data).
  useEffect(() => {
    if (state.status !== 'ready') return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tasks))
    } catch {
      // storage full or unavailable: the app still works in memory
    }
  }, [state.tasks, state.status])

  const value = useMemo(
    () => ({
      tasks: state.tasks,
      status: state.status,
      error: state.error,
      retry: () => setAttempt((a) => a + 1),
      addTask: (task) => dispatch({ type: 'add', task }),
      toggleTask: (id) => dispatch({ type: 'toggle', id }),
      renameTask: (id, title) => dispatch({ type: 'rename', id, title }),
      deleteTask: (id) => dispatch({ type: 'remove', id }),
    }),
    [state.tasks, state.status, state.error],
  )

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
}

export function useTasks() {
  const ctx = useContext(TasksContext)
  if (!ctx) throw new Error('useTasks must be used inside <TasksProvider>')
  return ctx
}
