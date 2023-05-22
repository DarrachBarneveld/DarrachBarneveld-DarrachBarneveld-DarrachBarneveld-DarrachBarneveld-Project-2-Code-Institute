const formArea = document.getElementById("form-area");
const gameArea = document.getElementById("game-area");
const gameForm = document.getElementById("game-form");
const submitButton = document.getElementById("submitButton");
const questionText = document.getElementById("question");
const answersText = document.getElementById("answers");
const btnContainer = document.querySelector(".btn-container");
const replayBtn = document.getElementById("replay");
const iconContainer = document.querySelector(".icon-container");
const fieldset = document.getElementsByTagName("fieldset").item(0);
const loader = document.getElementById("loader");

const logoImage = document.getElementById("icon");
const headline = document.getElementById("headline");

const url = window.location.search.split("?");

document.addEventListener("DOMContentLoaded", () => {
  let currentMedals = JSON.parse(localStorage.getItem("medals"));

  if (!currentMedals) return;
  else {
    currentMedals.forEach((object) => {
      const { category, easy, medium, hard } = object;

      if (category === url[1]) {
        if (easy) {
          const element = document.getElementById("bronze");
          element.src = "assets/images/bronze.png";
          element.alt = "Picture of a bronze medal";
        }
        if (medium) {
          const element = document.getElementById("silver");
          element.src = "assets/images/silver.png";
          element.alt = "Picture of a silver medal";
        }
        if (hard) {
          const element = document.getElementById("gold");
          element.src = "assets/images/gold.png";
          element.alt = "Picture of a gold medal";
        }
      } else return;
    });
  }
});

let category;
let correctAnswers = 0;
let mode;

switch (url[1]) {
  case "music":
    category = "12";
    logoImage.src = "assets/images/music.png";
    headline.textContent = "Earn All Musical Medals!";
    iconContainer.style.borderColor = "var(--pink)";
    fieldset.style.borderColor = "var(--pink)";
    break;
  case "history":
    category = "23";
    logoImage.src = "assets/images/history.png";
    headline.textContent = "Earn All Historical Medals!";
    iconContainer.style.borderColor = "var(--purple)";
    fieldset.style.borderColor = "var(--purple)";
    break;
  case "geography":
    category = "22";
    logoImage.src = "assets/images/geography.png";
    headline.textContent = "Earn All Geographical Medals!";
    iconContainer.style.borderColor = "var(--orange)";
    fieldset.style.borderColor = "var(--orange)";
    break;
  case "film":
    category = "11";
    logoImage.src = "assets/images/film.png";
    headline.textContent = "Earn All Film Medals!";
    iconContainer.style.borderColor = "var(--blue)";
    fieldset.style.borderColor = "var(--blue)";

    break;
  case "science":
    category = "17";
    logoImage.src = "assets/images/science.png";
    headline.textContent = "Earn All Science Medals!";
    iconContainer.style.borderColor = "var(--sky)";
    fieldset.style.borderColor = "var(--sky)";

    break;
  case "animals":
    category = "27";
    logoImage.src = "assets/images/animals.png";
    headline.textContent = "Earn All Animal Medals!";
    iconContainer.style.borderColor = "var(--yellow)";
    fieldset.style.borderColor = "var(--yellow)";

    break;
  case "general":
    category = "9";
    logoImage.src = "assets/images/general.png";
    headline.textContent = "Earn All General Knowledge Medals!";
    iconContainer.style.borderColor = "var(--red)";
    fieldset.style.borderColor = "var(--red)";

    break;
  case "sports":
    category = "21";
    logoImage.src = "assets/images/sports.png";
    headline.textContent = "Earn All Sports Medals!";
    iconContainer.style.borderColor = "var(--green)";
    fieldset.style.borderColor = "var(--green)";

    break;
  default:
    category = "geography";
    logoImage.src = "assets/images/geography.jpg";
    headline.textContent = "Earn All Geographical Medals!";
    iconContainer.style.borderColor = "var(--orange)";
    fieldset.style.borderColor = "var(--orange)";
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
  loader.classList.remove("hidden");

  formArea.remove();

  const { results } = await fetchQuestions(difficulty);
  loader.classList.add("hidden");
  questionText.classList.remove("hidden");
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
    const disableBtns = Array.from(document.getElementsByTagName("button"));

    disableBtns.forEach((btn) => {
      btn.disabled = true;
    });
    setTimeout(() => {
      disableBtns.forEach((btn) => {
        btn.disabled = false;
      });
      resolve();
    }, delay);
  });
}

function endQuiz() {
  let html;
  let reward;

  if (correctAnswers < 8) {
    html = `    <h2>Better luck next time!</h2>
    `;
  }

  if (correctAnswers >= 8 && mode === "easy") {
    html = `
    <h3>You Won!</h3>
    <img
      class="badge"
      src="assets/images/bronze.png"
      alt="Picture of a bronze medal"
    />
  `;
    reward = { category: url[1], easy: true };
    storeBadges(reward);
  }

  if (correctAnswers >= 8 && mode === "medium") {
    html = `
    <h3>You Won!</h3>
    <img
      class="badge"
      src="assets/images/silver.png"
      alt="Picture of a silver medal"
    />
`;
    reward = { category: url[1], medium: true };
    storeBadges(reward);
  }

  if (correctAnswers >= 8 && mode === "hard") {
    html = `
    <h3>You Won!</h3>
    <img
      class="badge"
      src="assets/images/gold.png"
      alt="Picture of a gold medal"
    />
  `;
    reward = { category: url[1], hard: true };
    storeBadges(reward);
  }

  gameArea.innerHTML = html;
  btnContainer.classList.remove("hidden");
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

function replayGame() {
  location.reload();
}

gameForm.addEventListener("submit", startGame);
replayBtn.addEventListener("click", replayGame);
