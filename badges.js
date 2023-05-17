document.addEventListener("DOMContentLoaded", () => {
  let currentBadges = JSON.parse(localStorage.getItem("badges"));

  if (!currentBadges) return;
  else {
    const badgeImages = Array.from(document.querySelectorAll(".badge"));

    badgeImages.forEach((badge) => {
      const { set } = badge.dataset;
      if (currentBadges.includes(set)) {
        let newSrc = `assets/images/animals/${set}.jpg`;
        badge.src = newSrc;
      }
    });
  }
});
