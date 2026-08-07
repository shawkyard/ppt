# B2C Loyalty-Fit Scoring — Company Benchmarks & CRM Triage

A transparent, sourced benchmark model that estimates **AOV**, **purchase
frequency**, and **gross margin** for B2C companies from three public attributes
— **sector**, **value segment** (extreme luxury → extreme discount), and **sales
channel** — and turns them into a **0–100 loyalty-fit score** so you can triage a
large CRM into likely-GREEN vs. likely-RED for a loyalty program and pull the top
20–30%.

Built for **directional triage at scale**, not per-dollar precision. The goal is
"green vs. red, top slice of the list," which is exactly what you can defend with
category benchmarks and cannot fake with fake per-company numbers.

## ⚠️ What's real vs. modeled

Per-company AOV and purchase frequency **are not public** — for a CRM of
thousands of mid-market names there is nothing to look up. So those are
**estimated** from published *category* benchmarks. What's solid: the sector
classification and the **gross margin**, anchored to NYU Stern / Damodaran. Full
provenance and confidence levels are in **`SOURCES.md`** — read it before quoting
anything to a prospect.

## The loyalty-fit score

`loyalty_fit_score` (0–100, higher = more likely GREEN) blends the three things
that actually decide whether a program clears its own reward + labor + platform
cost:

- **Margin (50%)** — room to fund rewards (0 at 20% GM → 1 at 60%+).
- **Frequency (35%)** — enough repeat to form a habit (0 at 1.2x/yr → 1 at 4x+).
- **AOV support (15%)** — ticket big enough to matter (0 at $15 → 1 at $60+).

…then **hard "structural red" caps** knock down the cases that lose money even
with a free program: sub-25% margin, too-infrequent to change behavior, or tiny
ticket + low frequency. Output tiers: **A/B = GREEN, C = MARGINAL, D = RED**.

`fit_percentile` ranks each company *within your file* (100 = best) so you can
cut, e.g., everyone above the 75th percentile regardless of the absolute number.

## Two ways to use it

### 1. Score the curated sample (Python)
```bash
python3 seed_companies.py    # build companies.csv (211 real brands)
python3 score.py             # -> companies_scored.csv, ranked, with fit score
```

### 2. Score YOUR CRM at scale (Excel)
```bash
python3 build_lookup.py      # -> benchmark_lookup.csv (full 1,400-combo grid)
```
Then, for each CRM row, classify the three public fields you can infer from
firmographics / website / industry code, build a key
`sector|value_segment|sales_channel`, and `XLOOKUP` it against the table:
```
=XLOOKUP($A2, lookup!$A:$A, lookup!$H:$H)   ' -> loyalty_fit_score
```
Sort by score, take your top 20–30%. No per-company AOV/PF needed — the grid
supplies it.

## Files

| File | What it is |
|---|---|
| `benchmarks.py` | The model: sector/segment/channel tables + `estimate()` and `loyalty_fit()`. Every constant commented and tunable. |
| `seed_companies.py` → `companies.csv` | 211 curated real brands (public fields only). Add rows to extend. |
| `score.py` → `companies_scored.csv` | Enriched + fit-scored + percentile-ranked. |
| `build_lookup.py` → `benchmark_lookup.csv` | Full sector×segment×channel grid — the Excel VLOOKUP/XLOOKUP table for CRM triage. |
| `classify.py` | Best-effort industry-text → sector guesser, to self-map a raw CRM export. |
| `SOURCES.md` | Benchmark provenance and honesty notes. **Read before quoting.** |

## Auto-classifying a raw CRM

`classify.py` maps a free-text industry label / SIC-NAICS description to a sector
so you don't hand-tag thousands of rows:

```bash
python3 classify.py my_crm.csv industry > my_crm_mapped.csv   # adds guessed_sector
```
It matches at word starts and returns blank for anything it can't place (route
those to manual review). It only guesses **sector** — the field a raw industry
code maps to reliably; **value_segment** and **sales_channel** still need your eye
(a $40 tee and a $4,000 gown are both "Apparel", and that's the whole point of
the segment split).

## Valid classification values (36 sectors)

- **sector**: Apparel & Accessories, Footwear, Beauty & Personal Care, Consumer
  Electronics, Home & Garden, Home / Mattress, Grocery, QSR / Coffee, Health &
  Supplements, Pet Care, Sports & Outdoor, Toys & Hobbies, Jewelry & Watches,
  Eyewear, General Merchandise, Luggage & Travel, Auto Parts & Accessories,
  Automotive Service & Tires, Appliances, Furniture & Home Furnishings, Home
  Improvement & Hardware, Office Supplies, Books & Media, Music & Instruments,
  Craft & Hobby, Drug & Pharmacy, Convenience & Gas, Wine Beer & Spirits, Baby &
  Kids, Florist & Gifts, Casual Dining, Fitness & Gym, Digital Subscription /
  Streaming, Hotel / Lodging, Airline / Travel _(margin-funded fit; see
  SOURCES.md notes 5–6 for airline & subscription caveats)_
- **value_segment**: extreme_luxury, luxury, standard, discount, extreme_discount
- **sales_channel**: Omnichannel, DTC Ecommerce, Marketplace, Mobile App / QSR,
  Big Box, Department Store, Subscription, Boutique

## Tuning

All judgment lives in `benchmarks.py`: sector baselines (margin anchored to
Damodaran), segment/channel multipliers, and the fit-score weights + caps.
Adjust for your book of business and re-run. Illustrative-ROI lift assumptions
are at the top of `score.py`.
