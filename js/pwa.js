/* ===== English Writing Course — PWA ===== */

import { toast } from "./utils.js";

export function initPWA() {
  if (!("serviceWorker" in navigator)) return;

  const swUrl = getServiceWorkerUrl();

  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      registration.addEventListener("updatefound", () => {
        const installing = registration.installing;
        if (!installing) return;

        installing.addEventListener("statechange", () => {
          if (
            installing.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            toast("تم تحديث نسخة الموقع — أعد التحميل للحصول على أحدث نسخة");
          }
        });
      });
    })
    .catch(() => {
      // Silent fail: site must work without SW.
    });

  window.setInterval(() => {
    navigator.serviceWorker.getRegistration().then((registration) => {
      if (registration) {
        registration.update().catch(() => {});
      }
    });
  }, 60 * 60 * 1000);
}

function getServiceWorkerUrl() {
  const manifest = document.querySelector('link[rel="manifest"]');

  if (manifest) {
    try {
      const manifestUrl = new URL(
        manifest.getAttribute("href"),
        document.baseURI
      );
      return new URL("sw.js", manifestUrl).href;
    } catch {
      // fall through
    }
  }

  const path = window.location.pathname;
  let root = "/";

  const lessonsIndex = path.indexOf("/lessons/");

  if (lessonsIndex >= 0) {
    root = path.slice(0, lessonsIndex + 1);
  } else {
    const lastSlash = path.lastIndexOf("/");
    root = lastSlash >= 0 ? path.slice(0, lastSlash + 1) : "/";
  }

  return new URL("sw.js", root).href;
}