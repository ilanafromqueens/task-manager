"use client";

import { memo } from "react";
import { focusRing } from "@/lib/a11y";
import { useTheme } from "@/components/ThemeProvider";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-text-label transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800 ${focusRing}`}
    >
      {isDark ? "Light Mode" : "Dark Mode"}
    </button>
  );
}

export default memo(ThemeToggle);
