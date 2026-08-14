/**
 * i18n.js — bilingual EN/FR toggle.
 *
 * Every translatable element carries data-en and data-fr attributes. On load we
 * set each element's textContent from the active language, persist the choice,
 * and keep <html lang> in sync. Deep-linkable via ?lang=en|fr.
 */
const KEY = "lang";
const SUPPORTED = ["en", "fr"];

function current() {
  const q = new URLSearchParams(location.search).get("lang");
  if (q && SUPPORTED.includes(q)) return q;
  return localStorage.getItem(KEY) || "en";
}

function apply(lang) {
  if (!SUPPORTED.includes(lang)) lang = "en";
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-en]").forEach((el) => {
    const value = el.getAttribute("data-" + lang);
    if (value !== null) el.textContent = value;
  });
  // The language button shows the language you would switch TO.
  const btn = document.getElementById("lang-toggle");
  if (btn) {
    btn.textContent = lang === "en" ? "FR" : "EN";
    btn.setAttribute(
      "aria-label",
      lang === "en" ? "Switch to French" : "Passer en anglais",
    );
  }
}

function toggle() {
  const next = current() === "en" ? "fr" : "en";
  localStorage.setItem(KEY, next);
  apply(next);
}

document.addEventListener("DOMContentLoaded", () => {
  apply(current());
  document.getElementById("lang-toggle")?.addEventListener("click", toggle);
});
