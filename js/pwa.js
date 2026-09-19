/* ===== English Writing Course — PWA ===== */

import { isLessonPage, toast } from "./utils.js";

function getServiceWorkerUrl() {
  const relativeUrl = isLessonPage ? "../sw.js" : "sw.js";

  return new URL(relativeUrl, document.baseURI).href;
}

export function initPWA() {
  if (!("serviceWorker" in navigator)) return;

  if (!/^https?:$/.test(window.location.protocol)) return;

  window.addEventListener("load", () => {
    const swUrl = getServiceWorkerUrl();

    navigator.serviceWorker
      .register(swUrl)
      .then((registration) => {
        setInterval(() => {
          registration.update().catch(() => {});
        }, 5 * 60 * 1000);
      })
      .catch(() => {
        // لا نكسر الموقع إذا فشل تسجيل Service Worker.
      });

    navigator.serviceWorker.addEventListener("controllerchange", () => {
      const reloadFlag = "ewc-sw-reload";

      if (sessionStorage.getItem(reloadFlag)) return;

      sessionStorage.setItem(reloadFlag, "1");

      toast("✅ تم تحديث التطبيق — جارٍ تحميل النسخة الجديدة…");

      setTimeout(() => {
        window.location.reload();
      }, 1200);
    });
  });
}