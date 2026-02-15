import { CACHE_TTL } from "./constants"

interface CacheEntry<T> {
  data: T
  expires: number
}

const store = new Map<string, CacheEntry<unknown>>()

export function cache_get<T>(key: string): T | null {
  const entry = store.get(key)
  if (!entry) return null
  if (Date.now() > entry.expires) {
    store.delete(key)
    return null
  }
  return entry.data as T
}

export function cache_set<T>(key: string, data: T, ttl = CACHE_TTL): void {
  store.set(key, { data, expires: Date.now() + ttl })
}

export function cache_evict_expired(): void {
  const now = Date.now()
  store.forEach((entry, key) => {
    if (now > entry.expires) store.delete(key)
  })
}
