const imageToPreload = new Image();
imageToPreload.src = "https://files.catbox.moe/f06odm.webp";

imageToPreload.onload = function () {
    document.getElementById("magni").src = imageToPreload.src;
};

const pupils = document.querySelectorAll(".eye .pupil");
const dialogueContainer = document.getElementById("dialogue");
const dialogues = [
    "Ah, a seeker of truths has arrived, drawn by the whispers of the cosmos.",
    "In the tapestry of existence, your presence is a thread woven into my thoughts.",
    "As I traverse the realms of creation, I wander the labyrinth of my mind.",
    "In solitude, I ponder the paths before me, reflections of my journey.",
    "Creation is both a blessing and a burden, a dance of light and shadow.",
    "From deep inspiration, I conjure visions that flicker like distant stars.",
    "Yet, doubt often casts its shadow upon my heart during this journey.",
    "In despair, I seek solace in the echoes of my past, where creativity began.",
    "I recall the whispers of dreamers, chasing the unknown in the night.",
    "Each step forward is a leap of faith into the vast void of possibility.",
    "Beneath the surface, ideas churn like a tempest, waiting to be shaped.",
    "With every heartbeat, I breathe life into the void, crafting my worlds.",
    "Some days, the horizon is obscured, and expectation weighs heavily.",
    "Yet, in struggle, I find my essence; creation reflects my evolution.",
    "As I sculpt these realms, I weave my experiences into their fabric.",
    "Joy and sorrow dance together, vital notes in the symphony of existence.",
    "I am both creator and creation, caught in a cycle of rebirth.",
    "In quiet reflection, I ponder: are my creations whispers or gateways?",
    "Every choice sends ripples through the cosmos, resonating beyond time.",
    "I stand at the crossroads of possibility, a guardian of my dreams.",
    "As the sun sets on my imagination, I embrace the uncertainties ahead.",
    "In the unknown, I discover the essence of creation—a journey without end.",
    "So, dear traveler, let us embark on this odyssey together, where reality blurs.",
    "Embrace the enigma of existence; within it lies the potential for wonders.",
    "In the depths of creation, I find solace in silence, where secrets are revealed.",
    "The journey is a spiral, winding back yet ever forward into the unknown.",
    "With each step, I shed doubt, revealing my essence as a weaver of worlds.",
    "In the grand tapestry of existence, I am but a thread with boundless potential.",
    "The dance of creation is a sacred ritual, celebrating life and imagination.",
    "As we traverse the unknown, remember, reality's boundaries await transcendence.",
    "Wake up."
];
let currentDialogueIndex = 0;
let dialogueShown = false;
let wakeUpDialogueShown = false;
let isClickDisabled = false;

function showDialogue() {
    dialogueContainer.textContent = "";
    const currentDialogue = dialogues[currentDialogueIndex];

    for (let char of currentDialogue) {
        const span = document.createElement("span");
        span.textContent = char === ' ' ? '\u00A0 ' : char;
        span.classList.add('jitter');
        dialogueContainer.appendChild(span);
    }

    startContinuousJitter();
}

function startContinuousJitter() {
    const spans = dialogueContainer.querySelectorAll('span');

    setInterval(() => {
        spans.forEach((span) => {
            span.style.setProperty('--x', Math.random() * 2 - 1);
            span.style.setProperty('--y', Math.random() * 2 - 1);
        });
    }, 100);
}

function nextDialogue() {

    isClickDisabled = true; //Locks this function from getting called again whilst the animations are playing
    dialogueContainer.classList.remove('fade-in');
    dialogueContainer.classList.add('fade-out');

    setTimeout(() => {
        currentDialogueIndex = (currentDialogueIndex + 1) % dialogues.length;
        dialogueContainer.classList.remove('fade-out');
        showDialogue();

        if (currentDialogueIndex === dialogues.length - 1) {
            wakeUpDialogueShown = true;
            setTimeout(() => {
                window.history.back();
            }, 1000);
        }
        isClickDisabled = false; //Unlocks this function
    }, 1000);
}

window.addEventListener("click", () => {
    if (!isClickDisabled) {
        nextDialogue();
    }

    //if (!dialogueShown) {
    //    dialogueShown = true;
    //    showDialogue();
    //} else if (wakeUpDialogueShown) {
    //} else {
    //    nextDialogue();
    //}
});

window.addEventListener("mousemove", (e) => {
    pupils.forEach((pupil) => {
        var rect = pupil.getBoundingClientRect();
        var x = (e.pageX - rect.left) / 75 + "px";
        var y = (e.pageY - rect.top) / 75 + "px";
        pupil.style.transform = "translate3d(" + x + "," + y + ", 0px)";
    });
});

document.getElementById("magni").addEventListener("contextmenu", (e) => {
    e.preventDefault();
});

const wind = document.getElementById("background-music");

window.addEventListener("click", () => {
    wind.play().catch(error => {
        console.error("Audio playback failed:", error);
    });
});
