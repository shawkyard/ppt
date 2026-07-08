// Property scratch scoring.
// Weighted 0–100. Some sub-scores are auto-derived from data (market strength,
// rent upside, vacancy upside); others are analyst 0–10 ratings on the property.
// "Broker optimism risk" is inverted — high broker optimism is a negative.

export const SCRATCH_FACTORS = [
  { key: 'marketStrength', label: 'Market strength', weight: 20, derived: true,
    help: 'Pulled from the linked market gate score.' },
  { key: 'submarketQuality', label: 'Submarket quality', weight: 15, derived: false,
    help: 'Is this a C property sitting in a B (or better) pocket? 10 = strong pocket.' },
  { key: 'conditionFit', label: 'Property condition / value-add fit', weight: 15, derived: false,
    help: 'Dated but fixable scores high. Already-renovated or luxury scores low.' },
  { key: 'rentUpside', label: 'Rent upside', weight: 15, derived: true,
    help: 'Derived from the gap between current and market rents.' },
  { key: 'vacancyUpside', label: 'Vacancy / operations upside', weight: 10, derived: true,
    help: 'Derived from current vacancy vs. a stabilized target.' },
  { key: 'capexFeasibility', label: 'Capex feasibility', weight: 10, derived: false,
    help: 'Is the renovation path realistic on budget and timeline? 10 = clean path.' },
  { key: 'brokerOptimismRisk', label: 'Broker optimism risk', weight: 5, derived: false, invert: true,
    help: 'How much does the deal lean on the broker pro forma? 10 = heavy reliance (bad).' },
  { key: 'debtStrikeFactor', label: 'Debt / strike-factor likelihood', weight: 10, derived: false,
    help: 'Likelihood financing pencils at todays terms. 10 = high confidence.' },
]

// Map a rent gap % into a 0–10 rating. ~20%+ gap = full marks.
function rentUpsideRating(rentGapPct) {
  if (rentGapPct <= 0) return 0
  return clamp010((rentGapPct / 0.20) * 10)
}

// Map current vacancy into a 0–10 upside rating vs a 5% stabilized target.
function vacancyUpsideRating(vacancyRate, target = 0.05) {
  const excess = (vacancyRate ?? 0) - target
  if (excess <= 0) return 1 // little operational upside if already tight
  return clamp010((excess / 0.15) * 10)
}

export function scoreDeal(property, market, deal) {
  const marketStrength = market ? (market.score / 10) : 5
  const rentUpside = rentUpsideRating(deal.rentGapPct)
  const vacancyUpside = vacancyUpsideRating(property.vacancyRate)

  const ratings = {
    marketStrength,
    submarketQuality: clamp010(property.submarketQuality),
    conditionFit: clamp010(property.conditionFit),
    rentUpside,
    vacancyUpside,
    capexFeasibility: clamp010(property.capexFeasibility),
    brokerOptimismRisk: clamp010(property.brokerOptimismRisk),
    debtStrikeFactor: clamp010(property.debtStrikeFactor),
  }

  let total = 0
  const breakdown = SCRATCH_FACTORS.map((f) => {
    const raw = ratings[f.key]
    const effective = f.invert ? 10 - raw : raw
    const points = (effective / 10) * f.weight
    total += points
    return { ...f, raw, points }
  })

  return { score: Math.round(total), breakdown, ratings }
}

export function dealVerdict(score) {
  if (score >= 85) return { label: 'Strong lead — request full OM immediately', short: 'Strong lead', tone: 'approve', band: 'strong' }
  if (score >= 70) return { label: 'Worth requesting full OM', short: 'Request OM', tone: 'approve', band: 'request' }
  if (score >= 55) return { label: 'Watchlist / needs price reset', short: 'Watchlist', tone: 'warn', band: 'watchlist' }
  if (score >= 40) return { label: 'Pass unless price drops materially', short: 'Pass unless price drops', tone: 'danger', band: 'pass-price' }
  return { label: 'Pass', short: 'Pass', tone: 'danger', band: 'pass' }
}

function clamp010(v) {
  const x = Number(v)
  if (Number.isNaN(x)) return 0
  return Math.min(10, Math.max(0, x))
}
