const gridContainer = document.getElementById('discoverGrid');
const visitMessageText = document.getElementById('visitMessageText');
const VISIT_STORAGE_KEY = 'tana_chamber_discover_last_visit';

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDiscoverPage);
} else {
    initDiscoverPage();
}

function initDiscoverPage() {
    updateVisitMessage();
    loadPointsOfInterest();
}

function updateVisitMessage() {
    if (!visitMessageText) {
        return;
    }

    const now = Date.now();
    const lastVisitValue = Number(localStorage.getItem(VISIT_STORAGE_KEY));

    let message = 'Welcome! Let us know if you have any questions.';

    if (Number.isFinite(lastVisitValue) && lastVisitValue > 0) {
        const millisecondsInDay = 1000 * 60 * 60 * 24;
        const diffInMs = now - lastVisitValue;
        const diffInDays = diffInMs / millisecondsInDay;

        if (diffInDays < 1) {
            message = 'Back so soon! Awesome!';
        } else {
            const wholeDays = Math.floor(diffInDays);
            const units = wholeDays === 1 ? 'day' : 'days';
            message = `You last visited ${wholeDays} ${units} ago.`;
        }
    }

    visitMessageText.textContent = message;
    localStorage.setItem(VISIT_STORAGE_KEY, now.toString());
}

async function loadPointsOfInterest() {
    if (!gridContainer) {
        return;
    }

    try {
        const response = await fetch('data/discover.json');
        if (!response.ok) {
            throw new Error(`Unable to load locations (status ${response.status}).`);
        }

        const items = await response.json();
        renderCards(items);
    } catch (error) {
        console.error('Discover data failed to load:', error);
        const fallback = document.createElement('p');
        fallback.className = 'discover-error';
        fallback.textContent = 'Unable to load highlights right now. Please try again later.';
        gridContainer.appendChild(fallback);
    }
}

function renderCards(items = []) {
    if (!Array.isArray(items) || items.length === 0) {
        const emptyState = document.createElement('p');
        emptyState.className = 'discover-empty';
        emptyState.textContent = 'We are updating our highlights. Check back soon!';
        gridContainer.appendChild(emptyState);
        return;
    }

    items.forEach((item) => {
        const card = createPointCard(item);
        if (card) {
            gridContainer.appendChild(card);
        }
    });
}

function createPointCard(item) {
    if (!item || !item.id) {
        return null;
    }

    const article = document.createElement('article');
    article.classList.add('poi-card', `poi-card--${item.id}`);

    const title = document.createElement('h2');
    title.textContent = item.name ?? 'Featured Destination';

    const figure = document.createElement('figure');
    const image = document.createElement('img');
    image.src = `images/${item.image}`;
    image.alt = item.name ? `${item.name} in Antananarivo region` : 'Discover highlight';
    image.loading = 'lazy';
    figure.appendChild(image);

    const address = document.createElement('address');
    address.textContent = item.address ?? '';

    const description = document.createElement('p');
    description.textContent = item.description ?? '';

    const button = document.createElement('a');
    button.classList.add('learn-more-button');
    button.href = item.learnMore ?? '#';
    button.target = '_blank';
    button.rel = 'noopener noreferrer';
    button.textContent = 'Learn more';

    article.appendChild(title);
    article.appendChild(figure);
    article.appendChild(address);
    article.appendChild(description);
    article.appendChild(button);

    return article;
}
