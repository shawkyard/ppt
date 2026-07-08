// Generates a standard 18–24 month value-add stabilization plan from a screened
// property. The plan is derived from the deal math so it stays consistent with
// the numbers shown elsewhere. This is the core "can it BECOME a good deal"
// thesis — we are not requiring 12% cash-on-cash in Year 1.
import { usd } from './format.js'

export function buildPlan(p) {
  const d = p.deal
  const perUnitCapex = d.units ? Math.round(d.estimatedCapex / d.units) : 0
  const unitsToRenovate = Math.max(1, Math.round(d.units * 0.6))

  return [
    {
      phase: 'Phase 1',
      window: 'Months 0–3',
      title: 'Take control & establish the baseline',
      actions: [
        'Close, transition management, and take over books and banking.',
        'Full unit-by-unit interior/exterior condition audit; confirm capex scope.',
        'Fire up the renovation supply chain and finalize the scope-per-unit budget.',
        `Confirm the ${usd(perUnitCapex)}/unit renovation premium with a 6-unit test batch.`,
        'Implement RUBS / other-income program design (laundry, parking, pet, fees).',
      ],
    },
    {
      phase: 'Phase 2',
      window: 'Months 3–12',
      title: 'Renovate on turns & push rents',
      actions: [
        `Renovate ~${unitsToRenovate} units on natural turnover (avoid mass vacancy).`,
        `Move renovated units from ${usd(d.currentRent)} toward the ${usd(d.marketRent)} market rent.`,
        'Roll out new leases at market; enforce the other-income program.',
        'Reduce controllable expenses; re-bid contracts, insurance, and payroll.',
        'Track economic occupancy weekly against the lease-up model.',
      ],
    },
    {
      phase: 'Phase 3',
      window: 'Months 12–18',
      title: 'Burn down vacancy & stabilize operations',
      actions: [
        'Complete remaining renovations and lease the down/offline units.',
        `Drive physical + economic occupancy to the stabilized target (~95%).`,
        'Fully capture stabilized other income.',
        'Tighten delinquency, renewals, and expense ratio toward the stabilized model.',
      ],
    },
    {
      phase: 'Phase 4',
      window: 'Months 18–24',
      title: 'Prove stabilized NOI & position for refi/hold/sale',
      actions: [
        `Demonstrate a trailing stabilized NOI near ${usd(d.stabilizedNOI)}.`,
        `Target a stabilized value near ${usd(d.stabilizedValue)} at a ${(d.exitCapRate * 100).toFixed(2)}% exit cap.`,
        'Order an updated appraisal / broker opinion of value.',
        'Decide: supplemental/refi to return capital, long-term hold, or sale.',
      ],
    },
  ]
}

export const planTargets = (p) => ({
  currentNOI: p.deal.currentNOI,
  stabilizedNOI: p.deal.stabilizedNOI,
  noiLift: p.deal.stabilizedNOI - p.deal.currentNOI,
  currentCap: p.deal.currentCapRate,
  stabilizedCap: p.deal.stabilizedCapRate,
  stabilizedValue: p.deal.stabilizedValue,
  valueCreated: p.deal.valueCreated,
})
