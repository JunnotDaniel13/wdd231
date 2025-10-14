import { loadJSON } from "./data.js";

const buildsContainer = document.querySelector("[data-builds-list]");
const filterSelect = document.querySelector("[data-builds-filter]");
const countTarget = document.querySelector("[data-builds-count]");

let buildsCache = [];

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

const createPartsTable = (parts) => {
  const table = createElement("table", { className: "responsive-table" });

  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  ["Component", "Category", "Skill level", "Notes"].forEach((heading) => {
    const th = document.createElement("th");
    th.textContent = heading;
    headerRow.append(th);
  });
  thead.append(headerRow);

  const tbody = document.createElement("tbody");
  parts.forEach((part) => {
    const row = document.createElement("tr");
    const cells = [
      part.name,
      part.category,
      part.skillLevel,
      part.notes
    ];

    cells.forEach((value) => {
      const td = document.createElement("td");
      td.textContent = value;
      row.append(td);
    });

    tbody.append(row);
  });

  table.append(thead, tbody);
  return table;
};

const createTimeline = (steps) => {
  const list = createElement("ol", { className: "timeline" });

  steps.forEach((step) => {
    const item = document.createElement("li");

    const heading = createElement("strong", {
      html: `${step.title} <span aria-hidden="true">(${step.duration})</span>`
    });
    const details = createElement("p", { text: step.details });

    item.append(heading, details);
    list.append(item);
  });

  return list;
};

const renderBuildCard = (build) => {
  const article = createElement("article", {
    className: "card blur-card",
    attrs: { id: build.id }
  });

  const header = createElement("div", { className: "section-header" });
  const title = createElement("h3", { text: build.name });
  const diffTag = createElement("span", {
    className: "tag",
    text: build.difficulty,
    attrs: { "data-tag": "status" }
  });

  header.append(title, diffTag);

  const tagline = createElement("p", {
    className: "announcement",
    text: build.tagline
  });

  const description = createElement("p", { text: build.description });

  const metaRow = createElement("div", { className: "route-meta" });
  [
    `Range: ${build.range}`,
    `Top speed: ${build.topSpeed}`,
    `Build time: ${build.buildTime}`
  ].forEach((meta) => {
    const pill = createElement("span", { text: meta });
    metaRow.append(pill);
  });

  const highlightsTitle = createElement("h4", { text: "Upgrade highlights" });
  const highlightsList = createElement("ul", { className: "skills-list" });
  build.highlights.forEach((highlight) => {
    const li = createElement("li", { text: highlight });
    highlightsList.append(li);
  });

  const partsTitle = createElement("h4", { text: "Parts & add-ons" });
  const partsTable = createPartsTable(build.parts);

  const timelineTitle = createElement("h4", { text: "Build timeline" });
  const timeline = createTimeline(build.timeline);

  article.append(
    header,
    tagline,
    description,
    metaRow,
    highlightsTitle,
    highlightsList,
    partsTitle,
    partsTable,
    timelineTitle,
    timeline
  );

  return article;
};

const renderBuilds = (builds) => {
  if (!buildsContainer) return;
  buildsContainer.textContent = "";

  builds.forEach((build) => {
    const card = renderBuildCard(build);
    buildsContainer.append(card);
  });
};

const updateCount = (total, shown) => {
  if (!countTarget) return;

  if (shown === total) {
    countTarget.textContent = `Showing all ${total} build recipes.`;
  } else {
    countTarget.textContent = `Showing ${shown} of ${total} builds.`;
  }
};

const applyFilter = () => {
  const selected = filterSelect?.value ?? "all";

  const filtered =
    selected === "all"
      ? buildsCache
      : buildsCache.filter((build) => build.difficulty === selected);

  renderBuilds(filtered);
  updateCount(buildsCache.length, filtered.length);
};

const initBuilds = async () => {
  try {
    buildsCache = await loadJSON("data/builds.json");
    applyFilter();
  } catch (error) {
    if (buildsContainer) {
      buildsContainer.innerHTML = `<article class="card"><h3>We could not load builds.</h3><p>${error.message}</p></article>`;
    }
  }
};

if (filterSelect) {
  filterSelect.addEventListener("change", applyFilter);
}

initBuilds();
