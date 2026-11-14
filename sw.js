const CACHE_NAME = 'rastro-austral-v23'; // VERSIÓN NUEVA (Forzar reinicio y purga de versiones anteriores)
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

// Instalar y tomar el control inmediatamente
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
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

// ESTRATEGIA DEFINITIVA: NETWORK FIRST (Primero la red, si falla usa caché)
self.addEventListener('fetch', event => {
  // Solo procesar solicitudes HTTP / HTTPS
  if (!event.request.url.startsWith('http')) return;

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
