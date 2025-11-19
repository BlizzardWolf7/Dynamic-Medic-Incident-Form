const APP_VERSION = '1.1.1';
const CACHE_NAME = `incident-pwa-${APP_VERSION}`;
const APP_ASSETS = [
  '/',
  'index.html',
  'style.css',
  'script.js',
  'incidents.js',
  'guidebook-data.js',
  'manifest.json',
  'icons/icon.svg',
  'https://cdn.jsdelivr.net/gh/BlizzardWolf7/Toast-Notification-Library@main/toast.css',
  'https://cdn.jsdelivr.net/gh/BlizzardWolf7/Toast-Notification-Library@main/toast.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key.startsWith('incident-pwa-') && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            networkResponse.type === 'basic' &&
            event.request.url.startsWith(self.location.origin)
          ) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => caches.match('index.html'));
    })
  );
});

