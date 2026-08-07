"""
score.py — enrich companies.csv with modeled AOV / PF / margin, apply the
loyalty-program "rescope" viability filter, and attach an illustrative ROI.

    python3 seed_companies.py     # (re)build companies.csv from the curated list
    python3 score.py              # -> companies_scored.csv

Two things this produces per company:

  1. Modeling inputs for a loyalty ROI calculator (aov, pf, gross_margin),
     estimated from benchmarks.py. NOT reported per-brand facts.

  2. A scope_status flag answering "would a loyalty program probably make or
     lose money here?" — because >50% of programs lose money, mostly on thin
     margins or too-low organic frequency.

The illustrative ROI columns use CONSERVATIVE, uniform lift assumptions (see
LIFT_* below). They exist so the file is directly sortable by opportunity; swap
in your own calculator's assumptions for real modeling.
"""

import csv
import os

from benchmarks import estimate

# --- Illustrative loyalty lift assumptions (uniform, conservative) ----------
LIFT_AOV = 0.08          # members spend ~8% more per order than the baseline
LIFT_PF = 0.25           # members buy ~25% more often
REWARD_COGS_RATE = 0.30  # reward COGS ≈ 30% of the incremental revenue created
# Program cost + member base are proxied from revenue so ROI is comparable
# across brands without needing per-brand member counts you don't have.
MEMBER_SHARE_OF_REV = 0.35   # assume 35% of revenue flows through members
PROGRAM_COST_RATE = 0.004    # fixed program opex ≈ 0.4% of member revenue


def rescope(aov, pf, margin, channel):
    """The viability filter. Returns (scope_status, reason)."""
    subscription_like = channel in ("Subscription", "Mobile App / QSR")

    # --- Guaranteed-loser guardrails --------------------------------------
    if margin < 0.35:
        return "REJECT", "gross margin < 35% — rewards eat the margin"
    if pf < 1.5 and margin < 0.65:
        return "REJECT", "frequency < 1.5x/yr — customers forget points before rebuying"
    if aov < 30 and pf < 10 and not subscription_like:
        return "REJECT", "low AOV + low frequency — software cost outruns incremental profit"

    # --- Golden targets ----------------------------------------------------
    high_margin_winner = margin >= 0.55 and 2.0 <= pf <= 6.0
    high_freq_winner = margin >= 0.35 and pf >= 10.0
    if high_margin_winner or high_freq_winner:
        if high_margin_winner:
            return "GOLDEN TARGET", "high margin + moderate frequency — every extra order is high-margin lift"
        return "GOLDEN TARGET", "solid margin + ultra-high frequency — subscription/point loop locks in habit"

    return "PROCEED", "viable, but model the specifics before committing"


def illustrative_roi(aov, pf, margin, rev_musd):
    """A rough, comparable loyalty ROI so rows can be ranked by opportunity."""
    baseline_spend = aov * pf
    member_spend = (aov * (1 + LIFT_AOV)) * (pf * (1 + LIFT_PF))
    per_capita_lift = member_spend - baseline_spend
    if per_capita_lift <= 0 or baseline_spend <= 0:
        return 0.0, 0.0

    member_rev = rev_musd * 1_000_000 * MEMBER_SHARE_OF_REV
    est_members = member_rev / baseline_spend
    incr_rev = est_members * per_capita_lift
    incr_gross_profit = incr_rev * margin
    reward_cogs = incr_rev * REWARD_COGS_RATE
    program_cost = member_rev * PROGRAM_COST_RATE
    net = incr_gross_profit - reward_cogs - program_cost
    total_cost = reward_cogs + program_cost
    roi_pct = (net / total_cost * 100) if total_cost > 0 else 0.0
    return round(net / 1_000_000, 2), round(roi_pct, 1)  # net in $M, roi %


def main():
    here = os.path.dirname(os.path.abspath(__file__))
    src = os.path.join(here, "companies.csv")
    out = os.path.join(here, "companies_scored.csv")

    rows = []
    with open(src) as f:
        for r in csv.DictReader(f):
            sector = r["sector"]
            segment = r["value_segment"]
            channel = r["sales_channel"]
            rev = float(r["approx_annual_rev_musd"])

            aov, pf, margin = estimate(sector, segment, channel)
            status, reason = rescope(aov, pf, margin, channel)
            net_m, roi = illustrative_roi(aov, pf, margin, rev)

            rows.append({
                "company": r["company"],
                "sector": sector,
                "value_segment": segment,
                "sales_channel": channel,
                "region": r["region"],
                "approx_annual_rev_musd": int(rev),
                "est_aov_usd": aov,
                "est_purchase_freq_yr": pf,
                "est_gross_margin": margin,
                "scope_status": status,
                "scope_reason": reason,
                "illustrative_net_profit_musd": net_m,
                "illustrative_roi_pct": roi,
            })

    # Rank: golden targets first, then by illustrative ROI.
    order = {"GOLDEN TARGET": 0, "PROCEED": 1, "REJECT": 2}
    rows.sort(key=lambda x: (order[x["scope_status"]], -x["illustrative_roi_pct"]))

    fields = list(rows[0].keys())
    with open(out, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fields)
        w.writeheader()
        w.writerows(rows)

    # Console summary
    from collections import Counter
    c = Counter(x["scope_status"] for x in rows)
    total = len(rows)
    print(f"Scored {total} companies -> {out}")
    for k in ("GOLDEN TARGET", "PROCEED", "REJECT"):
        print(f"  {k:14s}: {c.get(k,0):3d}  ({c.get(k,0)/total*100:4.1f}%)")


if __name__ == "__main__":
    main()
