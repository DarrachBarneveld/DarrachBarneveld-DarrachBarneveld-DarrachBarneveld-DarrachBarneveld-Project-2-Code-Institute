const gameForm = document.getElementById("game-form");
const submitButton = document.getElementById("submitButton");
const questionText = document.getElementById("question");
const answersText = document.getElementById("answers");

const url = window.location.search.split("?");

let category;
let correctAnswers = 0;

switch (url[1]) {
  case "history":
    category = "23";
    break;
  case "geography":
    category = "22";
    break;
  case "film":
    category = "11";
    break;
  case "science":
    category = "17";
    break;
  case "animals":
    category = "27";
    break;
  case "general":
    category = "9";
    break;
  case "sports":
    category = "21";
    break;
  default:
    category = "general";
    break;
}

async function fetchQuestions() {
  const difficulty = document.querySelector(
    'input[name="difficulty"]:checked'
  ).value;

  try {
    const APIUrl = `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=multiple`;
    const result = await fetch(`${APIUrl}`);

    const data = await result.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

async function startGame(e) {
  e.preventDefault();
  const { results } = await fetchQuestions();

  nextQuestion(results, 0);

  gameForm.remove();
}

async function nextQuestion(questions, index) {
  if (questions.length <= index) {
    await delayTimer(500);
    console.log("end quiz");
    return;
  }

  const { question, correct_answer, incorrect_answers } = questions[index];

  questionText.innerHTML = question;

  const answers = [...incorrect_answers, correct_answer];

  const html = `  <button class="btn">${answers[0]}</button>
        <button class="btn">${answers[1]}</button>
        <button class="btn">${answers[2]}</button>
        <button class="btn">${answers[3]}</button>`;

  answersText.innerHTML = html;

  const answerBtns = Array.from(answersText.querySelectorAll(".btn"));

  answerBtns.forEach((button) => {
    button.addEventListener("click", (e) =>
      checkAnswer(e, correct_answer, index, questions)
    );
  });
}

async function checkAnswer(e, answer, index, questions) {
  const userAnswer = e.target.innerHTML;

  if (userAnswer === answer) {
    e.target.style.background = "green";
    correctAnswers++;

    await delayTimer(500);
    nextQuestion(questions, index + 1);
  } else {
    e.target.style.background = "red";
    await delayTimer(500);
    nextQuestion(questions, index + 1);
  }
}

function delayTimer(delay) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, delay);
  });
}

gameForm.addEventListener("submit", startGame);
