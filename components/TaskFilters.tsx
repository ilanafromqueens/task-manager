"use client";

import { memo } from "react";
import { focusRing } from "@/lib/a11y";
import type { TaskFiltersProps } from "@/types/components";

const FILTER_OPTIONS = [
  { value: "all", label: "All" },
  { value: "active", label: "Due Soon" },
  { value: "completed", label: "Completed" },
] as const;

function TaskFilters({ activeFilter, onFilterChange }: TaskFiltersProps) {
  return (
    <div
      role="group"
      aria-label="Filter tasks by status"
      className="flex gap-2"
    >
      {FILTER_OPTIONS.map((option) => {
        const isActive = activeFilter === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onFilterChange(option.value)}
            aria-pressed={isActive}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${focusRing} ${
              isActive
                ? "bg-brand-primary text-white hover:bg-brand-primary-hover dark:bg-brand-primary-dark dark:text-white dark:hover:bg-brand-primary-dark-hover"
                : "border border-zinc-200 bg-white text-text-label hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export default memo(TaskFilters);
