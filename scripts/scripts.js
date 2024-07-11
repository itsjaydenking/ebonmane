// JavaScript for menu toggle
document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.getElementById("menu-toggle");
    const navList = document.querySelector("nav ul");
  
    menuToggle.addEventListener("click", function () {
      navList.classList.toggle("show");
    });
  });
  