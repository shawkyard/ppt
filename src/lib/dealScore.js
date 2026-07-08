// Property scratch scoring — weighted 0–100.
// Market strength, rent upside, and vacancy upside auto-derive from data;
// the rest are analyst 0–10 ratings. Broker optimism risk is inverted.
import { marketGate } from './reindicator.js'

export const SCRATCH_FACTORS = [
  { key: 'marketStrength', label: 'Market strength', weight: 20, help: 'From the market REIndicator gate.' },
  { key: 'submarketQuality', label: 'Submarket quality', weight: 15, help: 'C property in a B pocket scores high.' },
  { key: 'conditionFit', label: 'Condition / value-add fit', weight: 15, help: 'Dated but fixable scores high.' },
  { key: 'rentUpside', label: 'Rent upside', weight: 15, help: 'Derived from current → market rent gap.' },
  { key: 'vacancyUpside', label: 'Vacancy / operations upside', weight: 10, help: 'Derived from current occupancy.' },
  { key: 'capexFeasibility', label: 'Capex feasibility', weight: 10, help: 'Is the reno path realistic?' },
  { key: 'brokerOptimismRisk', label: 'Broker optimism risk', weight: 5, invert: true, help: 'Reliance on broker pro forma (high = bad).' },
  { key: 'debtStrikeFactor', label: 'Debt / strike-factor likelihood', weight: 10, help: 'Will financing pencil at stabilization?' },
]

const clamp = (v) => Math.min(10, Math.max(0, Number(v) || 0))

// Map a market gate to a 0–10 strength score.
const GATE_STRENGTH = { hunt: 9, limited: 6.5, watch: 5, review: 4, ignore: 2 }

function marketStrengthRating(market) {
  if (!market) return 5
  const gate = marketGate(market)
  let base = GATE_STRENGTH[gate.gate] ?? 5
  if (market.confidence === 'Needs verification') base -= 1
  return clamp(base)
}

const rentUpsideRating = (gapPct) => clamp((Math.max(0, gapPct) / 0.20) * 10)
const vacancyUpsideRating = (occupancy) => {
  const vac = 1 - (occupancy ?? 0.95)
  const excess = vac - 0.05
  return excess <= 0 ? 1 : clamp((excess / 0.15) * 10)
}

export function scoreDeal(property, market, deal) {
  const ratings = {
    marketStrength: marketStrengthRating(market),
    submarketQuality: clamp(property.submarketQuality),
    conditionFit: clamp(property.conditionFit),
    rentUpside: rentUpsideRating(deal.rentGapPct),
    vacancyUpside: vacancyUpsideRating(deal.current.occupancy),
    capexFeasibility: clamp(property.capexFeasibility),
    brokerOptimismRisk: clamp(property.brokerOptimismRisk),
    debtStrikeFactor: clamp(property.debtStrikeFactor),
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
  if (score >= 85) return { label: 'Strong Lead — request full OM immediately', short: 'Strong Lead', tone: 'green', band: 'strong' }
  if (score >= 70) return { label: 'Worth Requesting Full OM', short: 'Request OM', tone: 'green', band: 'request' }
  if (score >= 55) return { label: 'Watchlist / Needs Price Reset', short: 'Watchlist', tone: 'yellow', band: 'watchlist' }
  if (score >= 40) return { label: 'Pass Unless Price Drops Materially', short: 'Pass unless price drops', tone: 'red', band: 'pass-price' }
  return { label: 'Pass', short: 'Pass', tone: 'red', band: 'pass' }
}
