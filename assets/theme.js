(() => {
  const root = document.documentElement;
  let theme = "light";

  try {
    if (localStorage.getItem("theme") === "dark") theme = "dark";
  } catch {
    // Use the default palette when storage is unavailable.
  }

  root.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]').content = theme === "dark" ? "#12241d" : "#f7f7ef";

  document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("theme-toggle");

    const applyTheme = () => {
      const dark = theme === "dark";
      root.dataset.theme = theme;
      document.querySelector('meta[name="theme-color"]').content = dark ? "#12241d" : "#f7f7ef";
      button.dataset.ariaEn = dark ? "Switch to light theme" : "Switch to dark theme";
      button.dataset.ariaFr = dark ? "Activer le thème clair" : "Activer le thème sombre";
      button.setAttribute("aria-label", root.lang === "fr" ? button.dataset.ariaFr : button.dataset.ariaEn);
      button.firstElementChild.textContent = dark ? "☼" : "◐";
    };

    applyTheme();
    button.hidden = false;

    button.addEventListener("click", () => {
      theme = theme === "dark" ? "light" : "dark";
      applyTheme();
      try {
        localStorage.setItem("theme", theme);
      } catch {
        // The palette remains active for this page even without storage.
      }
    });
  });
})();
