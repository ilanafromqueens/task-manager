export interface TextColors {
  heading: string;
  body: string;
  muted: string;
  label: string;
}

export interface StylePreferences {
  light: TextColors;
  dark: TextColors;
  customCss: string;
}

export const STYLE_PREFERENCES_STORAGE_KEY = "task-manager-style-preferences";

const STYLE_ELEMENT_ID = "user-style-preferences";
const CUSTOM_CSS_ELEMENT_ID = "user-custom-css";

const HEX_COLOR_PATTERN = /^#[0-9A-Fa-f]{6}$/;

export const DEFAULT_LIGHT_COLORS: TextColors = {
  heading: "#18181b",
  body: "#52525b",
  muted: "#a1a1aa",
  label: "#71717a",
};

export const DEFAULT_DARK_COLORS: TextColors = {
  heading: "#fafafa",
  body: "#d4d4d8",
  muted: "#71717a",
  label: "#a1a1aa",
};

export const DEFAULT_STYLE_PREFERENCES: StylePreferences = {
  light: DEFAULT_LIGHT_COLORS,
  dark: DEFAULT_DARK_COLORS,
  customCss: "",
};

export const TEXT_COLOR_FIELDS: {
  key: keyof TextColors;
  label: string;
  description: string;
}[] = [
  {
    key: "heading",
    label: "Headings",
    description: "Page titles and section headings",
  },
  {
    key: "body",
    label: "Body text",
    description: "Primary readable text",
  },
  {
    key: "label",
    label: "Labels",
    description: "Subtitles, filters, and secondary labels",
  },
  {
    key: "muted",
    label: "Muted text",
    description: "Hints, timestamps, and helper text",
  },
];

function isHexColor(value: unknown): value is string {
  return typeof value === "string" && HEX_COLOR_PATTERN.test(value);
}

function parseTextColors(
  value: unknown,
  fallback: TextColors,
): TextColors {
  if (!value || typeof value !== "object") return fallback;

  const colors = value as Partial<TextColors>;
  return {
    heading: isHexColor(colors.heading) ? colors.heading : fallback.heading,
    body: isHexColor(colors.body) ? colors.body : fallback.body,
    muted: isHexColor(colors.muted) ? colors.muted : fallback.muted,
    label: isHexColor(colors.label) ? colors.label : fallback.label,
  };
}

export function parseStylePreferences(value: unknown): StylePreferences {
  if (!value || typeof value !== "object") {
    return DEFAULT_STYLE_PREFERENCES;
  }

  const prefs = value as Partial<StylePreferences>;
  return {
    light: parseTextColors(prefs.light, DEFAULT_LIGHT_COLORS),
    dark: parseTextColors(prefs.dark, DEFAULT_DARK_COLORS),
    customCss:
      typeof prefs.customCss === "string" ? sanitizeCustomCss(prefs.customCss) : "",
  };
}

export function sanitizeCustomCss(css: string): string {
  return css
    .replace(/@import\b[^;]*;?/gi, "")
    .replace(/expression\s*\(/gi, "")
    .replace(/javascript:/gi, "")
    .slice(0, 8000);
}

function buildPreferencesCss(preferences: StylePreferences): string {
  const { light, dark } = preferences;

  return `:root {
  --text-heading: ${light.heading};
  --text-body: ${light.body};
  --text-muted: ${light.muted};
  --text-label: ${light.label};
}

.dark {
  --text-heading: ${dark.heading};
  --text-body: ${dark.body};
  --text-muted: ${dark.muted};
  --text-label: ${dark.label};
}`;
}

function upsertStyleElement(id: string, css: string) {
  if (typeof document === "undefined") return;

  let styleElement = document.getElementById(id) as HTMLStyleElement | null;
  if (!styleElement) {
    styleElement = document.createElement("style");
    styleElement.id = id;
    document.head.appendChild(styleElement);
  }

  styleElement.textContent = css;
}

export function applyStylePreferences(preferences: StylePreferences) {
  if (typeof document === "undefined") return;

  upsertStyleElement(STYLE_ELEMENT_ID, buildPreferencesCss(preferences));
  upsertStyleElement(
    CUSTOM_CSS_ELEMENT_ID,
    sanitizeCustomCss(preferences.customCss),
  );
}
