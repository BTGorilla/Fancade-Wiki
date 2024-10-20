function createRain() {
    const rainContainer = document.createElement('div');
    rainContainer.className = 'rain-container';
    rainContainer.style.pointerEvents = 'none';

    for (let i = 0; i < 100; i++) {
        const rainDrop = document.createElement('div');
        rainDrop.className = 'rain';
        rainDrop.style.left = Math.random() * 100 + 'vw';
        rainDrop.style.animationDelay = Math.random() * 2 + 's';
        rainContainer.appendChild(rainDrop);
    }

    for (let i = 0; i < 30; i++) {
        const largerRainDrop = document.createElement('div');
        largerRainDrop.className = 'larger-rain';
        largerRainDrop.style.left = Math.random() * 100 + 'vw';
        largerRainDrop.style.animationDelay = Math.random() * 2 + 's';
        rainContainer.appendChild(largerRainDrop);
    }

    document.body.appendChild(rainContainer);
}

document.addEventListener('DOMContentLoaded', () => {
    createRain();
});
document.addEventListener('DOMContentLoaded', () => {
    createRain();
});
function showContent(id) {
    var contents = document.querySelectorAll('.content');
    contents.forEach(function (content) {
        content.classList.remove('active');
    });
    document.getElementById(id).classList.add('active');
}
window.onload = function () {
    showContent('news');
}

const cardsData = [
    { id: 'fancade', title: 'Fancade', imgSrc: 'https://files.catbox.moe/w7bteq.webp' },
    { id: 'martinmagni', title: 'Martin Magni', imgSrc: 'https://files.catbox.moe/6ulxvm.webp' },
    { id: 'sweatsmile', title: 'Sweatsmile', imgSrc: 'https://files.catbox.moe/6x2fl9.webp' },
    { id: 'oddbot', title: 'Odd Bot', imgSrc: 'https://files.catbox.moe/kl51xv.webp' },
    { id: 'drivemad', title: 'Drive Mad', imgSrc: 'https://files.catbox.moe/a8uock.webp' },
    { id: 'recoil', title: 'Recoil', imgSrc: 'https://files.catbox.moe/tm290f.webp' },
];

const cardsContainer = document.getElementById('cardsContainer');

cardsData.forEach(card => {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';
    cardDiv.onclick = () => showContent(card.id);

    const img = document.createElement('img');
    img.alt = card.title;
    img.height = 150;
    img.src = card.imgSrc;
    img.width = 200;

    const h3 = document.createElement('h3');
    h3.textContent = card.title;

    cardDiv.appendChild(img);
    cardDiv.appendChild(h3);
    cardsContainer.appendChild(cardDiv);
});

function showContent(id) {
    var contents = document.querySelectorAll('.content');
    contents.forEach(function (content) {
        content.classList.remove('active');
    });
    document.getElementById(id).classList.add('active');

    if (id !== 'sweatsmile') {
        closePetModal();
    }

    if (id === 'sweatsmile') {
        document.getElementById('dvd-bumper').style.display = 'block';
    } else {
        document.getElementById('dvd-bumper').style.display = 'none';
    }

    const section = document.getElementById(id);
    section.scrollIntoView({
        behavior: 'smooth'
    });
}
window.onload = function () {
    showContent('news');
}

const dvdBumper = document.getElementById('dvd-bumper');
let x = Math.random() * (window.innerWidth - 100);
let y = Math.random() * (window.innerHeight - 100);
let dx = 5;
let dy = 5;

function moveDvdBumper() {
    x += dx;
    y += dy;

    if (x + 100 > document.body.offsetWidth) {
        x = document.body.offsetWidth - 100;
        dx = -dx;
    }
    if (x < 0) {
        x = 0;
        dx = -dx;
    }

    if (y + 100 > document.body.offsetHeight) {
        y = document.body.offsetHeight - 100;
        dy = -dy;
    }
    if (y < 0) {
        y = 0;
        dy = -dy;
    }

    dvdBumper.style.top = `${y}px`;
    dvdBumper.style.left = `${x}px`;
}

setInterval(moveDvdBumper, 32);

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}
dvdBumper.addEventListener('click', () => {
    openPetModal();
});