/* ===== English Writing Course — Navigation (بسيطة ومضمونة) ===== */

import { $, $$, prefersReducedMotion, lessonHref } from "./utils.js";
import COURSE from "./data/course.js";

function currentLessonNumber() {
  const attr = document.body.dataset.lesson;
  if (attr) return Number(attr);
  const m = location.pathname.match(/lesson(\d+)\.html/i);
  return m ? Number(m[1]) : 0;
}

function lessonByNumber(n) {
  return COURSE.find((l) => l.n === n) || null;
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: prefersReducedMotion() ? "auto" : "smooth"
  });
}

function onHomePage() {
  return document.body.dataset.page === "home" || Boolean($("#roadmapStations"));
}

function bindBottomTabs() {
  $$(".bottombar .bb-tab").forEach((tab) => {
    tab.addEventListener("click", (event) => {
      const key = tab.dataset.tab;

      // الفهرس: زر افتراضي (مش لينك) → نمنع السلوك الطبيعي ونفتح الـ drawer
      if (key === "toc") {
        event.preventDefault();
        window.dispatchEvent(new CustomEvent("ewc:toggle-toc"));
        return;
      }

      // الرئيسية ونحن في الصفحة الرئيسية: نطلع فوق بدل إعادة تحميل
      if (key === "home" && onHomePage()) {
        event.preventDefault();
        scrollToTop();
        return;
      }

      // الدرس ونحن في صفحة درس: نطلع فوق
      if (key === "lesson" && !onHomePage()) {
        event.preventDefault();
        scrollToTop();
        return;
      }

      // الخريطة: لا نمنع السلوك الطبيعي أبدًا.
      // على الرئيسية href="#roadmap" → يسكرول للقسم.
      // على صفحة درس href="../index.html#roadmap" → يروح للرئيسية ثم يسكرول.
      // هذا يضمن أن الزر يعمل حتى لو فشل أي JS.
    });
  });
}

function initTopFab() {
  const fab = $("#topFab");
  if (!fab) return;
  fab.addEventListener("click", scrollToTop);
}

function bindKeyboardShortcuts() {
  document.addEventListener("keydown", (event) => {
    if (!event.altKey) return;

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      const target = lessonByNumber(currentLessonNumber() + 1);
      if (target && target.file) window.location.href = lessonHref(target.file);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      const target = lessonByNumber(currentLessonNumber() - 1);
      if (target && target.file) window.location.href = lessonHref(target.file);
      else if (currentLessonNumber() > 0) window.location.href = "../index.html";
    }
  });
}

export function initNavigation() {
  bindBottomTabs();
  initTopFab();
  bindKeyboardShortcuts();
}