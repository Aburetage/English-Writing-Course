/* ===== English Writing Course — Navigation ===== */

import { $, $$, prefersReducedMotion } from "./utils.js";

export function initNavigation() {
  initTopFab();
  initBottomBar();
  markActiveTab();
}

function initTopFab() {
  const fab = $("#topFab");
  if (!fab) return;

  fab.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion() ? "auto" : "smooth"
    });
  });
}

function initBottomBar() {
  const tabs = $$(".bottombar .bb-tab");

  tabs.forEach((tab) => {
    tab.addEventListener("click", (event) => {
      const name = tab.dataset.tab;

      if (name === "toc") {
        event.preventDefault();
        window.dispatchEvent(new CustomEvent("ewc:toggle-toc"));
      }
    });
  });
}

function markActiveTab() {
  const page = document.body.dataset.page;
  const lesson = document.body.dataset.lesson;

  if (page === "home") {
    const homeTab = $('.bottombar .bb-tab[data-tab="home"]');
    if (homeTab) homeTab.classList.add("active");
  }

  if (lesson) {
    const lessonTab = $('.bottombar .bb-tab[data-tab="lesson"]');
    if (lessonTab) lessonTab.classList.add("active");
  }
}