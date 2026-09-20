/* ===== English Writing Course — Navigation ===== */

import { $, $$, prefersReducedMotion, getCurrentLessonNumber, lessonHref } from "./utils.js";
import COURSE from "./course.js";

function lessonByNumber(n) {
  return COURSE.find((l) => l.n === n) || null;
}

function onHomePage() {
  return (
    document.body.dataset.page === "home" ||
    Boolean($("#roadmapStations"))
  );
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: prefersReducedMotion() ? "auto" : "smooth"
  });
}

function bindBottomTabs() {
  $$(".bottombar .bb-tab").forEach((tab) => {
    tab.addEventListener("click", (event) => {
      const key = tab.dataset.tab;

      // الفهرس: زر (مش لينك) → نمنع السلوك الطبيعي ونفتح الـ drawer
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

      // المقدمة ونحن في صفحة درس: نروح للمقدمة في index
      if (key === "intro" && !onHomePage()) {
        // نسيب اللينك الطبيعي يشتغل: ../index.html#intro
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

function bindKeyboardShortcuts() {
  document.addEventListener("keydown", (event) => {
    if (!event.altKey) return;

    const current = getCurrentLessonNumber();

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      const target = lessonByNumber(current + 1);
      if (target && target.file) {
        window.location.href = lessonHref(target.file);
      }
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      const target = lessonByNumber(current - 1);
      if (target && target.file) {
        window.location.href = lessonHref(target.file);
      } else if (current > 0) {
        window.location.href = "../index.html";
      }
    }
  });
}

export function initNavigation() {
  bindBottomTabs();
  initTopFab();
  markActiveTab();
  bindKeyboardShortcuts();
}