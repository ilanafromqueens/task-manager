export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "task-manager-theme";

export function parseTheme(value: unknown): Theme {
  return value === "dark" ? "dark" : "light";
}

export function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
}
