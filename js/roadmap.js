/* ===== English Writing Course — Roadmap (مجمّعة بالمراحل) ===== */

import COURSE from "./course.js";
import {
  $,
  escapeHtml,
  homeHref,
  roadmapHref,
  lessonHref,
  lessonStationHref,
  toast,
  getCurrentLessonNumber
} from "./utils.js";
import { isLessonVisited, markLessonVisited } from "./storage.js";

function lessonByNumber(n) {
  return COURSE.find((l) => l.n === n) || null;
}

function availableLessons() {
  return COURSE.filter((l) => l.file);
}

/* ---------- رسم الخريطة حسب المراحل ---------- */

export function renderRoadmap() {
  const host = $("#roadmapStations");
  if (!host) return;

  if (!COURSE || !COURSE.length) {
    host.innerHTML =
      '<div class="alert"><span class="aic" aria-hidden="true">⚠️</span>' +
      "<p>لا يمكن رسم خريطة الرحلة: تأكد من تحميل سجل الكورس (js/course.js).</p></div>";
    return;
  }

  host.classList.remove("road");
  host.classList.add("rm-wrap");

  const phases = [];
  COURSE.forEach((lesson) => {
    let phase = phases.find((p) => p.name === lesson.phase);
    if (!phase) {
      phase = { name: lesson.phase, lessons: [] };
      phases.push(phase);
    }
    phase.lessons.push(lesson);
  });

  host.innerHTML = phases
    .map((phase, index) => {
      const stations = phase.lessons.map(stationHtml).join("");
      return (
        '<div class="rm-phase">' +
        '<div class="rm-phead">' +
        '<span class="rm-pnum">' + (index + 1) + "</span>" +
        "<b>" + escapeHtml(phase.name) + "</b>" +
        "</div>" +
        '<div class="rm-grid">' + stations + "</div>" +
        "</div>"
      );
    })
    .join("");

  host.querySelectorAll(".rm-station.locked").forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      event.preventDefault();
      toast("هذا الدرس قريبًا — أكمل الدروس المفتوحة أولًا");
    });
  });
}

function stationHtml(lesson) {
  const available = Boolean(lesson.file);
  const visited = isLessonVisited(lesson.n);
  const href = available ? lessonHref(lesson.file) : "#";

  const statusTag = available
    ? visited
      ? '<span class="rm-tag done">✓ زرت</span>'
      : '<span class="rm-tag">متاح</span>'
    : '<span class="rm-tag lock">قريبًا 🔒</span>';

  const metaTags = [];
  if (lesson.ex) metaTags.push('<span class="rm-tag">' + lesson.ex + " تمرين</span>");
  if (lesson.min) metaTags.push('<span class="rm-tag">~' + lesson.min + " دقيقة</span>");

  const check = visited ? '<span class="rm-check" aria-hidden="true">✓</span>' : "";

  return (
    '<a class="rm-station ' +
    (available ? "" : "locked ") +
    (visited ? "visited" : "") +
    '" id="ls' + lesson.n + '" href="' + href + '" data-n="' + lesson.n + '">' +
    check +
    '<span class="rm-dot">' + lesson.n + "</span>" +
    '<span class="rm-body">' +
    '<span class="rm-en" lang="en">' + escapeHtml(lesson.en) + "</span>" +
    '<span class="rm-ar">' + escapeHtml(lesson.ar) + "</span>" +
    (lesson.desc ? '<span class="rm-desc">' + escapeHtml(lesson.desc) + "</span>" : "") +
    '<span class="rm-meta">' + statusTag + metaTags.join("") + "</span>" +
    "</span></a>"
  );
}

/* ---------- زر "واصل من حيث توقفت" ---------- */

export function renderContinue() {
  const list = availableLessons();
  const visited = list.filter((l) => isLessonVisited(l.n));

  const stats = $("#courseStats");
  if (stats) {
    stats.textContent = "✅ زرت " + visited.length + " من " + list.length + " درسًا متاحًا";
  }

  const button = $("#continueBtn");
  if (!button) return;

  const target = visited.length ? visited[visited.length - 1] : list[0];
  if (!target || !target.file) {
    button.href = roadmapHref();
    button.innerHTML = "🗺 افتح خريطة الرحلة";
    return;
  }

  button.href = lessonHref(target.file);
  button.innerHTML =
    "▶ واصل من حيث توقفت — Lesson " + target.n + " — " + escapeHtml(target.en);
}

/* ---------- كارت نهاية الدرس ---------- */

export function renderJourney() {
  const host = $("#journeyBox");
  if (!host) return;

  const current = getCurrentLessonNumber();
  if (!current) return;

  markLessonVisited(current);

  const previous = lessonByNumber(current - 1);
  const next = lessonByNumber(current + 1);

  let html = '<nav class="lesson-end-nav" aria-label="التنقل بين الدروس">';

  if (previous && previous.file) {
    html +=
      '<a class="len-btn prev" href="' + lessonHref(previous.file) + '">' +
      '<span class="len-arrow" aria-hidden="true">→</span>' +
      '<span class="len-text"><small>الدرس السابق</small><strong>' +
      previous.n + ". " + escapeHtml(previous.ar) + "</strong></span>" +
      '<span class="len-check' + (isLessonVisited(previous.n) ? " done" : "") + '">' +
      (isLessonVisited(previous.n) ? "✓" : "") + "</span></a>";
  } else {
    html +=
      '<a class="len-btn prev" href="' + homeHref() + '">' +
      '<span class="len-arrow" aria-hidden="true">→</span>' +
      '<span class="len-text"><small>البداية</small><strong>🏠 الرئيسية</strong></span>' +
      '<span class="len-check"></span></a>';
  }

  html += '<div class="len-divider" aria-hidden="true"></div>';

  if (next && next.file) {
    html +=
      '<a class="len-btn next" href="' + lessonHref(next.file) + '">' +
      '<span class="len-check' + (isLessonVisited(next.n) ? " done" : "") + '">' +
      (isLessonVisited(next.n) ? "✓" : "") + "</span>" +
      '<span class="len-text"><small>الدرس التالي</small><strong>' +
      next.n + ". " + escapeHtml(next.ar) + "</strong></span>" +
      '<span class="len-arrow" aria-hidden="true">←</span></a>';
  } else if (next) {
    html +=
      '<a class="len-btn next disabled" href="' + lessonStationHref(next.n) + '">' +
      '<span class="len-check"></span>' +
      '<span class="len-text"><small>قريبًا</small><strong>Lesson ' +
      next.n + " — " + escapeHtml(next.en) + "</strong></span>" +
      '<span class="len-arrow" aria-hidden="true">🔒</span></a>';
  } else {
    html +=
      '<a class="len-btn next" href="' + roadmapHref() + '">' +
      '<span class="len-check"></span>' +
      '<span class="len-text"><small>أنهيت الدرس</small><strong>🏁 اذهب للخريطة</strong></span>' +
      '<span class="len-arrow" aria-hidden="true">←</span></a>';
  }

  html += "</nav>";
  host.innerHTML = html;
}

/* ---------- التهيئة ---------- */

export function initRoadmap() {
  renderRoadmap();
  renderContinue();
  renderJourney();
}