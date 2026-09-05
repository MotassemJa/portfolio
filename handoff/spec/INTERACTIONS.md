# Interactions, state, islands

## Shared state

Three preferences drive the whole page and are read by several islands at once. Put them in one small store (nanostores + `@nanostores/react`, or a plain module with `useSyncExternalStore`) rather than a single mega-island.

| Key | Values | Default |
| --- | --- | --- |
| `lang` | `'en' \| 'de' \| 'ar'` | `'en'` |
| `theme` | `'light' \| 'dark'` | system preference until the user touches it |
| `hue` | `0-360` | `125` |
| `themeTouched` / `hueTouched` | boolean | false |

Persisted to `localStorage` under **`mja.prefs.v2`** as `{ lang, theme, themeTouched, hue, hueTouched }`. Keep the key and shape so existing visitors keep their settings. Wrap reads and writes in try/catch; private-mode failures must not break the page.

`themeTouched` / `hueTouched` exist so an untouched visitor keeps following the system, while a deliberate choice sticks.

### Applying state

One function writes all of it to `<html>`:

```js
const d = document.documentElement;
d.lang = lang;
d.dir  = lang === 'ar' ? 'rtl' : 'ltr';
d.dataset.theme = theme;
d.style.setProperty('--hue', hue);
```

Run the same logic in a blocking `<script is:inline>` in `<head>` before first paint, or the page flashes the wrong theme and language.

### Theme switching

```js
if (document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.startViewTransition(() => { document.documentElement.dataset.theme = next; });
} else {
  document.documentElement.dataset.theme = next;
}
```

## Islands

| Island | Directive | Why |
| --- | --- | --- |
| `PrefsBoot` (inline head script) | none | pre-paint theme/lang, no hydration |
| `Header` controls (lang, theme, lab, ⌘K, menu) | `client:load` | above the fold, immediately interactive |
| `CommandPalette` | `client:idle` | keyboard-summoned, can wait |
| Skills demos (4) | `client:visible` | below the fold, self-contained |
| `CopyEmail` | `client:visible` | below the fold |
| Scroll-spy (nav + work index) | `client:idle` | pure IntersectionObserver |

Everything else - all seven sections, all content - is **static Astro**. No hydration. The page must read completely with JS disabled.

## Keyboard

| Key | Action |
| --- | --- |
| `⌘K` / `Ctrl+K` | toggle the command palette (`preventDefault`) |
| `Escape` | close the palette (native `<dialog>`), or the mobile menu |
| `↑` / `↓` | move the palette selection |
| `Enter` | run the selected palette action |
| `Tab` | native order; palette traps focus via `<dialog>.showModal()` |

## Command palette

A native `<dialog>` opened with `showModal()` - it gives focus trap, Escape, and the backdrop for free. Do not rebuild it from divs.

- Input is `role="combobox"`, `aria-expanded="true"`, `aria-controls="pal-list"`, `aria-activedescendant` pointing at the selected option id.
- List is `<ul id="pal-list" role="listbox">`, options are `<li role="option" id="pal-N" aria-selected>`.
- Each row: accent mono icon (20px, centered), 14.5px label, mono 10.5px kind tag on the end. `min-height: var(--ctl-m)`, `--cut-s`, selected row gets a `--bg3` background.
- Clicking the backdrop closes it (compare `event.target` to the dialog element).
- Actions: six `Go to <section>`, toggle theme, shuffle accent hue, copy email address, and a `sudo hire-me` easter egg that scrolls to contact. Kinds are localized (`kGo`, `kTheme`, `kLang`, `kContact`, `kEgg`).
- Filtering is a case-insensitive substring match on the label. Empty result shows the localized `palNone` line.
- Reset `q` and `sel` to empty/0 on open; focus the input.

## Theme lab

A `popover="auto"` div triggered by `popovertarget` - native light-dismiss, no JS. Fixed `top:78px; inset-inline-end:16px`, 300px wide, `--cut`, `--bg2`, `box-shadow: 0 30px 80px -30px var(--shadow)`.

Contents: title, a 10px `--cap` hue strip (`linear-gradient(to right in oklch longer hue, oklch(0.75 0.15 0), oklch(0.75 0.15 359))`), a `0-360` range input with `accent-color: var(--accent)` and an `aria-label`, six preset swatches (30px, `--cut-xs`, `aria-pressed`, 2px border that turns accent when active), and a mono readout `oklch(L C <hue>)` with the hue in accent.

The swatches use `transform: scale()` for hover and press, not the `scale` property, because hover already animates transform.

## Scroll behavior

Two `IntersectionObserver`s, no scroll listeners anywhere:

```js
// active nav section
new IntersectionObserver(cb, { rootMargin: '-40% 0px -55% 0px' })  // on main section[id]
// active project for the sticky index marker
new IntersectionObserver(cb, { rootMargin: '-30% 0px -55% 0px' })  // on [data-proj]
```

Programmatic scroll accounts for the 70px header:

```js
const y = el.getBoundingClientRect().top + window.scrollY - 90;
window.scrollTo({ top: y, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
```

## Pointer effects

- **Spotlight** on skills, work and cert cards: `onPointerMove` sets `--mx` / `--my` on the card and fades the gradient layer to `opacity:1`; `onPointerLeave` fades it back. Gate on `matchMedia('(hover: hover) and (pointer: fine)')`.
- **Magnet** on hero CTAs and social pills: `translate` follows the cursor by a few pixels, resets on leave. Same gate.

Neither is required for comprehension; both are decoration.

## Copy email

`navigator.clipboard.writeText('Motassem.Jalal-Aldeen@outlook.com')`, then swap the button label to the localized `copied ✓` in `--ok` for about 1.6s. Announce it - `aria-live="polite"` on the label, or a visually hidden status region. Clear the timeout on unmount.

## Console easter egg

The prototype logs a styled greeting and exposes `window.motassem = { hire(), stack, hue(h) }`. Optional. If you keep it, keep it out of the critical path.

## Media queries in JS

```js
matchMedia('(max-width: 900px)')                        // mobile layout + menu
matchMedia('(hover: hover) and (pointer: fine)')        // enable pointer effects
matchMedia('(prefers-reduced-motion: reduce)')          // scroll + view transitions
matchMedia('(prefers-color-scheme: light)')             // initial theme
```

Add and remove listeners in effect cleanup. Disconnect both observers and clear all timers on unmount.

## Props that were tweakable in the prototype

Three knobs existed in the design tool. In Astro they become build-time config or drop out:

- `accentHue` (0-360, default 125) - the initial hue, overridden by a stored `hueTouched`.
- `motion` (`full` | `calm`) - sets `--amb` to `halo` or `none`, freezing the ambient glows. Worth keeping as a site constant.
- `workMode` (`sticky` | `stacked`) - shows or hides the sticky project index. Ship `sticky`.
