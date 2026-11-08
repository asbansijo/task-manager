# Task Manager

A one-page task manager built with React (Vite), function components and hooks only. No backend, no state library, no UI kit.

## Run

```bash
npm install
npm run dev      # development
npm run build    # production build into dist/
```

## Features

- First load fetches `public/tasks.json` (loader, error message and Retry button). After that, tasks load from `localStorage`.
- Add, complete, edit in place (Enter saves, Escape cancels), delete with confirmation.
- Filter tabs (All / Active / Completed) with a "N tasks left" counter.
- Case-insensitive search that works together with the filter tab.
- Sort by due date (soonest first, no date last) or priority (High first).
- Incomplete tasks past their due date show a red "Overdue" label.
- Responsive: works at 375px wide and on desktop.

## Structure

- `src/TasksContext.jsx` – reducer + Context: loading, saving to localStorage, task actions.
- `src/utils.js` – date helpers, overdue check, sorting.
- `src/App.jsx` – filter / search / sort state and page layout.
- `src/components/` – `TaskForm`, `Toolbar`, `TaskItem`, `ConfirmDialog`.
- `src/index.css` – plain CSS, mobile friendly.

To re-trigger the first-load fetch, clear the `task-manager.tasks.v1` key in browser localStorage.
