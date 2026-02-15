"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useFeeds } from "@/lib/use_feeds"
import { useArticles } from "@/lib/use_articles"
import type { StoredFeed } from "@/lib/types"
import Header from "./header"
import FeedSidebar from "./feed_sidebar"
import AddFeedDialog from "./add_feed_dialog"
import FeedList from "./feed_list"
import SearchBar from "./search_bar"
import LoadingSkeleton from "./loading_skeleton"
import EmptyState from "./empty_state"

export default function FeedApp() {
  const {
    feeds,
    articles: all_articles,
    loading,
    error,
    hydrated,
    refresh_all,
    add_feed,
    remove_feed,
  } = useFeeds()

  const {
    sorted,
    search,
    toggle_bookmark,
    mark_read,
    is_bookmarked,
    is_read,
    bookmarked_articles,
  } = useArticles(all_articles)

  const [active_feed, set_active_feed] = useState<string | null>(null)
  const [search_query, set_search_query] = useState("")
  const [show_add_dialog, set_show_add_dialog] = useState(false)
  const [show_bookmarks, set_show_bookmarks] = useState(false)

  // Auto-fetch on mount when feeds exist
  useEffect(() => {
    if (hydrated && feeds.length > 0) {
      refresh_all()
    }
  }, [hydrated]) // eslint-disable-line react-hooks/exhaustive-deps

  // Filter articles by active feed, bookmarks, and search
  const displayed_articles = useMemo(() => {
    let result = show_bookmarks ? bookmarked_articles : sorted

    if (active_feed) {
      result = result.filter((a) => a.feed_id === active_feed)
    }

    if (search_query.trim()) {
      const ids = new Set(search(search_query).map((a) => a.id))
      result = result.filter((a) => ids.has(a.id))
    }

    return result
  }, [sorted, bookmarked_articles, active_feed, search_query, show_bookmarks, search])

  const handle_add_feed = useCallback(
    (feed: StoredFeed) => {
      add_feed(feed)
      // Fetch the new feed's articles after a brief delay for state to settle
      setTimeout(() => refresh_all(true), 100)
    },
    [add_feed, refresh_all]
  )

  const handle_remove_feed = useCallback(
    (id: string) => {
      remove_feed(id)
      if (active_feed === id) set_active_feed(null)
    },
    [remove_feed, active_feed]
  )

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <Header />
        <main className="mx-auto max-w-5xl px-4 py-6">
          <LoadingSkeleton />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />

      <div className="mx-auto flex max-w-6xl gap-0 lg:gap-6">
        <FeedSidebar
          feeds={feeds}
          active_feed={active_feed}
          on_select={set_active_feed}
          on_remove={handle_remove_feed}
          on_add={() => set_show_add_dialog(true)}
        />

        <main className="min-w-0 flex-1 px-4 py-4">
          {feeds.length === 0 ? (
            <div>
              <EmptyState />
              <div className="mt-4 text-center">
                <button
                  onClick={() => set_show_add_dialog(true)}
                  className="rounded-lg bg-[var(--accent)] px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
                >
                  Add Your First Feed
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex-1">
                  <SearchBar value={search_query} onChange={set_search_query} />
                </div>
                <button
                  onClick={() => set_show_bookmarks(!show_bookmarks)}
                  className={`shrink-0 rounded-lg border px-3 py-2 text-sm transition-colors ${
                    show_bookmarks
                      ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                      : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)]"
                  }`}
                >
                  Bookmarks
                </button>
                <button
                  onClick={() => refresh_all(true)}
                  disabled={loading}
                  className="shrink-0 rounded-lg border border-[var(--border)] px-3 py-2 text-sm text-[var(--muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-50"
                >
                  {loading ? "Refreshing..." : "Refresh"}
                </button>
              </div>

              {error && (
                <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600 dark:border-red-900 dark:bg-red-900/20 dark:text-red-400">
                  {error}
                </p>
              )}

              {loading && all_articles.length === 0 ? (
                <LoadingSkeleton />
              ) : (
                <FeedList
                  articles={displayed_articles}
                  total={sorted.length}
                  isBookmarked={is_bookmarked}
                  isRead={is_read}
                  onToggleBookmark={toggle_bookmark}
                  onMarkRead={mark_read}
                />
              )}
            </>
          )}
        </main>
      </div>

      <AddFeedDialog
        open={show_add_dialog}
        on_close={() => set_show_add_dialog(false)}
        on_add={handle_add_feed}
      />
    </div>
  )
}
