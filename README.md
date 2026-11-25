# Portfolio — André Adonis Mounguengui

Personal portfolio + printable CV. A single-page static site, no frameworks, no build step.

- **Live title:** AI & Full-Stack Software Engineer
- **Appearance:** light by default, with a persistent dark mode and reduced-motion support
- **Languages:** English (default) + French toggle
- **Print:** click **Download CV** or press Ctrl/Cmd-P, then choose **Save as PDF**

## Run locally

Open `index.html` directly or serve the folder locally.

```bash
python -m http.server 8080
# then open http://localhost:8080
```

## Files

```
index.html              # all content & structure (bilingual via data-en/data-fr)
assets/styles.css       # tokens, layout, components, responsive, @media print
assets/i18n.js           # FR/EN toggle (localStorage + ?lang=)
assets/theme.js          # light/dark preference and browser theme color
assets/main.js           # navigation, mobile menu, and print behavior
assets/hero-sculpture.webp # hero artwork
assets/*.woff2           # local Bricolage Grotesque and Instrument Sans fonts
assets/*-OFL.txt         # font licenses
assets/favicon.svg      # monogram used in the header and browser tab
```

## Editing content

All copy lives in `index.html`. Translatable text is paired as
`data-en="..." data-fr="..."` on each element; the `i18n.js` module swaps the visible
text on toggle. Proper nouns and tech names (Kanda, NestJS, etc.) are not translated.

To change contact details, edit the links in the contact section
(`.contact__links`) and the structured profile in the page head.

## Deploy

This repo **is** the deployment: it's a GitHub Pages user-site
(`adalgimercy.github.io`), so the site is served from the `main` branch root at
**https://adalgimercy.github.io/** — every push to `main` deploys.

**Netlify** — drag-and-drop this folder onto the Netlify dashboard.

**Vercel** — import the folder as a new static project (Framework Preset: *Other*).

