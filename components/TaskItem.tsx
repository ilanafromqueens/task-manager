"use client";

import { memo, useEffect, useRef, useState } from "react";
import { focusRing, inputFocusRing } from "@/lib/a11y";
import type { TaskItemProps } from "@/types/components";
import {
  formatDueDate,
  isOverdue,
  type TaskPriority,
} from "@/lib/utils";

const PRIORITY_BADGES: Record<
  TaskPriority,
  { label: string; className: string }
> = {
  high: {
    label: "High",
    className:
      "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
  },
  medium: {
    label: "Medium",
    className:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300",
  },
  low: {
    label: "Low",
    className:
      "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
  },
};

type TaskItemComponentProps = TaskItemProps;

function TaskItem({
  task,
  animateEnter = false,
  onToggle,
  onEdit,
  onDelete,
}: TaskItemComponentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const inputRef = useRef<HTMLInputElement>(null);
  const deleteButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const exitTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (exitTimerRef.current) window.clearTimeout(exitTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  useEffect(() => {
    if (!isConfirmingDelete) return;

    confirmButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsConfirmingDelete(false);
        deleteButtonRef.current?.focus();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = dialogRef.current.querySelectorAll("button");
      if (focusable.length === 0) return;

      const first = focusable[0] as HTMLElement;
      const last = focusable[focusable.length - 1] as HTMLElement;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isConfirmingDelete]);

  function startEditing() {
    setIsConfirmingDelete(false);
    setEditTitle(task.title);
    setIsEditing(true);
  }

  function handleSave() {
    const trimmed = editTitle.trim();
    if (!trimmed) return;

    onEdit(task.id, trimmed);
    setIsEditing(false);
  }

  function handleCancel() {
    setEditTitle(task.title);
    setIsEditing(false);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSave();
    } else if (event.key === "Escape") {
      event.preventDefault();
      handleCancel();
    }
  }

  function handleCancelDelete() {
    setIsConfirmingDelete(false);
    deleteButtonRef.current?.focus();
  }

  function handleConfirmDelete() {
    setIsExiting(true);
    exitTimerRef.current = window.setTimeout(() => {
      onDelete(task.id);
    }, 200);
  }

  const formattedDueDate = formatDueDate(task.dueDate);
  const overdue = isOverdue(task.dueDate, task.completed);

  return (
    <li
      className={`group rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 ${
        isExiting ? "animate-task-exit" : animateEnter ? "animate-task-enter" : ""
      } ${task.completed ? "opacity-80" : "opacity-100"}`}
    >
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          disabled={isEditing || isExiting}
          aria-label={`Mark "${task.title}" as ${task.completed ? "incomplete" : "complete"}`}
          className={`mt-0.5 size-4 shrink-0 cursor-pointer rounded border-zinc-300 text-zinc-900 transition-transform duration-200 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-800 ${focusRing}`}
        />

        <div className="min-w-0 flex-1">
          {isEditing ? (
            <div className="animate-panel-enter flex flex-col gap-3">
              <input
                ref={inputRef}
                type="text"
                value={editTitle}
                onChange={(event) => setEditTitle(event.target.value)}
                onKeyDown={handleKeyDown}
                aria-label={`Edit task "${task.title}"`}
                className={`w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-text-heading dark:border-zinc-600 dark:bg-zinc-800 ${inputFocusRing}`}
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!editTitle.trim()}
                  aria-label={`Save changes to "${task.title}"`}
                  className={`rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300 ${focusRing}`}
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  aria-label={`Cancel editing "${task.title}"`}
                  className={`rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-text-label transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800 ${focusRing}`}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={startEditing}
                  aria-label={`Edit task "${task.title}"`}
                  className={`task-title text-left text-sm font-medium transition-all duration-200 hover:text-text-body ${focusRing} ${
                    task.completed
                      ? "text-text-muted line-through"
                      : "text-text-heading"
                  }`}
                >
                  {task.title}
                </button>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium transition-colors duration-200 ${PRIORITY_BADGES[task.priority].className}`}
                >
                  {PRIORITY_BADGES[task.priority].label}
                </span>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-muted">
                <span>
                  {new Date(task.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
                {formattedDueDate && (
                  <span
                    className={
                      overdue
                        ? "font-medium text-red-600 dark:text-red-400"
                        : undefined
                    }
                  >
                    Due {formattedDueDate}
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        {!isEditing && !isConfirmingDelete && !isExiting && (
          <button
            ref={deleteButtonRef}
            type="button"
            onClick={() => setIsConfirmingDelete(true)}
            aria-label={`Delete task "${task.title}"`}
            aria-haspopup="dialog"
            className={`rounded-lg px-2 py-1 text-xs font-medium text-text-muted opacity-60 transition-all hover:bg-red-50 hover:text-red-600 hover:opacity-100 focus-visible:opacity-100 dark:hover:bg-red-950 dark:hover:text-red-400 ${focusRing}`}
          >
            Delete
          </button>
        )}
      </div>

      {isConfirmingDelete && (
        <div
          ref={dialogRef}
          className="animate-panel-enter mt-3 flex flex-col gap-3 rounded-lg border border-red-200 bg-red-50 px-3 py-3 dark:border-red-900/50 dark:bg-red-950/30"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby={`delete-confirm-${task.id}`}
          aria-describedby={`delete-desc-${task.id}`}
        >
          <p
            id={`delete-confirm-${task.id}`}
            className="text-sm font-medium text-red-800 dark:text-red-200"
          >
            Delete this task?
          </p>
          <p
            id={`delete-desc-${task.id}`}
            className="text-sm text-red-700 dark:text-red-300"
          >
            &ldquo;{task.title}&rdquo; will be permanently removed.
          </p>
          <div className="flex gap-2">
            <button
              ref={confirmButtonRef}
              type="button"
              onClick={handleConfirmDelete}
              aria-label={`Confirm delete "${task.title}"`}
              className={`rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 ${focusRing}`}
            >
              Confirm Delete
            </button>
            <button
              type="button"
              onClick={handleCancelDelete}
              aria-label={`Cancel delete "${task.title}"`}
              className={`rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 transition-colors hover:bg-red-100 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950/50 ${focusRing}`}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </li>
  );
}

export default memo(TaskItem);
