# Handoff: Motassem Jalal Aldeen - Portfolio (Astro + GitHub Pages)

## Overview

A single-page personal portfolio for Motassem Jalal Aldeen, Senior Software Engineer, Fürth, Germany. One scrolling page with seven sections: hero, About, Skills, Selected work, Experience, Certificates, Contact. Three languages (EN / DE / AR, with AR flipping the page to RTL), a light/dark theme, a live accent-hue theme lab, and a ⌘K command palette.

The task is to rebuild it as an **Astro site deployed to GitHub Pages** at `https://MotassemJa.github.io/portfolio`.

## About the design files

`design-reference/Portfolio.dc.html` is a **design reference created in HTML**, not production code to copy. It is a prototype of look and behavior. It runs on a proprietary component runtime (`support.js`, the `<x-dc>` / `<sc-for>` / `<sc-if>` tags, `renderVals()`) that must **not** be carried into the Astro project. Read it for exact values, copy, and interaction detail, then reimplement in idiomatic Astro + React.

Open it directly in a browser to see the live design.

Two earlier explorations are not part of this handoff (`Portfolio v1 (pre-Taste).dc.html`, `Portfolio v2 (brutalist).dc.html`). Build from `Portfolio.dc.html` only.

## Fidelity

**High fidelity.** Colors, type scale, spacing, corner geometry, motion timings and copy are all final. Reproduce them exactly. Every value is listed in `spec/DESIGN-TOKENS.md`; all copy in all three languages is in `spec/CONTENT.md`.

## Decisions already made

| Question | Answer |
| --- | --- |
| Repo | `MotassemJa/portfolio` |
| Deploy | GitHub Pages project page, `https://MotassemJa.github.io/portfolio` |
| i18n | Client-side switch, one page, no locale URLs |
| Interactivity | React islands via `@astrojs/react` |
| Content | Astro content collections |
| Package manager | npm |

## Read next

1. `SETUP.md` - the exact commands to scaffold, init git, create the remote, and deploy. Start here.
2. `spec/DESIGN-TOKENS.md` - every color, size, radius, duration.
3. `spec/SECTIONS.md` - layout and component spec, section by section.
4. `spec/CONTENT.md` - all copy, EN / DE / AR, plus structured data.
5. `spec/INTERACTIONS.md` - state, islands, keyboard, storage.
6. `spec/ACCESSIBILITY.md` - the a11y contract this build must meet.
7. `starter/` - drop-in config files (Astro config, Pages workflow, tokens CSS, content schemas).

## Assets

- `assets/headshot.jpeg` - the portrait for the hero slot. Serve via `astro:assets` (`<Image>`), 4:5 crop.
- Fonts: Fira Sans (prose), Geist Mono (data/labels), IBM Plex Sans Arabic (Arabic fallback). Google Fonts, weights 400/500/600.
- No other images. Icons are inline SVG paths, listed in `spec/CONTENT.md`.

## Files in this bundle

```
README.md
SETUP.md
assets/headshot.jpeg
design-reference/Portfolio.dc.html   <- the design, open in a browser
design-reference/support.js          <- prototype runtime, do NOT port
design-reference/image-slot.js       <- prototype image placeholder, do NOT port
spec/DESIGN-TOKENS.md
spec/SECTIONS.md
spec/CONTENT.md
spec/INTERACTIONS.md
spec/ACCESSIBILITY.md
starter/astro.config.mjs
starter/deploy.yml
starter/tokens.css
starter/content.config.ts
```
