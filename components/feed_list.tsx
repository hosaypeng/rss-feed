"use client"

import FeedItem from "@/components/feed_item"
import type { Article } from "@/lib/types"

interface FeedListProps {
  articles: Article[]
  total: number
  isBookmarked: (id: string) => boolean
  isRead: (id: string) => boolean
  onToggleBookmark: (id: string) => void
  onMarkRead: (id: string) => void
}

export default function FeedList({
  articles,
  total,
  isBookmarked,
  isRead,
  onToggleBookmark,
  onMarkRead,
}: FeedListProps) {
  if (articles.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-[var(--muted)]">
        No articles found.
      </div>
    )
  }

  return (
    <div>
      {articles.length !== total && (
        <p className="mb-3 text-xs text-[var(--muted)]">
          Showing {articles.length} of {total} articles
        </p>
      )}
      <div className="space-y-3">
        {articles.map((article) => (
          <FeedItem
            key={article.id}
            article={article}
            bookmarked={isBookmarked(article.id)}
            read={isRead(article.id)}
            onToggleBookmark={() => onToggleBookmark(article.id)}
            onMarkRead={() => onMarkRead(article.id)}
          />
        ))}
      </div>
    </div>
  )
}
