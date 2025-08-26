// src/preloader.js
window.addEventListener("load", () => {
  const p = document.getElementById("preloader");
  if (p) p.classList.add("hidden");
});
const btn = document.getElementById("scroll-top");
if (btn) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) btn.classList.add("show");
    else btn.classList.remove("show");
  });
}
