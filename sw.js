/* ===== English Writing Course — Service Worker (Auto-Update) ===== */
const CACHE = 'ewc-auto-v3';
const CORE = [
  './',
  './index.html',
  './lesson1.html',
  './lesson2.html',
  './lesson3.html',
  './lesson4.html',
  './style.css',
  './course.js',
  './course-data.js',
  './sw.js',
  './manifest.webmanifest',
  './icon.svg',
  './icon-maskable.svg'
];
/* تثبيت: تخزين أساسي فوري + تفعيل فوري للـ SW الجديد */
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => Promise.allSettled(CORE.map(u => c.add(u))))
      .then(() => self.skipWaiting())
  );
});
/* تفعيل: تنظيف أي كاشات قديمة تلقائيًا + السيطرة على كل التبويبات */
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE && k.startsWith('ewc-')).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  /* موارد خارجية (خطوط جوجل): كاش فوري + تحديث في الخلفية */
  if (url.origin !== location.origin) {
    e.respondWith(
      caches.match(req).then(hit => {
        const refresh = fetch(req).then(res => {
          if (res && (res.ok || res.type === 'opaque')) {
            const cp = res.clone();
            caches.open(CACHE).then(c => c.put(req, cp));
          }
          return res;
        }).catch(() => hit);
        return hit || refresh;
      })
    );
    return;
  }
  /* صفحات وملفات الموقع: الشبكة أولًا (دايمًا أحدث نسخة) والكاش احتياطي (أوفلاين) */
  e.respondWith(
    fetch(req).then(res => {
      if (res && res.ok) {
        const cp = res.clone();
        caches.open(CACHE).then(c => c.put(req, cp));
      }
      return res;
    }).catch(() =>
      caches.match(req).then(hit =>
        hit || (req.mode === 'navigate' ? caches.match('./index.html') : Response.error())
      )
    )
  );
});