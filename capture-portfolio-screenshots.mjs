// Capture desktop screenshots for every site in the portfolio CSV.
//
// Usage (from a machine with normal outbound internet access):
//   npm i -D playwright && npx playwright install chromium
//   node capture-portfolio-screenshots.mjs
//
// Output: ./screenshots/<Screenshot Name>.png for each row in
// Portfolio_Master_Template_Enriched.csv (1440x900 above-the-fold shots).
//
// Note: this was written for the Ogden Web Solutions portfolio build. It could
// not be run inside the Claude Code remote environment because that session's
// network policy blocked all outbound web access. Run it anywhere with internet.

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const CSV = 'Portfolio_Master_Template_Enriched.csv';
const OUT = 'screenshots';

function parseCSV(text) {
  const rows = []; let row = [], f = '', q = false;
  const QUOTE = String.fromCharCode(34);
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === QUOTE) { if (text[i + 1] === QUOTE) { f += QUOTE; i++; } else q = false; }
      else f += c;
    } else {
      if (c === QUOTE) q = true;
      else if (c === ',') { row.push(f); f = ''; }
      else if (c === '\n') { row.push(f); rows.push(row); row = []; f = ''; }
      else if (c !== '\r') f += c;
    }
  }
  if (f.length || row.length) { row.push(f); rows.push(row); }
  return rows;
}

const rows = parseCSV(fs.readFileSync(CSV, 'utf8'));
const header = rows.shift();
const nameIdx = header.indexOf('Screenshot Name');
const urlIdx = header.indexOf('Website URL');

fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
for (const r of rows) {
  if (!r[urlIdx]) continue;
  const name = r[nameIdx];
  const url = r[urlIdx];
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
    await page.waitForTimeout(2500);
    await page.screenshot({ path: path.join(OUT, name), fullPage: false });
    console.log('ok  ', name);
  } catch (e) {
    console.log('FAIL', name, '-', e.message.slice(0, 80));
  }
  await ctx.close();
}
await browser.close();
console.log('done ->', OUT);
