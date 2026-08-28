import type { Task, TaskFilter } from "@/lib/tasks";

export function filterTasks(tasks: Task[], filter: TaskFilter): Task[] {
  switch (filter) {
    case "active":
      return tasks.filter((task) => !task.completed);
    case "completed":
      return tasks.filter((task) => task.completed);
    default:
      return tasks;
  }
}

export function searchTasks(tasks: Task[], query: string): Task[] {
  const trimmed = query.trim();
  if (!trimmed) return tasks;

  const lowerQuery = trimmed.toLowerCase();
  return tasks.filter((task) =>
    task.title.toLowerCase().includes(lowerQuery),
  );
}
