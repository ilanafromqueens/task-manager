"use client";

import { memo } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { focusRing, inputFocusRing } from "@/lib/a11y";
import type { TaskSearchProps } from "@/types/components";

function TaskSearch({
  searchQuery,
  onSearchChange,
  onClear,
  isSearching = false,
}: TaskSearchProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search tasks..."
          aria-label="Search tasks by title"
          aria-busy={isSearching}
          className={`flex-1 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm text-text-heading placeholder:text-text-muted transition-colors dark:border-zinc-700 dark:bg-zinc-900 ${inputFocusRing}`}
        />
        <button
          type="button"
          onClick={onClear}
          disabled={!searchQuery}
          aria-label="Clear search"
          className={`rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-text-label transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:hover:bg-zinc-800 ${focusRing}`}
        >
          Clear
        </button>
      </div>
      {isSearching && (
        <div className="flex items-center gap-2 text-xs text-text-label">
          <LoadingSpinner label="Searching tasks" size="sm" />
          <span aria-live="polite">Searching...</span>
        </div>
      )}
    </div>
  );
}

export default memo(TaskSearch);
