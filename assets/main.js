(() => {
  const nav = document.querySelector(".nav");
  const menu = document.getElementById("nav-links");
  const menuButton = document.getElementById("nav-burger");
  const navLinks = [...nav.querySelectorAll('a[href^="#"]')];
  const sections = [...document.querySelectorAll("main section[id]")];
  const studies = [...document.querySelectorAll(".case__details")];
  const cvButton = document.getElementById("print-cv");
  let expandedForPrint = [];

  const setMenuOpen = (open) => {
    menu.classList.toggle("is-open", open);
    menuButton.setAttribute("aria-expanded", String(open));
  };

  nav.classList.add("nav--enhanced");
  menuButton.hidden = false;
  menuButton.addEventListener("click", (event) => {
    const open = !menu.classList.contains("is-open");
    setMenuOpen(open);

    if (open && event.detail === 0) menu.querySelector("a").focus();
  });

  navLinks.forEach((link) => link.addEventListener("click", () => {
    if (!menu.classList.contains("is-open")) return;

    setMenuOpen(false);
    const target = document.getElementById(link.hash.slice(1));
    target.tabIndex = -1;
    target.focus({ preventScroll: true });
  }));

  nav.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu.classList.contains("is-open")) {
      setMenuOpen(false);
      menuButton.focus();
    }
  });

  document.addEventListener("click", (event) => {
    if (!nav.contains(event.target)) setMenuOpen(false);
  });
  matchMedia("(max-width: 64rem)").addEventListener("change", () => setMenuOpen(false));

  let scheduled = false;
  let currentSection;

  const updateCurrentSection = () => {
    scheduled = false;
    const marker = window.innerHeight * .35;
    const visibleSection = sections.findLast((section) => section.getBoundingClientRect().top <= marker);
    const atBottom = window.scrollY > 0 && Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight;
    const next = atBottom ? sections.at(-1).id : visibleSection?.id;

    if (currentSection === next) return;
    currentSection = next;

    navLinks.forEach((link) => {
      if (link.hash === `#${next}` && next !== "hero") {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  const scheduleUpdate = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(updateCurrentSection);
  };

  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate);
  document.addEventListener("toggle", scheduleUpdate, true);
  document.fonts.ready.then(scheduleUpdate);
  scheduleUpdate();

  cvButton.hidden = false;
  cvButton.addEventListener("click", () => window.print());
  window.addEventListener("beforeprint", () => {
    expandedForPrint = studies.filter((study) => !study.open);
    expandedForPrint.forEach((study) => { study.open = true; });
  });
  window.addEventListener("afterprint", () => {
    expandedForPrint.forEach((study) => { study.open = false; });
    expandedForPrint = [];
  });

  document.getElementById("year").textContent = String(new Date().getFullYear());
})();
