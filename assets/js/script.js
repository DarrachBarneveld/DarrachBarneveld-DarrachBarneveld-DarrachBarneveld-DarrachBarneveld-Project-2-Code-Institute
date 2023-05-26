const categoryAnchors = Array.from(document.querySelectorAll(".category"));
const categoryHeadline = document.getElementById("category-headline");

// Load user medals
document.addEventListener("DOMContentLoaded", () => {
  let currentMedals = JSON.parse(localStorage.getItem("medals"));

  if (!currentMedals) return;
  else {
    const badgeElement = document.getElementById("total-badges");
    const totalbadges = currentMedals.length;

    badgeElement.textContent = `${totalbadges}/21`;
  }
});

// Update score board medals
document.addEventListener("DOMContentLoaded", () => {
  let currentMedals = JSON.parse(localStorage.getItem("medals"));
  if (!currentMedals) return;
  addMedalStyling(currentMedals);
});

// Add styling to home page score board
function addMedalStyling(currentMedals) {
  currentMedals.forEach((object) => {
    const { category, easy, medium, hard } = object;

    if (easy) {
      const element = document.getElementById(`${category}-score`);
      const child = element.children[0];
      child.style.color = "var(--bronze)";
    }
    if (medium) {
      const element = document.getElementById(`${category}-score`);
      const child = element.children[1];
      child.style.color = "var(--silver)";
    }
    if (hard) {
      const element = document.getElementById(`${category}-score`);
      const child = element.children[2];
      child.style.color = "goldenrod";
    }
  });
}

function changeText(e) {
  const { id } = e.target.closest("a");
  categoryHeadline.innerText = id;
}

function removeText(e) {
  categoryHeadline.innerText = "Click a category segment";
}

// Category wheel styling listener functions
categoryAnchors.forEach((anchor) => {
  anchor.addEventListener("mouseover", changeText);
  anchor.addEventListener("focusin", changeText);
  anchor.addEventListener("mouseout", removeText);
});
