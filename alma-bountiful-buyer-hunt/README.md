# Alma AI Revenue Hunter — Buyer Research Report

**Private Buyer Research** — South Davis County, Utah (Bountiful · North Salt Lake · Centerville · Woods Cross)
Prepared for realtor **Chad Buttars**. Initial run: **2026-07-13**.

> **Not for public distribution.** The report is marked `noindex, nofollow` and ships with a
> disallow-all `robots.txt`. The buyer's identity and age are not shown; Chad's contact details are
> intentionally withheld from the report pages.

---

## ⚠️ Read this first — honest status of the initial run

This report was built to the full "Alma AI Revenue Hunter" specification: an accessible, client-ready
HTML report plus data exports, a 0–100 scoring engine, comparison table, map, community watchlist,
hidden-opportunity buckets, rejected log, and source log.

**However, no live listing could be independently verified on this run.** The major portals
(Redfin, Homes.com) returned **HTTP 403** to automated access, and no authorized MLS/IDX feed was
available. General web search returned only aggregate marketing pages, not verifiable individual
listings with real MLS numbers, prices, agents, or comparable sales.

The spec's own accuracy rules (§22) prohibit inventing a property, MLS number, status, price, agent,
HOA fee, or comparable sale — and the Claude instructions (§25) direct that, absent reliable data
access, the complete report **framework, schemas, and scoring engine** be delivered with unverified
data clearly flagged. That is exactly what this is:

- **`window.ALMA.listings` is intentionally empty.** No fabricated properties.
- Every field on the demo detail page reads **"Requires Verification."**
- **Community leads** (real communities surfaced from web search) are included but labeled
  **low-confidence / unverified** so Chad can hunt inventory before it lists.
- A concrete **research queue** (in the report's Methodology section and below) turns this into a
  fully populated report once an authorized MLS search is run.

**This report will not mislead a real buyer.** The moment verified records are added to the data
file, every page, table, map pin, and export populates and ranks automatically.

---

## How to view

Open **`index.html`** in any browser — it works directly from the file system (no server needed),
on desktop, tablet, and phone, and prints/exports to PDF cleanly.

- **`index.html`** — full report: Executive Summary, Ranked Listings, Comparison Table, Map,
  Hidden Opportunities, Community Watchlist, Rejected Properties, Methodology, Client Questions.
- **`listing.html?id=<id>`** — full 56-field property detail page for any listing. Try
  **`listing.html?id=template`** to see the finished detail layout and live scoring engine.

## Project structure

```
alma-bountiful-buyer-hunt/
├── index.html              # main report (all report pages as sections)
├── listing.html            # dynamic detail page (?id=…), renders any verified listing
├── robots.txt              # disallow-all (privacy)
├── README.md
├── assets/
│   ├── css/alma.css        # accessible brand styles + print/PDF rules
│   ├── js/data.js          # single source of truth (window.ALMA)
│   ├── js/score.js         # 0–100 scoring & ranking engine (spec §15)
│   ├── js/app.js           # renders every section from the data
│   └── images/
└── data/
    ├── listings.json       # machine-readable mirror + full record schema
    ├── listings.csv        # header ready; 0 verified rows this run
    ├── comparables.csv     # header ready; 0 verified rows this run
    ├── rejected-properties.csv
    ├── community-watchlist.csv
    └── source-log.csv
```

## How to add a verified property (turns this into a full report)

1. Run the MLS/IDX search in the research queue (below).
2. For each real match, verify status from the MLS record **plus** one broker source (§11).
3. Copy the record shape from `window.ALMA.template` (in `assets/js/data.js`) or the
   `listingSchema` in `data/listings.json`.
4. Fill real, sourced values; label accessibility items *Confirmed / Appears likely / Unknown /
   Requires in-person verification*. Set the eight `scores` A–H (maxes: 25/20/15/15/10/7/5/3).
5. Push the object into `window.ALMA.listings` (and mirror to `data/listings.json` + CSVs).
   The report re-ranks and rebuilds — no code changes needed.

## Research queue (complete verification)

1. MLS/IDX search: cities = Bountiful, North Salt Lake, Centerville, Woods Cross; beds ≥2; baths ≥2;
   price ≤ $500,000; style = Rambler/Single-level; status = Active + Coming Soon + Backup.
2. Repeat filtered to 55+/age-restricted and to "patio home"; search remarks for
   "main level", "no stairs", "zero step".
3. Pull expired/withdrawn/cancelled (last 6 months) matching the filter (hidden-inventory leads).
4. Verify status + capture MLS #, DOM, price history, public agent, photos/floor plan.
5. Run comps (3–6 sales, 0.5–1.5 mi, last 6–12 months, similar type/age/sqft); record $/sqft.
6. Confirm HOA terms (fee, snow removal, exterior maintenance, age & rental restrictions,
   reserves/assessments).
7. Assess accessibility from photos/floor plan + showing checklist.

## What these numbers are — and are not

- Market-value estimates are a **preliminary comparable analysis, not an appraisal.**
- Photo/description review is **not a home inspection.**
- Public-record review is **not a title search.**
- Resale figures are **scenario estimates, not promises** of appreciation.
- Neighborhoods are judged on objective distance/convenience only — never protected-class demographics.

## Privacy & ethics

`noindex,nofollow` + disallow-all `robots.txt`; buyer age/identity and Chad's contact details are not
published. No owner personal information. Listing data and images must be attributed to their source
and used only where licensing permits. Nothing here should be emailed, texted, published, or deployed
publicly without explicit authorization from Scott or Chad.
