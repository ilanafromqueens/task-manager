"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  applyStylePreferences,
  DEFAULT_STYLE_PREFERENCES,
  parseStylePreferences,
  STYLE_PREFERENCES_STORAGE_KEY,
  type StylePreferences,
  type TextColors,
} from "@/lib/stylePreferences";

interface StyleContextValue {
  preferences: StylePreferences;
  updateLightColors: (colors: TextColors) => void;
  updateDarkColors: (colors: TextColors) => void;
  updateCustomCss: (customCss: string) => void;
  resetPreferences: () => void;
}

const StyleContext = createContext<StyleContextValue | null>(null);

export function StyleProvider({ children }: { children: ReactNode }) {
  const { value: preferences, setValue: setPreferences } =
    useLocalStorage<StylePreferences>(
      STYLE_PREFERENCES_STORAGE_KEY,
      DEFAULT_STYLE_PREFERENCES,
      parseStylePreferences,
      {
        onWriteError: (error) => {
          console.error("Failed to save style preferences:", error);
        },
        onReadError: (error) => {
          console.error("Failed to load style preferences:", error);
        },
      },
    );

  useEffect(() => {
    applyStylePreferences(preferences);
  }, [preferences]);

  const updateLightColors = useCallback(
    (colors: TextColors) => {
      setPreferences((current) => ({ ...current, light: colors }));
    },
    [setPreferences],
  );

  const updateDarkColors = useCallback(
    (colors: TextColors) => {
      setPreferences((current) => ({ ...current, dark: colors }));
    },
    [setPreferences],
  );

  const updateCustomCss = useCallback(
    (customCss: string) => {
      setPreferences((current) => ({ ...current, customCss }));
    },
    [setPreferences],
  );

  const resetPreferences = useCallback(() => {
    setPreferences(DEFAULT_STYLE_PREFERENCES);
  }, [setPreferences]);

  const value = useMemo(
    () => ({
      preferences,
      updateLightColors,
      updateDarkColors,
      updateCustomCss,
      resetPreferences,
    }),
    [
      preferences,
      updateLightColors,
      updateDarkColors,
      updateCustomCss,
      resetPreferences,
    ],
  );

  return (
    <StyleContext.Provider value={value}>{children}</StyleContext.Provider>
  );
}

export function useStylePreferences() {
  const context = useContext(StyleContext);
  if (!context) {
    throw new Error("useStylePreferences must be used within a StyleProvider");
  }
  return context;
}
