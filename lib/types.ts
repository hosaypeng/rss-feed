export interface Feed {
  id: string
  title: string
  url: string
  site_url: string
  description: string
  category: string
  last_fetched: number
}

export interface StoredFeed {
  id: string
  title: string
  url: string
  site_url: string
  description: string
  category: string
}

export interface Article {
  id: string
  feed_id: string
  title: string
  link: string
  description: string
  content: string
  author: string
  pub_date: number
  feed_title: string
}

export interface DiscoveredFeed {
  url: string
  title: string
  type: "rss" | "atom" | "unknown"
}

export interface FeedResponse {
  feed: Feed
  articles: Article[]
}

export interface DiscoverResponse {
  feeds: DiscoveredFeed[]
  is_direct_feed: boolean
}

export type CategoryMap = Record<string, StoredFeed[]>
