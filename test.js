const gameForm = document.getElementById("game-form");
const submitButton = document.getElementById("submitButton");

const url = window.location.search.split("?");

let category;

switch (url[1]) {
  case "history":
    category = "23";
    break;
  case "geography":
    dayName = "22";
    break;
  case "film":
    dayName = "11";
    break;
  case "science":
    dayName = "17";
    break;
  case "animals":
    dayName = "27";
    break;
  case "general":
    dayName = "9";
    break;
  case "sport":
    dayName = "21";
    break;
  default:
    dayName = "general";
    break;
}

console.log(category);

async function fetchQuestions() {
  const difficulty = document.querySelector(
    'input[name="difficulty"]:checked'
  ).value;

  try {
    const APIUrl = `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=multiple`;
    const result = await fetch(`${APIUrl}`);

    const data = await result.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  }
}

async function startGame(e) {
  e.preventDefault();
  const questions = await fetchQuestions();
  gameForm.remove();
}

gameForm.addEventListener("submit", startGame);
