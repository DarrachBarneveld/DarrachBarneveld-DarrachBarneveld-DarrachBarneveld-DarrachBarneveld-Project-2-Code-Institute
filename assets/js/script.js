document.addEventListener("DOMContentLoaded", () => {
  let currentBadges = JSON.parse(localStorage.getItem("medals"));

  if (!currentBadges) return;
  else {
    const badgeElement = document.getElementById("total-badges");
    const totalbadges = currentBadges.length;

    badgeElement.textContent = `${totalbadges}/21`;
  }
});

document.addEventListener("DOMContentLoaded", () => {
  let currentMedals = JSON.parse(localStorage.getItem("medals"));
  addMedalStyling(currentMedals);
});

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
