// const NSWStars = document.getElementById("nsw-score");
// const VICStars = document.getElementById("vic-score");
// const QLStars = document.getElementById("ql-score");
// const SAStars = document.getElementById("sa-score");
// const WAStars = document.getElementById("wa-score");
// const NTStars = document.getElementById("nt-score");
// const TAZStars = document.getElementById("taz-score");

document.addEventListener("DOMContentLoaded", () => {
  let currentBadges = JSON.parse(localStorage.getItem("badges"));

  if (!currentBadges) return;
  else {
    const badgeElement = document.getElementById("total-badges");
    const totalbadges = currentBadges.length;

    badgeElement.textContent = `${totalbadges}/21`;
  }
});

document.addEventListener("DOMContentLoaded", () => {
  let currentBadges = JSON.parse(localStorage.getItem("badges"));

  const matchesObject = checkStateAnimals(currentBadges);

  addBadgeStyling(matchesObject);
});

// HELPER FUNCTION
function checkStateAnimals(arr) {
  const states = {
    nsw: ["koala", "emu", "funnel-web"],
    vic: ["possum", "wombat", "bandicoot"],
    ql: ["cassowary", "inland-taipan", "crocodile"],
    sa: ["echidna", "platypus", "kangaroo"],
    wa: ["quokka", "sea-lion", "great-white"],
    nt: ["python", "wallaby", "cane-toad"],
    taz: ["huntsman", "taz-devil", "thylacine"],
  };

  var stateMatches = {};

  for (let state in states) {
    let animals = states[state];
    let matches = 0;
    for (let i = 0; i < animals.length; i++) {
      let currentAnimal = animals[i];
      if (arr.includes(currentAnimal)) {
        matches++;
      }
    }

    if (matches > 0) {
      stateMatches[state] = matches;
    }
  }

  return stateMatches;
}

function addBadgeStyling(matchedObject) {
  const objectArray = Object.entries(matchedObject);

  objectArray.forEach((array) => {
    const amount = array[1];

    for (let i = 0; i < amount; i++) {
      const element = document.getElementById(`${array[0]}-score`);
      const child = element.children[i];

      if (i === 0) {
        child.style.color = "var(--bronze)";
      } else if (i == 1) {
        child.style.color = "var(--silver)";
      } else {
        child.style.color = "goldenrod";
      }
    }
  });
}
