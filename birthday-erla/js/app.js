const canvas = document.querySelector("#confetti");
const ctx = canvas.getContext("2d");
const song = document.querySelector("#birthdaySong");
const screens = {
  intro: document.querySelector("#introScreen"),
  wish: document.querySelector("#wishScreen"),
  gift: document.querySelector("#giftScreen"),
  product: document.querySelector("#productScreen")
};

const startButton = document.querySelector("#startButton");
const musicStatus = document.querySelector("#musicStatus");
const typedMessage = document.querySelector("#typedMessage");
const giftButton = document.querySelector("#giftButton");
const productButton = document.querySelector("#productButton");
const productVideoLink = document.querySelector("#productVideoLink");
const backButton = document.querySelector("#backButton");
const backToGiftButton = document.querySelector("#backToGiftButton");

const confettiColors = ["#ff5d7a", "#ffc857", "#48c6a8", "#3f8efc", "#8b5cf6", "#fff8ed"];
const productVideoUrl = "https://www.youtube.com/watch?v=gNvUtwpMR3g&t=1s";
const birthdayText = "Selamat ulang tahun, Mbull Aulia Saputri. Semoga tanggal 30 bulan 06 ini jadi hari yang ringan, rame secukupnya, manis seperlunya, dan penuh hal-hal kecil yang bikin kamu senyum tanpa sadar. Makin dewasa boleh, tapi jangan sampai kehilangan bagian lucu yang bikin kamu tetap kamu.";
const songStartTime = 246;
const songEndTime = 750;

let particles = [];
let typeTimer;
let confettiTimer;
let songPrepared = false;

function resizeCanvas() {
  const scale = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * scale;
  canvas.height = window.innerHeight * scale;
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
}

function showScreen(name) {
  Object.values(screens).forEach((screen) => screen.classList.remove("is-active"));
  screens[name].classList.add("is-active");
}

function typeBirthdayMessage() {
  clearInterval(typeTimer);
  typedMessage.textContent = "";
  giftButton.hidden = true;

  let index = 0;
  typeTimer = setInterval(() => {
    typedMessage.textContent += birthdayText[index];
    index += 1;

    if (index >= birthdayText.length) {
      clearInterval(typeTimer);
      giftButton.hidden = false;
      launchConfetti(120);
    }
  }, 25);
}

function startSong() {
  song.volume = 0.55;
  if (!songPrepared) {
    song.currentTime = songStartTime;
    songPrepared = true;
  }

  song.play()
    .then(() => {
      musicStatus.textContent = "Musik jalan terus selama halaman ini dibuka.";
    })
    .catch(() => {
      musicStatus.textContent = "Kalau musik belum jalan, klik sekali lagi ya.";
    });
}

function startContinuousConfetti() {
  if (confettiTimer) return;

  launchConfetti(90);
  confettiTimer = setInterval(() => {
    launchConfetti(55);
  }, 1000);
}

function launchConfetti(amount = 180) {
  const originX = window.innerWidth / 2;
  const originY = window.innerHeight * 0.34;

  for (let index = 0; index < amount; index += 1) {
    particles.push({
      x: originX,
      y: originY,
      size: Math.random() * 8 + 5,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      vx: (Math.random() - 0.5) * 12,
      vy: Math.random() * -9 - 4,
      gravity: Math.random() * 0.22 + 0.12,
      rotation: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 0.24,
      life: Math.random() * 80 + 110
    });
  }
}

function animateConfetti() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  particles = particles.filter((particle) => particle.life > 0 && particle.y < window.innerHeight + 40);

  particles.forEach((particle) => {
    particle.vy += particle.gravity;
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.rotation += particle.spin;
    particle.life -= 1;

    ctx.save();
    ctx.translate(particle.x, particle.y);
    ctx.rotate(particle.rotation);
    ctx.fillStyle = particle.color;
    ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size * 0.58);
    ctx.restore();
  });

  requestAnimationFrame(animateConfetti);
}

startButton.addEventListener("click", () => {
  startSong();
  startContinuousConfetti();
  showScreen("wish");
  typeBirthdayMessage();
});

giftButton.addEventListener("click", () => {
  showScreen("gift");
  launchConfetti(260);
});

productButton.addEventListener("click", () => {
  showScreen("product");
  launchConfetti(180);
});

backButton.addEventListener("click", () => showScreen("wish"));
backToGiftButton.addEventListener("click", () => showScreen("gift"));
window.addEventListener("resize", resizeCanvas);
song.addEventListener("timeupdate", () => {
  if (song.currentTime >= songEndTime) {
    song.currentTime = songStartTime;
    song.play();
  }
});

productVideoLink.href = productVideoUrl;
resizeCanvas();
animateConfetti();
