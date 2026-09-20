/* ===== English Writing Course — Table Of Contents ===== */

import { $, $$, smoothScrollTo } from "./utils.js";

export function initToc() {
  const toc = $("#toc");
  if (!toc) return;

  const backdrop = $("#backdrop");
  const buttons = $$('.bottombar .bb-tab[data-tab="toc"]');
  const links = $$("#toc a[href^='#']");

  let isOpen = false;

  function setState(open) {
    isOpen = Boolean(open);

    toc.classList.toggle("open", isOpen);
    document.body.classList.toggle("toc-open", isOpen);

    if (backdrop) {
      backdrop.classList.toggle("show", isOpen);
    }

    buttons.forEach((button) => {
      button.setAttribute("aria-expanded", String(isOpen));
    });
  }

  // navigation.js هو اللي بيعمل dispatch للزرار؛ هنا نستمع فقط
  window.addEventListener("ewc:toggle-toc", () => {
    setState(!isOpen);
  });

  if (backdrop) {
    backdrop.addEventListener("click", () => setState(false));
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen) {
      setState(false);
    }
  });

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const hash = link.getAttribute("href");
      if (!hash || hash === "#") return;

      const target = $(hash);
      if (!target) return;

      event.preventDefault();
      smoothScrollTo(target);
      history.replaceState(null, "", hash);
      setState(false);
    });
  });

  initActiveLinkOnScroll(links);

  if (window.location.hash) {
    const target = $(window.location.hash);
    if (target) {
      window.setTimeout(() => smoothScrollTo(target), 120);
    }
  }
}

function initActiveLinkOnScroll(links) {
  if (!links.length) return;

  const sections = links
    .map((link) => $(link.getAttribute("href")))
    .filter(Boolean);

  if (!sections.length) return;

  function updateActive() {
    let activeId = sections[0]?.id || "";

    for (const section of sections) {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 140) {
        activeId = section.id;
      }
    }

    links.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${activeId}`;
      link.classList.toggle("active", isActive);
    });
  }

  window.addEventListener("scroll", updateActive, { passive: true });
  window.addEventListener("resize", updateActive);
  updateActive();
}