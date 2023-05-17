document.addEventListener("DOMContentLoaded", () => {
  let currentBadges = JSON.parse(localStorage.getItem("badges"));

  if (!currentBadges) return;
  else {
    const badgeElement = document.getElementById("total-badges");
    const totalbadges = currentBadges.length;

    badgeElement.textContent = `${totalbadges}/21`;
  }
});
