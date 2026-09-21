/* ===== English Writing Course — Service Worker ===== */

const CACHE = "ewc-v9-ui-fixes";

const CORE = [
  "./",
  "./index.html",
  "./404.html",
  "./manifest.webmanifest",

  "./icons/icon.svg",
  "./icons/icon-maskable.svg",

  "./css/tokens.css",
  "./css/base.css",
  "./css/layout.css",
  "./css/components.css",
  "./css/lessons.css",
  "./css/print.css",

  "./js/main.js",
  "./js/utils.js",
  "./js/storage.js",
  "./js/toc.js",
  "./js/navigation.js",
  "./js/quiz.js",
  "./js/autosave.js",
  "./js/roadmap.js",
  "./js/pwa.js",

  "./js/data/course.js",
  "./js/data/vocabulary.js",

  "./lessons/lesson1.html",
  "./lessons/lesson2.html",
  "./lessons/lesson3.html",
  "./lessons/lesson4.html"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);

      await Promise.allSettled(
        CORE.map(async (url) => {
          try {
            const response = await fetch(url, { cache: "no-cache" });

            if (response && response.ok) {
              await cache.put(url, response);
            }
          } catch {
            // تجاهل أي ملف غير متاح حتى لا يفشل تثبيت Service Worker.
          }
        })
      );

      await self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();

      await Promise.all(
        keys
          .filter((key) => key !== CACHE)
          .map((key) => caches.delete(key))
      );

      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") return;

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) return;

  // صفحات التنقل: الشبكة أولًا، ثم الكاش، ثم الصفحة الرئيسية/404 عند الحاجة.
  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const networkResponse = await fetch(request);

          const cache = await caches.open(CACHE);
          cache.put(request, networkResponse.clone()).catch(() => {});

          return networkResponse;
        } catch {
          const cache = await caches.open(CACHE);

          const cachedResponse =
            (await cache.match(request)) ||
            (await cache.match("./index.html")) ||
            (await cache.match("index.html")) ||
            (await cache.match("./404.html")) ||
            (await cache.match("404.html"));

          return (
            cachedResponse ||
            new Response("Offline", {
              status: 503,
              headers: {
                "Content-Type": "text/plain; charset=utf-8"
              }
            })
          );
        }
      })()
    );

    return;
  }

  // الأصول: الكاش أولًا لسرعة العرض، مع محاولة التحديث من الشبكة في الخلفية.
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      const cachedResponse = await cache.match(request);

      const networkPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.ok) {
            cache.put(request, networkResponse.clone()).catch(() => {});
          }

          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || networkPromise;
    })()
  );
});