// Combines raw data → deal math → scores → verdict into one screened object.
// This is the single source of truth the UI reads from.
import { computeDeal, priceCorrection } from './calculations.js'
import { scoreDeal, dealVerdict } from './dealScore.js'
import { scoreMarket, marketVerdict } from './marketScore.js'

export function screenMarket(market) {
  const { score, breakdown } = scoreMarket(market.factors)
  return { ...market, score, breakdown, verdict: marketVerdict(score) }
}

export function screenProperty(property, market) {
  const deal = computeDeal(property)
  const { score, breakdown, ratings } = scoreDeal(property, market, deal)
  const verdict = dealVerdict(score)
  const correction = priceCorrection(deal)
  return { ...property, deal, score, breakdown, ratings, verdict, correction, market }
}
