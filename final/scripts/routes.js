import { loadJSON } from "./data.js";

const routesContainer = document.querySelector("[data-routes-list]");
const filterSelect = document.querySelector("[data-routes-filter]");
const routesCount = document.querySelector("[data-routes-count]");
const archivesContainer = document.querySelector("[data-archives-list]");

let routesCache = [];

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

const renderTips = (tips) => {
  const list = createElement("ul", { className: "meta-list" });
  tips.forEach((tip) => {
    const item = document.createElement("li");
    item.innerHTML = `💡 <span>${tip}</span>`;
    list.append(item);
  });
  return list;
};

const createRouteCard = (route) => {
  const article = createElement("article", {
    className: "card route-card",
    attrs: { id: route.id }
  });

  const header = createElement("div", { className: "section-header" });
  const title = createElement("h3", { text: route.name });
  const badge = createElement("span", {
    className: "tag",
    text: route.difficulty,
    attrs: { "data-tag": "status", "data-state": "live" }
  });
  header.append(title, badge);

  const description = createElement("p", { text: route.description });

  const meta = createElement("div", { className: "route-meta" });
  const metrics = [
    `Distance · ${route.distanceKm} km`,
    `Climb · ${route.elevationGainM} m`,
    `Meetup · ${route.meetup}`
  ];
  metrics.forEach((metric) => {
    const span = createElement("span", { text: metric });
    meta.append(span);
  });

  route.surface.forEach((surface) => {
    const span = createElement("span", { text: `Surface · ${surface}` });
    meta.append(span);
  });

  const tips = renderTips(route.tips);

  const mapWrapper = createElement("div", { className: "map-frame" });
  const iframe = document.createElement("iframe");
  iframe.src = route.map;
  iframe.loading = "lazy";
  iframe.title = `${route.name} route map`;
  iframe.allowFullscreen = true;
  iframe.setAttribute("allowfullscreen", "");
  iframe.referrerPolicy = "no-referrer-when-downgrade";
  iframe.setAttribute("referrerpolicy", "no-referrer-when-downgrade");
  mapWrapper.append(iframe);

  const mapCredit = createElement("p", {
    className: "map-credit",
    html: 'Map data © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap contributors</a>'
  });

  if (route.mapLink) {
    const viewLink = createElement("a", {
      text: "View larger map",
      attrs: {
        href: route.mapLink,
        target: "_blank",
        rel: "noopener"
      }
    });
    mapCredit.append(" · ", viewLink);
  }

  const cta = createElement("a", {
    className: "cta",
    text: "Join next ride",
    attrs: { href: `index.html#contact` }
  });

  article.append(header, description, meta, tips, mapWrapper, mapCredit, cta);
  return article;
};

const renderRoutes = (routes) => {
  if (!routesContainer) return;
  routesContainer.textContent = "";

  routes.forEach((route) => {
    const card = createRouteCard(route);
    routesContainer.append(card);
  });
};

const updateCount = (total, shown) => {
  if (!routesCount) return;

  if (total === 0) {
    routesCount.textContent = "No curated routes published yet.";
    return;
  }

  if (shown === total) {
    routesCount.textContent = `Showing all ${total} curated rides.`;
  } else if (shown === 0) {
    routesCount.textContent = "No routes match that surface filter. Try another terrain.";
  } else {
    routesCount.textContent = `Showing ${shown} of ${total} routes.`;
  }
};

const applyFilter = () => {
  const selected = filterSelect?.value ?? "all";

  const filtered =
    selected === "all"
      ? routesCache
      : routesCache.filter((route) =>
          route.surface.some((surface) => surface.toLowerCase() === selected.toLowerCase())
        );

  renderRoutes(filtered);
  updateCount(routesCache.length, filtered.length);
};

const renderArchives = (routes) => {
  if (!archivesContainer) return;
  archivesContainer.textContent = "";

  const archiveData = routes.map((route, index) => ({
    title: `${route.name} — ${2024 - index}`,
    riders: 18 + index * 6,
    download: "#",
    notes: `Shared by crew leader during ${route.meetup.split("—")[0].trim()} rideout. GPX and photo set available on the Discord channel.`,
    stats: `${route.distanceKm} km · ${route.elevationGainM} m climb`
  }));

  archiveData.forEach((entry) => {
    const card = createElement("article", { className: "card resource-card" });
    const title = createElement("strong", { text: entry.title });
    const stats = createElement("span", { text: entry.stats });
    const riders = createElement("span", { text: `${entry.riders} riders logged` });
    const notes = createElement("span", { text: entry.notes });
    const link = createElement("a", {
      className: "cta secondary",
      text: "Request files",
      attrs: { href: "index.html#contact" }
    });

    card.append(title, stats, riders, notes, link);
    archivesContainer.append(card);
  });
};

const initRoutes = async () => {
  try {
    routesCache = await loadJSON("data/routes.json");
    applyFilter();
    renderArchives(routesCache);
  } catch (error) {
    if (routesContainer) {
      routesContainer.innerHTML = `<article class="card"><h3>We could not load routes.</h3><p>${error.message}</p></article>`;
    }
    if (routesCount) {
      routesCount.textContent = "Route data temporarily unavailable.";
    }
  }
};

if (filterSelect) {
  filterSelect.addEventListener("change", applyFilter);
}

initRoutes();
