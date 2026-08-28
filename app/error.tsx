"use client";

import { focusRing } from "@/lib/a11y";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="app-root flex flex-1 flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-md rounded-xl border border-red-200 bg-white p-6 text-center dark:border-red-900/50 dark:bg-zinc-900">
        <h1 className="text-lg font-semibold text-text-heading">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm text-text-body">
          The task manager hit an unexpected error. You can try again without
          refreshing the page.
        </p>
        <button
          type="button"
          onClick={reset}
          aria-label="Try again"
          className={`mt-4 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300 ${focusRing}`}
        >
          Try again
        </button>
      </div>
    </div>
  );
}
