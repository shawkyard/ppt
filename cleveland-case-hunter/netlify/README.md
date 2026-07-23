# BBP Legal — Netlify Report Portal

A static, Netlify-ready site that delivers each attorney a private, co-branded daily
Utah legal-intelligence report. Built to scale to 10 attorneys, then to all 50 states.

## Deploy (fastest path)

**Drag-and-drop:** unzip, then drag the **unzipped folder** onto
<https://app.netlify.com/drop>. Done — you get a live HTTPS URL in ~10 seconds.

**CLI / Git (repeatable):**
```bash
npm i -g netlify-cli
netlify deploy --dir=. --prod      # run from this folder
```
Or connect the folder to a Git repo and let Netlify auto-deploy on push.

## What's in here

```
index.html                 BBP portal / client directory (multi-tenant showcase)
methodology/index.html     "Utah data sources & methodology" (your ad-source doc)
reports/cleveland/         Catherine Cleveland's live co-branded report
reports/_template/         Copy this to add a new attorney
assets/brand.css           >>> THE ONLY FILE YOU EDIT TO MATCH BBP BRANDING <<<
assets/report.css          Shared report layout
assets/bbp-logo.svg        Placeholder BBP logo — replace with the real file
netlify.toml               Config: clean URLs, security + noindex headers, caching
```

## 1. Match BBP branding (30 seconds)

The palette in **`assets/brand.css`** is matched to BBP Legal — **black / burnt-orange
(#e8611e) / warm cream** with serif headlines and orange italic accent lines. If you have
exact brand hexes, fine-tune the six `--brand-*` values at the top. Replace
**`assets/bbp-logo.svg`** with your real logo (keep the filename, or point the `<img>` tags
at a PNG/SVG). Every page updates automatically.

> Colors were matched visually from the BBP Legal site (the build environment's network
> policy blocked a direct fetch). Send the exact brand hex codes + logo file and I'll drop
> them in for pixel-exact fidelity.

## 2. Add an attorney (per-client branding)

1. Copy `reports/_template/` → `reports/<slug>/` (e.g. `reports/jane-doe/`).
2. In that `index.html`: set `--accent` (their brand color), their name/tagline, and drop
   their logo at `reports/<slug>/attorney-logo.svg`.
3. Fill the lead cards from that attorney's scored report.
4. Add a card for them on the home `index.html`.

Each report is reachable at `https://<your-site>/reports/<slug>/` — a clean private link
per attorney, each showing BBP branding **and** their own logo for maximum perceived value.

## 3. The daily 4:00 a.m. MST update (how to wire it)

This folder is the *output* of a daily run. To automate the "fresh every morning" vision:

1. **Generate:** each morning, the Case Hunter produces each attorney's scored report
   (JSON → the HTML card structure in `reports/cleveland/index.html`).
2. **Deploy:** a scheduled job (Netlify scheduled function, GitHub Action cron, or any
   scheduler set to `0 10 * * *` UTC = 4 a.m. MDT / `0 11 * * *` for MST) rebuilds the HTML
   and runs `netlify deploy --prod`.
3. **Notify (optional):** email each attorney their private link when the deploy succeeds.

> Note: the automated layer covers **public sources**. The manual Utah XChange step is done
> by a human operator and folded in before deploy — never automated (see `methodology/`).

## Compliance guardrails baked in

- `noindex, nofollow` on every page (reports are confidential).
- No solicitations are sent by the site; every lead is marked HOLD pending attorney review.
- Methodology page documents exactly what is searched vs. never touched, and gives
  ad-ready, Rule-7.1-safe claim language.
