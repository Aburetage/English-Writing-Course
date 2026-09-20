/* ===== English Writing Course — Service Worker ===== */

const CACHE = "ewc-v7-bottom-nav";

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
  "./js/data/course.js",
  "./js/data/vocabulary.js",

  "./manifest.webmanifest",
  "./robots.txt",
  "./sitemap.xml",

  "./icons/icon.svg",
  "./icons/icon-maskable.svg"
];

/* التثبيت: تخزين أساسي + تفعيل فوري */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => Promise.allSettled(CORE.map((url) => cache.add(url))))
      .then(() => self.skipWaiting())
  );
});

/* التنشيط: حذف الكاشات القديمة + السيطرة على التبويبات */
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

/* الجلب */
self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") return;

  const url = new URL(request.url);

  /* موارد خارجية (خطوط جوجل): stale-while-revalidate */
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

  /* صفحات التنقل: الشبكة أولًا، ثم الكاش، ثم الرئيسية أوفلاين */
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

  /* الأصول الثابتة (css/js/icons/manifest): stale-while-revalidate */
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