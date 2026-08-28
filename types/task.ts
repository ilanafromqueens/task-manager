export type TaskPriority = "high" | "medium" | "low";

export type TaskFilter = "all" | "active" | "completed";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: TaskPriority;
  dueDate?: string;
  createdAt: number;
}

export interface CreateTaskInput {
  title: string;
  priority?: TaskPriority;
  dueDate?: string;
}

export interface TaskHandlers {
  onToggle: (id: string) => void | Promise<void>;
  onEdit: (id: string, title: string) => void | Promise<void>;
  onDelete: (id: string) => void | Promise<void>;
}

export interface UseTasksResult {
  tasks: Task[];
  lastAddedId: string | null;
  isLoading: boolean;
  isSaving: boolean;
  handleAdd: (
    title: string,
    priority: TaskPriority,
    dueDate?: string,
  ) => Promise<void>;
  handleToggle: (id: string) => Promise<void>;
  handleDelete: (id: string) => Promise<void>;
  handleEdit: (id: string, title: string) => Promise<void>;
}
