/**
 * main.js — nav scroll-spy, mobile menu, print button, footer year.
 */
const SECTION_IDS = ["about", "skills", "work", "experience", "education", "contact"];

document.addEventListener("DOMContentLoaded", () => {
  const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean);
  const linkFor = (id) => document.querySelector(`.nav__links a[href="#${id}"]`);

  // ---- Scroll-spy: highlight the active nav link ----
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          document
            .querySelectorAll(".nav__links a")
            .forEach((a) => a.classList.remove("is-active"));
          linkFor(entry.target.id)?.classList.add("is-active");
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px" },
  );
  sections.forEach((s) => spy.observe(s));

  // ---- Mobile menu ----
  const burger = document.getElementById("nav-burger");
  const links = document.getElementById("nav-links");
  const closeMenu = () => {
    links?.classList.remove("is-open");
    burger?.setAttribute("aria-expanded", "false");
  };
  burger?.addEventListener("click", () => {
    const open = links.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", String(open));
  });
  // Close the menu after picking a destination.
  links?.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));

  // ---- Reveal sections on scroll ----
  // CSS only hides .reveal under .js + prefers-reduced-motion: no-preference,
  // so nothing is ever blank under no-JS or reduced-motion. We just flip .is-visible.
  const reveals = document.querySelectorAll(".reveal");
  if (reveals.length) {
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    reveals.forEach((el) => revealObserver.observe(el));
  }

  // ---- Print = "Download CV" ----
  document.getElementById("print-cv")?.addEventListener("click", () => window.print());

  // ---- Footer year ----
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
});
