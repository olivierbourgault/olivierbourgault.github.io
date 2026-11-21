// Service Worker hors-ligne léger — Portfolio Olivier Bourgault (V6 · Tech Canvas)
const CACHE_NAME = 'ob-portfolio-v6-cache-v1';
const PRECACHE_URLS = [
  '/',
  '/resume',
  '/identity',
  '/versions/',
  '/site.webmanifest',
  '/assets/data/github-projects.json',
  '/assets/docs/cv-fr.pdf',
  '/assets/docs/cv-en.pdf',
  '/assets/images/logos/logo-ob-tech.svg',
  '/assets/images/hero-avatar.webp'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .catch(() => {})
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Pages HTML & catalogue JSON : Network-First avec repli hors-ligne sur le cache
  const isDocOrJson =
    req.mode === 'navigate' ||
    url.pathname.endsWith('.html') ||
    url.pathname.endsWith('.json') ||
    url.pathname.endsWith('.md') ||
    url.pathname.endsWith('.txt');

  if (isDocOrJson) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(() => caches.match(req).then((cached) => cached || caches.match('/')))
    );
    return;
  }

  // Ressources statiques (_astro/, .webp, .woff2, .svg, .pdf) : Stale-While-Revalidate
  event.respondWith(
    caches.match(req).then((cached) => {
      const networkFetch = fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || networkFetch;
    })
  );
});
