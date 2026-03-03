# RSS Reader

A lightweight, client-first RSS feed reader built with Next.js. Subscribe to feeds by pasting any website URL — the app auto-discovers RSS/Atom feeds, aggregates articles into a unified timeline, and persists everything in LocalStorage. No accounts, no database, no setup.

## Features

- **Feed auto-discovery** — Paste a blog or newsletter URL and the app finds the RSS feed automatically. Detects `<link>` tags, probes common paths (`/feed`, `/rss.xml`, etc.), and recognizes platform conventions for Substack, Medium, WordPress, Ghost, and YouTube.
- **Unified timeline** — Articles from all subscribed feeds in a single reverse-chronological stream.
- **Full-text search** — Instant filtering across article titles and descriptions.
- **Bookmarks** — Save articles for later. Persisted in LocalStorage.
- **Read/unread tracking** — Articles are marked as read when opened, with a cap of 10,000 tracked IDs to keep storage bounded.
- **Category organization** — Feeds organized by category (Tech, News, Blog, Podcast, or custom) with a collapsible sidebar.
- **Server-side fetching** — API routes fetch and parse feeds server-side, bypassing CORS restrictions. Responses are cached for 5 minutes.
- **Dark mode support** — Respects system color scheme via CSS custom properties.

## Tech Stack

| Layer     | Technology                                  |
| --------- | ------------------------------------------- |
| Framework | Next.js 14 (App Router)                     |
| Language  | TypeScript                                  |
| Styling   | Tailwind CSS                                |
| Parsing   | `rss-parser` (RSS/Atom), `cheerio` (HTML)   |
| Storage   | Browser LocalStorage                        |
| Hosting   | Vercel                                      |

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install and run

```bash
git clone https://github.com/hosaypeng/rss-feed.git
cd rss-feed
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for production

```bash
npm run build
npm start
```

## Project Structure

```
app/
  api/
    discover/route.ts   # Auto-discovers RSS feeds from a website URL
    feed/route.ts       # Fetches and parses a single RSS feed
  layout.tsx            # Root layout with Inter font and metadata
  page.tsx              # Entry point — renders FeedApp
components/
  add_feed_dialog.tsx   # Modal for adding feeds with auto-discovery
  bookmark_icon.tsx     # Bookmark toggle icon
  category_badge.tsx    # Category label pill
  empty_state.tsx       # Shown when no feeds are subscribed
  feed_app.tsx          # Main app shell — sidebar, feed list, search
  feed_item.tsx         # Single article card
  feed_list.tsx         # Scrollable article list
  feed_sidebar.tsx      # Collapsible sidebar with feed management
  header.tsx            # Top navigation bar
  loading_skeleton.tsx  # Skeleton placeholders during loading
  search_bar.tsx        # Search input with instant filtering
lib/
  cache.ts              # In-memory TTL cache for API responses
  constants.ts          # Storage keys, TTLs, platform patterns
  feed_discoverer.ts    # Multi-phase feed auto-discovery engine
  feed_parser.ts        # RSS/Atom parsing via rss-parser
  types.ts              # Shared TypeScript interfaces
  use_articles.ts       # Hook for search, bookmarks, read state
  use_feeds.ts          # Hook for feed CRUD and article fetching
  use_local_storage.ts  # Generic LocalStorage hook with hydration
```

## API Routes

### `GET /api/discover?url=<website_url>`

Discovers RSS/Atom feeds on the given website. Returns an array of discovered feed URLs and a flag indicating whether the URL itself is a direct feed.

### `GET /api/feed?url=<feed_url>`

Fetches and parses an RSS/Atom feed. Returns structured feed metadata and articles as JSON. Responses are cached server-side for 5 minutes.

## License

[MIT](LICENSE)
