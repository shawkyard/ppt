# B2C Loyalty ROI — Company Dataset & Account Rescoping

A machine-readable dataset of real B2C brands classified by **sector**, **value
segment** (extreme luxury → extreme discount), and **primary sales channel**,
with modeled **AOV**, **purchase frequency**, and **gross margin** — plus a
filter that flags which accounts have a **high probability of making money with
a loyalty program** vs. losing it.

Built to feed a loyalty-program ROI calculator across many companies at once.

## ⚠️ Read this first — what's real and what's modeled

| Field | Status |
|---|---|
| company, sector, value_segment, sales_channel, region | **Real** — public classification |
| approx_annual_rev_musd | **Real, but order-of-magnitude** (approx, most-recent widely reported FY; private brands are rough public estimates) |
| est_aov_usd, est_purchase_freq_yr, est_gross_margin | **Modeled estimates** — see below |

**Per-company AOV and purchase frequency are not public.** No major brand
discloses "member AOV = $89." Any source handing you brand-specific AOV/PF to two
decimals is almost certainly making it up. So this dataset does **not** claim
per-brand facts for those. Instead, `benchmarks.py` estimates them from the
brand's sector × segment × channel using published *category* benchmark ranges.
Treat `est_*` columns as **defensible modeling inputs** — assumptions you'd
present in a deck — not measured truth about a specific company.

## Files

| File | What it is |
|---|---|
| `seed_companies.py` | The curated list of real brands. Run it to (re)build `companies.csv`. |
| `companies.csv` | Editable input: one row per brand, 6 public fields. **Add rows here to scale.** |
| `benchmarks.py` | The estimation model — every AOV/PF/margin assumption, commented and tunable. |
| `score.py` | Fills estimates, applies the rescoping filter, computes an illustrative ROI → `companies_scored.csv`. |
| `companies_scored.csv` | Generated output, ranked golden-targets-first. |

## Usage

```bash
python3 seed_companies.py     # build companies.csv from the curated list
python3 score.py              # -> companies_scored.csv
```

To grow toward "hundreds of companies": append rows to `companies.csv` in the
same shape (`company, sector, value_segment, sales_channel,
approx_annual_rev_musd, region`) and re-run `score.py`. The engine fills the rest
automatically — no per-brand AOV/PF needed. Valid values for `sector`,
`value_segment`, and `sales_channel` are the keys defined in `benchmarks.py`.

## The rescoping filter (`scope_status`)

Over half of loyalty programs lose money — almost always because margins are too
thin to absorb reward cost, or organic frequency is too low to ever trigger a
second purchase. The filter encodes that:

- **REJECT** — `margin < 35%`; **or** `frequency < 1.5x/yr` and not a luxury-margin
  exception; **or** low AOV *and* low frequency with no subscription/app cadence.
- **GOLDEN TARGET** — high margin (≥55%) + moderate frequency (2–6x/yr) *[every
  extra order is high-margin lift]*, **or** solid margin (≥35%) + ultra-high
  frequency (≥10x/yr) *[subscription/point loop locks in habit]*.
- **PROCEED** — viable, but model the specifics before committing.

Each row carries a `scope_reason` explaining the verdict.

## The illustrative ROI columns

`illustrative_net_profit_musd` and `illustrative_roi_pct` rank rows by
opportunity using **uniform, conservative** lift assumptions (members +8% AOV,
+25% frequency; reward COGS ≈ 30% of incremental revenue; member base and program
cost proxied from revenue). They are for *comparison and sorting only* — plug the
`est_*` columns into your own calculator with your own member counts and program
costs for real numbers.

## Tuning

Everything judgmental lives in `benchmarks.py`: sector baselines, segment
multipliers, channel multipliers, and segment margins. Adjust for your book of
business and re-run. The lift and cost assumptions for the illustrative ROI live
at the top of `score.py`.
