import Parser from "rss-parser"
import { USER_AGENT } from "./constants"
import type { Article, Feed, FeedResponse } from "./types"

const parser = new Parser({
  headers: { "User-Agent": USER_AGENT },
  timeout: 10_000,
})

function deterministic_id(feed_url: string, guid: string): string {
  // Simple hash: combine feed URL and item guid/link
  let hash = 0
  const str = `${feed_url}::${guid}`
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0
  }
  return Math.abs(hash).toString(36)
}

function strip_html(html: string | undefined): string {
  if (!html) return ""
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim()
}

export async function parse_feed(url: string): Promise<FeedResponse> {
  const raw = await parser.parseURL(url)

  const feed: Feed = {
    id: deterministic_id(url, url),
    title: raw.title || url,
    url,
    site_url: raw.link || url,
    description: strip_html(raw.description),
    category: "",
    last_fetched: Date.now(),
  }

  const articles: Article[] = (raw.items || []).map((item) => ({
    id: deterministic_id(url, item.guid || item.link || item.title || ""),
    feed_id: feed.id,
    title: item.title || "Untitled",
    link: item.link || "",
    description: strip_html(item.contentSnippet || item.content),
    content: item["content:encoded"] || item.content || "",
    author: item.creator || item.author || "",
    pub_date: item.pubDate ? new Date(item.pubDate).getTime() : Date.now(),
    feed_title: feed.title,
  }))

  return { feed, articles }
}
