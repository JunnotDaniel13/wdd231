const footerYearEl = document.getElementById('current-year');
const lastModifiedEl = document.getElementById('last-modified');
const spotlightContainer = document.getElementById('spotlight-container');
const currentTempEl = document.getElementById('current-temp');
const currentDescriptionEl = document.getElementById('current-description');
const weatherIconEl = document.getElementById('weather-icon');
const weatherCaptionEl = document.getElementById('weather-caption');
const forecastListEl = document.getElementById('forecast-list');

const API_KEY = '269473e260630827fd8e291ca904a5bb';
const LATITUDE = -18.8792; // Antananarivo, Madagascar
const LONGITUDE = 47.5079;
const UNITS = 'metric';

document.addEventListener('DOMContentLoaded', () => {
    updateFooterInfo();
    initNavigation();
    loadWeather();
    loadSpotlights();
});

function updateFooterInfo() {
    if (footerYearEl) {
        footerYearEl.textContent = new Date().getFullYear();
    }

    if (lastModifiedEl) {
        lastModifiedEl.textContent = document.lastModified;
    }
}

function initNavigation() {
    const menuButton = document.getElementById('menuButton');
    const navLinks = document.querySelector('.nav-links');

    if (!menuButton || !navLinks) {
        return;
    }

    menuButton.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        menuButton.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            menuButton.classList.remove('open');
        });
    });
}

async function loadWeather() {
    if (!currentTempEl || !forecastListEl) {
        return;
    }

    if (!API_KEY || API_KEY.includes('YOUR_OPENWEATHERMAP_API_KEY')) {
        currentDescriptionEl.textContent = 'Add your OpenWeatherMap API key in scripts/home.js to load live weather data.';
        forecastListEl.innerHTML = '<li>Weather forecast will appear once the API key is configured.</li>';
        return;
    }

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${LATITUDE}&lon=${LONGITUDE}&units=${UNITS}&appid=${API_KEY}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${LATITUDE}&lon=${LONGITUDE}&units=${UNITS}&appid=${API_KEY}`;

    try {
        const [weatherResponse, forecastResponse] = await Promise.all([
            fetch(weatherUrl),
            fetch(forecastUrl)
        ]);

        const weatherData = await parseJsonOrThrow(weatherResponse, 'weather');
        const forecastData = await parseJsonOrThrow(forecastResponse, 'forecast');

        renderCurrentWeather(weatherData);
        renderForecast(forecastData.list);
    } catch (error) {
        console.error('Unable to load weather data:', error);
        const fallbackMessage = error instanceof Error ? error.message : 'Unexpected error while retrieving weather updates.';
        currentDescriptionEl.textContent = fallbackMessage;
        forecastListEl.innerHTML = `<li>Forecast unavailable (${fallbackMessage}).</li>`;
    }
}

function renderCurrentWeather(data) {
    if (!data) {
        return;
    }

    const temperature = Math.round(data.main?.temp ?? 0);
    const description = data.weather?.[0]?.description ?? 'Current conditions';
    const iconCode = data.weather?.[0]?.icon;

    currentTempEl.textContent = temperature.toString();
    currentDescriptionEl.textContent = capitalize(description);

    if (iconCode) {
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        weatherIconEl.src = iconUrl;
        weatherIconEl.alt = description;
        weatherIconEl.hidden = false;
        weatherCaptionEl.textContent = description;
    } else {
        weatherIconEl.hidden = true;
        weatherCaptionEl.textContent = '';
    }
}

function renderForecast(list = []) {
    if (!Array.isArray(list) || list.length === 0) {
        forecastListEl.innerHTML = '<li>No forecast data available.</li>';
        return;
    }

    const dailySummaries = getNextThreeDays(list);

    if (dailySummaries.length === 0) {
        forecastListEl.innerHTML = '<li>No upcoming forecast data available.</li>';
        return;
    }

    const dayFormatter = new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    });

    forecastListEl.innerHTML = '';

    dailySummaries.forEach((entry) => {
        const li = document.createElement('li');
        const date = new Date(entry.dt * 1000);
        const temperature = Math.round(entry.main?.temp ?? 0);
        const description = entry.weather?.[0]?.description ?? '';

        const daySpan = document.createElement('span');
        daySpan.classList.add('forecast-day');
        daySpan.textContent = dayFormatter.format(date);

        const tempSpan = document.createElement('span');
        tempSpan.classList.add('forecast-temp');
        tempSpan.textContent = `${temperature}°C`;

        const descSpan = document.createElement('span');
        descSpan.classList.add('forecast-desc');
        descSpan.textContent = capitalize(description);

        li.appendChild(daySpan);
        li.appendChild(tempSpan);
        li.appendChild(descSpan);

        forecastListEl.appendChild(li);
    });
}

function getNextThreeDays(list) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const groupedByDay = new Map();

    list.forEach((item) => {
        const date = new Date(item.dt * 1000);
        const dayKey = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        if (dayKey <= today) {
            return;
        }

        const keyString = dayKey.toISOString();
        if (!groupedByDay.has(keyString)) {
            groupedByDay.set(keyString, []);
        }

        groupedByDay.get(keyString).push(item);
    });

    const sortedDays = Array.from(groupedByDay.entries())
        .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime());

    const selections = [];

    for (const [, items] of sortedDays) {
        const target = items.reduce((best, current) => {
            if (!best) {
                return current;
            }

            const currentHour = new Date(current.dt * 1000).getHours();
            const bestHour = new Date(best.dt * 1000).getHours();

            return Math.abs(currentHour - 12) < Math.abs(bestHour - 12) ? current : best;
        }, null);

        if (target) {
            selections.push(target);
        }

        if (selections.length === 3) {
            break;
        }
    }

    if (selections.length < 3) {
        for (const [, items] of sortedDays) {
            for (const item of items) {
                if (!selections.includes(item)) {
                    selections.push(item);
                    if (selections.length === 3) {
                        return selections;
                    }
                }
            }
        }
    }

    return selections;
}

async function loadSpotlights() {
    if (!spotlightContainer) {
        return;
    }

    try {
        const response = await fetch('data/members.json');
        if (!response.ok) {
            throw new Error(`Member data request failed: ${response.status}`);
        }

        const members = await response.json();
        const qualifyingMembers = members.filter((member) => {
            const level = member.membershipLevel?.toLowerCase();
            return level === 'gold' || level === 'silver';
        });

        if (qualifyingMembers.length === 0) {
            spotlightContainer.innerHTML = '<p>No spotlight members available at this time.</p>';
            return;
        }

        const shuffled = shuffleArray(qualifyingMembers);
        const count = Math.min(3, Math.max(2, shuffled.length));
        const selection = shuffled.slice(0, count);

        spotlightContainer.innerHTML = '';
        selection.forEach((member) => {
            spotlightContainer.appendChild(createSpotlightCard(member));
        });
    } catch (error) {
        console.error('Unable to load spotlight data:', error);
        spotlightContainer.innerHTML = '<p>Member spotlights are unavailable right now.</p>';
    }
}

async function parseJsonOrThrow(response, label) {
    if (response.ok) {
        return response.json();
    }

    let details = await response.text();
    try {
        const body = JSON.parse(details);
        if (body?.message) {
            details = body.message;
        }
    } catch (parseError) {
        // Ignore JSON parse issues and keep the raw text
    }

    throw new Error(`${capitalize(label)} request failed (${response.status}): ${details}`);
}

function createSpotlightCard(member) {
    let card = document.createElement('section');
    card.classList.add('member-card');

    let logo = document.createElement('img');
    logo.setAttribute('src', `images/${member.image}`);
    logo.setAttribute('alt', `Logo of ${member.name}`);
    logo.setAttribute('loading', 'lazy');
    
    let name = document.createElement('h2');
    name.textContent = member.name;
    
    let address = document.createElement('p');
    address.textContent = member.address;
    
    let phone = document.createElement('p');
    phone.textContent = member.phone;
    
    let website = document.createElement('a');
    website.setAttribute('href', member.website);
    website.setAttribute('target', '_blank');
    website.textContent = member.website.replace(/(^\w+:|^)\/\//, '');
    
    let membership = document.createElement('p');
    membership.classList.add('membership-level');
    membership.textContent = `Membership: ${member.membershipLevel}`;
    
    card.appendChild(logo);
    card.appendChild(name);
    card.appendChild(address);
    card.appendChild(phone);
    card.appendChild(website);
    card.appendChild(membership);

    return card;
}

function shuffleArray(items) {
    const array = [...items];
    for (let i = array.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function capitalize(value = '') {
    if (typeof value !== 'string' || value.length === 0) {
        return '';
    }
    return value.charAt(0).toUpperCase() + value.slice(1);
}
