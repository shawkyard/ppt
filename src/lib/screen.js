// Enriches raw records into screened objects the UI reads from.
import { computeDeal, strikeFactors } from './calculations.js'
import { scoreDeal, dealVerdict } from './dealScore.js'
import { marketGate } from './reindicator.js'
import { sourceLevel } from './sources.js'

export function screenMarket(market) {
  return { ...market, gate: marketGate(market) }
}

export function screenProperty(property, market) {
  const deal = computeDeal(property)
  const { score, breakdown, ratings } = scoreDeal(property, market, deal)
  const verdict = dealVerdict(score)
  const factors = strikeFactors(deal)
  const source = sourceLevel(property.sourceLevel)
  return { ...property, deal, score, breakdown, ratings, verdict, factors, source, market }
}
