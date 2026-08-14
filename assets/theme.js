/**
 * theme.js — dark-first light/dark theme toggle.
 *
 * Default is dark. When no choice is stored we follow prefers-color-scheme,
 * and we keep following OS changes until the user picks explicitly.
 */
const KEY = "theme";
const root = document.documentElement;
const mq = matchMedia("(prefers-color-scheme: light)");

const stored = () => localStorage.getItem(KEY); // 'dark' | 'light' | null
const system = () => (mq.matches ? "light" : "dark");
const resolve = () => stored() || system();

function apply(theme) {
  root.setAttribute("data-theme", theme);
  const btn = document.getElementById("theme-toggle");
  if (btn) {
    btn.textContent = theme === "dark" ? "☀" : "◐";
    btn.setAttribute(
      "aria-label",
      theme === "dark" ? "Switch to light theme" : "Switch to dark theme",
    );
  }
}

function toggle() {
  const next = resolve() === "dark" ? "light" : "dark";
  localStorage.setItem(KEY, next);
  apply(next);
}

document.addEventListener("DOMContentLoaded", () => {
  apply(resolve());
  document.getElementById("theme-toggle")?.addEventListener("click", toggle);
  // Follow the OS only while the user hasn't chosen.
  mq.addEventListener("change", () => {
    if (!stored()) apply(system());
  });
});
