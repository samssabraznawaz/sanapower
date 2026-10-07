/* SaNaML service worker (generated at build time from src/sw-template.js). Works offline after the first visit. */
const CACHE = 'sanapower-392d23fd36a6';
const FILES = ["assets/index-DABkSAph.js","assets/index-DkNQ2V1y.css","favicon.svg","./"];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES.map((f) => new URL(f, self.registration.scope)))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('sanapower-') && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  if (req.mode === 'navigate') {
    // Pages: the network first (to pick up new versions), the stored copy when offline.
    event.respondWith(fetch(req).catch(() => caches.match(req, { ignoreSearch: true }).then((r) => r || caches.match(new URL('./', self.registration.scope)))));
    return;
  }
  // Scripts, styles, the stored copy first (they are versioned), then the network.
  event.respondWith(caches.match(req, { ignoreSearch: true }).then((hit) => hit || fetch(req).then((res) => {
    if (res.ok && res.type === 'basic') { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
    return res;
  })));
});
