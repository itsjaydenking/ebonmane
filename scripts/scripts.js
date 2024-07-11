// JavaScript for menu toggle
document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("menu-toggle");
  const navList = document.querySelector("nav ul");

  menuToggle.addEventListener("click", function () {
    navList.classList.toggle("show");
  });
});

document.addEventListener("DOMContentLoaded", (event) => {
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  const body = document.body;
  const header = document.querySelector("header");
  const footer = document.querySelector("footer");

  darkModeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    header.classList.toggle("dark-mode");
    footer.classList.toggle("dark-mode");
  });
});
