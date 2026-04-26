/**
 * Spline Asset Cache — Service Worker
 * 
 * Intercepts requests to prod.spline.design for .splinecode files
 * and serves them from a persistent Cache API store after first download.
 * 
 * Strategy: Cache-First (stale-while-revalidate for freshness)
 *  1. If cached → serve instantly (no network lag)
 *  2. If not cached → fetch from network, cache the response, serve it
 *  3. Background revalidation updates the cache for next visit
 */

const CACHE_NAME = 'spline-assets-v1'

// Only cache requests matching these patterns
const CACHEABLE_PATTERNS = [
  /^https:\/\/prod\.spline\.design\/.*\.splinecode$/,
  // Also cache the Spline viewer runtime itself
  /^https:\/\/unpkg\.com\/@splinetool\/viewer/,
]

function isCacheable(url) {
  return CACHEABLE_PATTERNS.some(pattern => pattern.test(url))
}

// ── Install: pre-cache nothing, just activate immediately ──
self.addEventListener('install', (event) => {
  self.skipWaiting()
})

// ── Activate: claim all clients so caching starts on first visit ──
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      // Clean up old cache versions
      caches.keys().then(keys =>
        Promise.all(
          keys
            .filter(key => key.startsWith('spline-assets-') && key !== CACHE_NAME)
            .map(key => caches.delete(key))
        )
      ),
    ])
  )
})

// ── Fetch: Cache-first with background revalidation ──
self.addEventListener('fetch', (event) => {
  const url = event.request.url

  // Only intercept cacheable requests
  if (!isCacheable(url)) return

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cachedResponse = await cache.match(event.request)

      if (cachedResponse) {
        // ✅ Cache HIT — serve instantly, revalidate in background
        // This is fire-and-forget: update cache for next visit
        event.waitUntil(
          fetch(event.request)
            .then(freshResponse => {
              if (freshResponse.ok) {
                cache.put(event.request, freshResponse)
              }
            })
            .catch(() => {/* Network failed, cached version is fine */})
        )
        return cachedResponse
      }

      // ❌ Cache MISS — fetch from network, cache, and serve
      try {
        const networkResponse = await fetch(event.request)
        if (networkResponse.ok) {
          // Clone before caching because response body can only be consumed once
          cache.put(event.request, networkResponse.clone())
        }
        return networkResponse
      } catch (err) {
        // Network failed and no cache — nothing we can do
        return new Response('Offline', { status: 503 })
      }
    })
  )
})

// ── Message handler for cache management ──
self.addEventListener('message', (event) => {
  if (event.data?.type === 'CLEAR_SPLINE_CACHE') {
    caches.delete(CACHE_NAME).then(() => {
      event.ports[0]?.postMessage({ cleared: true })
    })
  }

  if (event.data?.type === 'GET_CACHE_STATUS') {
    caches.open(CACHE_NAME).then(async (cache) => {
      const keys = await cache.keys()
      const entries = keys.map(req => ({
        url: req.url,
      }))
      event.ports[0]?.postMessage({ entries, count: entries.length })
    })
  }
})
