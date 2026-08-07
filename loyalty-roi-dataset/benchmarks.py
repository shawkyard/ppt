"""
benchmarks.py — the transparent estimation model.

IMPORTANT — read this before trusting any AOV / purchase-frequency number:

  Almost no B2C brand publicly discloses its average order value (AOV) or
  per-customer purchase frequency (PF). Those are proprietary. So every AOV and
  PF value in this dataset is an ESTIMATE produced by the model below, NOT a
  reported figure. The only "hard" fields per company are its name, sector,
  value segment, primary sales channel, and an order-of-magnitude annual
  revenue. Treat AOV/PF/margin as defensible *modeling inputs* for a loyalty
  ROI calculator — the kind of assumptions you'd defend in a pitch — not as
  audited facts about a specific brand.

The model:  AOV, PF and gross margin are derived from three public attributes.

    aov          = SECTOR_BASE[sector].aov
                   * SEGMENT_AOV_MULT[segment]
                   * CHANNEL[channel].aov_mult
    pf           = SECTOR_BASE[sector].pf
                   * SEGMENT_PF_MULT[segment]
                   * CHANNEL[channel].pf_mult
    gross_margin = SEGMENT_MARGIN[segment]   (channel-agnostic)

Every constant below is a benchmark judgment call; they are grouped and
commented so you can tune them for your own book of business.
"""

from dataclasses import dataclass


@dataclass(frozen=True)
class SectorBase:
    aov: float   # baseline AOV ($) at the STANDARD value segment, omni channel
    pf: float    # baseline annual purchase frequency at STANDARD / omni


# --- Sector baselines (calibrated at value_segment="standard") --------------
# Sources of intuition: published category AOV/PF benchmark ranges (AppsFlyer,
# Opensend, Salesforce Shopping Index, industry medians). Point estimates =
# midpoints of the commonly-cited ranges.
SECTOR_BASE = {
    "Apparel & Accessories": SectorBase(90, 3.5),
    "Footwear":              SectorBase(110, 2.6),
    "Beauty & Personal Care": SectorBase(65, 3.6),
    "Consumer Electronics":  SectorBase(140, 3.0),
    "Home & Garden":         SectorBase(120, 2.9),
    "Home / Mattress":       SectorBase(700, 1.2),   # big-ticket, rare repeat
    "Grocery":               SectorBase(70, 15.0),
    "QSR / Coffee":          SectorBase(11, 42.0),   # low ticket, ultra-frequent
    "Health & Supplements":  SectorBase(60, 5.2),
    "Pet Care":              SectorBase(65, 6.2),
    "Sports & Outdoor":      SectorBase(120, 2.9),
    "Toys & Hobbies":        SectorBase(55, 3.4),
    "Jewelry & Watches":     SectorBase(350, 1.3),
    "Eyewear":               SectorBase(140, 1.6),
    "General Merchandise":   SectorBase(85, 16.0),   # big-box mass retail
    "Luggage & Travel":      SectorBase(260, 1.2),
}

# --- Value-segment multipliers ----------------------------------------------
# Higher segments = bigger tickets, lower frequency, fatter margins.
SEGMENT_AOV_MULT = {
    "extreme_luxury": 12.0,
    "luxury":          3.0,
    "standard":        1.0,
    "discount":        0.60,
    "extreme_discount":0.40,
}
SEGMENT_PF_MULT = {
    "extreme_luxury": 0.45,
    "luxury":         0.80,
    "standard":       1.00,
    "discount":       1.20,
    "extreme_discount":1.45,
}
# Gross margin is dominated by segment, not sector, for our purposes.
SEGMENT_MARGIN = {
    "extreme_luxury": 0.72,
    "luxury":         0.62,
    "standard":       0.50,
    "discount":       0.35,
    "extreme_discount":0.24,
}


@dataclass(frozen=True)
class Channel:
    aov_mult: float
    pf_mult: float


# --- Sales-channel multipliers ----------------------------------------------
# Rule of thumb the transcript referenced: mobile-app channels see lower AOV
# but much higher frequency (frictionless push + 1-click). Subscription pins
# frequency even higher. Department stores skew higher ticket, lower frequency.
CHANNEL = {
    "Omnichannel":        Channel(1.00, 1.00),
    "DTC Ecommerce":      Channel(1.00, 1.00),
    "Marketplace":        Channel(0.90, 1.10),
    "Mobile App / QSR":   Channel(0.80, 1.80),
    "Big Box":            Channel(1.00, 1.00),
    "Department Store":   Channel(1.10, 0.90),
    "Subscription":       Channel(0.90, 2.00),
    "Boutique":           Channel(1.20, 0.80),
}


def estimate(sector: str, segment: str, channel: str):
    """Return (aov, pf, gross_margin) estimates for a company."""
    if sector not in SECTOR_BASE:
        raise KeyError(f"Unknown sector: {sector!r}")
    if segment not in SEGMENT_AOV_MULT:
        raise KeyError(f"Unknown value_segment: {segment!r}")
    if channel not in CHANNEL:
        raise KeyError(f"Unknown sales_channel: {channel!r}")

    base = SECTOR_BASE[sector]
    ch = CHANNEL[channel]
    aov = base.aov * SEGMENT_AOV_MULT[segment] * ch.aov_mult
    pf = base.pf * SEGMENT_PF_MULT[segment] * ch.pf_mult
    margin = SEGMENT_MARGIN[segment]
    return round(aov, 2), round(pf, 2), margin
