/* ===== English Writing Course — Roadmap & Journey ===== */

import {
  $,
  $$,
  lessonHref,
  homeHref,
  roadmapHref,
  lessonStationHref,
  getCurrentLessonNumber
} from "./utils.js";

import {
  markLessonVisited,
  isLessonVisited
} from "./storage.js";

import {
  COURSE,
  getLessonByNumber,
  getAvailableLessons,
  getLatestAvailableLesson
} from "./data/course.js";

export function markCurrentLessonVisited() {
  const current = getCurrentLessonNumber();

  if (current > 0) {
    markLessonVisited(current);
  }
}

export function renderRoadmap() {
  const host = $("#roadmapStations");

  if (!host) return;

  if (!COURSE.lessons.length) {
    host.innerHTML = `
      <div class="alert">
        <span class="aic" aria-hidden="true">⚠️</span>
        <p>لا يمكن رسم خريطة الرحلة: تأكد من تحميل سجل الكورس.</p>
      </div>
    `;

    return;
  }

  const phases = [];

  COURSE.lessons.forEach((lesson) => {
    const existingPhase = phases.find((phase) => phase.name === lesson.phase);

    if (existingPhase) {
      existingPhase.lessons.push(lesson);
    } else {
      phases.push({
        name: lesson.phase,
        lessons: [lesson]
      });
    }
  });

  const latest = getLatestAvailableLesson();
  const latestNumber = latest ? latest.n : -1;

  host.innerHTML = phases
    .map((phase, phaseIndex) => {
      const stations = phase.lessons
        .map((lesson) => {
          const visited = isLessonVisited(lesson.n);

          const status = lesson.file
            ? `
                <a class="lbtn" href="${lessonHref(lesson.file)}">🚀 افتح الدرس</a>
                ${visited ? `<span class="lok">✓ تمت زيارته</span>` : ""}
                ${lesson.n === latestNumber ? `<span class="lnew">جديد</span>` : ""}
              `
            : `<span class="llock">🔒 قريبًا</span>`;

          const meta = [
            lesson.ex ? `${lesson.ex} تمرينًا` : "",
            lesson.min ? `~${lesson.min} دقيقة` : ""
          ]
            .filter(Boolean)
            .join(" · ");

          return `
            <div class="lstation" id="ls${lesson.n}" data-n="${lesson.n}">
              <span class="lt">
                <span class="e" lang="en">Lesson ${lesson.n} — ${lesson.en}</span>
              </span>
              <span class="la">الدرس ${lesson.n} — ${lesson.ar}</span>
              <small>${lesson.desc || ""}${meta ? ` · ${meta}` : ""}</small>
              <div class="lstatus">${status}</div>
            </div>
          `;
        })
        .join("");

      return `
        <div class="phase">
          <span class="phead">المرحلة ${phaseIndex + 1} — ${phase.name}</span>
        </div>
        <div class="lstations">
          ${stations}
        </div>
      `;
    })
    .join("");
}

export function renderContinue() {
  const available = getAvailableLessons();

  const visited = available.filter((lesson) => isLessonVisited(lesson.n));

  const stats = $("#courseStats");

  if (stats) {
    stats.textContent = `✅ زرت ${visited.length} من ${available.length} درسًا متاحًا`;
  }

  const button = $("#continueBtn");

  if (!button) return;

  const target = visited.length
    ? visited[visited.length - 1]
    : available[0];

  if (!target?.file) {
    button.href = roadmapHref();
    button.innerHTML = "🗺 افتح خريطة الرحلة";
    return;
  }

  button.href = lessonHref(target.file);
  button.innerHTML = `▶ واصل من حيث توقفت — Lesson ${target.n} — ${target.en}`;
}

export function renderJourney() {
  const host = $("#journeyBox");

  if (!host) return;

  const current = getCurrentLessonNumber();

  if (!current) return;

  const previous = getLessonByNumber(current - 1);
  const next = getLessonByNumber(current + 1);

  let html = "";

  if (previous?.file) {
    html += `<a class="jbtn" href="${lessonHref(previous.file)}">→ الدرس السابق: Lesson ${previous.n}</a>`;
  } else {
    html += `<a class="jbtn" href="${homeHref()}">🏠 الرئيسية</a>`;
  }

  html += `<a class="jbtn" href="${roadmapHref()}">🗺 خريطة الرحلة</a>`;

  if (next?.file) {
    html += `<a class="jbtn" href="${lessonHref(next.file)}">الدرس التالي: Lesson ${next.n} — ${next.en} ←</a>`;
  } else if (next) {
    html += `<a class="jbtn lock" href="${lessonStationHref(next.n)}">الدرس التالي: Lesson ${next.n} 🔒</a>`;
  } else {
    html += `<a class="jbtn" href="${roadmapHref()}">🏁 أنهيت كل المتاح حاليًا</a>`;
  }

  host.innerHTML = html;
}

export function renderLessonEndNav() {
  const existing = $(".lesson-end-nav");

  if (existing) {
    existing.remove();
  }

  const current = getCurrentLessonNumber();

  if (!current) return;

  const previous = getLessonByNumber(current - 1);
  const next = getLessonByNumber(current + 1);

  const previousVisited = previous ? isLessonVisited(previous.n) : false;
  const nextVisited = next ? isLessonVisited(next.n) : false;

  let html = `<div class="lesson-end-nav">`;

  if (previous?.file) {
    html += `
      <a class="len-btn prev" href="${lessonHref(previous.file)}">
        <span class="len-arrow" aria-hidden="true">→</span>
        <span class="len-text">
          <small>الدرس السابق</small>
          <strong>Lesson ${previous.n} — ${previous.en}</strong>
        </span>
        <span class="len-check ${previousVisited ? "done" : ""}" aria-hidden="true">
          ${previousVisited ? "✓" : ""}
        </span>
      </a>
    `;
  } else {
    html += `
      <a class="len-btn prev" href="${homeHref()}">
        <span class="len-arrow" aria-hidden="true">→</span>
        <span class="len-text">
          <small>الرجوع إلى</small>
          <strong>الرئيسية</strong>
        </span>
        <span class="len-check" aria-hidden="true"></span>
      </a>
    `;
  }

  html += `<div class="len-divider" aria-hidden="true"></div>`;

  if (next?.file) {
    html += `
      <a class="len-btn next" href="${lessonHref(next.file)}">
        <span class="len-check ${nextVisited ? "done" : ""}" aria-hidden="true">
          ${nextVisited ? "✓" : ""}
        </span>
        <span class="len-text">
          <small>الدرس التالي</small>
          <strong>Lesson ${next.n} — ${next.en}</strong>
        </span>
        <span class="len-arrow" aria-hidden="true">←</span>
      </a>
    `;
  } else if (next) {
    html += `
      <a class="len-btn next disabled" aria-disabled="true">
        <span class="len-check" aria-hidden="true"></span>
        <span class="len-text">
          <small>قريبًا</small>
          <strong>Lesson ${next.n} — ${next.en}</strong>
        </span>
        <span class="len-arrow" aria-hidden="true">🔒</span>
      </a>
    `;
  } else {
    html += `
      <a class="len-btn next" href="${roadmapHref()}">
        <span class="len-check" aria-hidden="true"></span>
        <span class="len-text">
          <small>أنهيت الدرس</small>
          <strong>🏁 اذهب للخريطة</strong>
        </span>
        <span class="len-arrow" aria-hidden="true">←</span>
      </a>
    `;
  }

  html += `</div>`;

  const footer = $("footer");

  if (footer) {
    footer.insertAdjacentHTML("beforebegin", html);
  } else {
    const main = $("main");

    if (main) {
      main.insertAdjacentHTML("beforeend", html);
    }
  }
}

export function updateTocProgress() {
  $$('#toc a[href*="lesson"]').forEach((link) => {
    const href = link.getAttribute("href") || "";
    const match = href.match(/lesson(\d+)\.html/);

    if (!match) return;

    const lessonNumber = parseInt(match[1], 10);

    if (!lessonNumber) return;

    let check = link.querySelector(".toc-check");

    if (!check) {
      check = document.createElement("span");
      check.className = "toc-check";
      check.setAttribute("aria-hidden", "true");
      check.textContent = "✓";
      link.appendChild(check);
    }

    const visited = isLessonVisited(lessonNumber);

    check.classList.toggle("done", visited);
    link.classList.toggle("done", visited);
  });
}

export function renderAllRoadmapUI() {
  renderRoadmap();
  renderContinue();
  renderJourney();
  renderLessonEndNav();
  updateTocProgress();
}