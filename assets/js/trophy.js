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
    if (easy && medium && hard) {
      const element = document.getElementById(category);
      element.classList.add("badge-box");
      element.classList.remove("none");
      const html = ` <h2 class="category-title">${category.toUpperCase()}</h2>
      <div class="icon">
        <img src="assets/images/${category}.png" />
      </div>
      <div class="medal-container">
        <img class="badge" src="assets/images/bronze.png" />
        <img class="badge" src="assets/images/silver.png" />
        <img class="badge" src="assets/images/gold.png" />
      </div>`;

      element.innerHTML = html;
    }
  }
}
