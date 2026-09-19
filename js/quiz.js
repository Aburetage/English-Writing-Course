/* ===== English Writing Course — Quiz Engine ===== */

import { $, $$ } from "./utils.js";

import {
  getQuizAnswer,
  saveQuizAnswer,
  resetQuizProgress
} from "./storage.js";

function getQuizId(quiz) {
  if (!quiz) return "unknown-quiz";

  return quiz.dataset.quiz || quiz.id || "unknown-quiz";
}

function updateScore(quiz) {
  if (!quiz) return;

  const questions = $$(".q[data-correct]", quiz);
  const done = questions.filter((q) => q.classList.contains("done")).length;

  const scoreElement = $(".score", quiz);

  if (scoreElement) {
    scoreElement.textContent = `— النتيجة: ${done} / ${questions.length}`;
  }
}

function showFeedback(question, type, message) {
  const feedback = $(".fb", question);

  if (!feedback) return;

  feedback.hidden = false;
  feedback.className = `fb ${type}`;
  feedback.textContent = message;
}

function restoreQuestion(question, quizId) {
  const qid = question.dataset.qid;

  if (!qid) return;

  const saved = getQuizAnswer(quizId, qid);

  if (!saved) return;

  const buttons = $$(".opts button", question);

  const matchedButton = buttons.find((button) => button.dataset.v === saved.v);

  if (!matchedButton) return;

  if (saved.correct) {
    question.classList.add("done");
    matchedButton.classList.add("ok");

    showFeedback(
      question,
      "good",
      `✅ إجابة صحيحة! ${question.dataset.fb || ""}`.trim()
    );
  } else {
    matchedButton.classList.add("no");

    showFeedback(
      question,
      "bad",
      "هذه لم تكن الإجابة الدقيقة في محاولتك السابقة — حاول مجددًا."
    );
  }
}

function bindQuestion(question) {
  const quiz = question.closest(".quiz");
  const quizId = getQuizId(quiz);
  const qid = question.dataset.qid;

  restoreQuestion(question, quizId);

  const buttons = $$(".opts button", question);

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      if (question.classList.contains("done")) return;

      const value = button.dataset.v;
      const correctValue = question.dataset.correct;
      const isCorrect = value === correctValue;

      buttons.forEach((btn) => {
        btn.classList.remove("ok", "no");
      });

      if (isCorrect) {
        button.classList.add("ok");
        question.classList.add("done");

        showFeedback(
          question,
          "good",
          `✅ إجابة صحيحة! ${question.dataset.fb || ""}`.trim()
        );

        if (quizId && qid) {
          saveQuizAnswer(quizId, qid, {
            v: value,
            correct: true
          });
        }

        updateScore(quiz);
      } else {
        button.classList.add("no");

        showFeedback(
          question,
          "bad",
          "ليست الإجابة الدقيقة — حاول مجددًا!"
        );

        if (quizId && qid) {
          saveQuizAnswer(quizId, qid, {
            v: value,
            correct: false
          });
        }

        setTimeout(() => {
          button.classList.remove("no");
        }, 600);
      }
    });
  });
}

function bindResetButtons() {
  $$(".reset").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();

      const quiz =
        button.dataset.target && document.getElementById(button.dataset.target)
          ? document.getElementById(button.dataset.target)
          : button.closest(".quiz");

      if (!quiz) return;

      const quizId = getQuizId(quiz);

      $$(".q", quiz).forEach((question) => {
        question.classList.remove("done");

        $$(".opts button", question).forEach((btn) => {
          btn.classList.remove("ok", "no");
        });

        const feedback = $(".fb", question);

        if (feedback) {
          feedback.hidden = true;
          feedback.className = "fb";
          feedback.textContent = "";
        }
      });

      resetQuizProgress(quizId);
      updateScore(quiz);
    });
  });
}

function bindRevealButtons() {
  $$(".rv:not(.reset)").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();

      const answer = button.nextElementSibling;

      if (!answer || !answer.classList.contains("ans")) return;

      answer.hidden = !answer.hidden;

      button.textContent = answer.hidden
        ? "👁 أظهر الإجابة"
        : "🙈 أخفِ الإجابة";
    });
  });
}

export function initQuizzes() {
  $$(".q[data-correct]").forEach(bindQuestion);

  $$(".quiz").forEach(updateScore);

  bindResetButtons();
  bindRevealButtons();
}