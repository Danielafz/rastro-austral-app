// ==========================================
// RASTRO AUSTRAL - SERVICE WORKER (STALE-WHILE-REVALIDATE)
// ==========================================

const CACHE_NAME = 'rastro-austral-v12'; // Incrementar este número para forzar purga de versiones anteriores
const urlsToCache = [
  './',
  './index.html',
  './css/styles.css',
  './js/app.js',
  './js/storage.js',
  './data/hitos.json',
  './data/observatorio_real.json',
  './data/areas_protegidas.geojson',
  './data/alertas_turbales.geojson',
  './manifest.json',
  './icon.svg',
  './assets/logo-rastro-austral.jpeg',
  './assets/hitos/tol-01.svg',
  './assets/hitos/rg-01.svg',
  './assets/hitos/ush-01.svg',
  './assets/hitos/ush-02.svg',
  './assets/hitos/tol-02.svg',
  './assets/hitos/rg-02.svg'
];

// Instalar y forzar activación inmediata
self.addEventListener('install', event => {
  self.skipWaiting(); // Obliga al SW a activarse sin esperar a que se cierren las pestañas
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Activar y limpiar cachés viejas
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
    }).then(() => self.clients.claim()) // Toma el control de la página inmediatamente
  );
});

// Estrategia Stale-While-Revalidate / Network Fallback
self.addEventListener('fetch', event => {
  // Solo interceptar solicitudes GET sobre protocolo HTTP/HTTPS
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      const fetchPromise = fetch(event.request).then(networkResponse => {
        // Actualizar la caché silenciosamente de fondo
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
        return cachedResponse;
      }); // Si no hay internet, usar la caché

      // Devolver primero la caché si existe, sino ir a la red
      return cachedResponse || fetchPromise;
    })
  );
});
