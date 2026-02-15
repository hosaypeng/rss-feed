"use client"

import { useState, useEffect, useRef } from "react"

interface SearchBarProps {
  value: string
  onChange: (query: string) => void
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  const [local, set_local] = useState(value)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Sync external value changes
  useEffect(() => {
    set_local(value)
  }, [value])

  const handle_change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value
    set_local(next)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => onChange(next), 300)
  }

  const handle_clear = () => {
    set_local("")
    if (timer.current) clearTimeout(timer.current)
    onChange("")
  }

  return (
    <div className="relative">
      <svg
        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
        />
      </svg>
      <input
        type="text"
        value={local}
        onChange={handle_change}
        placeholder="Search articles..."
        className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] py-2 pl-10 pr-9 text-sm text-[var(--foreground)] placeholder-[var(--muted)] outline-none transition-colors focus:border-[var(--accent)]"
      />
      {local && (
        <button
          onClick={handle_clear}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
          aria-label="Clear search"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}
