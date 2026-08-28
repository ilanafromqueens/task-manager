"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useToast } from "@/components/ToastProvider";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { getErrorMessage } from "@/lib/errors";
import { TASKS_STORAGE_KEY } from "@/lib/storageKeys";
import {
  countInvalidStoredTasks,
  createTask,
  parseStoredTasks,
  type Task,
  type TaskPriority,
} from "@/lib/tasks";
import type { UseTasksResult } from "@/types/task";

const INITIAL_TASKS: Task[] = [];

async function yieldToUi(): Promise<void> {
  await Promise.resolve();
}

export function useTasks(): UseTasksResult {
  const { showToast } = useToast();
  const hasWarnedInvalidTasks = useRef(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);

  const handleStorageWriteError = useCallback(
    (error: unknown) => {
      console.error("Failed to save tasks:", error);
      showToast(
        "Could not save tasks. Your browser storage may be full or disabled.",
        "error",
      );
    },
    [showToast],
  );

  const handleStorageReadError = useCallback(
    (error: unknown) => {
      console.error("Failed to load tasks:", error);
      showToast("Could not load saved tasks. Starting with an empty list.", "error");
    },
    [showToast],
  );

  const {
    value: tasks,
    setValue: setTasks,
    isLoaded,
  } = useLocalStorage<Task[]>(
    TASKS_STORAGE_KEY,
    INITIAL_TASKS,
    parseStoredTasks,
    {
      onWriteError: handleStorageWriteError,
      onReadError: handleStorageReadError,
    },
  );

  useEffect(() => {
    if (!isLoaded || hasWarnedInvalidTasks.current) return;

    try {
      const raw = window.localStorage.getItem(TASKS_STORAGE_KEY);
      if (!raw) return;

      const invalidCount = countInvalidStoredTasks(JSON.parse(raw));
      if (invalidCount > 0) {
        hasWarnedInvalidTasks.current = true;
        showToast(
          `${invalidCount} saved task${invalidCount === 1 ? "" : "s"} could not be loaded.`,
          "error",
        );
      }
    } catch (error) {
      console.error("Failed to validate stored tasks:", error);
      showToast("Some saved tasks could not be validated.", "error");
    }
  }, [isLoaded, showToast]);

  useEffect(() => {
    if (!lastAddedId) return;
    const timer = window.setTimeout(() => setLastAddedId(null), 300);
    return () => window.clearTimeout(timer);
  }, [lastAddedId]);

  const handleAdd = useCallback(
    async (title: string, priority: TaskPriority, dueDate?: string) => {
      setIsSaving(true);
      try {
        await yieldToUi();
        const task = createTask(title, priority, dueDate);
        setTasks((prev) => [task, ...prev]);
        setLastAddedId(task.id);
        showToast(`Task '${task.title}' has been added successfully!`);
      } catch (error) {
        showToast(getErrorMessage(error, "Failed to add task."), "error");
      } finally {
        setIsSaving(false);
      }
    },
    [setTasks, showToast],
  );

  const handleToggle = useCallback(
    async (id: string) => {
      setIsSaving(true);
      try {
        await yieldToUi();

        let taskMissing = false;
        setTasks((prev) => {
          if (!prev.some((task) => task.id === id)) {
            taskMissing = true;
            return prev;
          }

          return prev.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task,
          );
        });

        if (taskMissing) {
          throw new Error("Task not found.");
        }
      } catch (error) {
        showToast(getErrorMessage(error, "Failed to update task."), "error");
      } finally {
        setIsSaving(false);
      }
    },
    [setTasks, showToast],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      setIsSaving(true);
      try {
        await yieldToUi();
        let deletedTitle: string | undefined;
        let taskMissing = false;

        setTasks((prev) => {
          const task = prev.find((item) => item.id === id);
          if (!task) {
            taskMissing = true;
            return prev;
          }

          deletedTitle = task.title;
          return prev.filter((item) => item.id !== id);
        });

        if (taskMissing) {
          throw new Error("Task not found.");
        }

        if (deletedTitle) {
          showToast(`Task '${deletedTitle}' has been deleted.`);
        }
      } catch (error) {
        showToast(getErrorMessage(error, "Failed to delete task."), "error");
      } finally {
        setIsSaving(false);
      }
    },
    [setTasks, showToast],
  );

  const handleEdit = useCallback(
    async (id: string, title: string) => {
      setIsSaving(true);
      try {
        await yieldToUi();
        const trimmed = title.trim();
        if (!trimmed) {
          throw new Error("Task title cannot be empty.");
        }

        let taskMissing = false;
        setTasks((prev) => {
          if (!prev.some((task) => task.id === id)) {
            taskMissing = true;
            return prev;
          }

          return prev.map((task) =>
            task.id === id ? { ...task, title: trimmed } : task,
          );
        });

        if (taskMissing) {
          throw new Error("Task not found.");
        }

        showToast(`Task '${trimmed}' has been updated.`);
      } catch (error) {
        showToast(getErrorMessage(error, "Failed to update task."), "error");
      } finally {
        setIsSaving(false);
      }
    },
    [setTasks, showToast],
  );

  return useMemo(
    () => ({
      tasks,
      lastAddedId,
      isLoading: !isLoaded,
      isSaving,
      handleAdd,
      handleToggle,
      handleDelete,
      handleEdit,
    }),
    [
      tasks,
      lastAddedId,
      isLoaded,
      isSaving,
      handleAdd,
      handleToggle,
      handleDelete,
      handleEdit,
    ],
  );
}
