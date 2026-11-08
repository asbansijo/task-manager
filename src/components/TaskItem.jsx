import { useEffect, useRef, useState } from 'react'
import { formatDate, isOverdue } from '../utils.js'

export default function TaskItem({ task, today, onToggle, onRename, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(task.title)
  const [error, setError] = useState('')
  const inputRef = useRef(null)
  // Set once Enter/Escape has handled the edit, so the blur that follows
  // unmounting the input does not run a second save/cancel.
  const finished = useRef(false)

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editing])

  function startEdit() {
    finished.current = false
    setDraft(task.title)
    setError('')
    setEditing(true)
  }

  function cancel() {
    finished.current = true
    setEditing(false)
    setError('')
  }

  function save() {
    const trimmed = draft.trim()
    if (!trimmed) {
      setError('Title cannot be blank.')
      return
    }
    finished.current = true
    if (trimmed !== task.title) onRename(task.id, trimmed)
    setEditing(false)
    setError('')
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      save()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      cancel()
    }
  }

  function handleBlur() {
    if (finished.current) return
    // Clicking away saves a valid edit and quietly reverts a blank one.
    if (draft.trim()) save()
    else cancel()
  }

  const overdue = isOverdue(task, today)

  return (
    <li className={`task${task.completed ? ' task--done' : ''}`}>
      <input
        className="task__check"
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        aria-label={`Mark "${task.title}" as ${task.completed ? 'not done' : 'done'}`}
      />

      <div className="task__body">
        {editing ? (
          <>
            <input
              ref={inputRef}
              className="input task__edit"
              type="text"
              value={draft}
              maxLength={120}
              aria-label="Edit task title"
              aria-invalid={Boolean(error)}
              onChange={(e) => {
                setDraft(e.target.value)
                if (error) setError('')
              }}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
            />
            {error && (
              <p className="error" role="alert">
                {error}
              </p>
            )}
          </>
        ) : (
          <span className="task__title" onDoubleClick={startEdit}>
            {task.title}
          </span>
        )}

        <div className="task__meta">
          <span className={`badge badge--${task.priority.toLowerCase()}`}>
            {task.priority}
          </span>
          <span className="task__due">
            {task.dueDate ? `Due ${formatDate(task.dueDate)}` : 'No due date'}
          </span>
          {overdue && <span className="badge badge--overdue">Overdue</span>}
        </div>
      </div>

      <div className="task__actions">
        {!editing && (
          <button
            type="button"
            className="btn btn--ghost"
            onClick={startEdit}
            aria-label={`Edit "${task.title}"`}
          >
            Edit
          </button>
        )}
        <button
          type="button"
          className="btn btn--ghost btn--danger"
          onClick={() => onDelete(task)}
          aria-label={`Delete "${task.title}"`}
        >
          Delete
        </button>
      </div>
    </li>
  )
}
