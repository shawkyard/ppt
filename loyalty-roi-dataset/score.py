"""
score.py — enrich companies.csv with modeled AOV / PF / margin, attach the
loyalty-fit score, and rank the list so you can cut the top 20-30%.

    python3 seed_companies.py     # (re)build companies.csv from the curated list
    python3 score.py              # -> companies_scored.csv

Headline column is `loyalty_fit_score` (0-100). Higher = more likely GREEN.
`fit_percentile` ranks each company WITHIN this file (100 = best) so you can
take, e.g., everyone at or above the 70th–80th percentile. `expected_outcome`
collapses it to GREEN / MARGINAL / RED for a fast yes/no/maybe.

The illustrative ROI columns use uniform conservative lift assumptions and exist
only to break ties within a tier — plug the est_* columns into your own Excel
calculator for real dollars.
"""

import csv
import os
from collections import Counter

from benchmarks import estimate, loyalty_fit

# Illustrative lift assumptions (uniform, conservative) — tie-breaker ROI only.
LIFT_AOV = 0.08
LIFT_PF = 0.25
REWARD_COGS_RATE = 0.30
MEMBER_SHARE_OF_REV = 0.35
PROGRAM_COST_RATE = 0.004


def illustrative_roi(aov, pf, margin, rev_musd):
    baseline_spend = aov * pf
    member_spend = (aov * (1 + LIFT_AOV)) * (pf * (1 + LIFT_PF))
    per_capita_lift = member_spend - baseline_spend
    if per_capita_lift <= 0 or baseline_spend <= 0:
        return 0.0, 0.0
    member_rev = rev_musd * 1_000_000 * MEMBER_SHARE_OF_REV
    est_members = member_rev / baseline_spend
    incr_rev = est_members * per_capita_lift
    net = incr_rev * margin - incr_rev * REWARD_COGS_RATE - member_rev * PROGRAM_COST_RATE
    total_cost = incr_rev * REWARD_COGS_RATE + member_rev * PROGRAM_COST_RATE
    roi_pct = (net / total_cost * 100) if total_cost > 0 else 0.0
    return round(net / 1_000_000, 2), round(roi_pct, 1)


def main():
    here = os.path.dirname(os.path.abspath(__file__))
    src = os.path.join(here, "companies.csv")
    out = os.path.join(here, "companies_scored.csv")

    rows = []
    with open(src) as f:
        for r in csv.DictReader(f):
            sector, segment, channel = r["sector"], r["value_segment"], r["sales_channel"]
            rev = float(r["approx_annual_rev_musd"])
            aov, pf, margin = estimate(sector, segment, channel)
            score, tier, outcome = loyalty_fit(aov, pf, margin, channel)
            net_m, roi = illustrative_roi(aov, pf, margin, rev)
            rows.append({
                "company": r["company"], "sector": sector, "value_segment": segment,
                "sales_channel": channel, "region": r["region"],
                "approx_annual_rev_musd": int(rev),
                "est_aov_usd": aov, "est_purchase_freq_yr": pf, "est_gross_margin": margin,
                "loyalty_fit_score": score, "fit_tier": tier, "expected_outcome": outcome,
                "illustrative_net_profit_musd": net_m, "illustrative_roi_pct": roi,
            })

    # Percentile rank within this file (100 = best fit).
    n = len(rows)
    for i, r in enumerate(sorted(rows, key=lambda x: x["loyalty_fit_score"])):
        r["fit_percentile"] = round(100 * (i + 1) / n, 1)

    rows.sort(key=lambda x: -x["loyalty_fit_score"])
    fields = ["company", "sector", "value_segment", "sales_channel", "region",
              "approx_annual_rev_musd", "est_aov_usd", "est_purchase_freq_yr",
              "est_gross_margin", "loyalty_fit_score", "fit_percentile", "fit_tier",
              "expected_outcome", "illustrative_net_profit_musd", "illustrative_roi_pct"]
    with open(out, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fields)
        w.writeheader()
        w.writerows(rows)

    c = Counter(r["expected_outcome"] for r in rows)
    print(f"Scored {n} companies -> {out}")
    for k in ("GREEN", "MARGINAL", "RED"):
        print(f"  {k:9s}: {c.get(k,0):3d}  ({c.get(k,0)/n*100:4.1f}%)")
    top = [r for r in rows if r["fit_percentile"] >= 75]
    print(f"  Top quartile (fit_percentile >= 75): {len(top)} companies")


if __name__ == "__main__":
    main()
