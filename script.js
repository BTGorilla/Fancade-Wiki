const RAIN_COUNT = 150;
const LARGER_RAIN_COUNT = 45;
const DVD_BUMPER_SIZE = 100;
const LONGCAT_SIZE = 40;
const LONGCAT_DUPLICATION_INTERVAL = 1000;
const WIDTH_THRESHOLD = 800;

let x = Math.random() * (window.innerWidth - 100);
let y = Math.random() * (window.innerHeight - 100);
let dx = 5;
let dy = 5;
let longcat1 = null;
let longcatCount = 0;
let longcatInterval;
let currentActiveId = 'news';

const gunshotSound = new Audio('https://files.catbox.moe/kwot97.mp3');
const rainSound = new Audio('https://files.catbox.moe/78vqzc.mp3');
const splat = new Audio('https://files.catbox.moe/vezl55.mp3');
const errorSound = new Audio('https://files.catbox.moe/ma0ewv.wav');
const knock = new Audio('https://files.catbox.moe/hpseni.mp3');

const cardsContainer = document.getElementById('cardsContainer');
const cardsData = [
    { id: 'fancade', title: 'Fancade', imgSrc: 'https://files.catbox.moe/w7bteq.webp' },
    { id: 'martinmagni', title: 'Martin Magni', imgSrc: 'https://files.catbox.moe/6ulxvm.webp' },
    { id: 'sweatsmile', title: 'Sweatsmile', imgSrc: 'https://files.catbox.moe/6x2fl9.webp' },
    { id: 'oddbot', title: 'Odd Bot', imgSrc: 'https://files.catbox.moe/kl51xv.webp' },
    { id: 'drivemad', title: 'Drive Mad', imgSrc: 'https://files.catbox.moe/a8uock.webp' },
    { id: 'recoil', title: 'Recoil', imgSrc: 'https://files.catbox.moe/tm290f.webp' },
    { id: 'longcat', title: 'Longcat', imgSrc: 'https://files.catbox.moe/u5hiri.webp' },
    { id: 'mekorama', title: 'Mekorama', imgSrc: 'https://files.catbox.moe/fn9axa.webp' },
    { id: 'blocksworld', title: 'Blocksworld', imgSrc: 'https://files.catbox.moe/ide7pk.webp' },
    { id: 'oddbotout', title: 'Odd Bot Out', imgSrc: 'https://files.catbox.moe/ciq7e2.webp' }
];

function createRain() {
    const rainContainer = document.createElement('div');
    rainContainer.className = 'rain-container';
    rainContainer.style.pointerEvents = 'none';

    for (let i = 0; i < RAIN_COUNT; i++) {
        const rainDrop = document.createElement('div');
        rainDrop.className = 'rain';
        rainDrop.style.left = `${Math.random() * 100}vw`;
        rainDrop.style.animationDelay = `${Math.random() * 2}s`;
        rainContainer.appendChild(rainDrop);
    }

    for (let i = 0; i < LARGER_RAIN_COUNT; i++) {
        const largerRainDrop = document.createElement('div');
        largerRainDrop.className = 'larger-rain';
        largerRainDrop.style.left = `${Math.random() * 100}vw`;
        largerRainDrop.style.animationDelay = `${Math.random() * 2}s`;
        rainContainer.appendChild(largerRainDrop);
    }

    document.body.appendChild(rainContainer);
}

function createGunshotImage(event, cardDiv) {
    const gunshotImg = document.createElement('img');
    gunshotImg.src = 'https://files.catbox.moe/55pd31.png';
    gunshotImg.style.position = 'absolute';
    gunshotImg.style.width = '50px';
    gunshotImg.style.height = '50px';
    gunshotImg.style.pointerEvents = 'none';

    const rect = cardDiv.getBoundingClientRect();
    const x = event.clientX - rect.left - (parseInt(gunshotImg.style.width) / 2);
    const y = event.clientY - rect.top - (parseInt(gunshotImg.style.height) / 2);
    gunshotImg.style.left = `${x}px`;
    gunshotImg.style.top = `${y}px`;

    return gunshotImg;
}

function addGunshot(event, cardDiv) {
    const gunshotImg = createGunshotImage(event, cardDiv);
    cardDiv.appendChild(gunshotImg);

    gunshotSound.currentTime = 0;
    gunshotSound.play();
}

function createCard(card) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';

    if (card.id === 'blocksworld') {
        cardDiv.onclick = showErrorModal;
    } else {
        cardDiv.onclick = (event) => {
            showContent(card.id);
            if (card.id === 'recoil') {
                addGunshot(event, cardDiv);
            }
        };
    }

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
}

const dvdBumper = document.getElementById('dvd-bumper');

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

let hoverTimeout = null;
let isHovered = false;
let particlesCreated = false;

function createLongcat() {
    if (!longcat1) {
        longcat1 = document.createElement('img');
        longcat1.src = 'https://files.catbox.moe/n51efe.webp';
        longcat1.id = 'longcat1';
        longcat1.style.position = 'fixed';
        longcat1.style.bottom = '0px';
        document.body.appendChild(longcat1);

        longcatInterval = setInterval(duplicateLongcat, LONGCAT_DUPLICATION_INTERVAL);
        longcat1.addEventListener('mouseover', startHover);
        longcat1.addEventListener('mouseout', stopHover);

        if (localStorage.getItem('longcatDead') === 'true') {
            longcat1.src = 'https://files.catbox.moe/14z31k.webp';
        }
    }
}

function duplicateLongcat() {
    if (isHovered) return;

    longcatCount++;
    if (longcat1) {
        longcat1.style.bottom = `${longcatCount * LONGCAT_SIZE}px`;
    }

    const longcat2 = document.createElement('img');
    longcat2.src = 'https://files.catbox.moe/8pp0zc.webp';
    longcat2.className = 'longcat2';
    longcat2.style.bottom = `${(longcatCount - 1) * LONGCAT_SIZE}px`;
    longcat2.style.display = 'block';
    document.body.appendChild(longcat2);
}

function createParticles(x, y) {
    if (particlesCreated) return;

    splat.currentTime = 0;
    splat.play();

    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        const colors = [
            'rgb(150, 0, 0)',
            'rgb(200, 9, 9)',
            'rgb(255, 0, 0)',
            'rgba(200, 9, 9, 0.7)',
        ];

        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.backgroundColor = randomColor;
        const size = Math.random() * 5 + 5;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        const angle = Math.random() * 2 * Math.PI;
        const distance = Math.random() * 100;
        particle.style.setProperty('--x', `${Math.cos(angle) * distance}px`);
        particle.style.setProperty('--y', `${Math.sin(angle) * distance}px`);
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        const animationDuration = Math.random() * 0.5 + 0.5;
        particle.style.animationDuration = `${animationDuration}s`;

        document.body.appendChild(particle);

        particle.addEventListener('animationend', () => {
            particle.remove();
        });
    }
    particlesCreated = true;
}

function startHover() {
    isHovered = true;
    hoverTimeout = setTimeout(() => {
        const rect = longcat1.getBoundingClientRect();
        createParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);

        if (localStorage.getItem('longcatDead') !== 'true') {
            longcat1.src = 'https://files.catbox.moe/14z31k.webp';
            localStorage.setItem('longcatDead', 'true');
        }
    }, 3000);
}

function stopHover() {
    isHovered = false;
    clearTimeout(hoverTimeout);
}

function stopDuplicating() {
    clearInterval(longcatInterval);
}

function resumeDuplicating() {
    longcatInterval = setInterval(duplicateLongcat, LONGCAT_DUPLICATION_INTERVAL);
}

function showContent(id) {
    const contents = document.querySelectorAll('.content');

    if (currentActiveId !== id) {
        contents.forEach((content) => {
            content.classList.remove('active');
        });

        document.getElementById(id).classList.add('active');
        currentActiveId = id;

        if (id === 'sweatsmile') {
            dvdBumper.style.display = 'block';
        } else {
            dvdBumper.style.display = 'none';
        }

        if (id === 'longcat') {
            if (localStorage.getItem('longcatDead') !== 'true') {
                createLongcat();
                dvdBumper.style.display = 'none';
            }
        } else {
            if (longcat1) {
                longcat1.style.transition = 'bottom 1s';
                longcat1.style.bottom = '-100px';
                longcat1.addEventListener('transitionend', () => {
                    longcat1.remove();
                    longcat1 = null;
                    clearInterval(longcatInterval);
                });
            }
            const longcat2s = document.querySelectorAll('img[src="https://files.catbox.moe/8pp0zc.webp"]');
            longcat2s.forEach((longcat2) => longcat2.remove());
            longcatCount = 0;
            clearInterval(longcatInterval);
        }

        const section = document.getElementById(id);
        section.scrollIntoView({
            behavior: 'smooth'
        });
    }
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

dvdBumper.addEventListener('click', () => {
    openPetModal();
});

document.addEventListener('DOMContentLoaded', () => {
    createRain();
    cardsData.forEach(createCard);
    moveDvdBumper();
    showContent('news');
});

document.addEventListener('DOMContentLoaded', () => {
    const extraMessage = document.getElementById('extra-message');
    const warningScreen = document.getElementById('warning-screen');
    const proceedButton = document.getElementById('proceed-button');

    warningScreen.style.display = 'none';

    if (!localStorage.getItem('warningShown')) {
        warningScreen.style.display = 'flex';
        if (window.innerWidth < WIDTH_THRESHOLD) {
            extraMessage.style.display = 'block';
        } else {
            extraMessage.style.display = 'none';
        }
    }

    const playRainSound = () => {
        rainSound.play().catch(error => {
            console.error('Error playing sound:', error);
        });
    };

    proceedButton.addEventListener('click', () => {
        warningScreen.style.display = 'none';
        playRainSound();
        localStorage.setItem('warningShown', 'true');
    });

    document.addEventListener('click', () => {
        if (rainSound.paused) {
            playRainSound();
        }
    });
});

let errorModalOpenCount = 0;

function showErrorModal() {
    errorModalOpenCount++;

    const errorMessageElement = document.querySelector('#error-modal p strong');
    const modal = document.getElementById('error-modal');

    if (errorModalOpenCount > 10) {
        return;
    }

    const messages = {
        5: "Are you giving up yet?",
        6: "You can stop now.",
        7: "You can stop now.",
        8: "You can stop now!",
        9: "YOU CAN STOP NOW!",
        10: "Screw you, I'm leaving.",
    };

    errorMessageElement.textContent = messages[errorModalOpenCount] || 'ID "blocksworld" CANNOT BE FOUND';
    modal.style.display = 'flex';

    errorSound.currentTime = 0;
    errorSound.play().catch(error => {
        console.error("Error playing sound:", error);
    });
}

function closeErrorModal() {
    document.getElementById('error-modal').style.display = 'none';
}

document.getElementById('door1').addEventListener('click', () => {
    knock.currentTime = 0;
    knock.play();
});
