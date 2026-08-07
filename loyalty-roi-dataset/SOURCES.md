# Benchmark sources & provenance

You said you'll tell prospects exactly where these numbers came from. Here's the
honest ledger. Every benchmark in `benchmarks.py` is either (a) anchored to a
named public dataset or (b) a labeled judgment call. Nothing here is a
per-company measured fact — those don't exist publicly for AOV/frequency.

## What's anchored vs. judged

| Model input | Anchored to | Confidence |
|---|---|---|
| **Gross margin by sector** (`SECTOR_BASE[...].gm`) | NYU Stern / Aswath Damodaran, *"Margins by Sector (US)"* — the standard cited gross-margin dataset, rebuilt annually from public-company financials. Apparel ~52%, grocery ~20–25%, mass retail ~25%. | **High** — real, auditable, widely used |
| **AOV by sector** (`SECTOR_BASE[...].aov`) | Littledata (Shopify ~$85–92), Dynamic Yield, and category compilations (Triple Whale, Ringly): apparel ~$40–170, beauty ~$15–90, home/furniture ~$264, consumer goods ~$296. Point estimate = range midpoint. | **Medium** — solid ranges, midpoint is a choice |
| **Purchase frequency by sector** (`SECTOR_BASE[...].pf`) | Opensend, Eightx (DTC-vertical PF), AppsFlyer, industry retention studies: loyal ~5/yr; consumables 4–8; apparel 1.5–3.5; durables 1–2; subscription up to 12+. | **Medium** — directional, varies by definition |
| **Value-segment multipliers** (`SEGMENT`) | Judgment, calibrated to how luxury vs. discount shifts ticket, frequency, and pricing power. | **Judgment** — labeled, tunable |
| **Sales-channel multipliers** (`CHANNEL`) | Judgment + the well-worn app-commerce pattern (lower AOV, higher frequency on mobile/app; subscription pins frequency high). | **Judgment** — labeled, tunable |
| **Loyalty-fit score weights & caps** (`loyalty_fit`) | Judgment, encoding standard loyalty unit-economics: margin funds rewards, frequency forms habit, and a program can't rescue a structurally thin or too-infrequent business. | **Judgment** — the model's opinion, stated openly |

## Key honesty notes

1. **"Gross margin" here means PRODUCT gross margin (price − COGS)** — the actual
   cost of giving a reward — not store-level operating margin. This is why QSR
   (cheap COGS on a coffee) scores well and grocery (thin product margin) scores
   poorly, which matches real loyalty outcomes.

2. **The fit score is ordinal, not a calibrated probability.** Higher = more
   likely GREEN. Do not quote "78% score = 78% chance of profit." Use it to
   *rank and cut* (top 20–30%), which is exactly its design intent.

3. **The GREEN/RED split in `companies_scored.csv` reflects this curated,
   beauty/apparel-heavy sample** — not a random CRM. On a real mixed CRM
   (more electronics, grocery, furniture, auto, B2B-ish names) the green rate is
   lower. Rank on `fit_percentile` and take your top slice; don't read the
   absolute GREEN% as a market-wide rate.

4. **Costco/warehouse & grocery score RED for a *points* program** — correctly.
   Their economics work through paid membership + volume, not earn-and-burn
   points a 15–20% margin can't fund. Different animal; don't confuse the two.

5. **Airlines score RED on margin — that's the honest limit of a margin-funded
   model.** Airline/hotel loyalty is enormously profitable in reality, but it's
   funded by *selling miles/points to co-brand banks*, not from retail margin.
   This model scores fitness for a **margin-funded rewards program**, so it flags
   airlines RED. If your prospect monetizes points via a card partner, that's a
   different (and often great) model this score doesn't capture — treat travel as
   a manual-review exception.

6. **For Subscription / Streaming / Fitness sectors the "AOV" is a per-charge
   proxy, not a meaningful basket.** The fit score for these leans on margin +
   frequency (both high), which is correct; ignore their `est_aov_usd` and
   `illustrative_roi_*` columns and model the subscription economics directly.

## Source links

- NYU Stern / Damodaran, Margins by Sector (US): https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/margin.html
- Littledata ecommerce benchmarks: https://www.littledata.io/
- Ringly AOV statistics: https://www.ringly.io/blog/ecommerce-aov-statistics-2026
- Triple Whale ecommerce benchmarks: https://www.triplewhale.com/blog/ecommerce-benchmarks
- Opensend purchase-frequency statistics: https://www.opensend.com/post/purchase-frequency-statistics-ecommerce
- Eightx purchase frequency by DTC vertical: https://eightx.co/blog/average-purchase-frequency-orders-customer-yr-by-vertical
- AppsFlyer purchase-frequency glossary: https://www.appsflyer.com/glossary/purchase-frequency/

_Figures are as reported at time of retrieval (2026) and are approximate/rounded.
Re-pull annually — Damodaran updates every January._
