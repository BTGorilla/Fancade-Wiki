let happiness = 50;
let hunger = 10;
let energy = 50;
let isSleeping = false;
let isPetModalOpen = false;
let playDuration = 0;

const HUNGER_DECREASE = 20;
const HAPPINESS_INCREASE_FEED = 3;
const HAPPINESS_DECREASE_PLAY_SHORT = 15;
const HAPPINESS_DECREASE = 2;
const ENERGY_DECREASE_PLAY = 2;
const MAX_HAPPINESS = 100;
const MIN_HAPPINESS = 0;
const HUNGER_INCREASE = 4;
const ENERGY_INCREASE_SLEEP = 5;
const HAPPINESS_DECREASE_SLEEP = 2;

const happinessElement = document.getElementById('happiness');
const hungerElement = document.getElementById('hunger');
const energyElement = document.getElementById('energy');
const petMessageElement = document.getElementById('pet-message');
const petImageElement = document.getElementById('pet-image');
const playButton = document.getElementById('play-button');
const sleepButton = document.getElementById('sleep-button');
const petContainer = document.getElementById('pet-container');
const deathImage = document.getElementById('death-image');
const flashOverlay = document.getElementById('flash-overlay');
const deathMessageElement = document.getElementById('death-message');

const backgroundMusic = document.getElementById('background-music');

let hungerInterval;
let sleepInterval;
let happinessInterval;
let playInterval;

function updateStatus() {
    happinessElement.innerText = happiness;
    hungerElement.innerText = hunger;
    energyElement.innerText = energy;
}

function feedPet() {
    if (hunger > 0) {
        hunger = Math.max(0, hunger - HUNGER_DECREASE);
        happiness = Math.min(MAX_HAPPINESS, happiness + HAPPINESS_INCREASE_FEED);
        petMessageElement.innerText = "Yum! Sweatsmile loves the food!";
    } else {
        setTimeout(checkDeath, 100);
    }
    updateStatus();
}

function playWithPet() {
    if (isSleeping) {
        petMessageElement.innerText = "Wake Sweatsmile up first!";
        return;
    }

    if (playInterval) {
        clearInterval(playInterval);
        handleStopPlaying();
    } else {
        startPlaying();
    }
    updateStatus();
}

function handleStopPlaying() {
    if (playDuration < 3) {
        happiness = Math.max(MIN_HAPPINESS, happiness - HAPPINESS_DECREASE_PLAY_SHORT);
        petMessageElement.innerText = "Sweatsmile is sad you stopped playing so soon!";
    } else {
        petMessageElement.innerText = "Sweatsmile is done playing!";
    }

    playButton.innerText = "Play";
    petImageElement.classList.remove('bouncing');
    playDuration = 0;

    clearInterval(playInterval);
    playInterval = null;

    clearInterval(happinessInterval);
    happinessInterval = setInterval(() => {
        if (!isSleeping) {
            happiness = Math.max(MIN_HAPPINESS, happiness - HAPPINESS_DECREASE);
            updateStatus();
        }
    }, 1000);
}

function startPlaying() {
    if (energy > 0) {
        happiness = Math.min(MAX_HAPPINESS, happiness + 2);
        petMessageElement.innerText = "Sweatsmile is having fun!";
        playButton.innerText = "Stop Playing";
        petImageElement.classList.add('bouncing');

        playDuration = 0;
        clearInterval(happinessInterval);
        playInterval = setInterval(() => {
            if (energy > 0) {
                energy = Math.max(0, energy - ENERGY_DECREASE_PLAY);
                happiness = Math.min(MAX_HAPPINESS, happiness + 2);
                updateStatus();

                if (energy < 12) {
                    petMessageElement.innerText = "Sweatsmile can't play much longer.";
                }

                if (energy === 10) {
                    handleStopPlaying();
                }
                playDuration += 1;
            }
        }, 1000);
    } else {
        petMessageElement.innerText = "Sweatsmile is too tired to play!";
    }
}

function putPetToSleep() {
    if (isSleeping) {
        wakePet();
        return;
    }

    if (playInterval) {
        petMessageElement.innerText = "Sweatsmile can't sleep while playing!";
        return;
    }

    isSleeping = true;
    petMessageElement.innerText = "Sweatsmile is sleeping...";
    petImageElement.classList.remove('bouncing');
    petImageElement.classList.add('sleeping');

    const zs = document.createElement('span');
    zs.textContent = ' Zzz...';
    zs.classList.add('zs');
    petContainer.appendChild(zs);
    updateStatus();

    clearInterval(sleepInterval);
    clearInterval(happinessInterval);
    clearInterval(playInterval);
    sleepInterval = setInterval(() => {
        happiness = Math.max(MIN_HAPPINESS, happiness - HAPPINESS_DECREASE_SLEEP);
        energy = Math.min(100, energy + ENERGY_INCREASE_SLEEP);
        updateStatus();
        checkDeath();
    }, 1000);
    sleepButton.innerText = "Wake Up";
}

function wakePet() {
    if (!isSleeping) {
        return;
    }

    isSleeping = false;
    clearInterval(sleepInterval);
    petMessageElement.innerText = "Sweatsmile woke up!";
    petImageElement.classList.remove('sleeping');
    petContainer.querySelectorAll('.zs').forEach(z => z.remove());
    updateStatus();

    sleepButton.innerText = "Sleep";
}

function checkDeath() {
    if (document.getElementById('pet-modal').style.display === 'block') {
        if (hunger >= 100) {
            handleDeath("Sweatsmile starved to death.");
        } else if (hunger === 0) {
            handleDeath("Sweatsmile got overfed and died.");
        } else if (energy === 0) {
            handleDeath("Sweatsmile died of sleep deprivation.");
        } else if (energy === 100 && isSleeping) {
            handleDeath("Sweatsmile died in their sleep.");
        } else if (happiness === 0) {
            handleDeath("Sweatsmile died from depression.");
        }
    }
}

function handleDeath(message) {
    clearInterval(hungerInterval);
    clearInterval(sleepInterval);
    clearInterval(happinessInterval);
    clearInterval(playInterval);

    backgroundMusic.pause();

    const dvdBumper = document.getElementById('dvd-bumper');
    dvdBumper.src = "https://files.catbox.moe/6x2fl9.webp";
    dvdBumper.style.width = "50px";
    dvdBumper.style.height = "50px";
    deathMessageElement.innerText = message;

    flashOverlay.style.display = 'block';
    flashOverlay.style.opacity = '1';

    openDeathModal();
    setTimeout(() => {
        flashOverlay.style.opacity = '0';
        setTimeout(() => {
            flashOverlay.style.display = 'none';
        }, 1000);
    }, 500);
}

function openDeathModal() {
    document.getElementById('death-modal').style.display = 'block';
}

function openPetModal() {
    document.getElementById('pet-modal').style.display = 'block';
    isPetModalOpen = true;
    updateStatus();

    backgroundMusic.play();
}

function closePetModal() {
    document.getElementById('pet-modal').style.display = 'none';
    isPetModalOpen = false;
}

function closeDeathModal() {
    document.getElementById('death-modal').style.display = 'none';
    closePetModal(); 

    resetGameState();
}

function resetGameState() {
    happiness = 50;
    hunger = 10;
    energy = 50;
    isSleeping = false;
    isPetModalOpen = false;
    playDuration = 0;

    clearInterval(hungerInterval);
    clearInterval(sleepInterval);
    clearInterval(happinessInterval);
    clearInterval(playInterval);

    updateStatus();
}

hungerInterval = setInterval(() => {
    if (!isSleeping && !playInterval && isPetModalOpen) {
        hunger = Math.min(100, hunger + HUNGER_INCREASE);
        updateStatus();
    }
    checkDeath();
}, 1000);

happinessInterval = setInterval(() => {
    if (!isSleeping && isPetModalOpen) {
        happiness = Math.max(MIN_HAPPINESS, happiness - HAPPINESS_DECREASE);
        updateStatus();
    }
}, 1000);

document.getElementById('feed-button').addEventListener('click', feedPet);
document.getElementById('play-button').addEventListener('click', playWithPet);
document.getElementById('sleep-button').addEventListener('click', putPetToSleep);
