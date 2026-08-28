# Task Manager

A task manager app to better organize and complete tasks.

## Features

- **Task CRUD** — Create, read, update, and delete tasks with priority levels and optional due dates
- **Search** — Real-time, case-insensitive search by task title
- **Dark mode** — Toggle between light and dark themes (preference saved in the browser)
- **Task filtering** — Filter tasks by All, Active, or Completed

## Tech Stack

- React / Next.js
- TypeScript
- Tailwind CSS

## Installation

1. Clone the repository

   ```bash
   git clone <repository-url>
   cd task-manager
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Run the app

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Other commands

```bash
npm run build   # Production build
npm run start   # Start production server
npm run lint    # Run ESLint
```

## Usage

Users can add, edit, and delete tasks. They can filter and search through their list. Users can also toggle between dark and light mode to their preference.

Tasks are saved automatically in the browser, so your list persists when you refresh the page.
