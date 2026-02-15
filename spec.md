# RSS Feed Reader — Spec

## What
A lightweight web app that aggregates multiple RSS feeds into a unified, searchable interface with bookmarking. Deployed on Vercel.

## Core Features

### Multi-feed management
- Add/remove RSS feed URLs, organized by category
- **Auto-discovery:** User pastes any blog/newsletter URL → app auto-detects the RSS feed by:
  1. Checking `<link rel="alternate" type="application/rss+xml">` in page HTML
  2. Trying common paths (`/feed`, `/rss`, `/atom.xml`, `/feed.xml`, `/index.xml`)
  3. Checking for Substack, Medium, WordPress, Ghost conventions
  4. If multiple feeds found, let user pick; if none found, show clear error
- No need to know the raw RSS URL — just paste the site URL

### Unified feed view
- All articles from all feeds in a single chronological stream

### Search
- Full-text search across article titles and descriptions
- Instant filtering as you type

### Bookmarks
- Save articles for later, persisted in LocalStorage (no auth needed)

### Read/unread tracking
- Mark articles as read, persisted in LocalStorage

### Feed refresh
- Pull latest on load + manual refresh button

## Tech Stack

- **Next.js 14 (App Router)** — Vercel-native, API routes solve CORS, React Server Components for instant loads
- **Tailwind CSS** — utility-first, zero runtime CSS overhead
- **API routes:**
  - `/api/feed?url=...` — fetches and parses RSS server-side, returns JSON
  - `/api/discover?url=...` — fetches page HTML, extracts RSS feed URLs via auto-discovery
- **`rss-parser`** — lightweight RSS/Atom parsing library
- **`cheerio`** — HTML parsing for RSS auto-discovery (extract `<link>` tags from page head)
- **LocalStorage** — bookmarks, read state, feed list. No database, no auth
- **Vercel Edge** — deploy API routes at the edge for low latency globally

## Performance Targets

- First paint < 500ms
- Feed fetch + render < 1s
- Zero layout shift
- Minimal JS bundle (lean on Server Components, ship minimal client JS)
- Aggressive caching — feed responses cached for 5 min to avoid redundant fetches

## Non-goals (keeping it lightweight)

- No user accounts or auth
- No database
- No offline/PWA
- No AI summarization
