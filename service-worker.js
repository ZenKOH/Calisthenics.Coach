const VERSION = 'calisthenics-coach-v1.1.0';
const CORE = [
  './','./index.html','./styles.css','./manifest.webmanifest','./offline.html','./privacy.html','./safety.html',
  './js/app.js','./js/app-core.js','./js/app-repair.js','./js/app-training.js','./js/app-shell.js','./js/catalogue-fallback.js',
  './js/db.js','./js/planner.js','./js/avatar.js','./js/workout.js','./content/catalogue-index.json',
  './content/catalogue.part1.gz','./content/catalogue.part2.gz','./content/catalogue.part3.gz','./content/catalogue.part4.gz',
  './content/programmes.json','./icons/icon.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(VERSION).then(cache => cache.addAll(CORE)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== VERSION).map(key => caches.delete(key)))));
  self.clients.claim();
});

async function networkFirst(request) {
  const cache = await caches.open(VERSION);
  try {
    const response = await fetch(request);
    if (response.ok) await cache.put(request, response.clone());
    return response;
  } catch {
    return (await cache.match(request)) || (request.mode === 'navigate' ? cache.match('./offline.html') : Response.error());
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(VERSION);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) await cache.put(request, response.clone());
  return response;
}

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  const dynamic = event.request.mode === 'navigate' || ['script','style'].includes(event.request.destination) || url.pathname.endsWith('.json');
  event.respondWith(dynamic ? networkFirst(event.request) : cacheFirst(event.request));
});
