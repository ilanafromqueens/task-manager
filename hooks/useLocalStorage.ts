"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface UseLocalStorageOptions {
  onWriteError?: (error: unknown) => void;
  onReadError?: (error: unknown) => void;
}

export interface UseLocalStorageResult<T> {
  value: T;
  setValue: (value: T | ((prev: T) => T)) => void;
  isLoaded: boolean;
}

function readStoredValue<T>(
  key: string,
  fallback: T,
  validate?: (value: unknown) => T,
): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  const item = window.localStorage.getItem(key);
  if (item == null) return fallback;

  const parsed: unknown = JSON.parse(item);
  return validate ? validate(parsed) : (parsed as T);
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  validate?: (value: unknown) => T,
  options?: UseLocalStorageOptions,
): UseLocalStorageResult<T> {
  const initialValueRef = useRef(initialValue);
  const validateRef = useRef(validate);
  const onWriteErrorRef = useRef(options?.onWriteError);
  const onReadErrorRef = useRef(options?.onReadError);
  validateRef.current = validate;
  onWriteErrorRef.current = options?.onWriteError;
  onReadErrorRef.current = options?.onReadError;

  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      setStoredValue(
        readStoredValue(key, initialValueRef.current, validateRef.current),
      );
    } catch (error) {
      onReadErrorRef.current?.(error);
      setStoredValue(initialValueRef.current);
    } finally {
      setIsLoaded(true);
    }
  }, [key]);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const nextValue =
          typeof value === "function"
            ? (value as (prev: T) => T)(prev)
            : value;

        if (typeof window !== "undefined") {
          try {
            window.localStorage.setItem(key, JSON.stringify(nextValue));
          } catch (error) {
            onWriteErrorRef.current?.(error);
          }
        }

        return nextValue;
      });
    },
    [key],
  );

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== key) return;

      if (event.newValue == null) {
        setStoredValue(initialValueRef.current);
        return;
      }

      try {
        const parsed: unknown = JSON.parse(event.newValue);
        setStoredValue(
          validateRef.current
            ? validateRef.current(parsed)
            : (parsed as T),
        );
      } catch (error) {
        onReadErrorRef.current?.(error);
        setStoredValue(initialValueRef.current);
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [key]);

  return { value: storedValue, setValue, isLoaded };
}
