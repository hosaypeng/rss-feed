"use client"

import { useState, useCallback } from "react"
import { useLocalStorage } from "./use_local_storage"
import { STORAGE_KEYS, CACHE_TTL } from "./constants"
import type { StoredFeed, Article, FeedResponse } from "./types"

export function useFeeds() {
  const [feeds, set_feeds, hydrated] = useLocalStorage<StoredFeed[]>(
    STORAGE_KEYS.FEEDS,
    []
  )
  const [articles, set_articles] = useState<Article[]>([])
  const [loading, set_loading] = useState(false)
  const [error, set_error] = useState<string | null>(null)

  // Cache: url -> { articles, fetched_at }
  const [cache, set_cache] = useState<
    Record<string, { articles: Article[]; fetched_at: number }>
  >({})

  const fetch_single_feed = useCallback(
    async (feed: StoredFeed, force: boolean): Promise<Article[]> => {
      const cached = cache[feed.url]
      if (!force && cached && Date.now() - cached.fetched_at < CACHE_TTL) {
        return cached.articles
      }

      const res = await fetch(
        `/api/feed?url=${encodeURIComponent(feed.url)}`
      )
      if (!res.ok) {
        throw new Error(`Failed to fetch ${feed.title || feed.url}`)
      }
      const data: FeedResponse = await res.json()

      // Attach feed metadata to each article
      const enriched = data.articles.map((a) => ({
        ...a,
        feed_id: feed.id,
        feed_title: data.feed.title || feed.title,
      }))

      set_cache((prev) => ({
        ...prev,
        [feed.url]: { articles: enriched, fetched_at: Date.now() },
      }))

      return enriched
    },
    [cache]
  )

  const refresh_all = useCallback(
    async (force = false) => {
      if (feeds.length === 0) {
        set_articles([])
        return
      }

      set_loading(true)
      set_error(null)

      try {
        const results = await Promise.allSettled(
          feeds.map((f) => fetch_single_feed(f, force))
        )

        const all_articles: Article[] = []
        const errors: string[] = []

        results.forEach((r, i) => {
          if (r.status === "fulfilled") {
            all_articles.push(...r.value)
          } else {
            errors.push(feeds[i].title || feeds[i].url)
          }
        })

        set_articles(all_articles)
        if (errors.length > 0) {
          set_error(`Failed to fetch: ${errors.join(", ")}`)
        }
      } finally {
        set_loading(false)
      }
    },
    [feeds, fetch_single_feed]
  )

  const add_feed = useCallback(
    (feed: StoredFeed) => {
      set_feeds((prev) => {
        if (prev.some((f) => f.url === feed.url)) return prev
        return [...prev, feed]
      })
    },
    [set_feeds]
  )

  const remove_feed = useCallback(
    (id: string) => {
      set_feeds((prev) => prev.filter((f) => f.id !== id))
      set_articles((prev) => prev.filter((a) => a.feed_id !== id))
      set_cache((prev) => {
        const next = { ...prev }
        const feed = feeds.find((f) => f.id === id)
        if (feed) delete next[feed.url]
        return next
      })
    },
    [set_feeds, feeds]
  )

  const update_feed = useCallback(
    (id: string, updates: Partial<Pick<StoredFeed, "title" | "category">>) => {
      set_feeds((prev) =>
        prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
      )
    },
    [set_feeds]
  )

  return {
    feeds,
    articles,
    loading,
    error,
    hydrated,
    refresh_all,
    add_feed,
    remove_feed,
    update_feed,
  }
}
