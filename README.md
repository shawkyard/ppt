# Stonebrook Multifamily Deal Scout

A **map-first, value-add multifamily acquisition app** for screening apartment
deals before spending hours underwriting. Built for Scott & Alma.

It is a **static Version 1 MVP** — manual data entry, seeded markets, demo deals,
scoring logic, and premium dashboards. No backend, no accounts, no paid APIs, no
live crawling, no API keys. Everything is stored locally in the browser.

## The core thesis (important)

We do **not** require 12% cash-on-cash in Year 1. Years 1–2 are for renovation,
turnover, lease-up, vacancy reduction, management cleanup, and reserve-funded
stabilization. The real test is:

> **Can the property hit strong stabilized metrics in Year 3 after a realistic
> 18–24 month plan?**

Preferred acquisition: a **C property in a B area** — underperforming, under-market
rents, fixable vacancy/management, dated units, weak other income, a negotiable
seller, in a **strong or emerging market**, with enough capex and reserves to
execute. We avoid luxury/stabilized/renovated product, bad locations, deals where
the seller already captured the upside, deals that only work on the broker pro
forma, and appreciation-only bets.

## What's in Version 1

**16 screens:** Dashboard · Map Command Center · Market Gate · Market Layer
Manager · Deal Sourcing Queue · Add Property · Upload OM/RR/T12 · Scratch Screen ·
Deal Detail · 24-Month Stabilization Plan · Offer Price / Price Correction · Risk
Register · Broker Questions · Investor Summary · Report Builder · Settings.

- **Map Command Center** — approximate US map with colored REIndicator market
  regions, deal pins, filter panel, and a detail drawer. Regions are approximate
  from REIndicator screenshot review (clearly disclaimed).
- **REIndicator legend & Market Gate** — Turquoise = Pre-Emerging · Yellow = New
  Emerging (2 yr) · Green = Continuing Emerging (3+ yr) · Gray = Not Emerging ·
  White = Insufficient Data. Gray markets can be **manually approved**.
- **20 seeded markets** across the Sunbelt, Mountain West, and more — fully
  editable in the Market Layer Manager.
- **Three separated worlds on every deal:** Current Reality · Broker Story · Our
  Strike Deal — never mixed. Underwriting runs off the Strike Deal.
- **Property scratch score (0–100)** — market strength (20), submarket quality
  (15), condition/value-add fit (15), rent upside (15), vacancy/ops upside (10),
  capex feasibility (10), broker optimism risk (5, inverted), debt/strike (10).
  Bands: 85+ Strong Lead · 70–84 Request OM · 55–69 Watchlist · 40–54 Pass unless
  price drops · <40 Pass.
- **Full deal math** — price/unit, rent upside, current & stabilized NOI/cap,
  stabilized value, total project cost, value created, max supportable price,
  required price reduction, DSCR, stabilized cash-on-cash.
- **Year-3 strike factors** — 12%+ CoC, 1.4x/1.6x DSCR, 7%/8% cap, value created.
- **Source discipline** — 4 source levels and per-field labels
  (OM/RR/T12/BR/EXT/ASM/CALC/USER/MISS/NT).
- **Sourcing control center** — approved-market list, broker tracker, URL queue,
  paste box, cost guards, and **locked** V2 connectors (no live crawling in V1).
- **Upload workflow** — polished upload UI with a demo parsed-data preview.
- **Report Builder** — premium, printable investor one-pager (Print → save PDF).
- **5 demo properties**, one per decision band, across two markets.

## Tech

React + Vite + Tailwind. `react-router-dom` for routing. The US map is a
hand-built inline SVG (no map library, no tiles, no API). No other runtime deps.

## Run locally

```bash
npm install
npm run dev      # local dev server (Vite prints the URL)
npm run build    # production build → dist/
npm run preview  # preview the production build
```

Demo data seeds automatically on first run. **Settings → Reset demo data** restores it.

## Push to GitHub

```bash
git add -A
git commit -m "Stonebrook Multifamily Deal Scout — V1"
git push -u origin <your-branch>
```

## Deploy to Cloudflare Pages

1. Push the repo to GitHub.
2. Cloudflare Pages → **Create a project** → connect the repo.
3. Build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Framework preset:** None (or Vite)
4. Deploy. `public/_redirects` (`/* /index.html 200`) is included so client-side
   routes resolve on refresh/deep-link. **No environment variables required.**

## Cost control

No paid APIs · no hidden env vars · no uncontrolled scraper · no national
crawling · no recurring agent jobs. All future paid features are locked
placeholders. The MVP runs entirely on manual data, seeded markets, and demo pins.

## Version 2 (locked placeholders in the UI)

Real OM parser · rent roll parser · T12 parser · CSV import · broker-site
sourcing · public listing URL extraction · scheduled weekly scans · Supabase
database · investor CRM · LOI generator · PDF export.

---

*Version 1 market regions are approximate from REIndicator screenshot review and
must be verified before investment decisions. The app shows a preliminary max
supportable price, not a final offer.*
