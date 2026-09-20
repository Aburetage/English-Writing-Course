/* ===== English Writing Course — Utils ===== */

const isLessonPage = window.location.pathname.includes("/lessons/");

export const SITE_ROOT = isLessonPage ? "../" : "";

export const $ = (selector, root = document) => root.querySelector(selector);

export const $$ = (selector, root = document) =>
  Array.from(root.querySelectorAll(selector));

export function homeHref() {
  return `${SITE_ROOT}index.html`;
}

export function roadmapHref() {
  return `${homeHref()}#roadmap`;
}

export function lessonHref(file) {
  if (!file) return "#";
  if (file.includes("/")) return file;
  return isLessonPage ? file : `lessons/${file}`;
}

export function lessonStationHref(n) {
  return `${homeHref()}#ls${n}`;
}

export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function smoothScrollTo(target, offset = 88) {
  const el = typeof target === "string" ? $(target) : target;
  if (!el) return;

  const rect = el.getBoundingClientRect();
  const top = rect.top + window.scrollY - offset;

  window.scrollTo({
    top: Math.max(0, top),
    behavior: prefersReducedMotion() ? "auto" : "smooth"
  });
}

function removeExistingToasts() {
  $$(".toast").forEach((el) => el.remove());
}

export function toast(message, timeout = 4200) {
  if (!message) return;

  removeExistingToasts();

  const el = document.createElement("div");
  el.className = "toast";
  el.setAttribute("role", "status");
  el.setAttribute("aria-live", "polite");

  Object.assign(el.style, {
    position: "fixed",
    left: "16px",
    right: "16px",
    bottom: "calc(88px + env(safe-area-inset-bottom, 0px))",
    zIndex: "9999",
    margin: "0 auto",
    maxWidth: "360px",
    width: "max-content",
    background: "rgba(31, 45, 51, 0.94)",
    color: "#ffffff",
    padding: "10px 16px",
    borderRadius: "999px",
    boxShadow: "0 10px 28px rgba(0, 0, 0, 0.22)",
    fontFamily: '"Cairo", Tahoma, sans-serif',
    fontWeight: "800",
    fontSize: "0.88rem",
    lineHeight: "1.6",
    textAlign: "center",
    pointerEvents: "auto",
    opacity: "1",
    transform: "translateY(0)",
    transition: "opacity 0.3s ease, transform 0.3s ease"
  });

  el.innerHTML = message;
  document.body.appendChild(el);

  window.setTimeout(() => {
    el.style.opacity = "0";
    el.style.transform = "translateY(8px)";
    window.setTimeout(() => el.remove(), 320);
  }, timeout);
}