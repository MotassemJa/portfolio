// Regression test for the cascade bug where tokens.css's unlayered `a { color }`
// beat every layered link rule in app.css, making the CTA and skip-link text
// invisible. axe misses both: it cannot measure contrast against a
// background-image, and the skip link is off-screen until focused.
import { chromium } from 'playwright';

const URL = process.argv[2] ?? 'http://localhost:4321/portfolio/';

// selector -> the CSS custom property its text colour must resolve to
const EXPECTED = {
  'a.cta-primary': '--accent-ink',
  'a.cta-secondary': '--fg',
  '.skip': '--accent-ink',
  '.nav-link': '--fg3',
  '.wordmark': '--fg',
  '.idx-link:not(.on)': '--fg3',
  '.verify': '--fg2',
  '.social': '--fg',
  '.email-link': '--fg',
  '.footer-inner a': '--fg3',
};

const browser = await chromium.launch();
let failed = 0;

for (const scheme of ['dark', 'light']) {
  const ctx = await browser.newContext({ colorScheme: scheme });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: 'networkidle' });

  const results = await page.evaluate((expected) => {
    // Resolve the token through a probe element so both sides go through the
    // browser's own colour serialisation - comparing against the raw custom
    // property text trips over `.19` vs `0.19`.
    const probe = document.createElement('span');
    document.body.appendChild(probe);
    const resolve = (token) => {
      probe.style.color = '';
      probe.style.color = `var(${token})`;
      return getComputedStyle(probe).color;
    };
    const out = Object.entries(expected).map(([sel, token]) => {
      const el = document.querySelector(sel);
      if (!el) return { sel, missing: true };
      return { sel, token, actual: getComputedStyle(el).color, want: resolve(token) };
    });
    probe.remove();
    return out;
  }, EXPECTED);

  for (const r of results) {
    if (r.missing) {
      console.log(`FAIL ${scheme} ${r.sel} — element not found`);
      failed++;
    } else if (r.actual !== r.want) {
      console.log(`FAIL ${scheme} ${r.sel} — is ${r.actual}, expected ${r.token} (${r.want})`);
      failed++;
    } else {
      console.log(`ok   ${scheme} ${r.sel} = ${r.token}`);
    }
  }
  await ctx.close();
}

await browser.close();
console.log(failed === 0 ? '\nlink colours OK' : `\n${failed} failure(s)`);
process.exit(failed === 0 ? 0 : 1);
