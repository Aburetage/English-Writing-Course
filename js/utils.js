/* ===== English Writing Course — Utils ===== */

export const $ = (selector, root = document) => root.querySelector(selector);

export const $$ = (selector, root = document) =>
  Array.from(root.querySelectorAll(selector));

/**
 * هل نحن داخل صفحة درس؟
 * يعتمد على:
 * 1) وجود data-lesson في body
 * 2) أو أن المسار يحتوي على /lessons/
 */
export const isLessonPage =
  Boolean(document.body?.dataset?.lesson) ||
  window.location.pathname.includes("/lessons/");

/**
 * جذر الموقع بالنسبة للصفحة الحالية.
 * إذا كنا في lessons/ فنحتاج ../
 * وإذا كنا في الجذر فنستخدم ""
 */
export const SITE_ROOT = isLessonPage ? "../" : "";

/**
 * رابط داخلي لصفحة رئيسية.
 */
export function homeHref() {
  return `${SITE_ROOT}index.html`;
}

/**
 * رابط خريطة الرحلة.
 */
export function roadmapHref() {
  return `${homeHref()}#roadmap`;
}

/**
 * رابط درس من سجل الكورس.
 * file يجب أن يكون مثل: lesson1.html
 * وليس lessons/lesson1.html
 */
export function lessonHref(file) {
  if (!file) return "#";

  // إذا كان الملف يحتوي بالفعل على مسار، نتركه كما هو.
  if (file.includes("/")) return file;

  return isLessonPage ? file : `lessons/${file}`;
}

/**
 * رابط محطة درس في الخريطة.
 */
export function lessonStationHref(n) {
  return `${homeHref()}#ls${n}`;
}

/**
 * Debounce بسيط.
 */
export function debounce(fn, delay = 300) {
  let timer;

  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * إزالة أي Toast قديم.
 */
function removeExistingToasts() {
  $$(".toast").forEach((el) => el.remove());
}

/**
 * إشعار سفلي أنيق.
 */
export function toast(message, timeout = 4200) {
  removeExistingToasts();

  const el = document.createElement("div");
  el.className = "toast";
  el.setAttribute("role", "status");
  el.setAttribute("aria-live", "polite");
  el.innerHTML = message;

  document.body.appendChild(el);

  setTimeout(() => {
    el.remove();
  }, timeout);
}

/**
 * الحصول على رقم الدرس الحالي من body[data-lesson].
 */
export function getCurrentLessonNumber() {
  const value = parseInt(document.body?.dataset?.lesson || "0", 10);
  return Number.isFinite(value) ? value : 0;
}

/**
 * هل المتصفح يدعم IntersectionObserver؟
 */
export function supportsIntersectionObserver() {
  return "IntersectionObserver" in window;
}

/**
 * تمرير ناعم لعنصر.
 */
export function smoothScrollTo(element, block = "start") {
  if (!element) return;

  element.scrollIntoView({
    behavior: "smooth",
    block
  });
}

/**
 * تمرير ناعم لأعلى الصفحة.
 */
export function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}