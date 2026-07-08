# Stonebrook Deal Scout

A cost-controlled MVP for **screening value-add multifamily apartment deals** before
wasting hours on full underwriting.

This is a **static demo MVP** — manual entry, demo data, scoring logic, and clean
dashboards. It is intentionally **not** a live crawler, not a paid-API app, not a
scraper, and has no backend, no auth, and no keys. All state lives in the browser
(`localStorage`).

## The thesis

We do **not** use the old RE Mentor rule of requiring 12% cash-on-cash in Year 1.
We evaluate whether a property can **become** a good deal after a realistic
**18–24 month value-add stabilization plan**.

Target profile: an underperforming **C property in a B area** in a strong or
emerging market, with fixable upside — under-market rents, vacancy upside, dated
units, poor management, weak other income, a stale listing, a negotiable price,
and a realistic capex path. We avoid luxury/stabilized/fully-renovated product,
bad locations, deals that only work off the broker pro forma, deals with no rent
upside, and appreciation-only bets.

## Features

| Page | What it does |
|------|--------------|
| **Dashboard** | Pipeline overview, ranked deals, aggregate value created, market status |
| **Market Gate** | Score a market 0–100 across 10 factors → Approved / Watchlist / Reject |
| **Add Property** | Manual entry of listing-level data + value-add ratings |
| **Scratch Screen** | Fast 0–100 read on every property, filterable by decision band |
| **Deal Detail** | Full decision output: score, why, pain, upside, quick math, docs, risks |
| **24-Month Plan** | Phased stabilization plan derived from the deal math |
| **Offer / Price** | Preliminary *max supportable price* (never a final offer) + confidence |
| **Risk Register** | Log and rank risks with mitigations |
| **Broker Questions** | The questions/docs to request; one-click "copy as email" |
| **Investor Summary** | One-page, print-friendly deal summary |

### Scoring

**Market Gate (0–100)** — job growth, population growth, wage/income support,
employer anchors, rent growth, new-supply risk, affordability, crime/safety risk,
infrastructure investment, and your RE Indicator score. Risk factors are inverted.
- 80–100 Approved · 60–79 Watchlist · < 60 Reject

**Property scratch score (0–100)** — market strength (20), submarket quality (15),
condition/value-add fit (15), rent upside (15), vacancy/operations upside (10),
capex feasibility (10), broker-optimism risk (5, inverted), debt/strike factor (10).
- 85–100 Strong lead · 70–84 Request OM · 55–69 Watchlist · 40–54 Pass unless price drops · < 40 Pass

Market strength, rent upside, and vacancy upside are auto-derived from the data;
the rest are analyst ratings.

### Deal math

Price/unit, monthly & annual rent upside, current/stabilized gross rent, current
& stabilized NOI, current & stabilized cap rate, stabilized value, total project
cost, and value created — all in `src/lib/calculations.js`. On weak listing-only
data the app deliberately shows a **preliminary max supportable price** plus the
required documents, broker questions, and a confidence level — not a final offer.

## Tech

React + Vite + Tailwind. `react-router-dom` for routing. No other runtime deps.
No backend, no Supabase, no APIs, no env vars, no secrets.

## Getting started

```bash
npm install
npm run dev      # local dev server
npm run build    # production build → dist/
npm run preview  # preview the production build
```

Demo data (2 markets, 5 properties) seeds automatically on first run. Use
**Reset demo data** in the sidebar to restore it at any time.

## Deploy to Cloudflare Pages

1. Push this repo to GitHub.
2. In Cloudflare Pages, **Create a project** → connect the repo.
3. Build settings:
   - **Framework preset:** None (or Vite)
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Deploy. `public/_redirects` (`/* /index.html 200`) is included so client-side
   routes resolve correctly on refresh/deep-link.

No environment variables are required.

## Project structure

```
src/
  components/   Layout, DealTabs, DealHeader, shared UI primitives
  context/      AppContext — state + localStorage persistence
  data/         demoData.js — 2 markets, 5 seed properties
  lib/          marketScore, dealScore, calculations, plan, screen, format, storage
  pages/        the 10 screens
```

## Version 2 ideas

- Real data ingestion (crawler / paid listing APIs / OM PDF parsing) behind a backend
- Supabase (or similar) for auth, multi-user pipelines, and shared deal history
- Full underwriting model: financing, DSCR, IRR/equity multiple, sensitivity tables
- Rent & sales comps integration to validate market rents independently
- Document upload + checklist tracking per deal
- Export to PDF/Excel and shareable investor links
- Map view and submarket heat-mapping
