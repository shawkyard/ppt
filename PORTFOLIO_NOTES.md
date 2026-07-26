# Ogden Web Solutions — Portfolio Master (Enriched)

Deliverable for the **ogdenwebsolutions.com** portfolio page (built with Manus).

## Files

- **`Portfolio_Master_Template_Enriched.csv`** — the original portfolio template with
  five new strategist columns added for each of the 22 projects.
- **`capture-portfolio-screenshots.mjs`** — one-command Playwright script that reads
  the CSV and saves a `1440×900` desktop screenshot per project into `./screenshots/`,
  named to match the `Screenshot Name` column.

## Columns

Original: `Portfolio Item Name`, `Screenshot Name`, `Website URL`, `Description`,
`Category`, `Related`.

Added:

| Column | What it is |
|---|---|
| **Client Pain (Before)** | The specific problem the client felt before the build. |
| **Value Delivered — Website** | What the site itself solved (brand, clarity, credibility, UX). |
| **Value Delivered — Mass Traffic** | How the build drives volume (SEO, audience pages, shareability). |
| **Value Delivered — More Leads & Sales** | How the build converts that traffic into revenue. |
| **KPIs We Drive** | The metrics each build is engineered to move. |
| **ICP (Who This Is For)** | The ideal client profile the project represents. |
| **How It Relates To You** | Prospect-facing line that maps the case study to the site visitor. |

## Two honest notes on sourcing

1. **Screenshots were not captured in this session.** The remote build environment's
   network policy blocked all outbound web access (a plain request to `example.com`
   returned `403 CONNECT tunnel failed`), so the live sites could not be loaded to
   screenshot them. Run `capture-portfolio-screenshots.mjs` from any machine with
   normal internet, or let Manus capture them — the `Screenshot Name` filenames are
   preserved so either path drops straight into the CSV.

2. **The Pain / Value / KPI / ICP copy is strategist-derived** from the authoritative
   project descriptions already in the template (plus category context), not scraped
   from each live site (see note 1). It's written to be true-to-intent and
   ready-to-edit — verify any specific claim against the live site before publishing,
   and swap the KPI columns for real measured results wherever you have them (the
   columns currently name the metrics driven, not fabricated numbers).
