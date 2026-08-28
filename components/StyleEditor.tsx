"use client";

import { memo, useEffect, useId, useRef, useState } from "react";
import { focusRing } from "@/lib/a11y";
import {
  TEXT_COLOR_FIELDS,
  type TextColors,
} from "@/lib/stylePreferences";
import { useStylePreferences } from "@/components/StyleProvider";

type EditorTab = "colors" | "css";

interface ColorFieldGroupProps {
  title: string;
  colors: TextColors;
  onChange: (colors: TextColors) => void;
}

function ColorFieldGroup({ title, colors, onChange }: ColorFieldGroupProps) {
  return (
    <fieldset className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
      <legend className="px-1 text-sm font-medium text-text-heading">
        {title}
      </legend>
      <div className="mt-3 flex flex-col gap-4">
        {TEXT_COLOR_FIELDS.map((field) => (
          <label
            key={field.key}
            className="flex items-start gap-3 text-sm"
          >
            <input
              type="color"
              value={colors[field.key]}
              onChange={(event) =>
                onChange({ ...colors, [field.key]: event.target.value })
              }
              aria-label={`${title} ${field.label} color`}
              className={`mt-0.5 size-9 shrink-0 cursor-pointer rounded border border-zinc-200 bg-white p-0.5 dark:border-zinc-700 dark:bg-zinc-900 ${focusRing}`}
            />
            <span className="min-w-0 flex-1">
              <span className="block font-medium text-text-heading">
                {field.label}
              </span>
              <span className="mt-0.5 block text-xs text-text-muted">
                {field.description}
              </span>
              <input
                type="text"
                value={colors[field.key]}
                onChange={(event) => {
                  const value = event.target.value;
                  if (/^#[0-9A-Fa-f]{6}$/i.test(value)) {
                    onChange({ ...colors, [field.key]: value.toLowerCase() });
                  }
                }}
                aria-label={`${title} ${field.label} hex value`}
                className={`mt-2 w-full rounded-lg border border-zinc-200 bg-white px-2 py-1 font-mono text-xs text-text-body dark:border-zinc-700 dark:bg-zinc-900 ${focusRing}`}
              />
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function StyleEditorPanel({ onClose }: { onClose: () => void }) {
  const titleId = useId();
  const descriptionId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [activeTab, setActiveTab] = useState<EditorTab>("colors");
  const [draftCss, setDraftCss] = useState("");
  const {
    preferences,
    updateLightColors,
    updateDarkColors,
    updateCustomCss,
    resetPreferences,
  } = useStylePreferences();

  useEffect(() => {
    setDraftCss(preferences.customCss);
  }, [preferences.customCss]);

  useEffect(() => {
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function handleApplyCss() {
    updateCustomCss(draftCss);
  }

  function handleReset() {
    resetPreferences();
    setDraftCss("");
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 p-0 sm:p-4">
      <button
        type="button"
        aria-label="Close style editor"
        className="absolute inset-0"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="animate-panel-enter relative flex h-full w-full max-w-md flex-col border-l border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950 sm:h-auto sm:max-h-[calc(100vh-2rem)] sm:rounded-2xl sm:border"
      >
        <div className="flex items-start justify-between gap-4 border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
          <div>
            <h2
              id={titleId}
              className="text-lg font-semibold text-text-heading"
            >
              Customize Styles
            </h2>
            <p
              id={descriptionId}
              className="mt-1 text-sm text-text-label"
            >
              Adjust text colors and add custom CSS for the app.
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close customize styles panel"
            className={`rounded-lg px-2 py-1 text-sm text-text-label transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900 ${focusRing}`}
          >
            Close
          </button>
        </div>

        <div
          role="tablist"
          aria-label="Style editor sections"
          className="flex gap-2 border-b border-zinc-200 px-5 py-3 dark:border-zinc-800"
        >
          {(
            [
              { id: "colors", label: "Colors" },
              { id: "css", label: "Advanced CSS" },
            ] as const
          ).map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${focusRing} ${
                  isActive
                    ? "bg-brand-primary text-white dark:bg-brand-primary-dark"
                    : "text-text-label hover:bg-zinc-100 dark:hover:bg-zinc-900"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {activeTab === "colors" ? (
            <div className="flex flex-col gap-4">
              <ColorFieldGroup
                title="Light mode"
                colors={preferences.light}
                onChange={updateLightColors}
              />
              <ColorFieldGroup
                title="Dark mode"
                colors={preferences.dark}
                onChange={updateDarkColors}
              />
            </div>
          ) : (
            <div className="flex h-full flex-col gap-3">
              <p className="text-sm text-text-label">
                Scope custom rules to{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-xs text-text-body dark:bg-zinc-900">
                  .app-root
                </code>{" "}
                so changes stay within the app.
              </p>
              <textarea
                value={draftCss}
                onChange={(event) => setDraftCss(event.target.value)}
                spellCheck={false}
                aria-label="Custom CSS"
                placeholder={`.app-root main h1 {\n  letter-spacing: 0.08em;\n}\n\n.app-root .task-title {\n  font-style: italic;\n}`}
                className={`min-h-64 flex-1 resize-y rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-3 font-mono text-xs leading-5 text-text-body dark:border-zinc-700 dark:bg-zinc-900 ${focusRing}`}
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleApplyCss}
                  className={`rounded-lg bg-brand-primary px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-primary-hover dark:bg-brand-primary-dark dark:hover:bg-brand-primary-dark-hover ${focusRing}`}
                >
                  Apply CSS
                </button>
                <button
                  type="button"
                  onClick={() => setDraftCss(preferences.customCss)}
                  className={`rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-text-label transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900 ${focusRing}`}
                >
                  Revert
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-zinc-200 px-5 py-4 dark:border-zinc-800">
          <button
            type="button"
            onClick={handleReset}
            className={`w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-text-label transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900 ${focusRing}`}
          >
            Reset to defaults
          </button>
        </div>
      </div>
    </div>
  );
}

function StyleEditor() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-haspopup="dialog"
        className={`rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-text-label transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800 ${focusRing}`}
      >
        Customize
      </button>
      {isOpen && <StyleEditorPanel onClose={() => setIsOpen(false)} />}
    </>
  );
}

export default memo(StyleEditor);
