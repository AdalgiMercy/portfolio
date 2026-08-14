/**
 * effects.js — immersive motion layer for the portfolio.
 *
 * Adds: background particle network (theme-aware, pauses when tab hidden),
 * custom cursor (dot + lagging ring), magnetic buttons, 3D tilt + cursor
 * spotlight on case cards, matrix-style text scramble, and a scroll progress bar.
 *
 * Gates:
 *  - prefers-reduced-motion: reduce  → nothing runs; html never gets .fx and
 *    the CSS keeps the page fully static and readable.
 *  - coarse pointers / no hover      → cursor & magnetic effects skipped.
 */
const REDUCE = matchMedia("(prefers-reduced-motion: reduce)").matches;
const FINE = matchMedia("(hover: hover) and (pointer: fine)").matches;
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

document.addEventListener("DOMContentLoaded", () => {
  if (REDUCE) return;
  document.documentElement.classList.add("fx");
  initNet();
  initProgress();
  initScramble();
  initTilt();
  if (FINE) {
    initCursor();
    initMagnetic();
  }
});

/* ============ Background particle network ============ */
function initNet() {
  const canvas = $("#bg-net");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let w = 0, h = 0, nodes = [], raf = 0, running = false;
  let accent = "#7C5CFF";
  const mouse = { x: -1e4, y: -1e4 };

  const readTheme = () => {
    accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || accent;
  };
  readTheme();
  new MutationObserver(readTheme).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });

  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    w = innerWidth;
    h = innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(85, Math.round((w * h) / 17000)); // density caps work on big screens
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.7,
    }));
  };

  const LINK = 120; // px: max distance at which two nodes connect
  const PUSH = 130; // px: cursor repulsion radius

  const step = () => {
    ctx.clearRect(0, 0, w, h);
    for (const n of nodes) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;
      // gentle cursor repulsion — the field makes way for the pointer
      const dx = n.x - mouse.x, dy = n.y - mouse.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < PUSH * PUSH) {
        const d = Math.sqrt(d2) || 1;
        const f = ((PUSH - d) / PUSH) * 0.55;
        n.x += (dx / d) * f;
        n.y += (dy / d) * f;
      }
    }
    ctx.lineWidth = 1;
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        if (Math.abs(dx) > LINK || Math.abs(dy) > LINK) continue; // cheap reject
        const d = Math.hypot(dx, dy);
        if (d < LINK) {
          ctx.strokeStyle = accent;
          ctx.globalAlpha = (1 - d / LINK) * 0.15;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = accent;
    for (const n of nodes) {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    if (running) raf = requestAnimationFrame(step);
  };

  const start = () => { if (!running) { running = true; raf = requestAnimationFrame(step); } };
  const stop = () => { running = false; cancelAnimationFrame(raf); };

  addEventListener("resize", resize, { passive: true });
  addEventListener("pointermove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
  addEventListener("pointerleave", () => { mouse.x = -1e4; mouse.y = -1e4; });
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));

  resize();
  start();
}

/* ============ Custom cursor: instant dot + lagging ring ============ */
function initCursor() {
  const dot = document.createElement("div");
  dot.className = "cursor-dot";
  const ring = document.createElement("div");
  ring.className = "cursor-ring";
  document.body.append(dot, ring);
  document.documentElement.classList.add("has-cursor");

  let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y;

  addEventListener("pointermove", (e) => {
    x = e.clientX;
    y = e.clientY;
    dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
  }, { passive: true });

  (function follow() {
    rx += (x - rx) * 0.16; // lag: the ring always chases the dot
    ry += (y - ry) * 0.16;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    requestAnimationFrame(follow);
  })();

  // Grow the ring over anything interactive.
  const INTERACTIVE = "a, button, summary, [data-hover]";
  addEventListener("mouseover", (e) => {
    if (e.target.closest(INTERACTIVE)) ring.classList.add("is-hover");
  });
  addEventListener("mouseout", (e) => {
    if (e.target.closest(INTERACTIVE)) ring.classList.remove("is-hover");
  });
  // The custom cursor hides at the window edge; also release it on leave.
  addEventListener("pointerdown", () => ring.classList.add("is-down"));
  addEventListener("pointerup", () => ring.classList.remove("is-down"));
}

/* ============ Magnetic buttons ============ */
function initMagnetic() {
  const STRENGTH = 0.28; // how far the element leans toward the cursor
  for (const el of $$(".btn, .nav__brand, .nav__icon-btn")) {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      el.style.transition = "transform 90ms linear";
      el.style.transform = `translate(${dx * STRENGTH}px, ${dy * STRENGTH}px)`;
    });
    el.addEventListener("pointerleave", () => {
      el.style.transition = "transform var(--dur-base) var(--ease-spring)";
      el.style.transform = "";
      delete el.dataset.mag;
    });
  }
}

/* ============ Card tilt + cursor spotlight ============ */
function initTilt() {
  const MAX = 3.2; // degrees
  for (const card of $$(".case")) {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width; // 0..1
      const py = (e.clientY - r.top) / r.height;
      card.classList.add("is-tilting", "is-lit");
      card.style.transform =
        `perspective(950px) rotateX(${(0.5 - py) * MAX * 2}deg) rotateY(${(px - 0.5) * MAX * 2}deg)`;
      card.style.setProperty("--gx", `${px * 100}%`);
      card.style.setProperty("--gy", `${py * 100}%`);
    });
    card.addEventListener("pointerleave", () => {
      card.classList.remove("is-tilting", "is-lit");
      card.style.transform = "";
    });
  }
}

/* ============ Text scramble (matrix resolve) ============ */
const SCRAMBLE_CHARS = "!<>-_\\/[]{}=+*^?#";
function scramble(el, duration = 850) {
  if (el.dataset.scrambled) return;
  el.dataset.scrambled = "1";
  const finalText = el.textContent;
  const len = finalText.length;

  const frame = (t0) => (now) => {
    const p = Math.min(1, (now - t0) / duration);
    let out = "";
    for (let i = 0; i < len; i++) {
      const settle = (i / len) * 0.75 + 0.2; // each char resolves progressively L→R
      out +=
        p >= settle || finalText[i] === " "
          ? finalText[i]
          : SCRAMBLE_CHARS[(Math.random() * SCRAMBLE_CHARS.length) | 0];
    }
    el.textContent = out;
    if (p < 1) requestAnimationFrame(frame(t0));
    else el.textContent = finalText;
  };
  requestAnimationFrame(frame(performance.now()));
}

function initScramble() {
  // Hero name + title resolve on load (after the rise entrance begins).
  setTimeout(() => scramble($("h1[data-scramble]"), 900), 300);
  setTimeout(() => scramble($(".hero-title[data-scramble]"), 800), 950);

  // Section labels resolve as their section scrolls into view.
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        scramble(entry.target, 650);
        io.unobserve(entry.target);
      }
    }
  }, { rootMargin: "0px 0px -15% 0px" });
  $$(".section-label[data-scramble]").forEach((el) => io.observe(el));
}

/* ============ Scroll progress bar ============ */
function initProgress() {
  const bar = $("#progress-bar");
  if (!bar) return;
  const update = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? scrollY / max : 0;
    bar.style.transform = `scaleX(${Math.min(1, Math.max(0, p))})`;
  };
  addEventListener("scroll", update, { passive: true });
  addEventListener("resize", update, { passive: true });
  update();
}
