/* LWH Daily Word service worker */
const VERSION = 'dw-1.3.0';
const SHELL = ['./', './index.html', './manifest.json', './qrcode.js', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(k => k !== VERSION && k !== 'dw-scripture').map(k => caches.delete(k))
  )).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Scripture text never changes: cache first, keep forever.
  const isScripture =
    (url.hostname === 'bolls.life' && /^\/(get-text|get-verse|get-books|static\/bolls)/.test(url.pathname)) ||
    url.hostname === 'bible-api.com' || url.hostname === 'bible.helloao.org' ||
    url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
  if (isScripture) {
    e.respondWith(caches.open('dw-scripture').then(async c => {
      const hit = await c.match(req);
      if (hit) return hit;
      const res = await fetch(req);
      if (res.ok) c.put(req, res.clone());
      return res;
    }));
    return;
  }

  // Search, weather, random verse: network only, fall back to any cached copy.
  if (url.origin !== location.origin) {
    e.respondWith(fetch(req).catch(() => caches.match(req)));
    return;
  }

  // App shell: network first so updates show up, cache when offline.
  e.respondWith(fetch(req).then(res => {
    const copy = res.clone();
    caches.open(VERSION).then(c => c.put(req, copy));
    return res;
  }).catch(() => caches.match(req).then(r => r || caches.match('./index.html'))));
});
