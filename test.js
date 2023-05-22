const formArea = document.getElementById("form-area");
const gameArea = document.getElementById("game-area");
const gameForm = document.getElementById("game-form");
const submitButton = document.getElementById("submitButton");
const questionText = document.getElementById("question");
const answersText = document.getElementById("answers");

const logoImage = document.getElementById("icon");
const headline = document.getElementById("headline");

const url = window.location.search.split("?");

let category;
let correctAnswers = 0;
let mode;

switch (url[1]) {
  case "vic":
    category = "23";
    logoImage.src = "/assets/images/history.png";
    headline.textContent = "Earn All Historical Medals!";
    break;
  case "nsw":
    category = "22";
    logoImage.src = "/assets/images/geography.png";
    headline.textContent = "Earn All Geographical Medals!";

    break;
  case "wa":
    category = "11";
    logoImage.src = "/assets/images/film.png";
    headline.textContent = "Earn All Film Medals!";

    break;
  case "tas":
    category = "17";
    logoImage.src = "/assets/images/science.png";
    headline.textContent = "Earn All Science Medals!";

    break;
  case "sa":
    category = "27";
    logoImage.src = "/assets/images/animal.png";
    headline.textContent = "Earn All Animal Medals!";

    break;
  case "nt":
    category = "9";
    logoImage.src = "/assets/images/general.png";
    headline.textContent = "Earn All General Knowledge Medals!";

    break;
  case "ql":
    category = "21";
    logoImage.src = "/assets/images/sports.png";
    headline.textContent = "Earn All Sports Medals!";

    break;
  default:
    category = "nsw";
    logoImage.src = "/assets/images/geography.jpg";
    headline.textContent = "Earn All Geographical Medals!";
    break;
}

async function fetchQuestions(difficulty) {
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
  const difficulty = document.querySelector(
    'input[name="difficulty"]:checked'
  ).value;
  mode = difficulty;

  formArea.remove();

  const { results } = await fetchQuestions(difficulty);
  nextQuestion(results, 0);
}

async function nextQuestion(questions, index) {
  if (questions.length <= index) {
    await delayTimer(500);
    endQuiz();
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

function endQuiz() {
  let html;
  let reward;

  if (correctAnswers >= 1 && mode === "easy") {
    html = `
    <h3>You Won!</h3>
    <img
      class="badge"
      src="assets/images/bronze.png"
      alt="Picture of a bronze medal"
    />
  `;
    reward = { category: url[1], easy: true };
  }

  if (correctAnswers >= 1 && mode === "medium") {
    html = `
    <h3>You Won!</h3>
    <img
      class="badge"
      src="assets/images/silver.png"
      alt="Picture of a silver medal"
    />
`;
    reward = { category: url[1], medium: true };
  }

  if (correctAnswers >= 1 && mode === "hard") {
    html = `
    <h3>You Won!</h3>
    <img
      class="badge"
      src="assets/images/gold.png"
      alt="Picture of a gold medal"
    />
  `;
    reward = { category: url[1], hard: true };
  }

  gameArea.innerHTML = html;

  storeBadges(reward);
}

function storeBadges(reward) {
  let currentMedals = JSON.parse(localStorage.getItem("medals"));

  if (!currentMedals) {
    localStorage.setItem("medals", JSON.stringify([reward]));
  } else {
    const newMedalArray = mergeMedals(reward, currentMedals);

    localStorage.setItem("medals", JSON.stringify(newMedalArray));
  }
}

function mergeMedals(reward, medalArray) {
  {
    const { category, ...props } = reward;

    const matchedCategory = medalArray.find((obj) => obj.category === category);

    if (matchedCategory) {
      Object.assign(matchedCategory, props);
    } else {
      const newObj = { category, ...props };
      medalArray.push(newObj);
    }
  }

  return medalArray;
}

gameForm.addEventListener("submit", startGame);
