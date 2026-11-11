// ==========================================
// RASTRO AUSTRAL - SERVICE WORKER (CACHE-FIRST)
// ==========================================

const CACHE_NAME = "rastro-austral-v9";
const RECURSOS_ESTATICOS = [
  "./",
  "./index.html",
  "./css/styles.css",
  "./js/app.js",
  "./js/storage.js",
  "./data/hitos.json",
  "./data/observatorio_real.json",
  "./data/areas_protegidas.geojson",
  "./manifest.json",
  "./icon.svg",
  "./assets/logo-rastro-austral.jpeg",
  "./assets/hitos/tol-01.svg",
  "./assets/hitos/rg-01.svg",
  "./assets/hitos/ush-01.svg",
  "./assets/hitos/ush-02.svg",
  "./assets/hitos/tol-02.svg",
  "./assets/hitos/rg-02.svg"
];

// Instalación: precargar recursos estáticos
self.addEventListener("install", (evento) => {
  evento.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(RECURSOS_ESTATICOS);
    }).then(() => self.skipWaiting())
  );
});

// Activación: limpiar cachés obsoletos
self.addEventListener("activate", (evento) => {
  evento.waitUntil(
    caches.keys().then((claves) => {
      return Promise.all(
        claves.map((clave) => {
          if (clave !== CACHE_NAME) {
            return caches.delete(clave);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Estrategia Cache-First: responder desde caché o consultar red
self.addEventListener("fetch", (evento) => {
  // Solo interceptar solicitudes GET
  if (evento.request.method !== "GET") return;

  evento.respondWith(
    caches.match(evento.request).then((respuestaCache) => {
      if (respuestaCache) {
        return respuestaCache;
      }
      return fetch(evento.request).then((respuestaRed) => {
        // Guardar copia en caché si es recurso local válido
        if (respuestaRed && respuestaRed.status === 200 && respuestaRed.type === "basic") {
          const respuestaClonada = respuestaRed.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(evento.request, respuestaClonada);
          });
        }
        return respuestaRed;
      }).catch(() => {
        // Fallback básico si está sin conexión y no está en caché
        if (evento.request.headers.get("accept")?.includes("text/html")) {
          return caches.match("./index.html");
        }
      });
    })
  );
});

