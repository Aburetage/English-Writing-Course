/* ===== English Writing Course — Navigation ===== */

import {
  $,
  $$,
  isLessonPage,
  homeHref,
  roadmapHref,
  lessonHref,
  getCurrentLessonNumber,
  scrollToTop,
  smoothScrollTo
} from "./utils.js";

import { toggleToc } from "./toc.js";

import {
  COURSE,
  getLessonByNumber,
  getFirstAvailableLesson
} from "./data/course.js";

function goHomeOrTop() {
  const roadmap = $("#roadmap");

  if (roadmap) {
    scrollToTop();
    return;
  }

  window.location.href = homeHref();
}

function goToRoadmap() {
  const roadmap = $("#roadmap");

  if (roadmap) {
    smoothScrollTo(roadmap);
    return;
  }

  window.location.href = roadmapHref();
}

function goToLessonOrTop() {
  if (isLessonPage) {
    scrollToTop();
    return;
  }

  const first = getFirstAvailableLesson();

  if (first?.file) {
    window.location.href = lessonHref(first.file);
  } else {
    goToRoadmap();
  }
}

function navigateLesson(direction) {
  const current = getCurrentLessonNumber();

  if (!current) return;

  const targetNumber = current + direction;
  const target = getLessonByNumber(targetNumber);

  if (target?.file) {
    window.location.href = lessonHref(target.file);
    return;
  }

  if (direction === -1) {
    window.location.href = homeHref();
  }
}

function bindBottomTabs() {
  $$(".bb-tab").forEach((tab) => {
    tab.addEventListener("click", (event) => {
      event.preventDefault();

      const key = tab.dataset.tab;

      if (key === "toc") {
        toggleToc();
        return;
      }

      if (key === "map") {
        goToRoadmap();
        return;
      }

      if (key === "home") {
        goHomeOrTop();
        return;
      }

      if (key === "lesson") {
        goToLessonOrTop();
        return;
      }

      if (key === "print") {
        window.print();
      }
    });
  });
}

function bindLegacyButtons() {
  const menuBtn = $("#menuBtn");

  if (menuBtn) {
    menuBtn.addEventListener("click", (event) => {
      event.preventDefault();
      toggleToc();
    });
  }

  const mapBtn = $("#mapBtn");

  if (mapBtn) {
    mapBtn.addEventListener("click", (event) => {
      event.preventDefault();
      goToRoadmap();
    });
  }

  const printBtn = $("#printBtn");

  if (printBtn) {
    printBtn.addEventListener("click", (event) => {
      event.preventDefault();
      window.print();
    });
  }

  const topFab = $("#topFab");

  if (topFab) {
    topFab.addEventListener("click", (event) => {
      event.preventDefault();
      scrollToTop();
    });
  }
}

function bindKeyboardShortcuts() {
  document.addEventListener("keydown", (event) => {
    if (!event.altKey) return;

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      navigateLesson(1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      navigateLesson(-1);
    }
  });
}

function bindMobileSwipe() {
  let startX = 0;
  let startY = 0;
  let tracking = false;

  document.addEventListener(
    "touchstart",
    (event) => {
      if (event.touches.length !== 1) return;

      const target = event.target;

      const excluded = target.closest(
        "#toc, .bottombar, .topbar, textarea, button, a, select, details, .stairs, .opts"
      );

      if (excluded) return;

      startX = event.touches[0].clientX;
      startY = event.touches[0].clientY;
      tracking = true;
    },
    { passive: true }
  );

  document.addEventListener(
    "touchend",
    (event) => {
      if (!tracking) return;

      tracking = false;

      const endTouch = event.changedTouches[0];
      const deltaX = endTouch.clientX - startX;
      const deltaY = endTouch.clientY - startY;

      const isHorizontalSwipe = Math.abs(deltaX) > 70 && Math.abs(deltaY) < 50;

      if (!isHorizontalSwipe) return;

      if (deltaX < 0) {
        navigateLesson(1);
      } else {
        navigateLesson(-1);
      }
    },
    { passive: true }
  );
}

export function initNavigation() {
  bindBottomTabs();
  bindLegacyButtons();
  bindKeyboardShortcuts();
  bindMobileSwipe();
}