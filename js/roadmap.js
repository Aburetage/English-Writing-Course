/* ===== English Writing Course — Roadmap ===== */

import COURSE from "./data/course.js";
import { $, $$, toast } from "./utils.js";
import {
  markLessonVisited,
  isLessonVisited
} from "./storage.js";

export function initRoadmap() {
  renderStations();
  renderJourney();
}

function currentLessonNumber() {
  const attr = document.body.dataset.lesson;
  if (attr) return Number(attr);

  const match = window.location.pathname.match(/lesson(\d+)\.html/i);
  return match ? Number(match[1]) : 0;
}

function toRelative(file) {
  if (!file) return "#";

  const path = window.location.pathname;

  if (path.includes("/lessons/")) {
    return file.replace(/^lessons\//, "");
  }

  return file;
}

function renderStations() {
  const host = $("#roadmapStations");
  if (!host) return;

  host.innerHTML = "";

  COURSE.forEach((lesson) => {
    const available = Boolean(lesson.file);
    const visited = isLessonVisited(lesson.n);

    const element = available
      ? document.createElement("a")
      : document.createElement("div");

    element.className = "station";
    element.id = `ls${lesson.n}`;

    if (available) {
      element.href = toRelative(lesson.file);
      element.style.textDecoration = "none";
      element.style.color = "inherit";
    } else {
      element.classList.add("locked");
      element.style.cursor = "not-allowed";
      element.addEventListener("click", () => {
        toast("هذا الدرس قريبًا — أكمل الدروس المفتوحة أولًا", "warning");
      });
    }

    if (visited) {
      element.classList.add("visited");
    }

    const dot = document.createElement("div");
    dot.className = "sdot";
    dot.textContent = String(lesson.n);

    const label = document.createElement("div");
    label.className = "slabel";

    const en = document.createElement("span");
    en.className = "e";
    en.lang = "en";
    en.textContent = lesson.en;

    const ar = document.createElement("small");
    ar.textContent = lesson.ar;

    label.append(en, ar);

    if (lesson.desc) {
      const desc = document.createElement("small");
      desc.textContent = lesson.desc;
      label.append(desc);
    }

    element.append(dot, label);
    host.append(element);
  });
}

function renderJourney() {
  const box = $("#journeyBox");
  if (!box) return;

  const current = currentLessonNumber();
  if (!current) return;

  markLessonVisited(current);

  const index = COURSE.findIndex((lesson) => lesson.n === current);
  if (index === -1) return;

  const prev = COURSE[index - 1];
  const next = COURSE[index + 1];

  box.innerHTML = "";

  const nav = document.createElement("nav");
  nav.className = "lesson-end-nav";
  nav.setAttribute("aria-label", "التنقل بين الدروس");

  const prevButton = createEndButton(prev, "prev", "الدرس السابق");
  const divider = document.createElement("div");
  divider.className = "len-divider";
  const nextButton = createEndButton(next, "next", "الدرس التالي");

  nav.append(prevButton, divider, nextButton);
  box.append(nav);
}

function createEndButton(lesson, direction, label) {
  const element = document.createElement("a");
  element.className = `len-btn ${direction}`;

  const available = Boolean(lesson && lesson.file);

  if (!available) {
    element.classList.add("disabled");
    element.href = "#";
    element.setAttribute("aria-disabled", "true");

    element.addEventListener("click", (event) => {
      event.preventDefault();
      toast(
        lesson
          ? "هذا الدرس قريبًا"
          : "لا يوجد درس في هذا الاتجاه",
        "info"
      );
    });
  } else {
    element.href = toRelative(lesson.file);
  }

  const arrow = document.createElement("span");
  arrow.className = "len-arrow";
  arrow.textContent = direction === "prev" ? "→" : "←";

  const text = document.createElement("span");
  text.className = "len-text";

  const small = document.createElement("small");
  small.textContent = label;

  const strong = document.createElement("strong");
  strong.textContent = lesson
    ? `${lesson.n}. ${lesson.ar}`
    : "—";

  text.append(small, strong);

  const check = document.createElement("span");
  const visited = lesson ? isLessonVisited(lesson.n) : false;
  check.className = `len-check${visited ? " done" : ""}`;
  check.textContent = visited ? "✓" : "";

  element.append(arrow, text, check);

  return element;
}