const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const yearTarget = document.querySelector("[data-current-year]");
const modifiedTarget = document.querySelector("[data-last-modified]");

const toggleNavigation = () => {
  if (!nav) return;

  const expanded = nav.dataset.expanded === "true";
  nav.dataset.expanded = expanded ? "false" : "true";

  if (navToggle) {
    navToggle.setAttribute("aria-expanded", String(!expanded));
  }
};

if (nav && navToggle) {
  navToggle.addEventListener("click", toggleNavigation);
}

const closeNavigationOnLargeScreens = () => {
  if (!nav || !navToggle) return;

  const mediaQuery = window.matchMedia("(min-width: 768px)");

  const handleChange = () => {
    if (mediaQuery.matches) {
      nav.dataset.expanded = "true";
      navToggle.setAttribute("aria-expanded", "true");
    } else {
      nav.dataset.expanded = "false";
      navToggle.setAttribute("aria-expanded", "false");
    }
  };

  if (typeof mediaQuery.addEventListener === "function") {
    mediaQuery.addEventListener("change", handleChange);
  } else if (typeof mediaQuery.addListener === "function") {
    mediaQuery.addListener(handleChange);
  }
  handleChange();
};

closeNavigationOnLargeScreens();

const highlightActiveNav = () => {
  if (!nav) return;
  const currentPath = window.location.pathname.replace(/\/+$/, "");

  nav.querySelectorAll("a[data-nav-link]").forEach((link) => {
    const linkPath = new URL(link.href).pathname.replace(/\/+$/, "");
    if (linkPath === currentPath) {
      link.classList.add("active");
    }
  });
};

highlightActiveNav();

if (yearTarget) {
  yearTarget.textContent = new Date().getFullYear();
}

if (modifiedTarget) {
  modifiedTarget.textContent = document.lastModified;
}

document.addEventListener("click", (event) => {
  if (!nav || !navToggle) return;
  const isClickInsideNav = nav.contains(event.target);
  const isToggle = navToggle.contains(event.target);
  const navExpanded = nav.dataset.expanded === "true";

  if (!isClickInsideNav && !isToggle && navExpanded && window.innerWidth < 768) {
    nav.dataset.expanded = "false";
    navToggle.setAttribute("aria-expanded", "false");
  }
});
