/* ===== English Writing Course — Main Entry ===== */

import {
  $,
  toast,
  smoothScrollTo,
  prefersReducedMotion,
  getCurrentLessonNumber
} from "./utils.js";

import { initNavigation } from "./navigation.js";
import { initToc } from "./toc.js";
import { initQuizzes, initRevealButtons } from "./quiz.js";
import { initAutosave } from "./autosave.js";
import { initRoadmap } from "./roadmap.js";
import { initPWA } from "./pwa.js";

import {
  resetAllProgress,
  markLessonVisited
} from "./storage.js";

const RING_CIRCUMFERENCE = 2 * Math.PI * 18;

function initScrollUI() {
  const progressBar = $("#progress");
  const ringForeground = $("#ringFg");
  const ringText = $("#ringTxt");
  const topFab = $("#topFab");

  function update() {
    const html = document.documentElement;
    const maxScroll = html.scrollHeight - html.clientHeight;
    const progress = maxScroll > 0 ? html.scrollTop / maxScroll : 0;

    if (progressBar) {
      progressBar.style.width = `${progress * 100}%`;
    }

    if (ringForeground) {
      ringForeground.style.strokeDashoffset = String(
        RING_CIRCUMFERENCE - RING_CIRCUMFERENCE * progress
      );
    }

    if (ringText) {
      ringText.textContent = `${Math.round(progress * 100)}%`;
    }

    if (topFab) {
      topFab.classList.toggle("show", html.scrollTop > 420);
    }
  }

  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
}

function initHashNavigation() {
  function goToHash() {
    const hash = window.location.hash;
    if (!hash || hash === "#") return;

    const target = $(hash);
    if (!target) return;

    window.setTimeout(() => smoothScrollTo(target), 90);
  }

  window.addEventListener("hashchange", goToHash);
  goToHash();
}

function initResetAllButton() {
  const button = $("#resetAll");
  if (!button) return;

  button.addEventListener("click", () => {
    const confirmed = window.confirm(
      "هل تريد مسح كل الإجابات والتقدم المحفوظ في هذا المتصفح؟\n\nلا يمكن التراجع بعد المسح."
    );

    if (!confirmed) return;

    resetAllProgress();
    toast("تم مسح كل البيانات المحفوظة");

    window.setTimeout(() => {
      window.location.reload();
    }, 700);
  });
}

function initCurrentLessonVisit() {
  const lessonNumber = getCurrentLessonNumber();
  if (lessonNumber > 0) {
    markLessonVisited(lessonNumber);
  }
}

function init() {
  initNavigation();
  initToc();
  initQuizzes();
  initRevealButtons();
  initAutosave();
  initRoadmap();
  initPWA();
  initScrollUI();
  initHashNavigation();
  initResetAllButton();
  initCurrentLessonVisit();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}