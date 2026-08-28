import type { Task, TaskFilter, TaskPriority } from "@/types/task";

export interface TaskFormProps {
  onAdd: (
    title: string,
    priority: TaskPriority,
    dueDate?: string,
  ) => Promise<void>;
  isTaskListEmpty?: boolean;
  isSaving?: boolean;
}

export interface TaskFiltersProps {
  activeFilter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
}

export interface TaskSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClear: () => void;
  isSearching?: boolean;
}

export interface TaskListProps {
  tasks: Task[];
  lastAddedId: string | null;
  filterOnlyCount: number;
  activeFilter: TaskFilter;
  searchQuery: string;
  isLoading?: boolean;
  onToggle: (id: string) => void;
  onEdit: (id: string, title: string) => void;
  onDelete: (id: string) => void;
}

export interface TaskItemProps {
  task: Task;
  animateEnter?: boolean;
  onToggle: (id: string) => void;
  onEdit: (id: string, title: string) => void;
  onDelete: (id: string) => void;
}

export interface LoadingSpinnerProps {
  label?: string;
  size?: "sm" | "md";
  className?: string;
}
