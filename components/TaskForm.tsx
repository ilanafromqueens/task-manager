"use client";

import { FormEvent, memo, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { focusRing, inputFocusRing } from "@/lib/a11y";
import { DEFAULT_PRIORITY, type TaskPriority } from "@/lib/utils";
import type { TaskFormProps } from "@/types/components";

const PRIORITY_OPTIONS: { value: TaskPriority; label: string }[] = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

function TaskForm({
  onAdd,
  isTaskListEmpty = false,
  isSaving = false,
}: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<TaskPriority>(DEFAULT_PRIORITY);
  const [dueDate, setDueDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = title.trim();
    if (!trimmed || isSaving || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onAdd(trimmed, priority, dueDate || undefined);
      setTitle("");
      setPriority(DEFAULT_PRIORITY);
      setDueDate("");
    } catch {
      // Errors are surfaced via toast in useTasks.
    } finally {
      setIsSubmitting(false);
    }
  }

  const isTitleEmpty = !title.trim();
  const isDisabled = isTitleEmpty || isSaving || isSubmitting;

  return (
    <section aria-labelledby="task-form-heading">
      <h2 id="task-form-heading" className="sr-only">
        Add a new task
      </h2>

      {isTaskListEmpty && (
        <div
          role="status"
          className="mb-4 rounded-xl border border-dashed border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/50"
        >
          <p className="text-sm font-bold text-text-body">
            Your task list is empty
          </p>
          <p className="mt-1 text-sm text-text-label">
            Add your first task below. Set a priority to stay organized, or pick
            a due date to keep deadlines visible.
          </p>
        </div>
      )}

      <p
        id="task-form-description"
        className="mb-3 text-sm text-text-label"
      >
        Enter what you need to do, choose a priority, and optionally set a due
        date.
      </p>

      <form
        onSubmit={handleSubmit}
        aria-describedby="task-form-description task-form-hint"
        className="flex flex-col gap-3"
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="What do you need to do?"
            aria-label="Task title"
            aria-required="true"
            disabled={isSaving || isSubmitting}
            className={`flex-1 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-text-heading placeholder:text-text-muted transition-colors disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 ${inputFocusRing}`}
          />
          <div className="relative w-full sm:w-auto sm:min-w-[8.75rem]">
            <select
              value={priority}
              onChange={(event) =>
                setPriority(event.target.value as TaskPriority)
              }
              aria-label="Task priority"
              className={`w-full cursor-pointer appearance-none rounded-xl border border-zinc-200 bg-white py-3 pl-4 pr-9 text-sm text-text-heading transition-colors dark:border-zinc-700 dark:bg-zinc-900 ${inputFocusRing}`}
            >
              {PRIORITY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-text-label"
            >
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className="size-4"
              >
                <path
                  fillRule="evenodd"
                  d="M5.22 7.22a.75.75 0 0 1 1.06 0L10 10.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 8.28a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            aria-label="Task due date (optional)"
            className={`rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-text-heading transition-colors dark:border-zinc-700 dark:bg-zinc-900 ${inputFocusRing}`}
          />
          <button
            type="submit"
            disabled={isDisabled}
            aria-label="Add task"
            aria-disabled={isDisabled}
            aria-busy={isSubmitting || isSaving}
            className={`inline-flex min-w-[7.5rem] items-center justify-center gap-2 rounded-xl bg-brand-primary px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-primary-hover disabled:cursor-not-allowed disabled:opacity-40 dark:bg-brand-primary-dark dark:text-white dark:hover:bg-brand-primary-dark-hover sm:ml-auto ${focusRing}`}
          >
            {isSubmitting || isSaving ? (
              <>
                <LoadingSpinner label="Adding task" size="sm" />
                <span>Saving...</span>
              </>
            ) : (
              "Add Task"
            )}
          </button>
        </div>
        <p
          id="task-form-hint"
          className="text-xs text-text-muted"
        >
          {isTitleEmpty
            ? "Tip: Task title is required before you can add a task."
            : "Press Enter or click Add Task to save."}
        </p>
      </form>
    </section>
  );
}

export default memo(TaskForm);
