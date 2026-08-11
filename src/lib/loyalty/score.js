// Financial fit scoring, classification, and an honest positive-ROI probability.
// Pure functions. The score is explainable — every point is attributable to a
// named factor, in the same spirit as the Deal Scout scratch score.

// Piecewise-linear interpolation across (x, rating) anchors. Clamps to [0,10].
function anchoredRating(x, anchors) {
  if (x <= anchors[0][0]) return anchors[0][1]
  const last = anchors[anchors.length - 1]
  if (x >= last[0]) return last[1]
  for (let i = 1; i < anchors.length; i++) {
    const [x0, r0] = anchors[i - 1]
    const [x1, r1] = anchors[i]
    if (x <= x1) return r0 + ((x - x0) / (x1 - x0)) * (r1 - r0)
  }
  return last[1]
}

const clamp01 = (v) => Math.min(1, Math.max(0, v))

export const FIT_FACTORS = [
  { key: 'returnStrength', label: 'Expected return', weight: 40,
    help: 'How large the expected net ROI is.' },
  { key: 'downsideSafety', label: 'Downside safety', weight: 35,
    help: 'Whether the account still returns in the conservative case.' },
  { key: 'evidenceCoverage', label: 'Evidence coverage', weight: 15,
    help: 'Share of inputs that are known or well-benchmarked vs. modeled.' },
  { key: 'vendorFit', label: 'Vendor / channel fit', weight: 10,
    help: 'How well the account matches the vendor and loyalty mechanics.' },
]

// expected / conservative: results from computeLoyaltyROI.
// coverage: 0–1 evidence coverage. vendorFit: 0–10 modeled fit signal.
export function fitScore({ expected, conservative, coverage = 0.4, vendorFit = 5 }) {
  const ratings = {
    returnStrength: anchoredRating(expected.netROI, [[-0.5, 0], [0, 2], [0.5, 5], [1.0, 7.5], [2.0, 10]]),
    downsideSafety: anchoredRating(conservative.netROI, [[-1, 0], [0, 5], [0.5, 8.5], [1.0, 10]]),
    evidenceCoverage: clamp01(coverage) * 10,
    vendorFit: Math.min(10, Math.max(0, vendorFit)),
  }

  let total = 0
  const breakdown = FIT_FACTORS.map((f) => {
    const raw = ratings[f.key]
    const points = (raw / 10) * f.weight
    total += points
    return { ...f, raw, points }
  })

  return { score: Math.round(total), breakdown, ratings }
}

// Green / Amber / Red — mapped to ACT NOW / WATCH / DROP.
// Green requires a strong expected case AND survival through the conservative
// case AND a healthy fit score. This is why margin-of-safety, not the headline
// number, is what qualifies an account.
export function classify({ expected, conservative, score }) {
  const bcr = expected.benefitCostRatio
  const survives = conservative.benefitCostRatio >= 1.0

  if (bcr >= 2.0 && survives && score >= 72) {
    return { label: 'ACT NOW', band: 'green', tone: 'approve' }
  }
  if (bcr >= 1.3 && expected.netROI > 0) {
    return { label: 'WATCH', band: 'amber', tone: 'warn' }
  }
  return { label: 'DROP', band: 'red', tone: 'danger' }
}

// Standard normal CDF via an Abramowitz-Stegun erf approximation.
function erf(x) {
  const t = 1 / (1 + 0.3275911 * Math.abs(x))
  const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x)
  return x >= 0 ? y : -y
}
function normalCdf(z) { return 0.5 * (1 + erf(z / Math.SQRT2)) }

// Probability the account clears break-even, then shrunk toward 50% in
// proportion to how thin the evidence is. We are confident the economics work,
// but these are estimates — the shrink keeps us from overstating certainty.
export function positiveRoiProbability({ expected, conservative, breakEven, coverage = 0.4 }) {
  const mu = expected.combinedLiftFactor
  const c = conservative.combinedLiftFactor
  // Treat the conservative case as roughly a 10th-percentile outcome.
  const sigma = Math.max((mu - c) / 1.2816, 1e-6)
  const rawP = normalCdf((mu - breakEven) / sigma)
  const evidenceWeight = 0.5 + 0.5 * clamp01(coverage)
  return clamp01(0.5 + (rawP - 0.5) * evidenceWeight)
}
