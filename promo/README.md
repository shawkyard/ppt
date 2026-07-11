# Stonebrook Deal Scout — 30s promo video

A 30-second, 1080p promotional video for the Deal Scout app. The animation is a
deterministic HTML5 canvas render (`promo.html`), captured frame-by-frame with
headless Chromium and encoded to H.264 MP4 with ffmpeg.

- **`stonebrook-deal-scout-30s.mp4`** — the finished video (1920×1080, 30 fps).
- **`promo.html`** — self-contained animation. Open in a browser to preview it
  live; `renderFrame(t)` draws the exact frame for time `t` (0–30 s).
- **`render.mjs`** — capture + encode pipeline.

The palette (ink / gold / approve-green) matches `tailwind.config.js`, and every
figure on screen is the real value the app computes for the demo data:

| Scene | Data |
|-------|------|
| Market Gate | Greenville–Spartanburg, SC → **84 · Approved** |
| Property scratch score | Oakbridge Commons → **86 · Strong lead** |
| Deal math | $90K/unit · +$288K/yr rent upside · 5.3% → 8.7% stabilized cap |
| Value created | **$2.63M** (stabilized value $13.0M, all-in basis $10.4M) |

## Rebuild

```bash
cd promo
npm install                       # playwright-core + @ffmpeg-installer/ffmpeg
node render.mjs /tmp/frames       # render 900 PNG frames via headless Chromium
# encode (path from require('@ffmpeg-installer/ffmpeg').path):
ffmpeg -y -framerate 30 -i /tmp/frames/f%04d.png \
  -c:v libx264 -preset slow -crf 19 -pix_fmt yuv420p -movflags +faststart \
  stonebrook-deal-scout-30s.mp4
```

`render.mjs` points at the sandbox Chromium (`/opt/pw-browsers/...`); change
`executablePath` for a different environment.
