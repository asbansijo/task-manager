import { useState } from 'react'
import { PRIORITIES } from '../utils.js'

export default function TaskForm({ onAdd }) {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [dueDate, setDueDate] = useState('')
  const [error, setError] = useState('')

  // A <form> submits on Enter automatically, so no key handling is needed.
  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) {
      setError('Please enter a task title.')
      return
    }
    onAdd({ title: trimmed, priority, dueDate: dueDate || null })
    setTitle('')
    setPriority('Medium')
    setDueDate('')
    setError('')
  }

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <div className="task-form__row">
        <input
          className="input task-form__title"
          type="text"
          placeholder="What needs doing?"
          aria-label="Task title"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'add-error' : undefined}
          value={title}
          maxLength={120}
          onChange={(e) => {
            setTitle(e.target.value)
            if (error) setError('')
          }}
        />
        <button className="btn btn--primary" type="submit">
          Add
        </button>
      </div>
      <div className="task-form__row">
        <label className="field">
          <span>Priority</span>
          <select
            className="input"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Due date (optional)</span>
          <input
            className="input"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </label>
      </div>
      {error && (
        <p id="add-error" className="error" role="alert">
          {error}
        </p>
      )}
    </form>
  )
}
