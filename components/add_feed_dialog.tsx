"use client"

import { useState, useRef, useEffect } from "react"
import type { StoredFeed, DiscoverResponse, DiscoveredFeed } from "@/lib/types"
import { DEFAULT_CATEGORIES } from "@/lib/constants"

interface AddFeedDialogProps {
  open: boolean
  on_close: () => void
  on_add: (feed: StoredFeed) => void
}

export default function AddFeedDialog({ open, on_close, on_add }: AddFeedDialogProps) {
  const [url, set_url] = useState("")
  const [discovered, set_discovered] = useState<DiscoveredFeed[]>([])
  const [selected, set_selected] = useState<DiscoveredFeed | null>(null)
  const [category, set_category] = useState<string>(DEFAULT_CATEGORIES[0])
  const [custom_category, set_custom_category] = useState("")
  const [loading, set_loading] = useState(false)
  const [error, set_error] = useState<string | null>(null)
  const [step, set_step] = useState<"discover" | "select">("discover")
  const input_ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      set_url("")
      set_discovered([])
      set_selected(null)
      set_category(DEFAULT_CATEGORIES[0])
      set_custom_category("")
      set_error(null)
      set_step("discover")
      setTimeout(() => input_ref.current?.focus(), 100)
    }
  }, [open])

  const handle_discover = async () => {
    if (!url.trim()) return
    set_loading(true)
    set_error(null)

    try {
      let normalized = url.trim()
      if (!/^https?:\/\//i.test(normalized)) {
        normalized = `https://${normalized}`
      }

      const res = await fetch(`/api/discover?url=${encodeURIComponent(normalized)}`)
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Discovery failed")
      }

      const data: DiscoverResponse = await res.json()
      if (data.feeds.length === 0) {
        throw new Error("No feeds found at this URL")
      }

      set_discovered(data.feeds)
      set_selected(data.feeds[0])

      if (data.is_direct_feed && data.feeds.length === 1) {
        set_step("select")
      } else {
        set_step("select")
      }
    } catch (err) {
      set_error(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      set_loading(false)
    }
  }

  const handle_add = () => {
    if (!selected) return

    const final_category = category === "Custom" ? custom_category.trim() || "Uncategorized" : category

    const feed: StoredFeed = {
      id: crypto.randomUUID(),
      title: selected.title || new URL(selected.url).hostname,
      url: selected.url,
      site_url: new URL(selected.url).origin,
      description: "",
      category: final_category,
    }

    on_add(feed)
    on_close()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={on_close} />
      <div className="relative z-10 w-full max-w-md rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Add Feed</h2>
          <button
            onClick={on_close}
            className="rounded p-1 text-[var(--muted)] transition-colors hover:bg-[var(--border)]"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {step === "discover" && (
          <>
            <label className="mb-1 block text-sm text-[var(--muted)]">
              Paste a website or feed URL
            </label>
            <div className="flex gap-2">
              <input
                ref={input_ref}
                type="text"
                value={url}
                onChange={(e) => set_url(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handle_discover()}
                placeholder="https://example.com"
                className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
              />
              <button
                onClick={handle_discover}
                disabled={loading || !url.trim()}
                className="shrink-0 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "..." : "Discover"}
              </button>
            </div>
          </>
        )}

        {step === "select" && (
          <>
            <button
              onClick={() => set_step("discover")}
              className="mb-3 text-sm text-[var(--accent)] hover:underline"
            >
              &larr; Back
            </button>

            {discovered.length > 1 && (
              <div className="mb-4">
                <label className="mb-1 block text-sm text-[var(--muted)]">
                  Select a feed
                </label>
                <div className="max-h-40 space-y-1 overflow-y-auto">
                  {discovered.map((feed) => (
                    <button
                      key={feed.url}
                      onClick={() => set_selected(feed)}
                      className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
                        selected?.url === feed.url
                          ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                          : "hover:bg-[var(--border)]"
                      }`}
                    >
                      <div className="font-medium">{feed.title || feed.url}</div>
                      <div className="truncate text-xs text-[var(--muted)]">
                        {feed.url} ({feed.type})
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {discovered.length === 1 && selected && (
              <div className="mb-4 rounded-md border border-[var(--border)] px-3 py-2 text-sm">
                <div className="font-medium">{selected.title || selected.url}</div>
                <div className="truncate text-xs text-[var(--muted)]">{selected.url}</div>
              </div>
            )}

            <div className="mb-4">
              <label className="mb-1 block text-sm text-[var(--muted)]">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => set_category(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
              >
                {DEFAULT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="Custom">Custom...</option>
              </select>
              {category === "Custom" && (
                <input
                  type="text"
                  value={custom_category}
                  onChange={(e) => set_custom_category(e.target.value)}
                  placeholder="Enter category name"
                  className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
                />
              )}
            </div>

            <button
              onClick={handle_add}
              disabled={!selected}
              className="w-full rounded-lg bg-[var(--accent)] py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              Add Feed
            </button>
          </>
        )}

        {error && (
          <p className="mt-3 text-sm text-red-500">{error}</p>
        )}
      </div>
    </div>
  )
}
