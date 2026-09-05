# Accessibility contract

Target: **WCAG 2.2 AA**. The design was built to meet it; the Astro rebuild must not regress. Native elements first, ARIA only where the platform falls short.

## Document

- `<html lang>` and `<html dir>` are set before first paint and updated together whenever the language changes. `ar` implies `dir="rtl"`.
- Landmarks: one `<header>`, one `<main id="main">`, one `<footer>`, `<nav aria-label="Primary">` (the desktop nav and the mobile nav share the label because only one is in the tree at a time), `<aside>` for the sticky project index.
- Skip link is the first focusable element, visible on focus.
- Heading order: `h1` (name, hero) → `h2` per section → `h3` for cards, projects, roles, certificates. No skipped levels, no headings used for size.
- `<title>` and `<meta name="description">` per the design reference. Add `og:` tags and a canonical pointing at `https://MotassemJa.github.io/portfolio`.

## Interactive elements

- Every control is a real `<button>`, `<a>`, `<input>` or `<dialog>`. Nothing clickable is a `div`.
- The command palette is a native `<dialog>` opened with `showModal()` - focus trap, Escape and inert background come from the platform. Focus returns to the ⌘K button on close.
- The theme lab uses the native Popover API (`popover="auto"` + `popovertarget`) - light dismiss and focus handling are free.
- Toggle groups (language, locale demo, hue swatches) use `aria-pressed` on buttons, not `role="radio"`, because each is an immediate action rather than a pending selection.
- The active nav link carries `aria-current="page"`.
- The mobile menu button carries `aria-expanded` and an `aria-label` that changes between open and close. Body scroll is locked while open and restored on close and on language change.
- Range inputs carry `aria-label`, and the token sliders add `aria-valuetext` so a screen reader announces `md` rather than `2`.
- Every icon-only button has an `aria-label`. Every decorative glyph, arrow, dot, hairline, halo and the dot grid is `aria-hidden="true"`.
- Timeline markers are `role="img"` with an `aria-label` naming the kind (Work / Internship / Education), so the icon is not the only signal.

## Focus

```css
:focus-visible{ outline:2px solid var(--accent); outline-offset:3px }
```

Never removed, never replaced with a shadow that vanishes on a colored background. The outline uses the accent, which tracks the hue slider, so verify contrast at a few hue positions - the accent is L 0.855 in dark and L 0.5 in light, both chosen to clear 3:1 against their backgrounds at every hue.

## Color and contrast

- `--fg` on `--bg` and `--fg2` on `--bg` clear AA for body text in both themes. `--fg3` is used only for 11.5-13px metadata; check it stays at or above 4.5:1, and never carry meaning in `--fg3` alone.
- The accent is never the only signal. The pipeline demo pairs color with a changing symbol; the active nav link pairs color with a background and `aria-current`; the current role pairs an accent marker with the visible period text.
- Both themes are first-class. Off-black and off-white, never pure `#000` / `#fff`.
- The hue slider lets a visitor pick any accent. L and C are locked so contrast holds across the full range - do not let the slider touch lightness or chroma.

## Motion

- One global `prefers-reduced-motion: reduce` rule zeroes every animation and transition and resets `animation-timeline`.
- `scroll-behavior: smooth` is inside `@media (prefers-reduced-motion: no-preference)`.
- `document.startViewTransition` is skipped when reduced motion is set.
- Programmatic scroll passes `behavior: 'auto'` under reduced motion.
- No animation loops longer than 5 seconds carry information; the halos and dot drift are ambient only.
- **No `window.addEventListener('scroll')` anywhere.** IntersectionObserver and CSS scroll-driven animations only.

## Dynamic content

- Pipeline completion is announced with `role="status"`.
- The copy-email confirmation is announced politely.
- The palette's filtered result count changes silently, which is acceptable because `aria-activedescendant` moves with the selection and the empty state renders visible text.

## Forms

There is no contact form in this design; contact is a `mailto:` link plus a copy button. If a form is added later, every field needs a real `<label>`, errors need `aria-describedby` plus an `aria-live` region, and the submit state needs a status announcement.

## Progressive enhancement

With JavaScript disabled the page must still render every section, every project, every certificate, and all links must work. Only the theme toggle, language switch, palette, and the four skill demos degrade. Astro's static output gives you this for free as long as content stays out of the islands.

`corner-shape: bevel` and `animation-timeline` are progressive enhancements. Without them the page shows rounded corners and final-state content. Both are correct fallbacks; do not polyfill.

## Verification

Automated:

```bash
npx astro build && npx astro preview &
npx axe http://localhost:4321/portfolio --exit
npx lighthouse http://localhost:4321/portfolio --only-categories=accessibility
```

Manual, none of which axe catches:

1. Tab from the top - skip link appears first, order is header → sections → footer, focus is visible on every stop.
2. Open the palette with ⌘K, arrow through, Enter, Escape - focus returns to the trigger.
3. Switch to Arabic - the whole layout mirrors, the sticky index rail and the timeline move to the right, mono data blocks stay LTR.
4. Set the OS to reduced motion and reload - nothing animates, the theme toggle still works.
5. Zoom to 200% and to 400% - no horizontal scroll, nothing clipped, the hero still fits.
6. Drag the hue slider to several positions in both themes and re-check text and focus-ring contrast.
7. Screen reader pass (VoiceOver or NVDA) over headings, landmarks, and the timeline markers.
