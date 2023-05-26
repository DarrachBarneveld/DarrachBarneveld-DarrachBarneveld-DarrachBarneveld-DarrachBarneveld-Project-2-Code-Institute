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
const counter = document.getElementById("counter");
const scoreCount = document.getElementById("score-count");
const questionNumber = document.getElementById("question-count");

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

// GLOBAL VARIABLES
let category;
let correctAnswers = 0;
let mode;
let userAnswers = [];

// Switch Statement for dynamic page rendering based of url query string
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

// Initialise game with selected difficulty
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
  counter.classList.remove("hidden");
  nextQuestion(results, 0);
}

// Next question load with delay timer for UX score feedback
async function nextQuestion(questions, index) {
  if (questions.length <= index) {
    await delayTimer(500);
    endQuiz();
    return;
  }

  updateCounter(index + 1);

  const { question, correct_answer, incorrect_answers } = questions[index];

  questionText.innerHTML = question;

  const answers = [...incorrect_answers, correct_answer];

  const shuffledAnswers = shuffleArray(answers);

  const html = `  <button class="btn">${shuffledAnswers[0]}</button>
        <button class="btn">${shuffledAnswers[1]}</button>
        <button class="btn">${shuffledAnswers[2]}</button>
        <button class="btn">${shuffledAnswers[3]}</button>`;

  answersText.innerHTML = html;

  const answerBtns = Array.from(answersText.querySelectorAll(".btn"));

  answerBtns.forEach((button) => {
    button.addEventListener("click", (e) =>
      checkAnswer(e, correct_answer, index, questions)
    );
  });
}

// Function to check answer and update styling based on result
async function checkAnswer(e, correctAnswer, index, questions) {
  const userAnswer = e.target.innerHTML;

  // This is needed to convert the html coded answer string into a readable string for comparison
  const tempElement = document.createElement("div");
  tempElement.innerHTML = correctAnswer;

  // Updating User Answer Array for end results
  const answerData = {
    question: questions[index].question,
    answer: userAnswer,
    correctAnswer: tempElement.innerHTML,
    score: userAnswer === tempElement.innerHTML,
  };
  userAnswers.push(answerData);

  if (userAnswer === correctAnswer) {
    e.target.style.background = "green";
    correctAnswers++;

    await delayTimer(500);
    nextQuestion(questions, index + 1);
  } else {
    e.target.style.background = "red";
    const answersBtns = answersText.querySelectorAll(".btn");
    const answerElement = findAnswerText(tempElement.innerHTML, answersBtns);
    answerElement.style.background = "green";

    await delayTimer(750);
    nextQuestion(questions, index + 1);
  }
}

// Update Score
function updateCounter(index) {
  scoreCount.innerHTML = `<i
  style="color: green"
  class="fa-solid fa-circle-check"
></i
> ${correctAnswers}`;
  questionNumber.innerHTML = ` <i
  class="fa-solid fa-question"
  style="color: blue"
></i
> ${index}`;
}

// Find the correct answer in the markup so styling can be added to the correct answer on an incorrect guess
function findAnswerText(text, arrayAns) {
  for (let i = 0; i < arrayAns.length; i++) {
    if (arrayAns[i].innerHTML === text) {
      return arrayAns[i];
    }
  }
  return null;
}

// Shuffle answers array for random distribution in html
function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));

    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  return array;
}

// Delay timer for UX feedback
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

// End game and give user score and rewards
function endQuiz() {
  let reward;

  gameArea.innerHTML = "";

  let heading = document.createElement("h1");
  heading.classList.add("headline");
  gameArea.appendChild(heading);

  if (correctAnswers < 7) {
    heading.textContent = "Better Luck Next Time!";
  }
  if (correctAnswers >= 7) {
    heading.textContent = "You Won!";
    const medalImage = document.createElement("img");
    medalImage.classList.add("badge");

    if (mode === "easy") {
      medalImage.src = "assets/images/bronze.png";
      medalImage.alt = "Picture of a bronze medal";
      reward = { category: url[1], easy: true };
      storeMedals(reward);
    }
    if (mode === "medium") {
      medalImage.src = "assets/images/silver.png";
      medalImage.alt = "Picture of a silver medal";
      reward = { category: url[1], medium: true };
      storeMedals(reward);
    }
    if (mode === "hard") {
      medalImage.src = "assets/images/gold.png";
      medalImage.alt = "Picture of a gold medal";
      reward = { category: url[1], hard: true };
      storeMedals(reward);
    }
    gameArea.appendChild(medalImage);
  }

  let answerList = document.createElement("ol");
  answerList.classList.add("game-answer-list");
  gameArea.appendChild(answerList);

  userAnswers.forEach((object) => {
    let answerElement = document.createElement("li");
    answerElement.classList.add("game-answer");

    if (!object.score) {
      answerElement.style.borderColor = "red";
      answerElement.style.backgroundColor = "rgba(255, 54, 54, 0.3)";
    }

    const html = `
            <h3 class="game-over-question">${object.question}</h3>
            <div class="game-answer-container">
            ${
              object.score
                ? `<div class="answers">
            <p>
              <strong>You:</strong> ${object.answer}
            </p>
          </div>
          <span
            ><i
              style="font-size: 2rem; color: green"
              class="fa-solid fa-circle-check"
            ></i
          ></span>`
                : ` <div class="answers">
                <p>
                  <strong>You:</strong> ${object.answer}
                </p>
                <p><strong>Correct:</strong> ${object.correctAnswer}</p>
              </div>
              <span
                ><i
                  style="font-size: 2rem; color: red"
                  class="fa-solid fa-circle-xmark"
                ></i
              ></span>`
            }
              
            </div>
    `;
    answerElement.innerHTML = html;
    answerList.appendChild(answerElement);
  });

  btnContainer.classList.remove("hidden");
}

// Store user medals
function storeMedals(reward) {
  let currentMedals = JSON.parse(localStorage.getItem("medals"));

  if (!currentMedals) {
    localStorage.setItem("medals", JSON.stringify([reward]));
  } else {
    const newMedalArray = mergeMedals(reward, currentMedals);

    localStorage.setItem("medals", JSON.stringify(newMedalArray));
  }
}

// Function for updating user medal array with current won reward
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
