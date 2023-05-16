import {
  QueenslandQuestions,
  NorthernTerritoryQuestions,
} from "./questions.js";

const question = document.getElementById("question");
const questionContainer = document.querySelector(".question-container");
const quizBtn = document.getElementById("quizbtn");
const answers = document.getElementById("answers");

function startQuiz() {
  quizBtn.remove();

  nextQuestion(0);
}

async function nextQuestion(i) {
  if (chosenQuestions.length <= i) {
    await delayTimer(500);
    endQuiz();
    return;
  }

  question.textContent = chosenQuestions[i].question;

  const currentAnswers = chosenQuestions[i].answers;

  const html = `  <button class="btn">${currentAnswers[0]}</button>
    <button class="btn">${currentAnswers[1]}</button>
    <button class="btn">${currentAnswers[2]}</button>
    <button class="btn">${currentAnswers[3]}</button>`;
  answers.innerHTML = html;

  const answerBtns = Array.from(answers.querySelectorAll(".btn"));

  answerBtns.forEach((button) => {
    button.addEventListener("click", (e) => checkAnswer(e, i));
  });
}

async function checkAnswer(e, i) {
  const answer = e.target.textContent;

  if (answer === chosenQuestions[i].correct) {
    e.target.style.background = "green";
    correctAnswers++;

    await delayTimer(500);
    nextQuestion(i + 1);
  } else {
    e.target.style.background = "red";
    await delayTimer(500);
    nextQuestion(i + 1);
  }
}

// HELPER FUNCTIONS

function delayTimer(delay) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, delay);
  });
}

quizBtn.addEventListener("click", startQuiz);
