const url = 'data/members.json'; 
const memberDisplay = document.querySelector('#member-display');
const gridButton = document.querySelector('#grid-view');
const listButton = document.querySelector('#list-view');

async function getMemberData() {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        displayMembers(data);
    } catch (error) {
        console.error('Error fetching member data:', error);
        memberDisplay.innerHTML = '<p>Failed to load member data. Please try again later.</p>';
    }
}

const displayMembers = (members) => {
    memberDisplay.innerHTML = '';
    members.forEach((member) => {
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

        memberDisplay.appendChild(card);
    });
};

gridButton.addEventListener('click', () => {
    memberDisplay.classList.remove('list');
    memberDisplay.classList.add('grid');
    gridButton.classList.add('active');
    listButton.classList.remove('active');
});

listButton.addEventListener('click', () => {
    memberDisplay.classList.remove('grid');
    memberDisplay.classList.add('list');
    listButton.classList.add('active');
    gridButton.classList.remove('active');
});

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('current-year').textContent = new Date().getFullYear();
    document.getElementById('last-modified').textContent = document.lastModified;

   
    getMemberData();
});

const menuButton = document.querySelector('#menuButton');
const navLinks = document.querySelector('.nav-links');

menuButton.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    menuButton.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuButton.classList.remove('open');
    });
});