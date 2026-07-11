// Hidden Value Finder — flip / BRRRR + creative-control screening.
// Pure functions, no side effects, no formatting.
//
// The Utah value levers are grounded in real statute:
//   - Internal ADU permitted BY RIGHT in most residential zones (HB 82, 2021 —
//     Utah Code 10-9a-530). Cities may bar it on lots of 6,000 sf or less.
//   - Administrative subdivision / lot split (SB 174 & HB 406, 2023) forced a
//     two-step ministerial process, so an oversized lot is a real split lever.
//
// Everything here is a SCREENING estimate — not an appraisal, not legal advice.

const n = (v, d = 0) => {
  const x = Number(v)
  return Number.isNaN(x) ? d : x
}
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))
const clamp010 = (v) => clamp(n(v), 0, 10)

// Acquisition path a deal is controlled through. Drives capital-in + mechanic.
export const CONTROL_METHODS = [
  { key: 'direct', label: 'Direct purchase',
    mechanic: 'Buy outright, add value, resell or hold. Highest capital in.' },
  { key: 'option', label: 'Option',
    mechanic: 'Pay an option fee for the right to buy at a locked price; exercise or assign the spread. Low cash.' },
  { key: 'lease-option', label: 'Lease-option',
    mechanic: 'Rent with the right to buy later; part of rent credited toward purchase. Low cash, builds toward ownership.' },
  { key: 'note', label: 'Note (buy the debt)',
    mechanic: 'Buy the mortgage note at a discount; work it out, re-perform it, or take the asset. Capital + due-diligence heavy.' },
]

// ---------------------------------------------------------------------------
// Flip math — the buy is made here.
// ---------------------------------------------------------------------------
export const SEVENTY_RULE = 0.70

export function computeFlip(i = {}) {
  const arv = n(i.arv)
  const rehab = n(i.rehab)
  const purchase = n(i.purchase)
  const holdingCosts = n(i.holdingCosts)
  const buyClosingPct = n(i.buyClosingPct, 0.02)
  const sellClosingPct = n(i.sellClosingPct, 0.07)

  const buyClosing = Math.round(purchase * buyClosingPct)
  const sellClosing = Math.round(arv * sellClosingPct)

  // Classic 70% rule: max allowable offer = 70% of ARV, less rehab.
  const mao = Math.round(SEVENTY_RULE * arv - rehab)
  const maoGap = mao - purchase // positive = room under the rule

  const allIn = purchase + rehab + holdingCosts + buyClosing + sellClosing
  const profit = arv - allIn
  const marginPct = arv ? profit / arv : 0
  const cashInvested = purchase + rehab
  const roiPct = cashInvested ? profit / cashInvested : 0
  const passesRule = purchase > 0 && purchase <= mao

  return {
    arv, rehab, purchase, holdingCosts, buyClosing, sellClosing,
    mao, maoGap, allIn, profit, marginPct, roiPct, passesRule,
  }
}

// ---------------------------------------------------------------------------
// Utah value levers.
// ---------------------------------------------------------------------------
export const ADU_MIN_LOT_SQFT = 6000 // cities may prohibit internal ADUs at/below this

// Unfinished basement -> legal internal ADU (HB 82). Rough NOI-capitalized value.
export function basementAduLever(i = {}) {
  const lotSqft = n(i.lotSqft)
  const unfinished = n(i.unfinishedBasementSqft)
  const finishCostPerSqft = n(i.finishCostPerSqft, 55)
  const aduMonthlyRent = n(i.aduMonthlyRent)

  const lotOk = lotSqft > ADU_MIN_LOT_SQFT
  const eligible = lotOk && unfinished > 0

  const finishCost = Math.round(unfinished * finishCostPerSqft)
  const annualRent = aduMonthlyRent * 12
  // Conservative: capitalize ~60% of gross rent (NOI) at 8%, net of finish cost.
  const addedValue = eligible && aduMonthlyRent > 0
    ? Math.max(0, Math.round((annualRent * 0.6) / 0.08) - finishCost)
    : 0

  // 0–10: scaled by unfinished sqft up to ~1,000 sf, only if eligible.
  const score = eligible ? clamp010((unfinished / 1000) * 10) : 0

  return { eligible, lotOk, unfinished, finishCost, annualRent, addedValue, score }
}

// Oversized lot -> ministerial split (SB 174 / HB 406).
export function lotSplitLever(i = {}) {
  const lotSqft = n(i.lotSqft)
  const zoneMinLotSqft = n(i.zoneMinLotSqft)
  const extraLotValueInput = n(i.extraLotValue)

  const eligible = zoneMinLotSqft > 0 && lotSqft >= 2 * zoneMinLotSqft
  const potentialLots = zoneMinLotSqft > 0 ? Math.floor(lotSqft / zoneMinLotSqft) : 0
  const surplus = zoneMinLotSqft > 0 ? Math.max(0, lotSqft - zoneMinLotSqft) : 0
  const extraLotValue = eligible ? extraLotValueInput : 0

  // 0–10: 2x min -> 5, 3x min -> 10.
  const score = eligible ? clamp010(((lotSqft / zoneMinLotSqft) - 1) * 5) : 0

  return { eligible, potentialLots, surplus, extraLotValue, score }
}

// Below-market rents (SFR rental / small multifamily). Also the multifamily lever.
export function rentUpsideLever(i = {}) {
  const currentRent = n(i.currentRent)
  const marketRent = n(i.marketRent)
  const gapPerUnit = marketRent - currentRent
  const gapPct = currentRent ? gapPerUnit / currentRent : 0
  // ~20%+ gap = full marks.
  const score = clamp010((gapPct / 0.20) * 10)
  return { currentRent, marketRent, gapPerUnit, gapPct, score }
}

// ---------------------------------------------------------------------------
// Composite Hidden Value score (0–100).
// ---------------------------------------------------------------------------
export const HV_FACTORS = [
  { key: 'flipMargin', label: 'Flip margin', weight: 30,
    help: 'Profit as a share of ARV after all-in costs. ~20%+ = full marks.' },
  { key: 'ruleHeadroom', label: '70%-rule headroom', weight: 15,
    help: 'How far the purchase price sits under 70% of ARV less rehab.' },
  { key: 'basementAdu', label: 'Basement ADU (HB 82)', weight: 20,
    help: 'By-right internal ADU from an unfinished basement on a >6,000 sf lot.' },
  { key: 'lotSplit', label: 'Lot split (SB 174)', weight: 15,
    help: 'Oversized lot vs. the zone minimum — ministerial split potential.' },
  { key: 'rentUpside', label: 'Rent upside', weight: 20,
    help: 'Gap between in-place and market rent (rental / BRRRR / multifamily).' },
]

export function scoreHiddenValue(i = {}) {
  const flip = computeFlip(i)
  const adu = basementAduLever(i)
  const lot = lotSplitLever(i)
  const rent = rentUpsideLever(i)

  const flipMargin = clamp010((flip.marginPct / 0.20) * 10)
  const ruleHeadroom = flip.arv
    ? clamp010(((flip.mao - flip.purchase) / flip.arv / 0.10) * 10)
    : 0

  const ratings = {
    flipMargin,
    ruleHeadroom,
    basementAdu: adu.score,
    lotSplit: lot.score,
    rentUpside: rent.score,
  }

  let total = 0
  const breakdown = HV_FACTORS.map((f) => {
    const raw = ratings[f.key]
    const points = (raw / 10) * f.weight
    total += points
    return { ...f, raw, points }
  })

  // Total hidden value across the levers (flip is a separate exit path, shown apart).
  const holdValueCreated = adu.addedValue + lot.extraLotValue

  return {
    score: Math.round(total),
    breakdown,
    ratings,
    flip,
    adu,
    lot,
    rent,
    holdValueCreated,
  }
}

export function hiddenValueVerdict(score) {
  if (score >= 75) return { label: 'Strong hidden value — pursue', tone: 'approve', band: 'strong' }
  if (score >= 55) return { label: 'Some upside — dig deeper', tone: 'warn', band: 'some' }
  if (score >= 35) return { label: 'Thin — only at the right price', tone: 'warn', band: 'thin' }
  return { label: 'Pass — no hidden value here', tone: 'danger', band: 'pass' }
}
