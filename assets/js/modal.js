const modalBtn = document.getElementById("modal-btn");
const modal = document.getElementById("modal");
const closeBtn = document.querySelector(".close");

function showModal() {
  modal.style.display = "block";
}

function closeModal() {
  modal.style.display = "none";
}

closeBtn.addEventListener("click", closeModal);
modalBtn.addEventListener("click", showModal);
