/**
 * Echo Service Worker
 * Handles Web Push API events for native OS-level notifications.
 * Must live in /public so Vite serves it at root scope.
 */

self.addEventListener('push', function (event) {
  const payload = event.data ? event.data.json() : {};

  const options = {
    body: payload.body || 'You have a new notification.',
    icon: payload.icon || '/echo.svg',
    badge: '/echo.svg',
    data: { url: payload.url || '/' },
    vibrate: [100, 50, 100],
  };

  event.waitUntil(
    self.registration.showNotification(payload.title || 'Echo', options)
  );
});

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
        // Focus an existing tab if one matches the URL
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        // Otherwise open a new tab
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});
