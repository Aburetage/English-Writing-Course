/* ===== English Writing Course — Storage ===== */

const PREFIX = "ewc:";
const PROGRESS_KEY = `${PREFIX}progress:v1`;

function defaultProgress() {
  return {
    version: 1,
    lastVisitedLesson: 0,
    lessons: {},
    writing: {},
    quiz: {},
    settings: {}
  };
}

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;

    const parsed = JSON.parse(raw);

    if (!parsed || typeof parsed !== "object") return fallback;

    return parsed;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function getProgress() {
  const state = readJSON(PROGRESS_KEY, defaultProgress());

  return {
    ...defaultProgress(),
    ...state,
    lessons: state.lessons || {},
    writing: state.writing || {},
    quiz: state.quiz || {},
    settings: state.settings || {}
  };
}

export function saveProgress(state) {
  return writeJSON(PROGRESS_KEY, state);
}

export function markLessonVisited(n) {
  if (!n) return;

  const state = getProgress();
  const now = new Date().toISOString();

  state.lessons[n] = state.lessons[n] || {};
  state.lessons[n].visited = true;
  state.lessons[n].lastVisitedAt = now;

  state.lastVisitedLesson = n;
  state.lastActiveAt = now;

  saveProgress(state);
}

export function isLessonVisited(n) {
  const state = getProgress();
  return Boolean(state.lessons?.[n]?.visited);
}

export function getVisitedLessonNumbers() {
  const state = getProgress();

  return Object.entries(state.lessons || {})
    .filter(([, value]) => value?.visited)
    .map(([key]) => parseInt(key, 10))
    .filter(Number.isFinite);
}

export function saveWriting(key, value) {
  if (!key) return;

  const state = getProgress();
  state.writing[key] = value;
  state.updatedAt = new Date().toISOString();

  saveProgress(state);
}

export function getWriting(key) {
  const state = getProgress();
  return state.writing?.[key] || "";
}

export function saveQuizAnswer(quizId, qid, payload) {
  if (!quizId || !qid) return;

  const state = getProgress();
  const compositeKey = `${quizId}:${qid}`;

  state.quiz[compositeKey] = {
    ...payload,
    updatedAt: new Date().toISOString()
  };

  saveProgress(state);
}

export function getQuizAnswer(quizId, qid) {
  const state = getProgress();
  const compositeKey = `${quizId}:${qid}`;

  return state.quiz?.[compositeKey] || null;
}

export function resetQuizProgress(quizId) {
  if (!quizId) return;

  const state = getProgress();

  Object.keys(state.quiz || {}).forEach((key) => {
    if (key.startsWith(`${quizId}:`)) {
      delete state.quiz[key];
    }
  });

  saveProgress(state);
}

/**
 * مسح كل بيانات الموقع الجديدة + بعض البيانات القديمة إن وُجدت.
 */
export function resetAllProgress() {
  const keysToRemove = Object.keys(localStorage).filter((key) => {
    return (
      key.startsWith(PREFIX) ||
      /^l\d+vis$/.test(key) ||
      /^l\d+(ta-|-)/.test(key)
    );
  });

  keysToRemove.forEach((key) => localStorage.removeItem(key));
}