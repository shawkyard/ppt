// Market Gate scoring.
// Each input is a 0–10 rating supplied by the analyst.
// "Risk" factors (new supply, crime/safety) are inverted: a higher input = more
// risk = lower contribution. Weights sum to 100.

export const MARKET_FACTORS = [
  { key: 'jobGrowth', label: 'Job growth', weight: 15, invert: false,
    help: 'Payroll / employment momentum. 10 = strong, sustained gains.' },
  { key: 'populationGrowth', label: 'Population growth', weight: 12, invert: false,
    help: 'Net in-migration and household formation.' },
  { key: 'wageSupport', label: 'Wage / income support', weight: 10, invert: false,
    help: 'Can local incomes actually carry stabilized rents?' },
  { key: 'employerAnchors', label: 'Employer anchors', weight: 10, invert: false,
    help: 'Diversity and durability of major employers.' },
  { key: 'rentGrowth', label: 'Rent growth', weight: 12, invert: false,
    help: 'Trailing and projected rent trend for the class.' },
  { key: 'supplyRisk', label: 'New supply risk', weight: 10, invert: true,
    help: 'Pipeline / lease-up competition. 10 = heavy oversupply (bad).' },
  { key: 'affordability', label: 'Affordability', weight: 8, invert: false,
    help: 'Rent-to-income headroom. 10 = plenty of room to push rents.' },
  { key: 'crimeRisk', label: 'Crime / safety risk', weight: 8, invert: true,
    help: 'Safety perception in the trade area. 10 = high crime (bad).' },
  { key: 'infrastructure', label: 'Infrastructure investment', weight: 5, invert: false,
    help: 'Transit, roads, public/private capital flowing in.' },
  { key: 'reIndicator', label: 'RE Indicator score', weight: 10, invert: false,
    help: 'Your proprietary RE Indicator read for this market.' },
]

export function scoreMarket(inputs = {}) {
  let total = 0
  const breakdown = MARKET_FACTORS.map((f) => {
    const raw = clamp010(inputs[f.key])
    const effective = f.invert ? 10 - raw : raw
    const points = (effective / 10) * f.weight
    total += points
    return { ...f, raw, points }
  })
  return { score: Math.round(total), breakdown }
}

export function marketVerdict(score) {
  if (score >= 80) return { label: 'Approved', tone: 'approve', band: 'approved' }
  if (score >= 60) return { label: 'Watchlist', tone: 'warn', band: 'watchlist' }
  return { label: 'Reject', tone: 'danger', band: 'reject' }
}

function clamp010(v) {
  const n = Number(v)
  if (Number.isNaN(n)) return 0
  return Math.min(10, Math.max(0, n))
}
