const button = document.getElementById("moonButton");
const music = document.getElementById("music");

const photosContainer = document.getElementById("photosContainer");
const textContainer = document.getElementById("textContainer");

const canvas = document.getElementById("sakuraCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let started = false;
let photos = [];

/* 🌳 ТОЛЬКО ДЕРЕВЬЯ (НОВЫЙ БЛОК) */
function animateTrees() {

    const time = Date.now() * 0.001;

    const swayX = Math.sin(time) * 3;        // лёгкое движение влево-вправо
    const swayY = Math.cos(time * 0.7) * 1.5; // лёгкое движение вверх-вниз

    const trees = document.getElementById("treeRow");

    if (trees) {
        trees.style.transform =
            `translate(${swayX}px, ${swayY}px)`;
    }

    requestAnimationFrame(animateTrees);
}

animateTrees();

/* 🌸 сакура */
let petals = [];

function createPetal() {
    return {
        x: Math.random() * canvas.width,
        y: -20,
        size: 6 + Math.random() * 10,
        speed: 1 + Math.random() * 2,
        swing: 1 + Math.random() * 2,
        angle: Math.random() * Math.PI,
        rotateSpeed: 0.02 + Math.random() * 0.03
    };
}

function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);

    ctx.fillStyle = "rgba(255,192,203,0.85)";

    ctx.beginPath();
    ctx.moveTo(0, -p.size);
    ctx.bezierCurveTo(p.size, -p.size, p.size, p.size, 0, p.size);
    ctx.bezierCurveTo(-p.size, p.size, -p.size, -p.size, 0, -p.size);
    ctx.fill();

    ctx.restore();
}

function animatePetals() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let p of petals) {
        p.y += p.speed;
        p.x += Math.sin(p.y * 0.01) * p.swing;
        p.angle += p.rotateSpeed;
        drawPetal(p);
    }

    petals = petals.filter(p => p.y < canvas.height + 100);
    requestAnimationFrame(animatePetals);
}

setInterval(() => petals.push(createPetal()), 60);
animatePetals();

/* 🖼 фото */
async function loadPhotos() {
    const res = await fetch("/photos");
    photos = await res.json();
}

let lastPhotoIndex = -1;

function spawnPhoto() {
    if (!photos.length) return;

    let index;
    do {
        index = Math.floor(Math.random() * photos.length);
    } while (index === lastPhotoIndex && photos.length > 1);

    lastPhotoIndex = index;

    const img = document.createElement("img");
    img.src = photos[index];
    img.classList.add("photo");

    img.style.left = Math.random() * (window.innerWidth - 200) + "px";

    const rotate = -15 + Math.random() * 30;
    img.style.setProperty("--rot", rotate + "deg");

    const duration = 14 + Math.random() * 4;
    img.style.setProperty("--dur", duration + "s");

    photosContainer.appendChild(img);

    img.addEventListener("animationend", () => img.remove());
}

/* 💬 текст */
const messages = [
    "Я помню каждую твою улыбку...",
    "Ты осталась в моих мыслях",
    "Иногда мне кажется, что ты рядом",
    "Я не умею тебя забывать",
    "Ты стала частью меня",
    "Даже тишина напоминает о тебе",
    "Я не отпустил тебя внутри себя",
    "Если бы время можно было вернуть..."
];

function typeText(element, text, speed = 35) {
    let i = 0;

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

function spawnText() {
    const text = document.createElement("div");
    text.classList.add("memoryText");

    text.style.left = Math.random() * (window.innerWidth - 420) + "px";
    text.style.top = Math.random() * (window.innerHeight - 200) + "px";

    textContainer.appendChild(text);

    const msg = messages[Math.floor(Math.random() * messages.length)];

    typeText(text, msg);

    setTimeout(() => text.remove(), 8000);
}

/* 🚀 старт */
button.addEventListener("click", async () => {

    if (started) return;
    started = true;

    document.getElementById("startScreen").style.display = "none";

    music.play();

    await loadPhotos();

    setInterval(spawnPhoto, 900);
    setInterval(spawnText, 3200);
});

/* 📱 resize */
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});