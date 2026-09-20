/* ===== English Writing Course — Utils ===== */

export const $ = (selector, root = document) => root.querySelector(selector);

export const $$ = (selector, root = document) =>
  Array.from(root.querySelectorAll(selector));

export function debounce(fn, delay = 300) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function toast(message, type = "info") {
  if (!message) return;

  let host = $("#toastHost");

  if (!host) {
    host = document.createElement("div");
    host.id = "toastHost";
    host.setAttribute("aria-live", "polite");
    host.setAttribute("aria-atomic", "true");

    Object.assign(host.style, {
      position: "fixed",
      left: "16px",
      right: "16px",
      bottom: "calc(88px + env(safe-area-inset-bottom, 0px))",
      zIndex: "9999",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "8px",
      pointerEvents: "none"
    });

    document.body.appendChild(host);
  }

  const el = document.createElement("div");
  el.className = `toast ${type}`;

  const backgrounds = {
    info: "rgba(31, 45, 51, 0.94)",
    success: "rgba(44, 122, 104, 0.96)",
    warning: "rgba(196, 142, 28, 0.96)",
    danger: "rgba(184, 87, 74, 0.96)"
  };

  Object.assign(el.style, {
    pointerEvents: "auto",
    maxWidth: "360px",
    width: "max-content",
    maxHeight: "80vh",
    overflowWrap: "anywhere",
    background: backgrounds[type] || backgrounds.info,
    color: "#ffffff",
    padding: "10px 16px",
    borderRadius: "999px",
    boxShadow: "0 10px 28px rgba(0, 0, 0, 0.22)",
    fontWeight: "800",
    fontSize: "0.88rem",
    lineHeight: "1.6",
    textAlign: "center",
    opacity: "1",
    transform: "translateY(0)",
    transition: "opacity 0.3s ease, transform 0.3s ease"
  });

  el.textContent = message;
  host.appendChild(el);

  setTimeout(() => {
    el.style.opacity = "0";
    el.style.transform = "translateY(8px)";
    setTimeout(() => el.remove(), 320);
  }, 2600);
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