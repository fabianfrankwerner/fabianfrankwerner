const button = document.querySelector(".dropdown-button");
const menu = document.querySelector(".dropdown-menu");

button.addEventListener("click", () => {
  menu.classList.toggle("visible");
});

document.addEventListener("click", (e) => {
  if (!button.contains(e.target) && !menu.contains(e.target)) {
    menu.classList.remove("visible");
  }
});

document.querySelectorAll(".dropdown-item").forEach((item) => {
  item.addEventListener("click", () => {
    button.textContent = item.textContent;
    menu.classList.remove("visible");
  });
});
