import {
  QueenslandQuestions,
  NorthernTerritoryQuestions,
  NSWQuestions,
} from "./questions.js";

const question = document.getElementById("question");
const questionContainer = document.querySelector(".question-container");
const quizBtn = document.getElementById("quizbtn");
const answers = document.getElementById("answers");

let correctAnswers = 0;
let chosenQuestions = [];

const url = window.location.pathname.split(".");

if (url[0] === "/northernterritory") {
  chosenQuestions = NorthernTerritoryQuestions;
}
if (url[0] === "/nsw") {
  chosenQuestions = NSWQuestions;
} else {
  chosenQuestions = QueenslandQuestions;
}

document.addEventListener("DOMContentLoaded", () => {
  let currentBadges = JSON.parse(localStorage.getItem("badges"));
  const images = document
    .querySelector(".badge-container")
    .querySelectorAll("img");

  if (!currentBadges) return;
  else {
    changeImageSrc(currentBadges, images);
  }
});

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

function endQuiz() {
  let html;

  if (correctAnswers === 0) {
    html = `<h3>Better luck next time</h3>`;
    questionContainer.innerHTML = html;

    return;
  }
  if (correctAnswers === 1) {
    html = `
      <h3>You Won!</h3>
      <div class="badge-container">
      <img
        class="badge"
        src="assets/images/${chosenQuestions[0].badge}.jpg"
        alt="picture of a ${chosenQuestions[0].badge}"
      />
    </div>`;
  }
  if (correctAnswers === 2) {
    html = `
      <h3>You Won!</h3>
      <div class="badge-container">
      <img
        class="badge"
        src="assets/images/${chosenQuestions[0].badge}.jpg"
        alt="picture of a ${chosenQuestions[0].badge}"
      />
      <img
        class="badge"
        src="assets/images/${chosenQuestions[1].badge}.jpg"
        alt="picture of a ${chosenQuestions[1].badge}"
      />
    </div>`;
  }
  if (correctAnswers === 3) {
    html = `
      <h3>You Won!</h3>
      <div class="badge-container">
      <img
        class="badge"
        src="assets/images/${chosenQuestions[0].badge}.jpg"
        alt="picture of a ${chosenQuestions[0].badge}"
      />
      <img
        class="badge"
        src="assets/images/${chosenQuestions[1].badge}.jpg"
        alt="picture of a ${chosenQuestions[1].badge}"
      />
      <img
        class="badge"
        src="assets/images/${chosenQuestions[2].badge}.jpg"
        alt="picture of a ${chosenQuestions[2].badge}"
      />
    </div>`;
  }

  questionContainer.innerHTML = html;

  const badgesArr = chosenQuestions.map((question) => question.badge);

  storeBadges(badgesArr.slice(0, correctAnswers));
  correctAnswers = 0;
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

function storeBadges(badges) {
  let currentBadges = JSON.parse(localStorage.getItem("badges"));

  if (!currentBadges) {
    localStorage.setItem("badges", JSON.stringify(badges));
  } else {
    const uniqueArr = checkTwoArraysForMatch(badges, currentBadges);
    localStorage.setItem("badges", JSON.stringify(uniqueArr));
  }
}

function checkTwoArraysForMatch(arr1, arr2) {
  const totalArr = [...arr1, ...arr2];
  const uniqueArr = [];
  totalArr.forEach(function (str) {
    if (!uniqueArr.includes(str)) {
      uniqueArr.push(str);
    }
  });

  return uniqueArr;
}

function changeImageSrc(array, images) {
  images.forEach(function (image) {
    let { set } = image.dataset;
    if (array.includes(set)) {
      let newSrc = `assets/images/${set}.jpg`;
      image.src = newSrc;
    }
  });
}

//   EVENT LISTENERS
quizBtn.addEventListener("click", startQuiz);
