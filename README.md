# Task Manager

A simple one-page task manager I built with React and Vite. You can add tasks, mark them done, edit them, delete them, and filter or search through them. It works on phone and desktop.

Live demo: (add your Vercel link here)

## What it can do

- Loads the starting tasks from `public/tasks.json` the first time you open it. While it loads you see a spinner, and if the fetch fails you get an error message with a Retry button.
- After that, everything is saved in localStorage, so your tasks are still there when you come back. The JSON file is only used on the very first visit.
- Add a task with a title, a priority (Low, Medium, High) and an optional due date. Pressing Enter submits. If the title is empty or only spaces, it shows an error.
- Each task shows the title, a priority badge, the due date and a checkbox. Done tasks get a line through them.
- Edit a title right in the list. Enter saves, Escape cancels, and you can't save a blank title.
- Delete asks "are you sure?" first.
- Tabs for All, Active and Completed, and a counter like "3 tasks left".
- Search by title (not case sensitive). It works together with the tabs.
- Sort by due date (soonest first, no date goes last) or by priority (High first).
- If a task is not done and the due date has passed, it gets a red "Overdue" label.

## Built with

- React 18 (function components and hooks only)
- Vite
- Plain CSS
- No backend, no Redux, no UI library

## How to run it

You need Node.js installed.

```bash
npm install
npm run dev
```

Then open the link it prints in the terminal (usually http://localhost:5173).

To make a production build:

```bash
npm run build
npm run preview
```

If you want to see the first-load spinner again, open DevTools, go to Application > Local Storage, delete the `task-manager.tasks.v1` key and refresh.

## Folder structure

```
public/tasks.json        starting data
src/main.jsx             entry file
src/App.jsx              main page, holds filter / search / sort state
src/TasksContext.jsx     all the task data + loading + saving to localStorage
src/utils.js             helper functions (dates, overdue check, sorting)
src/components/
  TaskForm.jsx           the add task form
  Toolbar.jsx            tabs, search, sort and the counter
  TaskItem.jsx           one task row (checkbox, edit, delete)
  ConfirmDialog.jsx      the delete confirmation popup
src/index.css            all the styles
```

## How I built it

- I kept the tasks in one place using Context and `useReducer`, so any component can add, edit or delete without passing props down many levels.
- Saving to localStorage happens in a `useEffect`, but only after the data has finished loading. At first I didn't think about this and the empty list could overwrite the saved tasks.
- Filtering, searching and sorting are not stored anywhere. They are worked out from the task list each time, so there is no extra state to keep in sync.
- Dates are stored as `YYYY-MM-DD` text, so I can compare them directly to check if something is overdue.
- For the edit box I had a problem where pressing Enter saved the task and then the blur event fired and tried to save again. I fixed it with a `useRef` flag.
