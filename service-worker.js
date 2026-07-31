const VERSION = 'calisthenics-coach-v1.0.0';
const CORE = ["./","./index.html","./styles.css","./manifest.webmanifest","./offline.html","./privacy.html","./safety.html","./js/app.js","./js/app-core.js","./js/app-training.js","./js/app-shell.js","./js/db.js","./js/planner.js","./js/avatar.js","./js/workout.js","./content/catalogue-index.json","./content/catalogue.part1.gz","./content/catalogue.part2.gz","./content/catalogue.part3.gz","./content/catalogue.part4.gz","./content/programmes.json","./icons/icon.svg"];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(VERSION).then(cache => cache.addAll(CORE)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== VERSION).map(key => caches.delete(key)))));
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
      if (response.ok) {
        const copy = response.clone();
        caches.open(VERSION).then(cache => cache.put(event.request, copy));
      }
      return response;
    }).catch(() => event.request.mode === 'navigate' ? caches.match('./offline.html') : Response.error()))
  );
});
