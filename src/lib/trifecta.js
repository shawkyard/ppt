// Trifecta underwriting engine.
// Extends the screening math in calculations.js into a full 10-year, PPM-grade
// model. Pure functions — no side effects, no formatting.
//
// The Stonebrook mandate encoded here:
//   * Buy an under-managed C-in-B value-add deal at a DISCOUNT to in-place NOI.
//   * Run a ~24-month renovation ramp: rents climb from current toward market,
//     occupancy climbs from current toward the stabilized target.
//   * Solve for the PURCHASE PRICE ("buy-at") that clears the investor trifecta:
//        1) Cash-on-cash >= 12% starting Year 3 (after the 2-year ramp)
//        2) Going-in cap rate >= 7% (bought at a discount to in-place NOI)
//        3) DSCR >= 1.40
//   * Capital stack: 70% equity sourced from investors, 30% debt financed.
//   * Sponsor economics (Stonebrook + Alma):
//        - 30% of a 1%-5% finder's fee on the purchase price
//        - 30% of monthly cash flow ABOVE a 7% investor preferred return
//        - 30% carried equity for sourcing, underwriting, PM oversight, investors
//
// Every number the model produces is exposed so it can feed a PPM.

const n = (v, d = 0) => {
  const x = Number(v)
  return Number.isNaN(x) ? d : x
}

// ---- defaults ------------------------------------------------------------
// Assumptions live in one place so a deal only has to override what differs.
export const TRIFECTA_DEFAULTS = {
  // capital stack
  equityPct: 0.70, // sourced from investors as the down payment
  debtPct: 0.30, // financed
  interestRate: 0.065,
  amortYears: 30,
  closingCostsPct: 0.03,

  // value-add ramp
  rampYears: 2, // ~24-month stabilization
  stabilizedOccupancy: 0.95,

  // growth after stabilization
  rentGrowth: 0.03,
  otherIncomeGrowth: 0.03,
  expenseGrowth: 0.025,

  // exit
  holdYears: 10,
  exitCapRate: 0.065,
  saleCostPct: 0.02,

  // trifecta targets
  targetCoC: 0.12, // by Year 3
  targetCoCYear: 3,
  targetGoingInCap: 0.07,
  targetDSCR: 1.4,

  // sponsor waterfall
  finderFeePct: 0.03, // midpoint of the 1%-5% range
  sponsorFinderShare: 0.30, // Stonebrook's cut of the finder's fee
  preferredReturn: 0.07, // investor pref before the promote kicks in
  promoteShare: 0.30, // sponsor share of cash flow above the pref
  sponsorEquityShare: 0.30, // carried equity
}

// Blend a deal's raw fields with the defaults into a full assumption set.
export function assume(p = {}) {
  const d = TRIFECTA_DEFAULTS
  const currentOccupancy = p.currentOccupancy != null
    ? n(p.currentOccupancy)
    : 1 - n(p.vacancyRate, 0.10)
  return {
    units: n(p.units),
    currentRent: n(p.currentRentPerUnit),
    marketRent: n(p.marketRentPerUnit),
    currentOccupancy,
    stabilizedOccupancy: n(p.stabilizedOccupancy, d.stabilizedOccupancy),
    currentOtherIncome: n(p.currentOtherIncomeAnnual),
    stabilizedOtherIncome: n(p.stabilizedOtherIncomeAnnual, n(p.currentOtherIncomeAnnual)),
    currentExpenseRatio: n(p.expenseRatio, 0.50),
    stabilizedExpenseRatio: n(p.stabilizedExpenseRatio, n(p.expenseRatio, 0.50)),
    // broker proforma expense ratio: brokers usually show it tighter than reality
    brokerExpenseRatio: n(p.brokerExpenseRatio, n(p.stabilizedExpenseRatio, 0.45)),
    capex: n(p.estimatedCapex),
    reserves: n(p.reserves),
    askingPrice: n(p.askingPrice),

    equityPct: n(p.equityPct, d.equityPct),
    debtPct: n(p.debtPct, d.debtPct),
    interestRate: n(p.interestRate, d.interestRate),
    amortYears: n(p.amortYears, d.amortYears),
    closingCostsPct: n(p.closingCostsPct, d.closingCostsPct),

    rampYears: n(p.rampYears, d.rampYears),
    rentGrowth: n(p.rentGrowth, d.rentGrowth),
    otherIncomeGrowth: n(p.otherIncomeGrowth, d.otherIncomeGrowth),
    expenseGrowth: n(p.expenseGrowth, d.expenseGrowth),

    holdYears: n(p.holdYears, d.holdYears),
    exitCapRate: n(p.exitCapRate, d.exitCapRate),
    saleCostPct: n(p.saleCostPct, d.saleCostPct),

    targetCoC: n(p.targetCoC, d.targetCoC),
    targetCoCYear: n(p.targetCoCYear, d.targetCoCYear),
    targetGoingInCap: n(p.targetGoingInCap, d.targetGoingInCap),
    targetDSCR: n(p.targetDSCR, d.targetDSCR),

    finderFeePct: n(p.finderFeePct, d.finderFeePct),
    sponsorFinderShare: n(p.sponsorFinderShare, d.sponsorFinderShare),
    preferredReturn: n(p.preferredReturn, d.preferredReturn),
    promoteShare: n(p.promoteShare, d.promoteShare),
    sponsorEquityShare: n(p.sponsorEquityShare, d.sponsorEquityShare),
  }
}

// Annual debt service on a fully-amortizing loan.
export function annualDebtService(loan, rate, amortYears) {
  if (loan <= 0) return 0
  const mr = rate / 12
  const nMonths = amortYears * 12
  if (mr === 0) return loan / amortYears
  const payment = loan * (mr / (1 - Math.pow(1 + mr, -nMonths)))
  return payment * 12
}

// Fraction of the way through the value-add ramp during year y (midpoint of
// the year), clamped to [0, 1]. Year 1 midpoint is 0.5/rampYears, etc.
function rampFraction(y, rampYears) {
  if (rampYears <= 0) return 1
  return Math.min(1, Math.max(0, (y - 0.5) / rampYears))
}

// ---- equity basis --------------------------------------------------------
export function equityBasis(a, price) {
  const closingCosts = price * a.closingCostsPct
  const downPayment = price * a.equityPct
  // Capex + reserves are funded by the equity raise alongside the down payment.
  return {
    downPayment,
    closingCosts,
    capex: a.capex,
    reserves: a.reserves,
    total: downPayment + closingCosts + a.capex + a.reserves,
  }
}

// ---- the 10-year model at a given purchase price -------------------------
// mode: 'realistic' (full ramp), 'current' (as-is held flat),
//       'broker' (instant stabilization at market, optimistic expenses).
export function project(a, price, mode = 'realistic') {
  const loan = price * a.debtPct
  const ds = annualDebtService(loan, a.interestRate, a.amortYears)
  const equity = equityBasis(a, price)

  const years = []
  for (let y = 1; y <= a.holdYears; y++) {
    let rentPerUnit, occupancy, otherIncome, expenseRatio, capexThisYear

    if (mode === 'current') {
      // As-is: today's rents/occupancy/expenses, grown modestly, no reno.
      const g = Math.pow(1 + a.rentGrowth, y - 1)
      rentPerUnit = a.currentRent * g
      occupancy = a.currentOccupancy
      otherIncome = a.currentOtherIncome * Math.pow(1 + a.otherIncomeGrowth, y - 1)
      expenseRatio = a.currentExpenseRatio
      capexThisYear = 0
    } else if (mode === 'broker') {
      // Broker pro forma: stabilized on day one, optimistic expense ratio.
      const g = Math.pow(1 + a.rentGrowth, y - 1)
      rentPerUnit = a.marketRent * g
      occupancy = a.stabilizedOccupancy
      otherIncome = a.stabilizedOtherIncome * Math.pow(1 + a.otherIncomeGrowth, y - 1)
      expenseRatio = a.brokerExpenseRatio
      capexThisYear = 0
    } else {
      // Realistic ramp.
      const f = rampFraction(y, a.rampYears)
      const stabilizedGrowthYears = Math.max(0, y - a.rampYears)
      const rentGrow = Math.pow(1 + a.rentGrowth, stabilizedGrowthYears)
      const baseRent = a.currentRent + (a.marketRent - a.currentRent) * f
      rentPerUnit = baseRent * rentGrow
      occupancy = a.currentOccupancy + (a.stabilizedOccupancy - a.currentOccupancy) * f
      const baseOther = a.currentOtherIncome + (a.stabilizedOtherIncome - a.currentOtherIncome) * f
      otherIncome = baseOther * Math.pow(1 + a.otherIncomeGrowth, stabilizedGrowthYears)
      expenseRatio = a.currentExpenseRatio + (a.stabilizedExpenseRatio - a.currentExpenseRatio) * f
      // Renovation capital is spent across the ramp years.
      capexThisYear = y <= Math.ceil(a.rampYears) ? a.capex / Math.ceil(a.rampYears) : 0
    }

    const gpr = a.units * rentPerUnit * 12
    const vacancyLoss = gpr * (1 - occupancy)
    const egi = gpr - vacancyLoss + otherIncome
    const opex = egi * expenseRatio
    const noi = egi - opex
    const cashFlow = noi - ds - capexThisYear
    const dscr = ds ? noi / ds : Infinity
    const coc = equity.total ? cashFlow / equity.total : 0
    const capOnPrice = price ? noi / price : 0

    years.push({
      year: y, rentPerUnit, occupancy, gpr, vacancyLoss, otherIncome,
      egi, expenseRatio, opex, noi, debtService: ds, capex: capexThisYear,
      cashFlow, dscr, coc, capOnPrice,
    })
  }

  // Sale at exit on the final year's NOI.
  const exitNOI = years[years.length - 1].noi
  const grossSale = a.exitCapRate ? exitNOI / a.exitCapRate : 0
  const saleCosts = grossSale * a.saleCostPct
  const netSale = grossSale - saleCosts - loan
  const goingInCap = years[0] ? years[0].noi / price : 0

  return { mode, price, loan, debtService: ds, equity, years, goingInCap,
    exitNOI, grossSale, saleCosts, netSale }
}

// ---- trifecta test -------------------------------------------------------
export function trifectaCheck(a, proj) {
  const yr = proj.years[a.targetCoCYear - 1] || proj.years[proj.years.length - 1]
  const goingInCap = proj.goingInCap
  const dscrYear1 = proj.years[0].dscr
  const cocAtTarget = yr.coc

  const cocPass = cocAtTarget >= a.targetCoC
  const capPass = goingInCap >= a.targetGoingInCap
  const dscrPass = dscrYear1 >= a.targetDSCR

  return {
    cocAtTarget, cocYear: a.targetCoCYear, cocTarget: a.targetCoC, cocPass,
    goingInCap, capTarget: a.targetGoingInCap, capPass,
    dscrYear1, dscrTarget: a.targetDSCR, dscrPass,
    allPass: cocPass && capPass && dscrPass,
  }
}

// ---- solve for the buy-at price ------------------------------------------
// All three trifecta metrics are monotonically decreasing in price, so the
// feasible set is price <= P*. Bisection finds the max price that still clears
// every target. Returns the price plus which constraint binds.
export function solveBuyAtPrice(p) {
  const a = assume(p)
  const passes = (price) => trifectaCheck(a, project(a, price, 'realistic')).allPass

  // If even a nominal price fails, the deal can't hit the trifecta at any price.
  const lo0 = 1000
  if (!passes(lo0)) {
    return { price: 0, feasible: false, binding: 'infeasible', assumptions: a }
  }

  let lo = lo0
  let hi = Math.max(a.askingPrice * 2, a.units * 300_000, 5_000_000)
  // Push hi up until it fails, so the root is bracketed.
  let guard = 0
  while (passes(hi) && guard < 40) { hi *= 1.5; guard++ }

  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2
    if (passes(mid)) lo = mid
    else hi = mid
  }
  const price = Math.round(lo / 1000) * 1000

  // Identify the binding constraint at the solved price.
  const check = trifectaCheck(a, project(a, price, 'realistic'))
  const slack = {
    coc: check.cocAtTarget - check.cocTarget,
    cap: check.goingInCap - check.capTarget,
    dscr: (check.dscrYear1 - check.dscrTarget) / check.dscrTarget,
  }
  const binding = Object.entries(slack).sort((x, y) => x[1] - y[1])[0][0]

  return { price, feasible: true, binding, check, assumptions: a }
}

// ---- sponsor waterfall (Stonebrook + Alma economics) ---------------------
// Given a realistic projection, compute the finder's fee, the investor
// preferred return, the promote split above the pref, and the sponsor's
// carried-equity value at exit.
export function sponsorEconomics(a, proj) {
  const finderFee = proj.price * a.finderFeePct
  const stonebrookFinderCut = finderFee * a.sponsorFinderShare

  const prefDollars = proj.equity.total * a.preferredReturn // annual pref hurdle

  // Per-year cash-flow split: investors take the pref first, sponsor promotes
  // 30% of everything above it, investors keep the remaining 70%.
  const distributions = proj.years.map((yr) => {
    const cf = Math.max(0, yr.cashFlow)
    const toPref = Math.min(cf, prefDollars)
    const above = Math.max(0, cf - prefDollars)
    const sponsorPromote = above * a.promoteShare
    const investorAbove = above * (1 - a.promoteShare)
    return {
      year: yr.year,
      cashFlow: yr.cashFlow,
      investorPref: toPref,
      investorAbovePref: investorAbove,
      investorTotal: toPref + investorAbove,
      sponsorPromote,
      metPref: cf >= prefDollars,
    }
  })

  // Carried equity: sponsor owns 30% of the deal's equity value. At exit that
  // is 30% of net sale proceeds (return of capital + gain).
  const sponsorEquityValueAtExit = proj.netSale * a.sponsorEquityShare
  const totalPromote = distributions.reduce((s, d) => s + d.sponsorPromote, 0)
  const totalSponsorCash = stonebrookFinderCut + totalPromote + sponsorEquityValueAtExit

  return {
    finderFee, finderFeePct: a.finderFeePct, stonebrookFinderCut,
    prefDollars, distributions, totalPromote,
    sponsorEquityShare: a.sponsorEquityShare, sponsorEquityValueAtExit,
    totalSponsorCash,
  }
}

// ---- one-call full underwrite --------------------------------------------
// Produces the three P&L scenarios, the solved buy-at price, the trifecta
// scorecard at that price, and the sponsor waterfall. This is the object a
// PPM / investor package reads from.
export function underwrite(p) {
  const a = assume(p)

  const current = project(a, a.askingPrice, 'current')
  const broker = project(a, a.askingPrice, 'broker')

  const solved = solveBuyAtPrice(p)
  const buyAtPrice = solved.feasible ? solved.price : 0
  const realistic = solved.feasible ? project(a, buyAtPrice, 'realistic') : null

  const trifectaAtBuy = realistic ? trifectaCheck(a, realistic) : null
  const waterfall = realistic ? sponsorEconomics(a, realistic) : null

  const discountToAsking = a.askingPrice
    ? (a.askingPrice - buyAtPrice) / a.askingPrice
    : 0

  return {
    assumptions: a,
    scenarios: { current, broker, realistic },
    buyAtPrice,
    pricePerUnitBuyAt: a.units ? buyAtPrice / a.units : 0,
    askingPrice: a.askingPrice,
    discountToAsking,
    binding: solved.binding,
    feasible: solved.feasible,
    trifecta: trifectaAtBuy,
    waterfall,
  }
}
