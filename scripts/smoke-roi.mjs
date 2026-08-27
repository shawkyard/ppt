import { chromium } from 'playwright-core';
import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = '/home/user/ppt/public';
const types = { '.html': 'text/html', '.js': 'text/javascript' };
const server = createServer((req, res) => {
  const p = join(root, req.url.split('?')[0]);
  if (existsSync(p)) {
    res.setHeader('Content-Type', types[p.slice(p.lastIndexOf('.'))] || 'text/plain');
    res.end(readFileSync(p));
  } else { res.statusCode = 404; res.end('nf'); }
});
await new Promise(r => server.listen(4173, r));

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage();
let fail = 0;

// 1. Bare calculator renders correct defaults
await page.goto('http://localhost:4173/roi/calculator.html?brand=TestCo&color=7c3aed');
await page.waitForTimeout(300);
const net = await page.textContent('#netAnnualProfit');
const roi = await page.textContent('#roiNote');
const payback = await page.textContent('#payback');
const title = await page.textContent('#brandTitle');
console.log('net:', net, '| roi:', roi, '| payback:', payback, '| title:', title);
if (net !== '$31,974') { console.error('FAIL net'); fail++; }
if (!roi.startsWith('135%')) { console.error('FAIL roi'); fail++; }
if (payback !== '0.6 mo') { console.error('FAIL payback'); fail++; }
if (title !== 'TestCo ROI Calculator') { console.error('FAIL branding'); fail++; }

// 2. Change an input, verify recompute
await page.fill('#monthlyCustomers', '2400');
await page.waitForTimeout(200);
const net2 = await page.textContent('#netAnnualProfit');
console.log('net after 2400 customers:', net2);
if (net2 !== '$67,536') { console.error('FAIL recompute (expected $67,536)'); fail++; }

// 3. Demo client page: embed script creates iframe and it resizes
await page.goto('http://localhost:4173/roi/demo-client.html');
await page.waitForSelector('iframe', { timeout: 5000 });
await page.waitForTimeout(600);
const frame = page.frames().find(f => f.url().includes('calculator.html'));
const embeddedTitle = await frame.textContent('#brandTitle');
const h = await page.$eval('iframe', el => el.style.height);
console.log('embedded title:', embeddedTitle, '| iframe height:', h);
if (!embeddedTitle.includes('Harborline')) { console.error('FAIL embed branding'); fail++; }
if (!h || h === '0px') { console.error('FAIL iframe resize'); fail++; }

// 4. Lead capture emits roi-lead on host page
await page.evaluate(() => new Promise(res => {
  window.__lead = null;
  window.addEventListener('roi-lead', e => { window.__lead = e.detail; res(); });
  const f = window.frames[0].document;
  f.getElementById('leadEmail').value = 'test@example.com';
  f.getElementById('leadForm').dispatchEvent(new Event('submit', { cancelable: true }));
}));
const lead = await page.evaluate(() => window.__lead);
console.log('lead captured:', lead && lead.email, '| netAnnualProfit in payload:', lead && lead.results.netAnnualProfit);
if (!lead || lead.email !== 'test@example.com') { console.error('FAIL lead capture'); fail++; }

if (process.env.SMOKE_SHOT) await page.screenshot({ path: process.env.SMOKE_SHOT, fullPage: true });

// 5. Wizard: step order must be Baseline → Loyalty Assumptions → Costs & TCO
await page.goto('http://localhost:4173/roi/wizard.html');
await page.click('[data-go="1"]');
const s1 = await page.textContent('h1.step-title');
await page.click('.btn-next');
const s2 = await page.textContent('h1.step-title');
await page.click('.btn-next');
const s3 = await page.textContent('h1.step-title');
console.log('wizard order:', s1, '→', s2, '→', s3);
if (!s2.includes('Loyalty Assumptions')) { console.error('FAIL step 2 should be Loyalty Assumptions'); fail++; }
if (!s3.includes('Costs')) { console.error('FAIL step 3 should be Costs & TCO'); fail++; }
const kpiNet = await page.textContent('.kpi .n');
console.log('wizard 5yr net value KPI:', kpiNet);
if (kpiNet.includes('NaN') || kpiNet === '—') { console.error('FAIL wizard KPI'); fail++; }
await page.click('.btn-next'); // -> outlook
await page.click('.btn-next'); // -> executive report
const s5 = await page.textContent('h1.step-title');
if (!s5.includes('Executive')) { console.error('FAIL step 5'); fail++; }
if (process.env.SMOKE_DIR) {
  await page.screenshot({ path: process.env.SMOKE_DIR + '/wizard-step5.png', fullPage: true });
  await page.goto('http://localhost:4173/roi/wizard.html');
  await page.click('[data-go="1"]'); await page.click('.btn-next');
  await page.screenshot({ path: process.env.SMOKE_DIR + '/wizard-step2-assumptions.png', fullPage: true });
  await page.click('.btn-next');
  await page.screenshot({ path: process.env.SMOKE_DIR + '/wizard-step3-costs.png', fullPage: true });
}

// 6. Loyalty Methods mockup: embedded wizard in light theme + brand color
await page.goto('http://localhost:4173/roi/mockups/loyaltymethods.html');
await page.waitForSelector('iframe', { timeout: 5000 });
await page.waitForTimeout(600);
const wframe = page.frames().find(f => f.url().includes('wizard.html'));
const isLight = await wframe.evaluate(() => document.body.classList.contains('light'));
const accent = await wframe.evaluate(() =>
  getComputedStyle(document.documentElement).getPropertyValue('--accent').trim());
const lmBrand = await wframe.textContent('#brandName');
console.log('mockup embed → light:', isLight, '| accent:', accent, '| brand:', lmBrand);
if (!isLight) { console.error('FAIL mockup should embed light theme'); fail++; }
if (accent !== '#f58220') { console.error('FAIL mockup accent color'); fail++; }
if (lmBrand !== 'Loyalty Methods') { console.error('FAIL mockup brand'); fail++; }
if (process.env.SMOKE_DIR) {
  await page.screenshot({ path: process.env.SMOKE_DIR + '/mockup-loyaltymethods.png', fullPage: true });
}

await browser.close();
server.close();
if (fail) { console.error(fail + ' smoke check(s) FAILED'); process.exit(1); }
console.log('All smoke checks passed.');
