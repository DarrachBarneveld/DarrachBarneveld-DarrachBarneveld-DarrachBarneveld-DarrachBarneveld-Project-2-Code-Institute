const gameForm = document.getElementById("game-form");
const submitButton = document.getElementById("submitButton");

async function fetchQuestions(e) {
  e.preventDefault();
  const difficulty = document.querySelector(
    'input[name="difficulty"]:checked'
  ).value;

  try {
    const APIUrl = `https://opentdb.com/api.php?amount=10&category=22&difficulty=${difficulty}&type=multiple`;
    const result = await fetch(`${APIUrl}`);

    const data = await result.json();

    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

gameForm.addEventListener("submit", fetchQuestions);
