function startOfDay(date: Date): Date {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}

export function parseDueDate(dueDate: string): Date | null {
  const parts = dueDate.split("-").map(Number);
  if (parts.length !== 3) return null;

  const [year, month, day] = parts;
  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
    return null;
  }

  const parsed = startOfDay(new Date(year, month - 1, day));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function formatDueDate(dueDate: string | null | undefined): string | null {
  if (!dueDate) return null;

  const due = parseDueDate(dueDate);
  if (!due) return null;

  const today = startOfDay(new Date());
  const diffDays = Math.round(
    (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays > 1) return `In ${diffDays} days`;
  if (diffDays === -1) return "Yesterday";
  return `${Math.abs(diffDays)} days ago`;
}

export function isOverdue(
  dueDate: string | null | undefined,
  completed: boolean,
): boolean {
  if (!dueDate || completed) return false;

  const due = parseDueDate(dueDate);
  if (!due) return false;

  const today = startOfDay(new Date());
  return due < today;
}
