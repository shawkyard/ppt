"""
build_lookup.py — generate benchmark_lookup.csv: the full
sector x value_segment x sales_channel grid with modeled AOV / PF / margin and
loyalty-fit score for every combination.

This is the artifact for scoring a CRM at scale in Excel. Your workflow:

  1. For each company in your CRM, classify three fields you CAN infer from
     firmographics / website / industry code:
        sector, value_segment, sales_channel
  2. Build a lookup key  =  sector | value_segment | sales_channel
  3. VLOOKUP / XLOOKUP that key against benchmark_lookup.csv to pull
     est_aov, est_pf, est_gross_margin, loyalty_fit_score, expected_outcome.
  4. Sort by loyalty_fit_score and take the top 20-30%.

Excel example (key in A2, table on the 'lookup' sheet):
  =XLOOKUP($A2, lookup!$A:$A, lookup!$F:$F)     ' -> loyalty_fit_score
where column A of the table is the same "sector|segment|channel" key.
"""

import csv
import os

from benchmarks import SECTOR_BASE, SEGMENT, CHANNEL, estimate, loyalty_fit


def main():
    here = os.path.dirname(os.path.abspath(__file__))
    out = os.path.join(here, "benchmark_lookup.csv")

    fields = ["lookup_key", "sector", "value_segment", "sales_channel",
              "est_aov_usd", "est_purchase_freq_yr", "est_gross_margin",
              "loyalty_fit_score", "fit_tier", "expected_outcome"]
    rows = []
    for sector in SECTOR_BASE:
        for segment in SEGMENT:
            for channel in CHANNEL:
                aov, pf, margin = estimate(sector, segment, channel)
                score, tier, outcome = loyalty_fit(aov, pf, margin, channel)
                rows.append({
                    "lookup_key": f"{sector}|{segment}|{channel}",
                    "sector": sector, "value_segment": segment, "sales_channel": channel,
                    "est_aov_usd": aov, "est_purchase_freq_yr": pf, "est_gross_margin": margin,
                    "loyalty_fit_score": score, "fit_tier": tier, "expected_outcome": outcome,
                })

    rows.sort(key=lambda r: (r["sector"], r["value_segment"], r["sales_channel"]))
    with open(out, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fields)
        w.writeheader()
        w.writerows(rows)
    print(f"Wrote {len(rows)} benchmark combinations -> {out}")


if __name__ == "__main__":
    main()
