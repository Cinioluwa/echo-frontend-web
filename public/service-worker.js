/**
 * Echo Service Worker
 * Handles:
 *   1. App shell caching (offline support for core routes)
 *   2. Web Push API events for native OS-level notifications
 */

const CACHE_NAME = 'echo-shell-v2';

// Assets to pre-cache on install — update version string when deploying new builds
const SHELL_ASSETS = [
  '/',
  '/manifest.json',
  '/echo.svg',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// ─── Install: pre-cache shell assets ────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS))
  );
  // Activate immediately without waiting for old SW to release clients
  self.skipWaiting();
});

// ─── Activate: clean up old caches ──────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  // Take control of all open clients immediately
  self.clients.claim();
});

// ─── Fetch: Network-first for API, Cache-first for shell ────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip cross-origin requests (API calls to backend)
  // These must always be live — never serve stale API data
  if (url.origin !== self.location.origin) return;

  // Skip chrome-extension and non-http(s) schemes
  if (!url.protocol.startsWith('http')) return;

  // For navigation requests (page loads): serve from network, fallback to cache
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match('/').then((cached) => cached || Response.error())
      )
    );
    return;
  }

  // For static assets: cache-first strategy
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        // Only cache successful responses for same-origin assets
        if (response.ok && url.origin === self.location.origin) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      });
    })
  );
});

// ─── Push: Show OS-level notification ───────────────────────────────────────
self.addEventListener('push', function (event) {
  const payload = event.data ? event.data.json() : {};

  const options = {
    body: payload.body || 'You have a new notification.',
    icon: payload.icon || '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    data: { url: payload.url || '/' },
    vibrate: [100, 50, 100],
  };

  event.waitUntil(
    self.registration.showNotification(payload.title || 'Echo', options)
  );
});

// ─── Notification click: focus or open app ──────────────────────────────────
self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  const urlToOpen = new URL(
    event.notification.data.url || '/',
    self.location.origin
  ).href;

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then(function (clientList) {
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});
