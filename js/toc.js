/* ===== English Writing Course — Table of Contents ===== */

import { $, $$, smoothScrollTo, supportsIntersectionObserver } from "./utils.js";

let tocElement = null;
let backdropElement = null;

export function isTocOpen() {
  return Boolean(tocElement?.classList.contains("open"));
}

export function openToc() {
  if (!tocElement) return;

  tocElement.classList.add("open");

  if (backdropElement) {
    backdropElement.classList.add("show");
  }
}

export function closeToc() {
  if (!tocElement) return;

  tocElement.classList.remove("open");

  if (backdropElement) {
    backdropElement.classList.remove("show");
  }
}

export function toggleToc() {
  if (isTocOpen()) {
    closeToc();
  } else {
    openToc();
  }
}

function setActiveLink(hash) {
  $$("#toc a").forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === hash);
  });
}

function bindTocLinks() {
  $$("#toc a").forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href") || "";

      if (!href.startsWith("#")) return;

      event.preventDefault();

      const id = href.slice(1);
      const target = document.getElementById(id);

      if (target) {
        smoothScrollTo(target);
      }

      setActiveLink(href);

      setTimeout(() => {
        closeToc();
      }, 180);
    });
  });
}

function bindBackdrop() {
  backdropElement = $("#backdrop");

  if (backdropElement) {
    backdropElement.addEventListener("click", closeToc);
  }
}

function bindCloseButton() {
  const closeBtn = $(".toc-close");

  if (closeBtn) {
    closeBtn.addEventListener("click", closeToc);
  }
}

function bindKeyboard() {
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeToc();
    }
  });
}

function observeSections() {
  if (!supportsIntersectionObserver()) return;

  const sections = $$("section.card[id], .card[id]");

  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const id = entry.target.id;
        if (!id) return;

        setActiveLink(`#${id}`);
      });
    },
    {
      rootMargin: "-25% 0px -65% 0px",
      threshold: 0.1
    }
  );

  sections.forEach((section) => observer.observe(section));
}

export function initToc() {
  tocElement = $("#toc");

  if (!tocElement) return;

  bindBackdrop();
  bindCloseButton();
  bindTocLinks();
  bindKeyboard();
  observeSections();

  if (window.location.hash) {
    setActiveLink(window.location.hash);
  }
}