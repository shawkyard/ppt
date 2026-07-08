// 18–24 month value-add stabilization plan, derived from the deal math.
// Core thesis: Year 1–2 are for execution; Year 3 is the first stabilized year.
// We never reject a deal for weak Year-1 cash-on-cash.
import { usd } from './format.js'

export function buildPlan(p) {
  const d = p.deal
  const perUnit = usd(d.capexPerUnit)
  const renoUnits = Math.max(1, Math.round(d.units * 0.6))
  return [
    { phase: 'Months 1–6', title: 'Take control & de-risk', tone: 'gold', actions: [
      'Close, transition management, take over books and banking.',
      'Full unit-by-unit condition audit; confirm capex scope and contingency.',
      `Prove the ${perUnit}/unit renovation premium with a 6-unit test batch.`,
      'Stand up the other-income program (RUBS, laundry, parking, pet, fees).',
    ]},
    { phase: 'Months 6–12', title: 'Renovate on turns & push rents', tone: 'turq', actions: [
      `Renovate ~${renoUnits} of ${d.units} units on natural turnover.`,
      `Move rents from ${usd(d.current.avgRent)} toward ${usd(d.strike.avgRent)} (strike).`,
      'Enforce collections and the other-income program; re-bid contracts.',
    ]},
    { phase: 'Months 12–18', title: 'Burn down vacancy & stabilize ops', tone: 'green', actions: [
      'Complete remaining renovations; lease the down/offline units.',
      'Drive economic occupancy to the stabilized target (~93–95%).',
      'Tighten delinquency, renewals, and the expense ratio.',
    ]},
    { phase: 'Months 18–24 → Year 3', title: 'Prove stabilized NOI', tone: 'gold', actions: [
      `Demonstrate trailing stabilized NOI near ${usd(d.stabilizedNOI)}.`,
      `Target stabilized value near ${usd(d.stabilizedValue)} at a ${(d.exitCapRate * 100).toFixed(2)}% exit cap.`,
      'Order updated appraisal / BOV. Decide: refi to return capital, hold, or sell.',
    ]},
  ]
}
