// Accessibility gate. Runs axe across the states axe-cli alone cannot reach:
// both themes, Arabic/RTL, the open command palette, and the mobile layout.
// Usage: npx astro build && npx astro preview & node scripts/a11y-audit.mjs <outDir>
import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';

const URL = 'http://localhost:4321/portfolio/';
const OUT = process.argv[2] ?? '.';
let failures = 0;

async function audit(page, name) {
  const r = await new AxeBuilder({ page }).analyze();
  const v = r.violations;
  console.log(`${v.length === 0 ? 'PASS' : 'FAIL'}  ${name}  (${v.length} violations)`);
  for (const x of v) {
    failures++;
    console.log(`      ${x.id} [${x.impact}] x${x.nodes.length}: ${x.help}`);
    console.log(`        e.g. ${x.nodes[0].target.join(' ')}`);
  }
}

const browser = await chromium.launch();

for (const scheme of ['light', 'dark']) {
  const ctx = await browser.newContext({ colorScheme: scheme, viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: 'networkidle' });
  await audit(page, `theme=${scheme}`);
  await page.screenshot({ path: `${OUT}/shots/${scheme}-top.png` });
  await page.screenshot({ path: `${OUT}/shots/${scheme}-full.png`, fullPage: true });
  await ctx.close();
}

// Arabic / RTL
{
  const ctx = await browser.newContext({ colorScheme: 'dark', viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'عربي', exact: true }).first().click();
  await page.waitForTimeout(400);
  const dir = await page.evaluate(() => document.documentElement.dir);
  const lang = await page.evaluate(() => document.documentElement.lang);
  console.log(`      after AR click: lang=${lang} dir=${dir}`);
  if (dir !== 'rtl' || lang !== 'ar') { failures++; console.log('FAIL  RTL did not apply'); }
  await audit(page, 'lang=ar (rtl)');
  await page.screenshot({ path: `${OUT}/shots/ar-top.png` });
  await page.screenshot({ path: `${OUT}/shots/ar-full.png`, fullPage: true });
  await ctx.close();
}

// Command palette open
{
  const ctx = await browser.newContext({ colorScheme: 'dark', viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.keyboard.press('Meta+k');
  await page.waitForTimeout(400);
  const open = await page.evaluate(() => document.getElementById('palette')?.open === true);
  console.log(`      palette open after Cmd+K: ${open}`);
  if (!open) { failures++; console.log('FAIL  palette did not open'); }
  const focused = await page.evaluate(() => document.activeElement?.className);
  console.log(`      focus after open: ${focused}`);
  await audit(page, 'palette open');
  await page.screenshot({ path: `${OUT}/shots/palette.png` });
  // arrow + escape
  await page.keyboard.press('ArrowDown');
  const selected = await page.evaluate(() => document.querySelector('[aria-selected="true"]')?.textContent);
  console.log(`      after ArrowDown selected: ${JSON.stringify(selected)}`);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
  const closed = await page.evaluate(() => document.getElementById('palette')?.open === false);
  console.log(`      palette closed after Escape: ${closed}`);
  if (!closed) failures++;
  await ctx.close();
}

// Mobile
{
  const ctx = await browser.newContext({ colorScheme: 'dark', viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: 'networkidle' });
  await audit(page, 'mobile 390px');
  await page.screenshot({ path: `${OUT}/shots/mobile.png` });
  const hScroll = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  console.log(`      horizontal scroll at 390px: ${hScroll}`);
  if (hScroll) { failures++; console.log('FAIL  page scrolls horizontally'); }
  await ctx.close();
}

await browser.close();
console.log(`\n${failures === 0 ? 'ALL CHECKS PASSED' : failures + ' FAILURE(S)'}`);
process.exit(failures === 0 ? 0 : 1);
