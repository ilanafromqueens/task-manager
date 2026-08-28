"use client";

import { memo } from "react";
import type { LoadingSpinnerProps } from "@/types/components";

function LoadingSpinner({
  label = "Loading",
  size = "md",
  className = "",
}: LoadingSpinnerProps) {
  const sizeClass = size === "sm" ? "size-4 border-2" : "size-6 border-2";

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      className={`inline-flex items-center gap-2 ${className}`}
    >
      <span
        className={`inline-block animate-spin rounded-full border-zinc-300 border-t-zinc-700 dark:border-zinc-600 dark:border-t-zinc-200 ${sizeClass}`}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}

export default memo(LoadingSpinner);
