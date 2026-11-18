const CACHE_NAME = 'rastro-austral-v94'; // VERSIÓN NUEVA (Forzar reinicio y purga de versiones anteriores)
const FONT_OUTFIT_URL = 'https://fonts.googleapis.com/css2?family=Outfit:wght@600;700;800&display=swap';
const urlsToCache = [
  './',
  './index.html',
  './css/styles.css',
  './js/app.js',
  './js/storage.js',
  './js/museo-data.js',
  './js/museo.js',
  './data/hitos.json',
  './data/observatorio_real.json',
  './data/areas_protegidas.geojson',
  './data/alertas_turbales.geojson',
  './manifest.json',
  './icon.svg',
  './assets/logo-rastro-austral.png',
  './assets/pinguino-bienvenida.webp',
  './assets/hitos/tol-01.svg',
  './assets/hitos/rg-01.svg',
  './assets/hitos/ush-01.svg',
  './assets/hitos/ush-02.svg',
  './assets/hitos/tol-02.svg',
  './assets/hitos/rg-02.svg'
];

// Instalar y tomar el control inmediatamente con precaché seguro (sin fallar offline)
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      await cache.addAll(urlsToCache);
      try {
        const fontRes = await fetch(FONT_OUTFIT_URL, { mode: 'cors' });
        if (fontRes && fontRes.ok) {
          await cache.put(FONT_OUTFIT_URL, fontRes);
        }
      } catch (err) {
        console.warn('No se pudo precachear fuente externa Outfit en install:', err);
      }
    })
  );
});

// Limpiar cachés viejas al activarse
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Borrando caché antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// ESTRATEGIA DE RED Y CACHÉ DINÁMICO
self.addEventListener('fetch', event => {
  // Solo procesar solicitudes HTTP / HTTPS
  if (!event.request.url.startsWith('http')) return;

  const url = new URL(event.request.url);

  // Imágenes del Museo Austral (Wikimedia Commons): Cache-First con guardado dinámico para 100% offline
  if (url.hostname.includes('wikimedia.org')) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then(networkResponse => {
          if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        }).catch(() => {
          return caches.match(event.request);
        });
      })
    );
    return;
  }

  // Estrategia general: Network-First con fallback a caché
  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        // Si hay internet, devolvemos la versión fresca y la guardamos en caché de fondo
        if (networkResponse && networkResponse.status === 200 && event.request.method === 'GET') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Solo si NO hay internet (falla el fetch), buscamos en la caché
        return caches.match(event.request);
      })
  );
});
