import { loadJSON } from "./data.js";

const statsTargets = {
  builds: document.querySelector("[data-stat-builds]"),
  routes: document.querySelector("[data-stat-routes]"),
  members: document.querySelector("[data-stat-members]")
};

const featuredTargets = {
  container: document.querySelector("[data-featured-build]"),
  name: document.querySelector("[data-build-name]"),
  description: document.querySelector("[data-build-description]"),
  highlights: document.querySelector("[data-build-highlights]"),
  difficulty: document.querySelector("[data-build-difficulty]"),
  time: document.querySelector("[data-build-time]"),
  range: document.querySelector("[data-build-range]")
};

const eventsList = document.querySelector("[data-events-list]");

const formatDate = (dateString) => {
  const date = new Date(dateString);
  if (Number.isNaN(date.valueOf())) return "TBA";

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(date);
};

const getStatusLabel = (status) => {
  switch (status) {
    case "registration-open":
      return "Open slots";
    case "spots-limited":
      return "Limited spots";
    case "waitlist":
      return "Waitlist";
    default:
      return "Details";
  }
};

const renderStats = (builds, routes) => {
  if (statsTargets.builds) {
    statsTargets.builds.textContent = builds.length.toString().padStart(2, "0");
  }
  if (statsTargets.routes) {
    statsTargets.routes.textContent = routes.length.toString().padStart(2, "0");
  }
  if (statsTargets.members) {
    const baseMembers = 180;
    const projection = baseMembers + builds.length * 4 + routes.length * 6;
    statsTargets.members.textContent = projection.toString();
  }
};

const renderFeaturedBuild = (build) => {
  if (!build || !featuredTargets.container) return;

  featuredTargets.container.dataset.id = build.id;

  if (featuredTargets.name) featuredTargets.name.textContent = build.name;
  if (featuredTargets.description) {
    featuredTargets.description.textContent = build.description;
  }
  if (featuredTargets.difficulty) {
    featuredTargets.difficulty.textContent = build.difficulty;
  }
  if (featuredTargets.time) {
    featuredTargets.time.textContent = build.buildTime;
  }
  if (featuredTargets.range) {
    featuredTargets.range.textContent = build.range;
  }

  if (featuredTargets.highlights) {
    featuredTargets.highlights.innerHTML = "";
    build.highlights.slice(0, 4).forEach((highlight) => {
      const li = document.createElement("li");
      li.textContent = highlight;
      featuredTargets.highlights.append(li);
    });
  }

  const cta = featuredTargets.container.querySelector(".cta");
  if (cta) {
    cta.setAttribute("href", `projects.html#${build.id}`);
  }
};

const renderEvents = (events) => {
  if (!eventsList) return;
  eventsList.textContent = "";

  const nextEvents = events
    .slice()
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  nextEvents.forEach((event) => {
    const item = document.createElement("li");
    item.className = "event-card";

    const title = document.createElement("strong");
    title.textContent = event.title;

    const timeRow = document.createElement("time");
    timeRow.setAttribute("datetime", `${event.date}T${event.time}`);
    timeRow.innerHTML = `🗓 <span>${formatDate(event.date)} · ${event.time}</span>`;

    const location = document.createElement("span");
    location.innerHTML = `📍 ${event.location}`;

    const summary = document.createElement("span");
    summary.textContent = event.summary;

    const status = document.createElement("span");
    status.className = "tag";
    status.dataset.tag = "status";
    if (event.status === "registration-open") {
      status.dataset.state = "live";
    }
    status.textContent = getStatusLabel(event.status);

    item.append(title, status, timeRow, location, summary);

    if (event.link) {
      const link = document.createElement("a");
      link.className = "cta secondary";
      link.href = event.link;
      link.textContent = "Details";
      item.append(link);
    }

    eventsList.append(item);
  });
};

const initHome = async () => {
  try {
    const [builds, routes, events] = await Promise.all([
      loadJSON("data/builds.json"),
      loadJSON("data/routes.json"),
      loadJSON("data/events.json")
    ]);

    renderStats(builds, routes);
    renderFeaturedBuild(builds[0]);
    renderEvents(events);
  } catch (error) {
    if (eventsList) {
      eventsList.innerHTML = `<li class="event-card"><strong>We're updating the calendar.</strong><span>${error.message}</span></li>`;
    }
  }
};

initHome();
