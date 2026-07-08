// Deal math. Pure functions — no side effects, no formatting.
// Every formula here maps directly to the underwriting spec.

const n = (v, d = 0) => {
  const x = Number(v)
  return Number.isNaN(x) ? d : x
}

export function computeDeal(p = {}) {
  const units = n(p.units)
  const askingPrice = n(p.askingPrice)
  const currentRent = n(p.currentRentPerUnit)
  const marketRent = n(p.marketRentPerUnit)
  const expenseRatio = n(p.expenseRatio, 0.5)
  const stabilizedExpenseRatio = n(p.stabilizedExpenseRatio, expenseRatio)
  const exitCapRate = n(p.exitCapRate, 0.06)
  const currentOtherIncome = n(p.currentOtherIncomeAnnual)
  const stabilizedOtherIncome = n(p.stabilizedOtherIncomeAnnual, currentOtherIncome)
  const estimatedCapex = n(p.estimatedCapex)
  const reserves = n(p.reserves)
  const closingCostsPct = n(p.closingCostsPct, 0.03)
  const closingCosts = Math.round(askingPrice * closingCostsPct)

  const pricePerUnit = units ? askingPrice / units : 0
  const rentGapPerUnit = marketRent - currentRent
  const rentGapPct = currentRent ? rentGapPerUnit / currentRent : 0

  const monthlyRentUpside = units * rentGapPerUnit
  const annualRentUpside = monthlyRentUpside * 12

  const currentGrossRent = units * currentRent * 12
  const stabilizedGrossRent = units * marketRent * 12

  const currentGrossIncome = currentGrossRent + currentOtherIncome
  const stabilizedGrossIncome = stabilizedGrossRent + stabilizedOtherIncome

  const currentNOI = currentGrossIncome * (1 - expenseRatio)
  const stabilizedNOI = stabilizedGrossIncome * (1 - stabilizedExpenseRatio)

  const currentCapRate = askingPrice ? currentNOI / askingPrice : 0
  const stabilizedCapRate = askingPrice ? stabilizedNOI / askingPrice : 0
  const stabilizedValue = exitCapRate ? stabilizedNOI / exitCapRate : 0

  const totalProjectCost = askingPrice + estimatedCapex + closingCosts + reserves
  const valueCreated = stabilizedValue - totalProjectCost

  return {
    units, askingPrice, currentRent, marketRent, expenseRatio, stabilizedExpenseRatio,
    exitCapRate, estimatedCapex, reserves, closingCostsPct, closingCosts,
    pricePerUnit, rentGapPerUnit, rentGapPct,
    monthlyRentUpside, annualRentUpside,
    currentGrossRent, stabilizedGrossRent,
    currentGrossIncome, stabilizedGrossIncome,
    currentNOI, stabilizedNOI,
    currentCapRate, stabilizedCapRate, stabilizedValue,
    totalProjectCost, valueCreated,
  }
}

// Preliminary, deliberately conservative. We are NOT recommending a final offer.
// Supportable price = price at which the stabilized deal clears a target cap
// (exit cap + risk spread), net of the capital we must inject to get there.
export function maxSupportablePrice(deal, spread = 0.0075) {
  const targetCap = deal.exitCapRate + spread
  if (!targetCap) return 0
  const supportableTotalBasis = deal.stabilizedNOI / targetCap
  const supportable = supportableTotalBasis - deal.estimatedCapex - deal.reserves
  return Math.max(0, Math.round(supportable))
}

export function priceCorrection(deal) {
  const max = maxSupportablePrice(deal)
  const delta = max - deal.askingPrice
  const deltaPct = deal.askingPrice ? delta / deal.askingPrice : 0
  return { max, delta, deltaPct }
}
