const navBtn = document.getElementById("nav-button");
const nav = document.getElementById("nav-bar");

if (navBtn && nav) {
  navBtn.addEventListener("click", () => {
    const showing = nav.classList.toggle("show");
    navBtn.classList.toggle("show", showing);
    navBtn.setAttribute("aria-expanded", String(showing));
  });
}
