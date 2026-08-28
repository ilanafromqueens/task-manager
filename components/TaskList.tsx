"use client";

import { memo } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import type { TaskListProps } from "@/types/components";
import type { TaskFilter } from "@/types/task";
import TaskItem from "./TaskItem";

const FILTER_EMPTY_MESSAGES: Record<
  Exclude<TaskFilter, "all">,
  { title: string; description: string }
> = {
  active: {
    title: "No tasks due soon",
    description: "All tasks are completed. Great work!",
  },
  completed: {
    title: "No completed tasks",
    description: "Complete a task to see it here.",
  },
};

function TaskList({
  tasks,
  lastAddedId,
  filterOnlyCount,
  activeFilter,
  searchQuery,
  isLoading = false,
  onToggle,
  onEdit,
  onDelete,
}: TaskListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-white px-6 py-16 dark:border-zinc-800 dark:bg-zinc-900/50">
        <LoadingSpinner label="Loading tasks" />
      </div>
    );
  }

  if (tasks.length === 0) {
    const hasSearch = searchQuery.trim().length > 0;
    const filterMessage =
      filterOnlyCount === 0 && activeFilter !== "all"
        ? FILTER_EMPTY_MESSAGES[activeFilter]
        : null;
    const searchMessage =
      hasSearch && filterOnlyCount > 0
        ? {
            title: "No matching tasks",
            description: `No tasks match "${searchQuery.trim()}". Try a different keyword or clear the search.`,
          }
        : null;
    const emptyMessage = searchMessage ?? filterMessage;

    return (
      <div
        role="status"
        aria-live="polite"
        className="animate-panel-enter rounded-xl border border-dashed border-zinc-200 bg-white px-6 py-16 text-center dark:border-zinc-800 dark:bg-zinc-900/50"
      >
        <p className="text-sm font-medium text-text-label">
          {emptyMessage?.title ?? "No tasks yet"}
        </p>
        <p className="mt-1 text-sm text-text-muted">
          {emptyMessage?.description ??
            "Add a task above to get started. You can filter, search, and set priorities anytime."}
        </p>
      </div>
    );
  }

  return (
    <ul
      aria-label="Task list"
      className="flex flex-col gap-3"
    >
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          animateEnter={task.id === lastAddedId}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

export default memo(TaskList);
