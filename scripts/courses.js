const courses = [
  {
    code: "CSE 111",
    title: "Programming with Functions",
    subject: "CSE",
    credits: 2,
    completed: true,
    grade: "A-",
    term: "25T3",
    completedOn: "2025-06-25",
  },
  {
    code: "CSE 210",
    title: "Programming with Classes",
    subject: "CSE",
    credits: 2,
    completed: true,
    grade: "A-",
    term: "25T2",
    completedOn: "2025-04-23",
  },
  {
    code: "CSEPC 110",
    title: "Introduction to Programming (EQUIV)",
    subject: "CSE",
    credits: 2,
    completed: true,
    grade: "A",
    term: "25T1",
    completedOn: "2025-02-26",
  },
  {
    code: "WDD 130",
    title: "Web Fundamentals",
    subject: "WDD",
    credits: 2,
    completed: true,
    grade: "A",
    term: "25T2",
    completedOn: "2025-04-23",
  },
  {
    code: "WDD 131",
    title: "Dynamic Web Fundamentals",
    subject: "WDD",
    credits: 2,
    completed: true,
    grade: "A",
    term: "25T3",
    completedOn: "2025-06-25",
  },
  {
    code: "WDD 231",
    title: "Web Frontend Development I",
    subject: "WDD",
    credits: 2,
    completed: false,
    grade: null,
    term: "25T5",
    completedOn: null,
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
