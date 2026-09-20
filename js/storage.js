/* ===== English Writing Course — Storage ===== */

const STORAGE_KEY = "ewc:progress:v2";

const LEGACY_KEYS = [
  "ewc-progress",
  "ewc_progress",
  "writing_answers",
  "quiz_answers",
  "course_progress"
];

const memoryStore = {};

function hasLocalStorage() {
  try {
    const testKey = "__ewc_test__";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

function readRaw() {
  if (hasLocalStorage()) {
    return window.localStorage.getItem(STORAGE_KEY);
  }
  return memoryStore[STORAGE_KEY] || null;
}

function writeRaw(value) {
  if (hasLocalStorage()) {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
      return;
    } catch {
      // fall through to memory
    }
  }
  memoryStore[STORAGE_KEY] = value;
}

function createState() {
  return {
    writing: {},
    quiz: {},
    visited: {},
    completed: {},
    updatedAt: new Date().toISOString()
  };
}

function normalizeState(input) {
  const state = createState();

  if (!input || typeof input !== "object") return state;

  if (input.writing && typeof input.writing === "object") {
    state.writing = input.writing;
  }

  if (input.quiz && typeof input.quiz === "object") {
    state.quiz = input.quiz;
  }

  if (input.visited && typeof input.visited === "object") {
    state.visited = input.visited;
  }

  if (input.completed && typeof input.completed === "object") {
    state.completed = input.completed;
  }

  if (typeof input.updatedAt === "string") {
    state.updatedAt = input.updatedAt;
  }

  return state;
}

export function getProgress() {
  const raw = readRaw();
  if (!raw) return createState();

  try {
    return normalizeState(JSON.parse(raw));
  } catch {
    return createState();
  }
}

export function saveProgress(state) {
  const normalized = normalizeState(state);
  normalized.updatedAt = new Date().toISOString();
  writeRaw(JSON.stringify(normalized));
}

export function saveWriting(key, value) {
  if (!key) return;

  const state = getProgress();
  state.writing[key] = String(value ?? "");
  saveProgress(state);
}

export function getWriting(key) {
  if (!key) return "";
  const state = getProgress();
  return state.writing?.[key] || "";
}

export function saveQuizAnswer(quizId, qid, payload) {
  if (!quizId || !qid) return;

  const state = getProgress();
  const compositeKey = `${quizId}:${qid}`;

  state.quiz=compositeKey;

  state.quiz[compositeKey] = {
    ...(payload || {}),
    updatedAt: new Date().toISOString()
  };

  saveProgress(state);
}

export function getQuizAnswer(quizId, qid) {
  if (!quizId || !qid) return null;

  const state = getProgress();
  const compositeKey = `${quizId}:${qid}`;
  return state.quiz?.[compositeKey] || null;
}

export function resetQuizProgress(quizId) {
  if (!quizId) return;

  const state = getProgress();
  const prefix = `${quizId}:`;

  Object.keys(state.quiz || {}).forEach((key) => {
    if (key.startsWith(prefix)) {
      delete state.quiz[key];
    }
  });

  saveProgress(state);
}

export function markLessonVisited(lessonNumber) {
  const n = Number(lessonNumber);
  if (!Number.isFinite(n) || n <= 0) return;

  const state = getProgress();
  state.visited[n] = new Date().toISOString();
  saveProgress(state);
}

export function isLessonVisited(lessonNumber) {
  const n = Number(lessonNumber);
  if (!Number.isFinite(n) || n <= 0) return false;

  const state = getProgress();
  return Boolean(state.visited?.[n]);
}

export function markLessonCompleted(lessonNumber) {
  const n = Number(lessonNumber);
  if (!Number.isFinite(n) || n <= 0) return;

  const state = getProgress();
  state.completed[n] = new Date().toISOString();
  saveProgress(state);
}

export function isLessonCompleted(lessonNumber) {
  const n = Number(lessonNumber);
  if (!Number.isFinite(n) || n <= 0) return false;

  const state = getProgress();
  return Boolean(state.completed?.[n]);
}

export function resetAllProgress() {
  if (hasLocalStorage()) {
    [STORAGE_KEY, ...LEGACY_KEYS].forEach((key) => {
      try {
        window.localStorage.removeItem(key);
      } catch {
        // ignore
      }
    });
  }

  delete memoryStore[STORAGE_KEY];
  LEGACY_KEYS.forEach((key) => delete memoryStore[key]);
}