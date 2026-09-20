/* ===== English Writing Course — Autosave ===== */

import { $, $$, debounce } from "./utils.js";
import { getWriting, saveWriting } from "./storage.js";

export function initAutosave() {
  const textareas = $$("textarea[data-save]");
  textareas.forEach((textarea) => bindTextarea(textarea));
}

function bindTextarea(textarea) {
  const key = textarea.dataset.save;
  if (!key) return;

  const meta = textarea.nextElementSibling;
  const wordCountElement = meta ? $(".wc", meta) : null;
  const saveElement = meta ? $(".sav", meta) : null;

  const savedValue = getWriting(key);
  if (savedValue) {
    textarea.value = savedValue;
  }

  updateWordCount(textarea, wordCountElement);

  const persist = debounce(() => {
    saveWriting(key, textarea.value);
    flashSaved(saveElement);
  }, 450);

  textarea.addEventListener("input", () => {
    updateWordCount(textarea, wordCountElement);
    persist();
  });

  textarea.addEventListener("change", () => {
    saveWriting(key, textarea.value);
    flashSaved(saveElement);
  });

  textarea.addEventListener("paste", () => {
    window.setTimeout(() => {
      updateWordCount(textarea, wordCountElement);
      persist();
    }, 0);
  });
}

function updateWordCount(textarea, element) {
  if (!element) return;

  const words = textarea.value
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  element.textContent = words.length ? `${words.length} كلمة` : "";
}

function flashSaved(element) {
  if (!element) return;

  element.textContent = "✓ تم الحفظ";
  element.classList.add("on");

  window.setTimeout(() => {
    element.classList.remove("on");
  }, 1500);
}