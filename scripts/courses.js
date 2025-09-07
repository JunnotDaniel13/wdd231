const courses = [
  {
    code: "WDD 130",
    title: "Web Fundamentals",
    subject: "WDD",
    credits: 2,
    completed: true,
  },
  {
    code: "WDD 231",
    title: "Web Frontend Dev I",
    subject: "WDD",
    credits: 3,
    completed: false,
  },
  {
    code: "CSE 110",
    title: "Intro to Programming",
    subject: "CSE",
    credits: 2,
    completed: true,
  },
];

const listEl = document.getElementById("course-list");
const totalEl = document.getElementById("total-credits");
const filterBtns = document.querySelectorAll(".filters [data-filter]");

function render(list) {
  listEl.innerHTML = "";
  list.forEach((c) => {
    const li = document.createElement("li");
    li.className = `course ${c.completed ? "completed" : ""}`;
    li.innerHTML = `
            <h3>${c.code} — ${c.title}</h3>
            <p>${c.subject} • ${c.credits} credits</p>
        `;
    listEl.appendChild(li);
  });
}

function updateCredits(list) {
  const total = list.reduce((sum, c) => sum + (Number(c.credits) || 0), 0);
  totalEl.textContent = total;
}

function filteredCourses(key) {
  if (key === "all") return courses;
  return courses.filter((c) => c.subject === key);
}

function applyFilter(key, button) {
  const list = filteredCourses(key);
  render(list);
  updateCredits(list);
  filterBtns.forEach((b) => b.classList.toggle("active", b === button));
}

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => applyFilter(btn.dataset.filter, btn));
});

applyFilter("all", document.querySelector('[data-filter="all"]'));
