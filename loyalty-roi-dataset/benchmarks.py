"""
benchmarks.py — the transparent estimation + loyalty-fit model.

Purpose: given only the PUBLIC attributes of a company (sector, value segment,
sales channel), produce (a) ballpark AOV / purchase-frequency / gross-margin
estimates and (b) a 0-100 loyalty-fit score whose only job is to sort a large
CRM into "likely GREEN" vs "likely RED" for a loyalty program. It is built for
directional triage at scale — top 20-30% of a list — not per-dollar precision.

WHY ESTIMATES ARE THE ONLY OPTION
  Per-company AOV and purchase frequency are not public. For a CRM of thousands
  of mid-market names there is no source of truth to look up. So we estimate
  from published *category* benchmarks. Every number below is traceable to a
  named public source (see SOURCES.md) or is a labeled judgment call.

THE MODEL
  aov          = SECTOR_BASE[sector].aov  * SEGMENT[segment].aov_mult * CHANNEL[channel].aov_mult
  pf           = SECTOR_BASE[sector].pf   * SEGMENT[segment].pf_mult  * CHANNEL[channel].pf_mult
  gross_margin = clamp(SECTOR_BASE[sector].gm + SEGMENT[segment].gm_adj, 0.10, 0.85)

  Margin is SECTOR-driven (anchored to NYU Stern / Damodaran) with a segment
  adjustment for pricing power — this is the single biggest driver of whether a
  loyalty program can afford its own rewards, so it must not be a guess.
"""

from dataclasses import dataclass


def _clamp(x, lo=0.0, hi=1.0):
    return max(lo, min(hi, x))


@dataclass(frozen=True)
class SectorBase:
    aov: float   # baseline AOV ($) at value_segment="standard", omnichannel
    pf: float    # baseline annual purchase frequency at standard / omni
    gm: float    # baseline PRODUCT gross margin (rev - COGS), standard segment


# --- Sector baselines -------------------------------------------------------
# aov/pf: midpoints of published category ranges (Littledata, Dynamic Yield,
#   Opensend, Eightx, AppsFlyer — see SOURCES.md).
# gm: NYU Stern / Damodaran "Margins by Sector (US)" (gross margin), rounded to
#   sector proxies. NOTE gm is PRODUCT gross margin (price - COGS), i.e. what a
#   reward actually costs to give — NOT store-level operating margin. This is
#   why QSR (cheap COGS on a coffee) scores high and grocery (thin) scores low.
SECTOR_BASE = {
    "Apparel & Accessories":  SectorBase(90,  3.5, 0.54),
    "Footwear":               SectorBase(110, 2.6, 0.45),
    "Beauty & Personal Care": SectorBase(65,  3.6, 0.62),
    "Consumer Electronics":   SectorBase(140, 3.0, 0.28),
    "Home & Garden":          SectorBase(120, 2.9, 0.40),
    "Home / Mattress":        SectorBase(700, 1.2, 0.55),
    "Grocery":                SectorBase(70,  15.0, 0.22),
    "QSR / Coffee":           SectorBase(11,  42.0, 0.66),
    "Health & Supplements":   SectorBase(60,  5.2, 0.55),
    "Pet Care":               SectorBase(65,  6.2, 0.40),
    "Sports & Outdoor":       SectorBase(120, 2.9, 0.45),
    "Toys & Hobbies":         SectorBase(55,  3.4, 0.42),
    "Jewelry & Watches":      SectorBase(350, 1.3, 0.50),
    "Eyewear":                SectorBase(140, 1.6, 0.60),
    "General Merchandise":    SectorBase(85,  16.0, 0.25),
    "Luggage & Travel":       SectorBase(260, 1.2, 0.50),
}


@dataclass(frozen=True)
class Segment:
    aov_mult: float
    pf_mult: float
    gm_adj: float   # additive gross-margin adjustment for pricing power


# --- Value-segment adjustments ----------------------------------------------
# Higher segments: bigger ticket, lower frequency, more pricing power (margin).
SEGMENT = {
    "extreme_luxury":   Segment(12.0, 0.45,  0.10),
    "luxury":           Segment(3.0,  0.80,  0.06),
    "standard":         Segment(1.0,  1.00,  0.00),
    "discount":         Segment(0.60, 1.20, -0.05),
    "extreme_discount": Segment(0.40, 1.45, -0.10),
}


@dataclass(frozen=True)
class Channel:
    aov_mult: float
    pf_mult: float


# --- Sales-channel adjustments ----------------------------------------------
# Mobile/app: lower ticket, higher frequency. Subscription pins frequency high.
CHANNEL = {
    "Omnichannel":      Channel(1.00, 1.00),
    "DTC Ecommerce":    Channel(1.00, 1.00),
    "Marketplace":      Channel(0.90, 1.10),
    "Mobile App / QSR": Channel(0.80, 1.80),
    "Big Box":          Channel(1.00, 1.00),
    "Department Store": Channel(1.10, 0.90),
    "Subscription":     Channel(0.90, 2.00),
    "Boutique":         Channel(1.20, 0.80),
}


def estimate(sector: str, segment: str, channel: str):
    """Return (aov, pf, gross_margin) ballpark estimates."""
    if sector not in SECTOR_BASE:
        raise KeyError(f"Unknown sector: {sector!r}")
    if segment not in SEGMENT:
        raise KeyError(f"Unknown value_segment: {segment!r}")
    if channel not in CHANNEL:
        raise KeyError(f"Unknown sales_channel: {channel!r}")
    b, s, c = SECTOR_BASE[sector], SEGMENT[segment], CHANNEL[channel]
    aov = b.aov * s.aov_mult * c.aov_mult
    pf = b.pf * s.pf_mult * c.pf_mult
    gm = _clamp(b.gm + s.gm_adj, 0.10, 0.85)
    return round(aov, 2), round(pf, 2), round(gm, 3)


# ---------------------------------------------------------------------------
# LOYALTY-FIT SCORE  (0-100)  — the headline output
# ---------------------------------------------------------------------------
# Not a calibrated probability; an ordinal index designed so that higher = more
# likely to land GREEN (program clears rewards + labor + platform cost). Tuned
# so the structurally-doomed cases (thin margin, or too-infrequent to change
# behavior) are driven down hard, matching how a seasoned loyalty seller triages.
#
#   margin_score : room to fund rewards        0 at 20% GM  -> 1 at 60% GM
#   freq_score   : enough repeat to form habit  0 at 1.2x    -> 1 at 4.0x/yr
#   aov_support  : ticket big enough to matter  0 at $15     -> 1 at $60
#
#   raw = 100 * (0.50*margin + 0.35*freq + 0.15*aov_support)
#   then hard "structural red" caps are applied.
FIT_WEIGHTS = {"margin": 0.50, "freq": 0.35, "aov": 0.15}


def loyalty_fit(aov: float, pf: float, margin: float, channel: str):
    """Return (score_0_100, tier, expected_outcome)."""
    subscription_like = channel in ("Subscription", "Mobile App / QSR")

    margin_score = _clamp((margin - 0.20) / 0.40)
    freq_score = _clamp((pf - 1.2) / 2.8)
    aov_support = _clamp((aov - 15) / 45)

    raw = 100 * (FIT_WEIGHTS["margin"] * margin_score
                 + FIT_WEIGHTS["freq"] * freq_score
                 + FIT_WEIGHTS["aov"] * aov_support)

    # --- structural-red caps (the "even free, they lose money" cases) -------
    cap = 100.0
    if margin < 0.25:                      # rewards + labor eat a thin margin
        cap = min(cap, 28)
    if pf < 1.3 and margin < 0.65:         # too rare to change behavior (no luxury-margin rescue)
        cap = min(cap, 22)
    if aov < 20 and pf < 6 and not subscription_like:  # platform cost per member outruns lift
        cap = min(cap, 28)

    score = round(min(raw, cap), 1)
    tier, outcome = _tier(score)
    return score, tier, outcome


def _tier(score: float):
    if score >= 65:
        return "A", "GREEN"          # prime target
    if score >= 50:
        return "B", "GREEN"          # good target
    if score >= 35:
        return "C", "MARGINAL"       # coin-flip; needs a real look
    return "D", "RED"                # likely loses money — drop
