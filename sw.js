/* ===== English Writing Course — Service Worker ===== */

const CACHE = "ewc-final-v3";

const CORE = [
  "./",
  "./index.html",
  "./404.html",

  "./lessons/lesson1.html",
  "./lessons/lesson2.html",
  "./lessons/lesson3.html",
  "./lessons/lesson4.html",

  "./css/tokens.css",
  "./css/base.css",
  "./css/layout.css",
  "./css/components.css",
  "./css/lessons.css",
  "./css/print.css",

  "./js/main.js",
  "./js/utils.js",
  "./js/storage.js",
  "./js/navigation.js",
  "./js/toc.js",
  "./js/quiz.js",
  "./js/autosave.js",
  "./js/roadmap.js",
  "./js/pwa.js",
  "./js/course.js",
  "./js/vocabulary.js",

  "./manifest.webmanifest",
  "./robots.txt",
  "./sitemap.xml",

  "./icons/icon.svg",
  "./icons/icon-maskable.svg"
];

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => Promise.allSettled(CORE.map((url) => cache.add(url))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE && key.startsWith("ewc-"))
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Cross-origin: cache first, then network update if possible.
  if (url.origin !== self.location.origin) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const network = fetch(request)
          .then((response) => {
            if (response && (response.ok || response.type === "opaque")) {
              const copy = response.clone();
              caches.open(CACHE).then((cache) => cache.put(request, copy));
            }
            return response;
          })
          .catch(() => cached);

        return cached || network;
      })
    );
    return;
  }

  // Navigations: network first, then cache, then index.html fallback.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() =>
          caches
            .match(request)
            .then((cached) => cached || caches.match("./index.html"))
        )
    );
    return;
  }

  // Same-origin static assets: cache first, then network update.
  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);

      return cached || network;
    })
  );
});