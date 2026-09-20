/* ===== English Writing Course — Main Entry ===== */

import {
  $,
  toast,
  getCurrentLessonNumber,
  smoothScrollTo
} from "./utils.js";

import {
  resetAllProgress
} from "./storage.js";

import { initToc } from "./toc.js";
import { initNavigation } from "./navigation.js";
import { initQuizzes } from "./quiz.js";
import { initAutosave } from "./autosave.js";
import { initPWA } from "./pwa.js";

import {
  markCurrentLessonVisited,
  renderAllRoadmapUI
} from "./roadmap.js";

import { getLessonByNumber } from "./data/course.js";

const RING_CIRCUMFERENCE = 2 * Math.PI * 18;

function updateReadingProgress() {
  const html = document.documentElement;

  const scrollTop = html.scrollTop || document.body.scrollTop || 0;
  const scrollHeight = html.scrollHeight - html.clientHeight;

  const progress = scrollHeight > 0 ? scrollTop / scrollHeight : 0;

  const progressBar = $("#progress");

  if (progressBar) {
    progressBar.style.width = `${Math.min(Math.max(progress, 0), 1) * 100}%`;
  }

  const ringForeground = $("#ringFg");

  if (ringForeground) {
    const offset = RING_CIRCUMFERENCE - (RING_CIRCUMFERENCE * progress);
    ringForeground.style.strokeDashoffset = String(offset);
  }

  const ringText = $("#ringTxt");

  if (ringText) {
    ringText.textContent = `${Math.round(progress * 100)}%`;
  }

  const fab = $("#topFab");

  if (fab) {
    fab.classList.toggle("show", scrollTop > 500);
  }
}

let endToastShown = false;

function showEndOfLessonToast() {
  if (endToastShown) return;

  const current = getCurrentLessonNumber();

  if (!current) return;

  endToastShown = true;

  const next = getLessonByNumber(current + 1);

  const message = next?.file
    ? `🎉 أنهيت الدرس؟ <a href="${next.file}" style="color:#fff;text-decoration:underline">التالي: Lesson ${next.n}</a>`
    : `🏁 أنهيت كل المتاح حاليًا — تابع خريطة الرحلة`;

  toast(message, 9000);
}

function bindScrollUI() {
  window.addEventListener(
    "scroll",
    () => {
      updateReadingProgress();

      const html = document.documentElement;

      const nearBottom =
        html.scrollTop + html.clientHeight >=
        html.scrollHeight - 160;

      if (nearBottom) {
        showEndOfLessonToast();
      }
    },
    { passive: true }
  );

  updateReadingProgress();
}

function bindHashNavigation() {
  window.addEventListener("hashchange", () => {
    const hash = window.location.hash.slice(1);

    if (!hash) return;

    const target = document.getElementById(hash);

    if (target) {
      smoothScrollTo(target);
    }
  });
}

function scrollToInitialHash() {
  const hash = window.location.hash.slice(1);

  if (!hash) return;

  const target = document.getElementById(hash);

  if (target) {
    setTimeout(() => {
      smoothScrollTo(target);
    }, 250);
  }
}

function bindResetAllButton() {
  const button = $("#resetAll");

  if (!button) return;

  button.addEventListener("click", () => {
    const confirmed = window.confirm(
      "سيتم مسح جميع إجاباتك المحفوظة ونتائج التمارين وعلامات الزيارة. هل أنت متأكد؟"
    );

    if (!confirmed) return;

    resetAllProgress();

    window.alert("تم المسح بنجاح ✅");

    window.location.reload();
  });
}

function init() {
  markCurrentLessonVisited();

  initToc();
  initNavigation();
  initQuizzes();
  initAutosave();

  renderAllRoadmapUI();

  bindScrollUI();
  bindHashNavigation();
  bindResetAllButton();

  scrollToInitialHash();

  initPWA();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}