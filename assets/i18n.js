(() => {
  const supported = ["en", "fr"];
  const root = document.documentElement;
  const button = document.getElementById("lang-toggle");
  const initialUrl = new URL(location.href);
  const requested = initialUrl.searchParams.get("lang");
  let saved;

  try {
    saved = localStorage.getItem("lang");
  } catch {
    // A restricted browser can still use the language switch for this page.
  }

  function apply(language) {
    root.lang = language;
    document.querySelectorAll("[data-en]").forEach((element) => {
      element.textContent = element.dataset[language];
    });
    document.querySelectorAll("[data-aria-en]").forEach((element) => {
      element.setAttribute("aria-label", element.getAttribute(`data-aria-${language}`));
    });

    button.textContent = language === "en" ? "FR" : "EN";
    button.setAttribute("aria-label", language === "en" ? "Switch to French" : "Passer en anglais");
  }

  apply(supported.includes(requested) ? requested : supported.includes(saved) ? saved : "en");
  button.hidden = false;

  button.addEventListener("click", () => {
    const next = root.lang === "en" ? "fr" : "en";
    apply(next);

    try {
      localStorage.setItem("lang", next);
    } catch {
      // The visible language still switches when storage is unavailable.
    }

    const url = new URL(location.href);
    if (url.searchParams.has("lang")) {
      url.searchParams.set("lang", next);
      try {
        history.replaceState(null, "", url);
      } catch {
        // The browser may restrict history updates for local files.
      }
    }
  });
})();
