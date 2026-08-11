// Governed estimates. When a real value is missing, the engine fills the gap
// from these calibrated priors — and records the field as `modeled` so the
// evidence trail always shows what was assumed vs. known.
//
// These are directional screening priors, NOT validated per-company numbers.
// The uplift priors are intended to represent *net incremental* behavior, so no
// additional self-selection haircut is applied on top of them (see prescope.js).

// Per-segment behavioral and cost priors.
export const SEGMENT_PRIORS = {
  fastCasual:   { aov: 26,  purchaseFrequency: 22, grossMargin: 0.35, aovLift: 0.07, pfLift: 0.12, rewardCostRate: 0.014, memberRevenueShare: 0.42 },
  qsr:          { aov: 12,  purchaseFrequency: 30, grossMargin: 0.32, aovLift: 0.06, pfLift: 0.12, rewardCostRate: 0.015, memberRevenueShare: 0.40 },
  grocery:      { aov: 55,  purchaseFrequency: 44, grossMargin: 0.27, aovLift: 0.04, pfLift: 0.06, rewardCostRate: 0.012, memberRevenueShare: 0.55 },
  convenience:  { aov: 9,   purchaseFrequency: 60, grossMargin: 0.30, aovLift: 0.05, pfLift: 0.10, rewardCostRate: 0.013, memberRevenueShare: 0.35 },
  beautyRetail: { aov: 48,  purchaseFrequency: 6,  grossMargin: 0.55, aovLift: 0.08, pfLift: 0.15, rewardCostRate: 0.020, memberRevenueShare: 0.45 },
  apparel:      { aov: 85,  purchaseFrequency: 4,  grossMargin: 0.50, aovLift: 0.06, pfLift: 0.08, rewardCostRate: 0.018, memberRevenueShare: 0.35 },
  petSupplies:  { aov: 60,  purchaseFrequency: 9,  grossMargin: 0.38, aovLift: 0.06, pfLift: 0.11, rewardCostRate: 0.016, memberRevenueShare: 0.40 },
  // Fallback when a segment is unknown — deliberately cautious.
  generic:      { aov: 45,  purchaseFrequency: 8,  grossMargin: 0.35, aovLift: 0.05, pfLift: 0.07, rewardCostRate: 0.015, memberRevenueShare: 0.35 },
}

export function segmentPrior(segment) {
  return SEGMENT_PRIORS[segment] || SEGMENT_PRIORS.generic
}

// Conservative case = expected uplifts and margin, discounted.
// upliftFactor 0.57 turns a 7%/12% expected case into ~4%/7% — the downside
// stress the report shows. marginDelta trims a few points off gross margin.
export const CONSERVATIVE = {
  upliftFactor: 0.57,
  marginDelta: -0.03,
}

// How much each provenance level counts toward evidence coverage.
export const CONFIDENCE_WEIGHT = {
  actual: 1.0,   // the buyer's real number
  high: 0.8,     // strong external benchmark
  estimate: 0.6, // reasonable segment estimate
  modeled: 0.35, // filled from a prior
  unknown: 0.15,
}

// Default program cost model when costs aren't supplied, scaled to footprint.
// Software scales with unit count; labor/marketing/misc scale with revenue.
export function defaultCosts({ revenue = 0, units = 0 } = {}) {
  const software = Math.min(150000 + units * 1500, 600000)
  const labor = Math.max(180000, Math.round(revenue * 0.001))     // ~0.1% of revenue, floor 3 FTE-ish
  const marketing = Math.max(250000, Math.round(revenue * 0.0025)) // ~0.25% of revenue
  const misc = Math.max(120000, Math.round(revenue * 0.0008))
  return { software, labor, marketing, misc }
}
