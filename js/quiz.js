/* ===== English Writing Course — Quizzes ===== */

import { $, $$, toast } from "./utils.js";
import {
  getQuizAnswer,
  saveQuizAnswer,
  resetQuizProgress
} from "./storage.js";

export function initQuizzes() {
  const quizzes = $$(".quiz");

  quizzes.forEach((quiz, index) => {
    bindQuiz(quiz, index);
  });

  bindResetButtons();
}

export function initRevealButtons() {
  const buttons = $$(".rv");

  buttons.forEach((button) => {
    if (button.classList.contains("reset")) return;

    button.addEventListener("click", (event) => {
      event.stopPropagation();

      const answer = button.nextElementSibling;
      if (!answer || !answer.classList.contains("ans")) return;

      if (!button.dataset.originalLabel) {
        button.dataset.originalLabel = button.textContent.trim();
      }

      answer.hidden = !answer.hidden;

      button.textContent = answer.hidden
        ? button.dataset.originalLabel
        : "🙈 أخفِ الإجابة";
    });
  });
}

function getQuizId(quiz, index) {
  return quiz.dataset.quiz || quiz.id || `auto-quiz-${index + 1}`;
}

function bindQuiz(quiz, index) {
  const quizId = getQuizId(quiz, index);

  if (!quiz.dataset.quiz && !quiz.id) {
    quiz.dataset.quiz = quizId;
  }

  const questions = $$(".q", quiz);

  questions.forEach((question) => {
    bindQuestion(question, quizId);
  });

  updateScore(quiz, questions);
}

function bindQuestion(question, quizId) {
  const qid = question.dataset.qid;
  if (!qid) return;

  const buttons = $$(".opts button", question);
  const correctValue = question.dataset.correct;

  const saved = quizId ? getQuizAnswer(quizId, qid) : null;

  if (saved) {
    const matchedButton = buttons.find(
      (button) => button.dataset.v === saved.v
    );

    if (matchedButton) {
      if (saved.correct) {
        matchedButton.classList.add("ok");
        question.classList.add("done");
        showFeedback(
          question,
          "good",
          saved.fb || "إجابة صحيحة — أحسنت!"
        );
      } else {
        showFeedback(
          question,
          "bad",
          saved.fb || "ليست الإجابة الدقيقة — حاول مجددًا!"
        );
      }
    }
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      if (question.classList.contains("done")) return;

      const value = button.dataset.v;
      const isCorrect = value === correctValue;

      const feedbackMessage =
        button.dataset.fb ||
        question.dataset.fb ||
        (isCorrect
          ? "إجابة صحيحة — أحسنت!"
          : "ليست الإجابة الدقيقة — حاول مجددًا!");

      buttons.forEach((other) => {
        other.classList.remove("ok", "no");
      });

      if (isCorrect) {
        button.classList.add("ok");
        question.classList.add("done");
        showFeedback(question, "good", feedbackMessage);
      } else {
        button.classList.add("no");
        showFeedback(question, "bad", feedbackMessage);

        window.setTimeout(() => {
          button.classList.remove("no");
        }, 650);
      }

      if (quizId) {
        saveQuizAnswer(quizId, qid, {
          v: value,
          correct: isCorrect,
          fb: feedbackMessage
        });
      }

      const quiz = question.closest(".quiz");
      if (quiz) {
        updateScore(quiz, $$(".q", quiz));
      }
    });
  });
}

function showFeedback(question, type, message) {
  const feedback = $(".fb", question);
  if (!feedback) return;

  feedback.hidden = false;
  feedback.className = `fb ${type}`;
  feedback.textContent = message;
}

function updateScore(quiz, questions) {
  if (!quiz) return;

  const scoreElement = $(".score", quiz);
  if (!scoreElement) return;

  const done = questions.filter((question) =>
    question.classList.contains("done")
  ).length;

  scoreElement.textContent = `— النتيجة: ${done} / ${questions.length}`;
}

function bindResetButtons() {
  const buttons = $$(".reset");

  buttons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();

      const targetId = button.dataset.target;
      const quiz = targetId
        ? document.getElementById(targetId)
        : button.closest(".quiz");

      if (!quiz || !quiz.classList.contains("quiz")) return;

      const quizId = quiz.dataset.quiz || quiz.id;
      const questions = $$(".q", quiz);

      questions.forEach((question) => {
        question.classList.remove("done");

        const feedback = $(".fb", question);
        if (feedback) {
          feedback.hidden = true;
          feedback.textContent = "";
          feedback.className = "fb";
        }

        $$(".opts button", question).forEach((option) => {
          option.classList.remove("ok", "no");
        });
      });

      if (quizId) {
        resetQuizProgress(quizId);
      }

      updateScore(quiz, questions);
      toast("تم إعادة تعيين هذا الاختبار", "info");
    });
  });
}