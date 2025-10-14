import { loadJSON } from "./data.js";

const eventsGrid = document.querySelector("[data-events-grid]");
const submitForm = document.querySelector("[data-submit-form]");
const submitStatus = document.querySelector("[data-submit-status]");

const createElement = (tag, options = {}) => {
  const el = document.createElement(tag);
  if (options.className) el.className = options.className;
  if (options.text) el.textContent = options.text;
  if (options.html) el.innerHTML = options.html;
  if (options.attrs) {
    Object.entries(options.attrs).forEach(([key, value]) => {
      el.setAttribute(key, value);
    });
  }
  return el;
};

const formatDate = (date, time) => {
  const snapshot = new Date(`${date}T${time}`);
  if (Number.isNaN(snapshot.valueOf())) {
    return `${date} · ${time}`;
  }
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  }).format(snapshot);
};

const renderEvents = (events) => {
  if (!eventsGrid) return;
  eventsGrid.textContent = "";

  events
    .slice()
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .forEach((event) => {
      const card = createElement("article", { className: "card event-card" });
      const title = createElement("strong", { text: event.title });
      const when = createElement("time", {
        className: "date-highlight",
        text: formatDate(event.date, event.time),
        attrs: { datetime: `${event.date}T${event.time}` }
      });
      const location = createElement("span", {
        text: `Location: ${event.location}`
      });
      const summary = createElement("span", { text: event.summary });

      const status = createElement("span", {
        className: `status-tag ${
          event.status === "registration-open" ? "live" : ""
        }`,
        text:
          event.status === "registration-open"
            ? "Registration open"
            : event.status === "spots-limited"
            ? "Spots limited"
            : "Waitlist"
      });

      card.append(title, status, when, location, summary);

      if (event.link) {
        const cta = createElement("a", {
          className: "cta secondary",
          text: "View details",
          attrs: { href: event.link }
        });
        card.append(cta);
      }

      eventsGrid.append(card);
    });
};

const initEvents = async () => {
  try {
    const events = await loadJSON("data/events.json");
    renderEvents(events);
  } catch (error) {
    if (eventsGrid) {
      eventsGrid.innerHTML =
        '<article class="card"><h3>Calendar offline</h3><p>We are refreshing the schedule. Try again shortly.</p></article>';
    }
    console.error(error);
  }
};

const handleSubmit = (event) => {
  if (!submitForm || !submitStatus) return;
  event.preventDefault();

  const formData = new FormData(submitForm);
  const name = formData.get("name") || "Rider";
  submitStatus.textContent = `Thanks, ${name}! We will review your build within 24 hours and send an upload link to your preferred channel.`;
  submitStatus.classList.add("status-tag", "live");
  submitForm.reset();
};

if (submitForm) {
  submitForm.addEventListener("submit", handleSubmit);
}

initEvents();
