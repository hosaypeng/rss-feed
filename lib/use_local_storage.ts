"use client"

import { useState, useEffect, useCallback } from "react"

export function useLocalStorage<T>(key: string, initial_value: T) {
  const [value, set_value] = useState<T>(initial_value)
  const [hydrated, set_hydrated] = useState(false)

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(key)
      if (stored !== null) {
        set_value(JSON.parse(stored))
      }
    } catch {
      // Corrupted data — fall back to initial
    }
    set_hydrated(true)
  }, [key])

  // Persist to localStorage on change (after hydration)
  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Storage full or unavailable
    }
  }, [key, value, hydrated])

  // Cross-tab sync via storage events
  useEffect(() => {
    const on_storage = (e: StorageEvent) => {
      if (e.key !== key) return
      try {
        set_value(e.newValue !== null ? JSON.parse(e.newValue) : initial_value)
      } catch {
        set_value(initial_value)
      }
    }
    window.addEventListener("storage", on_storage)
    return () => window.removeEventListener("storage", on_storage)
  }, [key, initial_value])

  const update = useCallback(
    (updater: T | ((prev: T) => T)) => {
      set_value((prev) =>
        typeof updater === "function"
          ? (updater as (prev: T) => T)(prev)
          : updater
      )
    },
    []
  )

  return [value, update, hydrated] as const
}
