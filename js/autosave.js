/* ===== English Writing Course — Autosave ===== */

import { $$, debounce } from "./utils.js";

import {
  saveWriting,
  getWriting
} from "./storage.js";

function countWords(value) {
  const text = String(value || "").trim();

  if (!text) return 0;

  return text.split(/\s+/).length;
}

function updateWordCount(textarea, wordCountElement) {
  if (!wordCountElement) return;

  const count = countWords(textarea.value);

  wordCountElement.textContent = count
    ? `🔢 ${count} كلمة`
    : "";
}

function showSavedIndicator(saveElement) {
  if (!saveElement) return;

  saveElement.textContent = "✓ تم الحفظ";
  saveElement.classList.add("on");

  setTimeout(() => {
    saveElement.classList.remove("on");
  }, 1500);
}

function bindTextarea(textarea) {
  const key = textarea.dataset.save;

  if (!key) return;

  const meta = textarea.nextElementSibling;

  const wordCountElement = meta
    ? meta.querySelector(".wc")
    : null;

  const saveElement = meta
    ? meta.querySelector(".sav")
    : null;

  const savedValue = getWriting(key);

  if (savedValue) {
    textarea.value = savedValue;
  }

  updateWordCount(textarea, wordCountElement);

  const persist = debounce(() => {
    saveWriting(key, textarea.value);
    showSavedIndicator(saveElement);
  }, 400);

  textarea.addEventListener("input", () => {
    updateWordCount(textarea, wordCountElement);
    persist();
  });
}

export function initAutosave() {
  $$("textarea[data-save]").forEach(bindTextarea);
}