/* =========================================================
   BIRTHDAY WEBSITE — script.js
   Vanilla JS only. No frameworks.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------------------------------------------------------
     1) AMBIENT FLOATING HEARTS + SPARKLES
     Runs continuously in the background across the whole page.
  --------------------------------------------------------- */
  const ambient = document.getElementById("ambient");
  const symbols = ["💗", "💕", "✨", "🤍", "💖"];

  function spawnFloaty() {
    const el = document.createElement("span");
    el.className = "floaty";
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];

    const size = 14 + Math.random() * 18; // 14–32px
    const startX = Math.random() * 100; // vw
    const duration = 7 + Math.random() * 6; // seconds
    const drift = (Math.random() * 120 - 60) + "px";
    const rot = (Math.random() * 60 - 30) + "deg";

    el.style.left = startX + "vw";
    el.style.fontSize = size + "px";
    el.style.setProperty("--drift", drift);
    el.style.setProperty("--rot", rot);
    el.style.animationDuration = duration + "s";

    ambient.appendChild(el);
    setTimeout(() => el.remove(), duration * 1000 + 200);
  }

  // Gentle, continuous drip of hearts/sparkles
  setInterval(spawnFloaty, 900);
  for (let i = 0; i < 5; i++) setTimeout(spawnFloaty, i * 300);

  /* ---------------------------------------------------------
     2) SCROLL PROGRESS RIBBON
  --------------------------------------------------------- */
  const ribbon = document.getElementById("progressRibbon");
  function updateRibbon() {
    const scrollTop = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (scrollTop / max) * 100 : 0;
    ribbon.style.width = pct + "%";
  }
  window.addEventListener("scroll", updateRibbon, { passive: true });
  updateRibbon();

  /* ---------------------------------------------------------
     3) NAVIGATION HELPERS — "Open My Surprise" & scroll buttons
  --------------------------------------------------------- */
  const openSurpriseBtn = document.getElementById("openSurpriseBtn");
  if (openSurpriseBtn) {
    openSurpriseBtn.addEventListener("click", () => {
      document.getElementById("birthday").scrollIntoView({ behavior: "smooth" });
    });
  }

  document.querySelectorAll(".scroll-next").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-target");
      const target = document.getElementById(targetId);
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  });

  /* ---------------------------------------------------------
     4) WAX SEAL — little tap interaction on the opening screen
  --------------------------------------------------------- */
  const waxSeal = document.getElementById("waxSeal");
  if (waxSeal) {
    waxSeal.addEventListener("click", () => {
      waxSeal.style.transform = "scale(1.18)";
      setTimeout(() => (waxSeal.style.transform = ""), 220);
    });
  }

  /* ---------------------------------------------------------
     5) MEMORIES — LIGHTBOX (zoom effect for photo1/2/3.jpg)
  --------------------------------------------------------- */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxClose = document.getElementById("lightboxClose");

  document.querySelectorAll(".photo-card").forEach((card) => {
    card.addEventListener("click", () => {
      const full = card.getAttribute("data-full");
      lightboxImg.src = full;
      lightbox.classList.add("open");
    });
  });

  function closeLightbox() {
    lightbox.classList.remove("open");
    setTimeout(() => (lightboxImg.src = ""), 250);
  }

  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });

  /* ---------------------------------------------------------
     6) FINAL SURPRISE — gift box opens + confetti burst
  --------------------------------------------------------- */
  const giftBox = document.getElementById("giftBox");
  const openGiftBtn = document.getElementById("openGiftBtn");
  const finalMessage = document.getElementById("finalMessage");
  let giftOpened = false;

  function openGift() {
    if (giftOpened) return;
    giftOpened = true;

    giftBox.classList.add("shake");
    setTimeout(() => {
      giftBox.classList.remove("shake");
      giftBox.classList.add("opened");
      finalMessage.classList.add("show");
      openGiftBtn.classList.add("hidden");
      launchConfetti();
    }, 450);
  }

  openGiftBtn.addEventListener("click", openGift);
  giftBox.addEventListener("click", openGift);

  /* ---------------------------------------------------------
     7) CONFETTI ANIMATION (lightweight canvas, no libraries)
  --------------------------------------------------------- */
  const canvas = document.getElementById("confettiCanvas");
  const ctx = canvas.getContext("2d");
  const confettiColors = ["#f5abc7", "#dd6f9c", "#f6cf9e", "#ffffff", "#c85285"];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  function launchConfetti() {
    const pieces = [];
    const count = 90;
    const originY = giftBox.getBoundingClientRect().top;

    for (let i = 0; i < count; i++) {
      pieces.push({
        x: window.innerWidth / 2 + (Math.random() * 200 - 100),
        y: originY,
        vx: (Math.random() - 0.5) * 8,
        vy: -(Math.random() * 9 + 4),
        size: 5 + Math.random() * 5,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10,
        gravity: 0.28 + Math.random() * 0.12,
        shape: Math.random() > 0.5 ? "rect" : "heart",
      });
    }

    let frame = 0;
    const maxFrames = 160;

    function drawHeart(x, y, size) {
      ctx.beginPath();
      const topCurveHeight = size * 0.3;
      ctx.moveTo(x, y + topCurveHeight);
      ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
      ctx.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + (size + topCurveHeight) / 1.4, x, y + size);
      ctx.bezierCurveTo(x, y + (size + topCurveHeight) / 1.4, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
      ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
      ctx.fill();
    }

    function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;

      pieces.forEach((p) => {
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;

        if (p.shape === "rect") {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        } else {
          drawHeart(0, -p.size / 2, p.size);
        }
        ctx.restore();
      });

      if (frame < maxFrames) {
        requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    requestAnimationFrame(tick);
  }

});