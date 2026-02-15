"use client"

import { useMemo, useCallback } from "react"
import { useLocalStorage } from "./use_local_storage"
import { STORAGE_KEYS, MAX_READ_IDS } from "./constants"
import type { Article } from "./types"

export function useArticles(articles: Article[]) {
  const [bookmarks, set_bookmarks] = useLocalStorage<string[]>(
    STORAGE_KEYS.BOOKMARKS,
    []
  )
  const [read_ids, set_read_ids] = useLocalStorage<string[]>(
    STORAGE_KEYS.READ,
    []
  )

  // Sets for O(1) lookups
  const bookmark_set = useMemo(() => new Set(bookmarks), [bookmarks])
  const read_set = useMemo(() => new Set(read_ids), [read_ids])

  const toggle_bookmark = useCallback(
    (id: string) => {
      set_bookmarks((prev) =>
        prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
      )
    },
    [set_bookmarks]
  )

  const toggle_read = useCallback(
    (id: string) => {
      set_read_ids((prev) => {
        if (prev.includes(id)) {
          return prev.filter((r) => r !== id)
        }
        const next = [...prev, id]
        // Evict oldest entries if over limit
        return next.length > MAX_READ_IDS ? next.slice(-MAX_READ_IDS) : next
      })
    },
    [set_read_ids]
  )

  const mark_read = useCallback(
    (id: string) => {
      set_read_ids((prev) => {
        if (prev.includes(id)) return prev
        const next = [...prev, id]
        return next.length > MAX_READ_IDS ? next.slice(-MAX_READ_IDS) : next
      })
    },
    [set_read_ids]
  )

  const is_bookmarked = useCallback(
    (id: string) => bookmark_set.has(id),
    [bookmark_set]
  )

  const is_read = useCallback(
    (id: string) => read_set.has(id),
    [read_set]
  )

  // Articles sorted by pub_date descending (newest first)
  const sorted = useMemo(
    () => [...articles].sort((a, b) => b.pub_date - a.pub_date),
    [articles]
  )

  // Search across title and description
  const search = useCallback(
    (query: string) => {
      if (!query.trim()) return sorted
      const lower = query.toLowerCase()
      return sorted.filter(
        (a) =>
          a.title.toLowerCase().includes(lower) ||
          a.description.toLowerCase().includes(lower)
      )
    },
    [sorted]
  )

  // Filter to bookmarked articles only
  const bookmarked_articles = useMemo(
    () => sorted.filter((a) => bookmark_set.has(a.id)),
    [sorted, bookmark_set]
  )

  // Filter to unread articles only
  const unread_articles = useMemo(
    () => sorted.filter((a) => !read_set.has(a.id)),
    [sorted, read_set]
  )

  return {
    sorted,
    bookmarked_articles,
    unread_articles,
    search,
    toggle_bookmark,
    toggle_read,
    mark_read,
    is_bookmarked,
    is_read,
  }
}
