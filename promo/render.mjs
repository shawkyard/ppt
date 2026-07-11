// Render promo.html to 900 PNG frames (30s @ 30fps) via headless Chromium,
// then let ffmpeg encode them to MP4. Deterministic: each frame is drawn by
// renderFrame(t) rather than captured in real time.
import { chromium } from 'playwright-core';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __dir = dirname(fileURLToPath(import.meta.url));
const FPS = 30, DUR = Number(process.argv[4]) || 30, TOTAL = FPS * DUR;
const outDir = process.argv[2] || join(__dir, 'frames');
const htmlFile = process.argv[3] || 'promo.html';
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--no-sandbox', '--force-color-profile=srgb', '--hide-scrollbars'],
});
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
await page.addInitScript(() => { window.__CAPTURE__ = true; });
await page.goto('file://' + join(__dir, htmlFile));
await page.waitForFunction(() => typeof window.renderFrame === 'function');

// Match the viewport to the canvas so any aspect ratio (1:1, 16:9, 9:16) captures cleanly.
const dims = await page.evaluate(() => { const c = document.getElementById('c'); return { w: c.width, h: c.height }; });
await page.setViewportSize({ width: dims.w, height: dims.h });

const canvas = page.locator('#c');
for (let i = 0; i < TOTAL; i++) {
  const t = i / FPS;
  await page.evaluate((tt) => window.renderFrame(tt), t);
  await canvas.screenshot({ path: join(outDir, `f${String(i).padStart(4, '0')}.png`) });
  if (i % 60 === 0) process.stdout.write(`\r  frame ${i}/${TOTAL}`);
}
process.stdout.write(`\r  frame ${TOTAL}/${TOTAL}\n`);
await browser.close();
console.log('frames done ->', outDir);
