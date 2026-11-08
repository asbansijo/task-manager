const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Completed' },
]

export default function Toolbar({
  filter,
  onFilterChange,
  query,
  onQueryChange,
  sortBy,
  onSortChange,
  activeCount,
}) {
  return (
    <div className="toolbar">
      <div className="tabs" role="tablist" aria-label="Filter tasks">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            role="tab"
            type="button"
            aria-selected={filter === f.id}
            className={`tab${filter === f.id ? ' tab--active' : ''}`}
            onClick={() => onFilterChange(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="toolbar__row">
        <input
          className="input toolbar__search"
          type="search"
          placeholder="Search tasks…"
          aria-label="Search tasks by title"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
        <label className="field field--inline">
          <span>Sort</span>
          <select
            className="input"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="none">Default</option>
            <option value="due">Due date</option>
            <option value="priority">Priority</option>
          </select>
        </label>
      </div>

      <p className="counter" aria-live="polite">
        {activeCount} {activeCount === 1 ? 'task' : 'tasks'} left
      </p>
    </div>
  )
}
