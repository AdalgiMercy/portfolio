# Portfolio — André Adonis Mounguengui

Personal portfolio + printable CV. A single-page static site, no frameworks, no build step.

- **Live title:** AI & Full-Stack Software Engineer
- **Aesthetic:** "Terminal Noir" — dark-first, monospace accents, one accent color (`#7C5CFF`)
- **Languages:** English (default) + French toggle
- **Print:** click **Download CV** (or Ctrl/Cmd-P) → "Save as PDF" for a clean 2-page CV

## Run locally

No dependencies. Either open `index.html` directly, or serve it (recommended, so the
`type="module"` scripts load over http):

```bash
python -m http.server 8080
# then open http://localhost:8080
```

## Files

```
index.html              # all content & structure (bilingual via data-en/data-fr)
assets/styles.css       # tokens, layout, components, responsive, @media print
assets/i18n.js          # FR/EN toggle (localStorage + ?lang=)
assets/theme.js         # dark/light toggle (prefers-color-scheme)
assets/main.js          # nav scroll-spy, mobile menu, print button, year
assets/effects.js       # immersive layer: particle-net background, custom cursor,
                        # magnetic buttons, card tilt + spotlight, text scramble,
                        # skills marquee, film grain, scroll progress bar
assets/monogram.svg     # AAM mark (inline in hero)
assets/favicon.svg
```

## Immersive effects

`effects.js` runs only when JavaScript is enabled **and** the user has no
`prefers-reduced-motion: reduce` setting — it then adds `html.fx`, which the CSS
uses as the single gate for every animated effect. Under reduced motion, no-JS,
or print, the page stays fully static, readable, and CV-printable. The particle
canvas re-reads `--accent` on theme toggle (MutationObserver), caps device
pixel ratio at 2, and pauses via `visibilitychange` when the tab is hidden.

## Editing content

All copy lives in `index.html`. Translatable text is paired as
`data-en="..." data-fr="..."` on each element; the `i18n.js` module swaps the visible
text on toggle. Proper nouns and tech names (Kanda, NestJS, etc.) are not translated.

To change contact details, search for the links in the hero (`.hero__cta`) and the
contact section (`.contact__links`).

## Deploy

This repo **is** the deployment: it's a GitHub Pages user-site
(`adalgimercy.github.io`), so the site is served from the `main` branch root at
**https://adalgimercy.github.io/** — every push to `main` deploys.

**Netlify** — drag-and-drop this folder onto the Netlify dashboard.

**Vercel** — import the folder as a new static project (Framework Preset: *Other*).

