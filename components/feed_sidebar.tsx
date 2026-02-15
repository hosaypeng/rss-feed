"use client"

import { useState } from "react"
import type { StoredFeed } from "@/lib/types"
import CategoryBadge from "./category_badge"

interface FeedSidebarProps {
  feeds: StoredFeed[]
  active_feed: string | null
  on_select: (id: string | null) => void
  on_remove: (id: string) => void
  on_add: () => void
}

export default function FeedSidebar({
  feeds,
  active_feed,
  on_select,
  on_remove,
  on_add,
}: FeedSidebarProps) {
  const [open, set_open] = useState(false)

  const grouped = feeds.reduce<Record<string, StoredFeed[]>>((acc, feed) => {
    const cat = feed.category || "Uncategorized"
    ;(acc[cat] ??= []).push(feed)
    return acc
  }, {})

  const categories = Object.keys(grouped).sort()

  const sidebar_content = (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
          Feeds
        </h2>
        <button
          onClick={on_add}
          className="rounded-md bg-[var(--accent)] px-3 py-1 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          + Add
        </button>
      </div>

      <button
        onClick={() => on_select(null)}
        className={`mb-2 w-full rounded-md px-3 py-2 text-left text-sm font-medium transition-colors ${
          active_feed === null
            ? "bg-[var(--accent)]/10 text-[var(--accent)]"
            : "text-[var(--foreground)] hover:bg-[var(--border)]"
        }`}
      >
        All Feeds
        <span className="ml-2 text-xs text-[var(--muted)]">({feeds.length})</span>
      </button>

      <div className="space-y-4">
        {categories.map((cat) => (
          <div key={cat}>
            <div className="mb-1 px-1">
              <CategoryBadge category={cat} />
            </div>
            <div className="space-y-0.5">
              {grouped[cat].map((feed) => (
                <div
                  key={feed.id}
                  className={`group flex items-center rounded-md transition-colors ${
                    active_feed === feed.id
                      ? "bg-[var(--accent)]/10"
                      : "hover:bg-[var(--border)]"
                  }`}
                >
                  <button
                    onClick={() => on_select(feed.id)}
                    className={`min-w-0 flex-1 truncate px-3 py-1.5 text-left text-sm ${
                      active_feed === feed.id
                        ? "font-medium text-[var(--accent)]"
                        : "text-[var(--foreground)]"
                    }`}
                    title={feed.title}
                  >
                    {feed.title || feed.url}
                  </button>
                  <button
                    onClick={() => on_remove(feed.id)}
                    className="mr-1 hidden shrink-0 rounded p-1 text-[var(--muted)] transition-colors hover:bg-red-100 hover:text-red-600 group-hover:block dark:hover:bg-red-900/30"
                    aria-label={`Remove ${feed.title}`}
                  >
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => set_open(!open)}
        className="mb-4 flex items-center gap-2 rounded-md border border-[var(--border)] px-3 py-2 text-sm lg:hidden"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        Feeds
      </button>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => set_open(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${
          open ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto border-r border-[var(--border)] bg-[var(--card)] p-4 pt-20 transition-transform lg:static lg:translate-x-0 lg:pt-4`}
      >
        {sidebar_content}
      </aside>
    </>
  )
}
