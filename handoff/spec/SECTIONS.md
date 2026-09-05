# Sections

Order in `<main>`: hero, about, skills, work, experience, certs, contact. Above `<main>`: skip link, scroll progress bar, header, mobile menu. Below: footer, command palette `<dialog>`, theme lab popover.

Every section: `id`, `aria-labelledby` pointing at its own `h2`, `scroll-margin-top: 90px`, `padding-block: clamp(4.5rem,13vh,8.5rem)`, `border-top: 1px solid var(--line2)`.

Every section header is the same unit: `h2` + a flex-1 1px hairline that grows in on scroll.

```html
<div style="display:flex;align-items:flex-end;gap:20px;margin-bottom:clamp(2.2rem,5vh,3.2rem)">
  <h2 id="h-work">Selected work</h2>
  <span aria-hidden="true" style="flex:1;height:1px;background:var(--line);margin-bottom:12px;
    scale:0 1;transform-origin:left;animation:lineIn 1ms linear both;
    animation-timeline:view();animation-range:entry 0% entry 60%"></span>
</div>
```

`transform-origin` is `left` in LTR, `right` in RTL. Same for the scroll progress bar.

---

## Chrome

### Skip link
First focusable element. `position:fixed; top:-70px; inset-inline-start:16px; z-index:100`, moves to `top:14px` on `:focus`. Accent background, `--accent-ink` text, `--cut-s` bevel, weight 600.

### Scroll progress bar
`position:fixed; inset-block-start:0; inset-inline:0; height:2px; background:var(--accent); z-index:90`, driven by `animation: growbar 1ms linear both; animation-timeline: scroll(root)`. `aria-hidden`.

### Header
70px, sticky, `z-index:80`. Left: wordmark `mja()` with the parens in `--accent`, Geist Mono 15px/500, `dir="ltr"`, links to `#top`. Center (desktop only): `<nav aria-label="Primary">` with six links, `padding:9px 15px`, `--cut-s`, 14.5px/500; active link gets `aria-current="page"`, `--fg` color and `--bg2` background. Right cluster, gap 8px:

1. Language segmented group (desktop) - `role="group" aria-label` from `t.langSw`, 1px border, `--cut-s`, 3px padding, three buttons `min-width/height: var(--ctl-s)`, Geist Mono 12px, `aria-pressed`.
2. Theme lab trigger - `popovertarget="themelab"`, 40x40, `--cut-s`, bordered, contains a 15px accent dot with `box-shadow: 0 0 14px var(--glow2)`.
3. Theme toggle - 40x40, `--cut-s`, bordered, icon glyph, `aria-label` from `t.themeTo`.
4. ⌘K button (desktop) - Geist Mono 12px, bordered, `--cut-s`, `min-height: var(--ctl-s)`, `dir="ltr"`.
5. Hamburger (mobile) - 44x44, two 22x1.5px bars, gap 6px, `--cap`, rotate into an X on open, `aria-expanded`.

Hover on the bordered buttons: `border-color: var(--accent)`. All get the press scale.

### Mobile menu
Full-screen overlay, `z-index:75`, `background: color-mix(in oklch, var(--bg) 90%, transparent)`, `backdrop-filter: blur(22px)`, `padding-top: 92px`. Six links stacked, `clamp(1.9rem,8vw,2.6rem)`, each `border-bottom: 1px solid var(--line2)`, `padding: 15px 6px`, staggered `rise`. Language buttons below at `min-height: var(--ctl-m)`. Opening sets `document.documentElement.style.overflow = 'hidden'`. Escape closes.

---

## 1. Hero (`#hero`)

`min-height: calc(100svh - 70px)`, flex centered, `overflow: clip`, `position: relative`.

Two decorative layers, both `aria-hidden`, both `pointer-events:none`:

**Dot grid** - `position:absolute; inset:0`, two stacked radial-gradient dot lattices:
```css
background-image:
  radial-gradient(circle, var(--dot)  1px, transparent 1.4px),
  radial-gradient(circle, var(--dot2) 1px, transparent 1.4px);
background-size: 60px 60px, 30px 30px;
mask-image: radial-gradient(120% 90% at 30% 25%, black 0%, transparent 72%);
animation: drift 40s linear infinite;
```

**Halo** - `top:-30%`, centered, `width:min(1150px,135vw)`, `aspect-ratio:1`, `border-radius:50%`, `radial-gradient(circle, var(--glow) 0%, transparent 62%)`, `filter: blur(24px)`, `animation-name: var(--amb, halo)` 28s ease-in-out infinite alternate. `--amb` is set to `none` by the calm motion setting.

Content row: `flex; flex-wrap:nowrap; gap:clamp(1rem,4vw,3.5rem)`.

**Left column** (`flex:1 1 auto; min-width:0`), in order:
1. Availability pill - inline-flex, 1px border, `--cut-s`, `padding:8px 16px 8px 13px`, `--bg2`; 7px `--ok` dot with `pulseDot`; 13px `--fg2` text (`t.avail`).
2. `h1` - two lines, each wrapped in `overflow:hidden` with `padding-block:.1em`, inner span animated with `lift`.
3. Role row - accent role text, a 26px hairline, then mono 13px location.
4. Tagline `p` - `max-width: 56ch`, `--fg2`.
5. Stats row - three items, `gap: clamp(1.8rem,5vw,4rem)`. Value: mono, tabular-nums, `dir="ltr"`. Label: 13px `--fg3`, 6px above.
6. CTA row, gap 12px:
   - Primary `#work`: `background: var(--grad)`, `--accent-ink` text, 15px/600, `padding:16px 30px`, `min-height: var(--ctl-l)`, `--cut`. Hover `box-shadow: 0 16px 40px -14px var(--glow2); scale:1.02`.
   - Secondary `#contact`: gradient border via `linear-gradient(var(--bg2),var(--bg2)) padding-box, var(--grad-line-hi) border-box`, `--fg` text, 15px/500, same box metrics.
   - Both use a pointer-magnet effect (`translate` follows the cursor slightly, resets on leave). Skip on coarse pointers.

**Right column** (`flex:0 1 clamp(88px,24vw,320px)`): a 4:5 frame, 6px padding, gradient border, `--cut`, `box-shadow: 0 30px 70px -34px var(--shadow)`, inner `--cut-in` clip holding the headshot. In Astro use `<Image src={headshot} alt="" width={640} height={800} />` - decorative, so empty alt, since the name is already the `h1`.

---

## 2. About (`#about`)

Two columns, `grid-template-columns: repeat(auto-fit, minmax(min(100%,330px), 1fr))`, `gap: clamp(2rem,5vw,4rem)`, `align-items:start`.

Left: two paragraphs, `clamp(1.05rem,1.7vw,1.2rem)` / 1.75 / `--fg2`.

Right: a facts card - gradient border, `--cut`, `padding: clamp(1.3rem,3vw,1.8rem)`, `box-shadow: 0 24px 60px -40px var(--shadow)`. Four rows, each `display:flex; justify-content:space-between; padding:12px 2px; border-bottom:1px solid var(--line2)`; key in mono 12.5px `--fg3`, value 14.5px/500 `text-align:end`. Then the availability line with a static `--ok` dot.

---

## 3. Skills (`#skills`)

Header, then intro `p` (`max-width:52ch`), then a 2x2 grid: `repeat(auto-fit, minmax(min(100%,420px), 1fr))`, gap 20px.

All four cards share the shell: gradient border, `--cut`, `padding: clamp(1.3rem,3vw,1.8rem)`, flex column gap 14px, `overflow:hidden`, hover `--grad-line-hi` + `translateY(-3px)`, plus a **spotlight layer** - an absolutely positioned `radial-gradient(340px circle at var(--mx) var(--my), var(--glow), transparent 68%)` at `opacity:0`, faded in on pointer move with `--mx`/`--my` set from the event. Card header: `h3` 1.2rem/600 + a mono 11.5px tag line (`dir="ltr"`).

Each card holds a nested panel: `border: 1px solid var(--line2); background: var(--bg); border-radius: var(--cut-in); padding:16px`.

**Card 1 - State & reactivity.** A labelled text input framed by mono `signal(` / `)` spans. Below a hairline, three derived rows in a `88px 16px 1fr` grid: function name, an accent arrow, the derived value. Derivations: uppercase, length, reversed, or similar - one source, three outputs, all recomputed live. Input is `--cut-xs`, `min-height: var(--ctl-s)`, `maxlength=40`.

**Card 2 - Design systems.** Two range sliders (`--radius`, `--space`, each 0-4 step 1, `accent-color: var(--accent)`, `aria-valuetext` = the token name), a mono scale readout of all five steps with the active one highlighted, and a live preview card whose `border-radius`, `padding` and `gap` follow the sliders. Radii `[4,8,12,16,24]`, spaces `[8,12,16,24,32]`, steps `['xs','sm','md','lg','xl']`. This card's rounded radii are intentional - see the tokens doc.

**Card 3 - Internationalization.** Three locale buttons (`de-DE`, `en-US`, `ar-EG`) in a `role="group" aria-label="Locale"`, `aria-pressed`. Below, an `82px 1fr` grid showing the same source data formatted through `Intl` for the picked locale: a number, a currency, a relative date, plus a `dir` row rendering `ltr`/`rtl` in accent. Use the real `Intl.NumberFormat` / `Intl.DateTimeFormat` / `Intl.RelativeTimeFormat` APIs, not hardcoded strings.

**Card 4 - Delivery.** Five pipeline rows in an `18px 1fr auto` grid: status symbol, step name, duration. Steps: install 4.2s, lint 1.8s, test 6.3s, build 12.4s, deploy 8.1s. A `run pipeline` button (mono 12.5px, accent border, `--cut-s`, `min-height: var(--ctl-m)`, hover `background: var(--glow)`) advances the steps on an interval; the running step spins, done steps turn accent. On completion a `role="status"` line reads `deployed - zero downtime` in `--ok`.

Below the grid: `Also in the toolbox` label, then a `ul` of chips - `li`, 1px border, `--bg2`, `--cut-s`, `padding:9px 18px`, 14px `--fg2`, hover `border-color: var(--accent); translateY(-2px)`. Twelve chips, split from `t.also` on `·`.

---

## 4. Work (`#work`)

Row: `flex; flex-wrap:wrap; align-items:flex-start; gap: clamp(2rem,5vw,4.5rem)`.

**Sticky index** (`flex: 0 0 240px; position:sticky; top:110px`), shown only in `sticky` mode and hidden on mobile. A 1px vertical rail plus a 2px accent marker (`--cap`, height 42px) that translates to `activeIndex * 42px` with `.5s cubic-bezier(.2,.8,.2,1)`. Five links, each 42px tall, mono number + title, hover shifts `padding-inline-start` to 5px. Below: `internal project - details on request`, 13px `--fg3`, `max-width:30ch`.

**Cards** (`flex: 1 1 460px`), gap `clamp(1rem,2.5vh,1.4rem)`. Each is an `<article data-proj="{id}">` with the same gradient-border + spotlight shell as the skills cards, `padding: clamp(1.5rem,3.5vw,2.4rem)`, `scroll-margin-top:110px`, hover `translateY(-4px)` + `box-shadow: 0 30px 70px -40px var(--shadow)`.

Content: a mono row with the accent index (`01`…) left and the year right; `h3` at `clamp(1.7rem,3.6vw,2.5rem)`; a mono meta line; a description `p` (`max-width:62ch`, 1rem/1.7); a status pill (1px border, `--cut-s`, `padding:7px 15px`, mono 11.5px).

An `IntersectionObserver` with `rootMargin: '-30% 0px -55% 0px'` on `[data-proj]` sets the active project for the marker.

`workMode: 'stacked'` drops the sticky index entirely.

---

## 5. Experience (`#experience`)

Legend row first: three items, each a 26px `--cut-xs` bordered square holding a 13px inline SVG icon, plus a 13.5px `--fg3` label (Work / Internship / Education).

Then a `<ul>` with `padding-inline-start: clamp(2.4rem,5vw,3.4rem)` and `gap: clamp(2.2rem,6vh,3.2rem)`, plus two absolutely positioned 1px vertical lines at `inset-inline-start:17px`: the static `--line` rail and the accent one that scales in with `lineY`.

Each `<li>`: a marker square pulled into the gutter (`inset-inline-start: calc(-1 * clamp(2.4rem,5vw,3.4rem) + 5px)`, 26px, `--cut-xs`, `background: var(--bg)`, 1px border in the kind color, `box-shadow: 0 0 0 5px var(--bg)`, `role="img"` with an `aria-label` naming the kind). The current role's marker also runs `expNow`. Then: mono period line (`dir="ltr"`), `h3` role, company in 14.5px/500 (accent for the current role), a bullet list (5px `--cap` accent dots at `opacity:.7`, 15px/1.65 text), and an optional mono tag line.

Five entries, `EXPKIND = ['work','work','work','internship','education']`. Icon paths are in `CONTENT.md`.

---

## 6. Certificates (`#certs`)

Grouped by field. Each group: a label row (14px/500 `--fg2` + a flex-1 `--line2` hairline), then a `ul` grid `repeat(auto-fit, minmax(min(100%,290px), 1fr))`, gap 16px.

Each `li` is a card: gradient border (pinned certs get a brighter one), `--cut`, `padding: clamp(1.2rem,2.5vw,1.5rem)`, flex column gap 14px, spotlight layer, hover `translateY(-4px)` + `box-shadow: 0 26px 60px -40px var(--shadow)`. Content: a mono row with accent issuer left and date right; `h3` 1.05rem/600 `text-wrap:balance` taking `flex:1`; a `verify credential ↗` link - `target="_blank" rel="noopener noreferrer"`, 1px border, `--cut-s`, `padding:9px 16px`, `min-height: var(--ctl-s)`, hover turns border and text accent.

---

## 7. Contact (`#contact`)

`overflow:clip`, with a second halo anchored `bottom:-45%`, `width:min(900px,120vw)`, 32s.

Blurb `p` at `clamp(1.15rem,2.4vw,1.6rem)` / 1.6, `max-width:34ch`.

Email block: a 13px `--fg3` label, then the `mailto:` link at `clamp(1.05rem,3.2vw,2rem)`/500 with an animated underline (`background-image: linear-gradient(var(--accent),var(--accent))`, `background-size: 0% 1.5px` → `100% 1.5px` over `.5s`), plus a copy button (mono 12px, bordered, `--cut-s`, `min-height: var(--ctl-s)`) that swaps its label to `copied ✓` in `--ok` for ~1.6s.

Social row: bordered pills, `--bg2`, `--cut-s`, `padding:12px 22px`, `min-height: var(--ctl-m)`, 14.5px/500, trailing accent `↗`, pointer-magnet on hover.

**Real URLs to use:**
- GitHub - `https://github.com/MotassemJa`
- LinkedIn - `https://www.linkedin.com/in/motassem-jalal-71b507a5/`
- Xing - no URL supplied. Drop the Xing pill until one exists; do not ship a `#`.

## Footer

`border-top: 1px solid var(--line2)`, `padding-block: 28px`, flex space-between, 12.5px `--fg3`. Left the copyright line, right a `back to top` link to `#top` that turns accent on hover.
