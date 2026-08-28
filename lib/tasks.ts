import type { Task, TaskPriority } from "@/types/task";

export type { Task, TaskFilter, TaskPriority, CreateTaskInput } from "@/types/task";

export const DEFAULT_PRIORITY: TaskPriority = "medium";

const VALID_PRIORITIES: TaskPriority[] = ["high", "medium", "low"];

export function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export function createTask(
  title: string,
  priority: TaskPriority = DEFAULT_PRIORITY,
  dueDate?: string,
): Task {
  const trimmed = title.trim();
  if (!trimmed) {
    throw new Error("Task title is required");
  }

  return {
    id: generateId(),
    title: trimmed,
    completed: false,
    priority,
    ...(dueDate ? { dueDate } : {}),
    createdAt: Date.now(),
  };
}

function isValidTask(value: unknown): value is Task {
  if (typeof value !== "object" || value == null) return false;

  const task = value as Record<string, unknown>;

  return (
    typeof task.id === "string" &&
    typeof task.title === "string" &&
    typeof task.completed === "boolean" &&
    typeof task.createdAt === "number" &&
    VALID_PRIORITIES.includes(task.priority as TaskPriority) &&
    (task.dueDate === undefined || typeof task.dueDate === "string")
  );
}

export function parseStoredTasks(value: unknown): Task[] {
  if (!Array.isArray(value)) return [];
  return value.filter(isValidTask);
}

export function countInvalidStoredTasks(value: unknown): number {
  if (!Array.isArray(value)) return 0;
  return value.length - value.filter(isValidTask).length;
}
