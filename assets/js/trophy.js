// Load intial medals form user storage
document.addEventListener("DOMContentLoaded", () => {
  let currentMedals = JSON.parse(localStorage.getItem("medals"));

  if (!currentMedals) return;
  else {
    completedCategoryCheck(currentMedals);
  }
});

// Unlock trump card when all medals are obtained by checking category objects in storage
function completedCategoryCheck(array) {
  for (const obj of array) {
    const { category, easy, medium, hard } = obj;
    const element = document.getElementById(category);
    const badges = element.querySelectorAll(".badge");

    if (easy) {
      badges[0].src = "assets/images/bronze.png";
      badges[0].alt = "Picture of a bronze medal";
    }
    if (medium) {
      badges[1].src = "assets/images/silver.png";
      badges[1].alt = "Picture of a silver medal";
    }
    if (hard) {
      badges[2].src = "assets/images/gold.png";
      badges[2].alt = "Picture of a gold medal";
    }
    if (easy && medium && hard) {
      element.classList.add("badge-box");
      element.classList.remove("none");
      const html = ` <h2 class="category-title">${category.toUpperCase()}</h2>
      <div class="icon">
        <img src="assets/images/${category}.png" />
      </div>
      <div class="medal-container">
        <img class="badge" src="assets/images/bronze.png" alt="Picture of a bronze medal" />
        <img class="badge" src="assets/images/silver.png" alt="Picture of a silver medal" />
        <img class="badge" src="assets/images/gold.png" alt="Picture of a gold medal"/>
      </div>`;

      element.innerHTML = html;
    }
  }
}
