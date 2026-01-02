// Loader
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  setTimeout(() => loader?.classList.add("hidden"), 900);
});

// Custom Cursor
const cursorDot = document.getElementById("cursorDot");
let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (cursorDot) cursorDot.style.opacity = "1";
});

document.addEventListener("mouseleave", () => {
  if (cursorDot) cursorDot.style.opacity = "0";
});

function animateCursor() {
  cursorX += (mouseX - cursorX) * 0.18;
  cursorY += (mouseY - cursorY) * 0.18;
  if (cursorDot) {
    cursorDot.style.left = cursorX + "px";
    cursorDot.style.top = cursorY + "px";
  }
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Cursor scale on hover
document.querySelectorAll("a, button, .project-item").forEach((el) => {
  el.addEventListener("mouseenter", () => {
    if (!cursorDot) return;
    cursorDot.style.transform = "translate(-50%,-50%) scale(3)";
    cursorDot.style.opacity = "0.45";
  });
  el.addEventListener("mouseleave", () => {
    if (!cursorDot) return;
    cursorDot.style.transform = "translate(-50%,-50%) scale(1)";
    cursorDot.style.opacity = "1";
  });
});

// Matrix Canvas Animation
const canvas = document.getElementById("matrixCanvas");
const ctx = canvas?.getContext("2d");

function resizeCanvas() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

if (canvas && ctx) {
  const chars = "01";
  const fontSize = 14;
  let columns = Math.floor(canvas.width / fontSize);
  let drops = Array(columns).fill(1);

  function drawMatrix() {
    if (!canvas || !ctx) return;

    // fade background
    ctx.fillStyle = "rgba(0, 0, 0, 0.06)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#00ffff";
    ctx.font = `${fontSize}px monospace`;

    for (let i = 0; i < drops.length; i++) {
      const text = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  }

  // keep drops aligned after resize
  window.addEventListener("resize", () => {
    columns = Math.floor(canvas.width / fontSize);
    drops = Array(columns).fill(1);
  });

  setInterval(drawMatrix, 50);
}

// Reveal animations (replaces GSAP)
const revealEls = document.querySelectorAll("[data-reveal]");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -120px 0px" }
);
revealEls.forEach((el) => revealObserver.observe(el));

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute("href"));
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// Counter animation (starts when hero stats are visible)
function animateCounter(el) {
  const target = parseFloat(el.getAttribute("data-count") || "0");
  const duration = 1200;
  const start = performance.now();
  const isInt = Number.isInteger(target);

  function tick(now) {
    const t = Math.min((now - start) / duration, 1);
    const value = target * t;
    el.textContent = isInt ? String(Math.floor(value)) : value.toFixed(1);
    if (t < 1) requestAnimationFrame(tick);
    else el.textContent = isInt ? String(target) : target.toFixed(1);
  }
  requestAnimationFrame(tick);
}

const heroStats = document.querySelector(".hero-stats");
if (heroStats) {
  const statsObserver = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        document.querySelectorAll(".stat-num").forEach(animateCounter);
        statsObserver.disconnect();
      }
    },
    { threshold: 0.45 }
  );
  statsObserver.observe(heroStats);
}

// Image fallback (fix “image especially”)
(function () {
  const img = document.getElementById("profileImg");
  if (!img) return;

  img.addEventListener("error", () => {
    const svg = encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="500" height="500">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#00ffff"/>
            <stop offset="1" stop-color="#a855f7"/>
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#g)"/>
        <circle cx="250" cy="200" r="90" fill="rgba(255,255,255,0.22)"/>
        <rect x="120" y="310" width="260" height="140" rx="70" fill="rgba(255,255,255,0.20)"/>
        <text x="50%" y="485" text-anchor="middle" font-family="Arial" font-size="18" fill="rgba(255,255,255,0.92)">
          Add Images/Pranshul.jpeg
        </text>
      </svg>
    `);
    img.src = `data:image/svg+xml;charset=utf-8,${svg}`;
  });
})();
