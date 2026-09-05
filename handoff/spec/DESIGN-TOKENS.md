# Design tokens

Everything is derived from **one hue variable**. `--hue` is a bare number (default `125`, green) set on `:root` by JS. Every color is `oklch()` referencing it. Changing `--hue` recolors the entire page, which is what the theme lab does.

## Color - dark theme (default)

```css
:root{
  color-scheme: dark; --hue: 125;
  --bg:  oklch(0.163 0.012 var(--hue));
  --bg2: oklch(0.205 0.014 var(--hue));
  --bg3: oklch(0.262 0.016 var(--hue));
  --fg:  oklch(0.965 0.006 var(--hue));
  --fg2: oklch(0.795 0.009 var(--hue));
  --fg3: oklch(0.63  0.012 var(--hue));
  --line:  oklch(0.95 0.02 var(--hue) / 0.14);
  --line2: oklch(0.95 0.02 var(--hue) / 0.07);
  --dot:   oklch(0.95 0.02 var(--hue) / 0.16);
  --dot2:  oklch(0.95 0.02 var(--hue) / 0.08);
  --accent:     oklch(0.855 0.185 var(--hue));
  --accent-ink: oklch(0.19  0.05  var(--hue));
  --ok:         oklch(0.8   0.14  152);
  --glow:  oklch(0.855 0.185 var(--hue) / 0.16);
  --glow2: oklch(0.855 0.185 var(--hue) / 0.34);
  --shadow: oklch(0.05 0.02 var(--hue) / 0.7);
  --grad: linear-gradient(115deg,
    oklch(0.9   0.15 calc(var(--hue) - 22)) 0%,
    oklch(0.855 0.185 var(--hue))          48%,
    oklch(0.79  0.2  calc(var(--hue) + 26)) 100%);
  --grad-line: linear-gradient(150deg,
    oklch(0.86 0.18 calc(var(--hue) - 22) / 0.5) 0%,
    oklch(0.95 0.03 var(--hue) / 0.1)           42%,
    oklch(0.82 0.19 calc(var(--hue) + 26) / 0.34) 100%);
  --grad-line-hi: linear-gradient(150deg,
    oklch(0.86 0.18 calc(var(--hue) - 22) / 0.92) 0%,
    oklch(0.95 0.03 var(--hue) / 0.2)            42%,
    oklch(0.82 0.19 calc(var(--hue) + 26) / 0.66) 100%);
}
```

## Color - light theme

Applied both by `@media (prefers-color-scheme: light)` on `:root:not([data-theme])` **and** by `:root[data-theme="light"]`. Same declarations in both blocks.

```css
color-scheme: light;
--bg:  oklch(0.982 0.004 var(--hue));
--bg2: oklch(1 0 0);
--bg3: oklch(0.94 0.008 var(--hue));
--fg:  oklch(0.21  0.016 var(--hue));
--fg2: oklch(0.42  0.016 var(--hue));
--fg3: oklch(0.565 0.016 var(--hue));
--line:  oklch(0.21 0.02 var(--hue) / 0.15);
--line2: oklch(0.21 0.02 var(--hue) / 0.07);
--dot:   oklch(0.21 0.03 var(--hue) / 0.34);
--dot2:  oklch(0.21 0.03 var(--hue) / 0.18);
--accent:     oklch(0.5  0.145 var(--hue));
--accent-ink: oklch(0.99 0.01  var(--hue));
--ok:         oklch(0.52 0.13  152);
--glow:  oklch(0.5 0.145 var(--hue) / 0.1);
--glow2: oklch(0.5 0.145 var(--hue) / 0.22);
--shadow: oklch(0.35 0.03 var(--hue) / 0.16);
--grad: linear-gradient(115deg,
  oklch(0.5  0.13  calc(var(--hue) - 22)) 0%,
  oklch(0.46 0.145 var(--hue))           48%,
  oklch(0.4  0.15  calc(var(--hue) + 26)) 100%);
--grad-line: linear-gradient(150deg,
  oklch(0.55 0.15 calc(var(--hue) - 22) / 0.4) 0%,
  oklch(0.3  0.03 var(--hue) / 0.09)          42%,
  oklch(0.5  0.15 calc(var(--hue) + 26) / 0.3) 100%);
--grad-line-hi: linear-gradient(150deg,
  oklch(0.55 0.15 calc(var(--hue) - 22) / 0.8) 0%,
  oklch(0.3  0.03 var(--hue) / 0.18)          42%,
  oklch(0.5  0.15 calc(var(--hue) + 26) / 0.6) 100%);
```

`--dot` / `--dot2` exist only for the hero dot grid; they are darker than `--line` in light theme so the pattern stays visible. Do not merge them back into `--line`.

## Shape - beveled corners, one unit

Every bordered box gets a **top-left and bottom-right bevel**, never rounded. Four tokens, all multiples of `--cut-unit: 5px`, all paired with `corner-shape: bevel`.

```css
--cut-unit: 5px;
--cut:    calc(4 * var(--cut-unit)) 0 calc(4 * var(--cut-unit)) 0;  /* 20px - cards, popovers, dialog, hero CTAs */
--cut-in: calc(3 * var(--cut-unit)) 0 calc(3 * var(--cut-unit)) 0;  /* 15px - panels nested inside a card */
--cut-s:  calc(2 * var(--cut-unit)) 0 calc(2 * var(--cut-unit)) 0;  /* 10px - controls, pills with text */
--cut-xs: var(--cut-unit) 0 var(--cut-unit) 0;                      /*  5px - badges, timeline markers, kbd */
--cap: 999px;
```

Usage: `border-radius: var(--cut-s); corner-shape: bevel;`

`--cap` is the **only** capsule value and is used **only on unbordered** elements: status dots, hairline bars, skeleton lines, the hue-strip in the theme lab, the sticky-index marker. A bordered box never takes `--cap`. Full circles for decorative halos use `border-radius: 50%` (geometry, not a corner treatment).

The one documented exception: the design-tokens demo card in Skills carries its own illustrative 4px-step radius scale (4 / 8 / 12 / 16 / 24 px) driven by its slider. That scale is the demo's *content*, not part of the page shape system.

## Control heights

```css
--ctl-unit: 8px;
--ctl-s: calc(5 * var(--ctl-unit));  /* 40px - icon buttons, inline inputs, segments */
--ctl-m: calc(6 * var(--ctl-unit));  /* 48px - text buttons, social links, palette rows */
--ctl-l: calc(7 * var(--ctl-unit));  /* 56px - hero CTAs */
```

No raw pixel heights on buttons or inputs. The mobile hamburger is the one 44x44 exception (touch target minimum).

## Press

One recipe for every control on the page:

```css
--press: 0.97;
--press-t: .12s;
/* transition: … , scale var(--press-t);  :active { scale: var(--press) } */
```

Two elements layer press over an existing hover and need care:
- **Primary hero CTA** - on `:active` it also drops its hover shadow to `0 6px 16px -10px var(--glow2)` and shortens the transition, so it reads as pressed *into* the surface.
- **Theme-lab swatches** - they already animate `transform: scale(1.12)` on hover, so press uses `transform: scale(1.04)`, not the `scale` property.

Text links have **no** press scale.

## Typography

| Role | Family | Weight |
| --- | --- | --- |
| Display: h1, section h2, project titles | Fira Sans | 400 |
| Prose, UI labels, buttons | Fira Sans | 400 / 500 / 600 |
| Data, meta, code, mono labels | Geist Mono | 400 / 500 |
| Arabic fallback for all prose | IBM Plex Sans Arabic | 400 / 500 / 600 |

Stack: `'Fira Sans','IBM Plex Sans Arabic',system-ui,sans-serif` and `'Geist Mono',ui-monospace,monospace`.

Google Fonts link (preconnect to `fonts.googleapis.com` and `fonts.gstatic.com` first):

```
https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500&family=IBM+Plex+Sans+Arabic:wght@400;500;600&family=Fira+Sans:wght@400;500;600&display=swap
```

### Type scale

| Element | Size | Line height | Tracking |
| --- | --- | --- | --- |
| h1 | `clamp(2.9rem, 8.6vw, 6.5rem)` | 0.96 | -0.025em |
| Section h2 | `clamp(2.3rem, 5.4vw, 4rem)` | 1 | -0.025em |
| Project h3 | `clamp(1.7rem, 3.6vw, 2.5rem)` | 1.08 | -0.02em |
| Mobile nav link | `clamp(1.9rem, 8vw, 2.6rem)` | - | - |
| Contact blurb | `clamp(1.15rem, 2.4vw, 1.6rem)` | 1.6 | - |
| Email link | `clamp(1.05rem, 3.2vw, 2rem)` | - | -0.02em |
| Hero role | `clamp(1.05rem, 2.2vw, 1.35rem)` / 500 | - | - |
| Hero tagline | `clamp(1.02rem, 1.7vw, 1.18rem)` | 1.65 | - |
| About prose | `clamp(1.05rem, 1.7vw, 1.2rem)` | 1.75 | - |
| Hero stat value | `clamp(1.5rem, 3vw, 2rem)` mono 500, tabular-nums | - | -0.02em |
| Skill card h3 | 1.2rem / 600 | - | - |
| Cert h3 | 1.05rem / 600 | 1.45 | balance |
| Exp role h3 | `clamp(1.15rem, 2.2vw, 1.4rem)` / 600 | - | -0.01em |
| Body / bullets | 15px | 1.65 | - |
| Project desc | 1rem | 1.7 | - |
| Nav, palette rows, chips | 14.5px | - | - |
| Mono meta / tags | 11.5-12.5px | - | - |
| Footer | 12.5px | - | - |

`text-wrap: pretty` on paragraphs and bullets; `text-wrap: balance` on cert titles.

## Layout

- Content column: `max-width: 1180px; margin-inline: auto;`
- Gutter: `padding-inline: clamp(1.25rem, 5vw, 3.5rem);`
- Section rhythm: `padding-block: clamp(4.5rem, 13vh, 8.5rem);` + `border-top: 1px solid var(--line2)`
- `scroll-margin-top: 90px` on every section (header is 70px sticky)
- Header: 70px tall, sticky, `background: color-mix(in oklch, var(--bg) 74%, transparent)`, `backdrop-filter: blur(18px) saturate(1.4)`, `border-bottom: 1px solid var(--line2)`
- Mobile breakpoint: `max-width: 900px`

## Motion

| Name | Use | Timing |
| --- | --- | --- |
| `settle` | section content entering view | `1ms linear both` on `view()` timeline, range `entry 0% entry 48%`; from `opacity 0, translateY(30px) scale(.985), blur(7px)` |
| `lift` | h1 lines | `1s cubic-bezier(.16,.84,.24,1)`, delays .12s / .24s, from `translateY(112%)` inside `overflow:hidden` |
| `rise` | hero elements, mobile nav items | `.7-1s cubic-bezier(.2,.8,.2,1)`, staggered .38 / .5 / .62 / .74 / .86s |
| `lineIn` | section header hairline | `scale 0 1 → 1 1` on `view()`, range `entry 0% entry 60%` |
| `lineY` | experience timeline accent line | `scale 1 0 → 1 1` on `view()`, range `entry 30% cover 55%` |
| `growbar` | top scroll progress bar | on `scroll(root)` timeline |
| `halo` | ambient accent glow, hero + contact | 28s / 32s ease-in-out infinite alternate; translate + scale 1 → 1.16 |
| `drift` | hero dot grid | 40s linear infinite; `background-position` to `120px -120px, 60px -60px` |
| `pulseDot` | availability dot | 2.6s ease-out infinite box-shadow ring |
| `expNow` | current-role timeline marker | box-shadow ring pulse |
| `spin` | pipeline running step | `rotate 360deg` |
| Hover lift | cards | `translateY(-3px)` skills, `-4px` work + certs, `.4-.45s cubic-bezier(.2,.8,.2,1)` |
| Theme switch | `document.startViewTransition` | `::view-transition-old/new(root)` `.45s` |

Reduced motion: one global rule kills all of it.

```css
@media (prefers-reduced-motion: reduce){
  *,*::before,*::after{
    animation-duration:.01ms!important; animation-iteration-count:1!important;
    transition-duration:.01ms!important; animation-timeline:auto!important;
  }
}
```

`html{scroll-behavior:smooth}` is wrapped in `@media (prefers-reduced-motion: no-preference)`, and the JS `goto()` passes `behavior:'auto'` when reduced motion is set.

## Global base

```css
body{ margin:0; background:var(--bg); color:var(--fg);
  font-family:'Fira Sans','IBM Plex Sans Arabic',system-ui,sans-serif;
  -webkit-font-smoothing:antialiased; text-rendering:optimizeLegibility; overflow-x:clip }
a{ color:var(--accent); text-underline-offset:3px }
a:hover{ color:var(--fg) }
::selection{ background:var(--accent); color:var(--accent-ink) }
::placeholder{ color:var(--fg3); opacity:1 }
:focus-visible{ outline:2px solid var(--accent); outline-offset:3px }
dialog::backdrop{ background:oklch(0.12 0.02 125 / 0.5); backdrop-filter:blur(6px); animation:fade .35s ease both }
```
