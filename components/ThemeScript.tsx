import { THEME_STORAGE_KEY } from "@/lib/theme";

export function ThemeScript() {
  const script = `
    (function () {
      try {
        var stored = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
        var theme = stored ? JSON.parse(stored) : "light";
        if (theme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      } catch (e) {}
    })();
  `;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
