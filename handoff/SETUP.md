# Setup: local project, git, GitHub, Pages

Run these in order. Everything assumes macOS/Linux with Node 20+, npm, git, and the GitHub CLI (`gh`) authenticated. If `gh` is not installed: `brew install gh && gh auth login`.

## 1. Scaffold Astro

```bash
cd ~/projects            # or wherever you keep repos
npm create astro@latest portfolio -- --template minimal --typescript strict --no-install --no-git
cd portfolio
npm install
```

`--no-git` on purpose: we init the repo ourselves in step 3 so the first commit is a clean, complete tree.

## 2. Add integrations

```bash
npx astro add react --yes
npx astro add sitemap --yes
```

## 3. Init git

```bash
git init -b main
printf 'node_modules\ndist\n.astro\n.DS_Store\n.env\n' > .gitignore
git add -A
git commit -m "Scaffold Astro portfolio"
```

## 4. Create the GitHub remote

```bash
gh repo create MotassemJa/portfolio --public --source=. --remote=origin --push
```

If the repo already exists:

```bash
git remote add origin git@github.com:MotassemJa/portfolio.git
git push -u origin main
```

## 5. Configure Astro for a project page

Copy `starter/astro.config.mjs` over the generated one. The two lines that matter:

```js
site: 'https://MotassemJa.github.io',
base: '/portfolio',
```

Because `base` is set, **never hardcode a root-relative asset path**. Use `import.meta.env.BASE_URL` or Astro's `<Image>` / `import` handling. In-page anchors (`#work`, `#contact`) are unaffected.

## 6. Add the Pages workflow

```bash
mkdir -p .github/workflows
cp <handoff>/starter/deploy.yml .github/workflows/deploy.yml
```

Then in the repo: **Settings → Pages → Build and deployment → Source = GitHub Actions**. Or:

```bash
gh api -X POST repos/MotassemJa/portfolio/pages -f build_type=workflow
```

## 7. Project structure to build toward

```
src/
  pages/index.astro
  layouts/Base.astro
  styles/tokens.css            <- from starter/
  content.config.ts            <- from starter/
  content/
    projects/*.json
    experience/*.json
    certificates/*.json
  i18n/
    en.ts  de.ts  ar.ts  index.ts
  components/
    Hero.astro  About.astro  Skills.astro  Work.astro
    Experience.astro  Certificates.astro  Contact.astro
    Header.astro  Footer.astro
  islands/
    PrefsProvider.tsx          <- lang + theme + hue, one store
    LangSwitch.tsx  ThemeToggle.tsx  ThemeLab.tsx
    CommandPalette.tsx  MobileMenu.tsx
    demos/SignalDemo.tsx  TokenDemo.tsx  LocaleDemo.tsx  PipelineDemo.tsx
    CopyEmail.tsx
public/
  favicon.svg
```

## 8. Deploy and verify

```bash
git add -A && git commit -m "Portfolio: sections, i18n, islands" && git push
gh run watch
open https://MotassemJa.github.io/portfolio
```

## 9. Accessibility gate before you call it done

```bash
npm i -D @axe-core/cli
npx astro build && npx astro preview &
npx axe http://localhost:4321/portfolio --exit
```

Zero violations required. Also run the manual checklist in `spec/ACCESSIBILITY.md` - axe catches maybe half of what matters here.

## Notes and gotchas

- **Islands must share state.** Language, theme and hue are read by the header, the palette, the theme lab and every section. Put them in one tiny store (nanostores `@nanostores/react`, or a plain module with `useSyncExternalStore`) so islands hydrate independently but stay in sync. Do not lift them into a single giant `client:load` island; that defeats Astro.
- **Flash of wrong theme.** Read `localStorage` in a blocking inline `<script is:inline>` in `<head>` and set `document.documentElement.dataset.theme`, `.lang`, `.dir` and `--hue` before first paint.
- **`corner-shape: bevel` is progressive.** Browsers without it fall back to rounded corners at the same radius. That is acceptable. Do not polyfill with clip-path.
- **Animation timelines** (`animation-timeline: view()` / `scroll(root)`) are also progressive. Unsupported browsers show content in its final state, which is correct. There is deliberately no `window.addEventListener('scroll')` anywhere; keep it that way.
- **Arabic.** Setting `dir="rtl"` on `<html>` does most of the work because the design uses logical properties throughout (`inset-inline-start`, `padding-inline`, `text-align: start`). Code and data blocks stay `dir="ltr"`.
