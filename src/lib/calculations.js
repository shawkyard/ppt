// Deal math for Stonebrook. Pure functions — no formatting, no side effects.
// Separates three worlds and never mixes them:
//   current  = Current Reality (what it does today)
//   broker   = Broker Story (what the broker claims)
//   strike   = Our Strike Deal (conservative underwriting)

const n = (v, d = 0) => {
  const x = Number(v)
  return Number.isNaN(x) ? d : x
}

// Standard fully-amortizing annual debt service.
export function annualDebtService(loan, rate, years) {
  if (!loan) return 0
  const r = rate / 12
  const months = years * 12
  if (!r) return loan / years
  const pmt = (loan * r) / (1 - Math.pow(1 + r, -months))
  return pmt * 12
}

// One operating scenario → income statement + value.
export function computeScenario(p, s = {}) {
  const units = n(p.units)
  const ask = n(p.askingPrice)
  const avgRent = n(s.avgRent)
  const occupancy = s.occupancy == null ? 0.95 : n(s.occupancy, 0.95)
  const expenseRatio = n(s.expenseRatio, 0.5)
  const otherIncome = n(s.otherIncomeAnnual)
  const exitCap = n(p.exitCapRate, 0.065)

  const grossRent = units * avgRent * 12
  const collectedRent = grossRent * occupancy
  const grossIncome = collectedRent + otherIncome
  const expenses = grossIncome * expenseRatio
  const noi = grossIncome - expenses
  const capRateOnAsk = ask ? noi / ask : 0
  const value = exitCap ? noi / exitCap : 0

  return { avgRent, occupancy, expenseRatio, otherIncome, grossRent, collectedRent, grossIncome, expenses, noi, capRateOnAsk, value }
}

// Whole-deal math built from the three scenarios + capital stack.
export function computeDeal(p = {}) {
  const units = n(p.units)
  const ask = n(p.askingPrice)
  const sc = p.scenarios || {}
  const current = computeScenario(p, sc.current)
  const broker = computeScenario(p, sc.broker)
  const strike = computeScenario(p, sc.strike)

  const pricePerUnit = units ? ask / units : 0
  const rentGapPerUnit = strike.avgRent - current.avgRent
  const rentGapPct = current.avgRent ? rentGapPerUnit / current.avgRent : 0
  const monthlyRentUpside = units * rentGapPerUnit
  const annualRentUpside = monthlyRentUpside * 12

  // Sources & uses
  const capexPerUnit = n(p.estimatedCapexPerUnit)
  const capex = capexPerUnit * units
  const closingCostsPct = n(p.closingCostsPct, 0.025)
  const closingCosts = Math.round(ask * closingCostsPct)
  const reserves = n(p.reserves)
  const totalProjectCost = ask + capex + closingCosts + reserves

  // Debt (on purchase price)
  const ltv = n(p.ltv, 0.65)
  const rate = n(p.interestRate, 0.065)
  const amortYears = n(p.amortYears, 30)
  const loanAmount = Math.round(ask * ltv)
  const debtService = annualDebtService(loanAmount, rate, amortYears)
  const equity = Math.max(0, totalProjectCost - loanAmount)

  // Year-3 stabilized (from the Strike Deal)
  const stabilizedNOI = strike.noi
  const stabilizedValue = strike.value
  const stabilizedCapRate = ask ? stabilizedNOI / ask : 0
  const valueCreated = stabilizedValue - totalProjectCost
  const stabilizedCashFlow = stabilizedNOI - debtService
  const stabilizedDSCR = debtService ? stabilizedNOI / debtService : 0
  const stabilizedCoC = equity ? stabilizedCashFlow / equity : 0

  // Preliminary max supportable price (conservative — NOT a final offer)
  const targetCap = n(p.exitCapRate, 0.065) + n(p.riskSpread, 0.0075)
  const supportableBasis = targetCap ? stabilizedNOI / targetCap : 0
  const maxSupportablePrice = Math.max(0, Math.round(supportableBasis - capex - reserves))
  const requiredPriceReduction = ask - maxSupportablePrice
  const requiredReductionPct = ask ? requiredPriceReduction / ask : 0

  return {
    units, askingPrice: ask, pricePerUnit,
    current, broker, strike,
    rentGapPerUnit, rentGapPct, monthlyRentUpside, annualRentUpside,
    capexPerUnit, capex, closingCostsPct, closingCosts, reserves, totalProjectCost,
    ltv, interestRate: rate, amortYears, loanAmount, debtService, equity,
    exitCapRate: n(p.exitCapRate, 0.065),
    currentNOI: current.noi, currentCapRate: current.capRateOnAsk,
    stabilizedNOI, stabilizedValue, stabilizedCapRate, valueCreated,
    stabilizedCashFlow, stabilizedDSCR, stabilizedCoC,
    maxSupportablePrice, requiredPriceReduction, requiredReductionPct,
  }
}

// Year-3 strike-factor tests (the real go/no-go, not Year-1 cash-on-cash).
export function strikeFactors(d) {
  return [
    { key: 'coc', label: 'Stabilized cash-on-cash', value: d.stabilizedCoC, fmt: 'pct',
      pass: d.stabilizedCoC >= 0.12, strong: d.stabilizedCoC >= 0.14, target: '12%+ target' },
    { key: 'dscr', label: 'Stabilized DSCR', value: d.stabilizedDSCR, fmt: 'x',
      pass: d.stabilizedDSCR >= 1.4, strong: d.stabilizedDSCR >= 1.6, target: '1.4x min · 1.6x strong' },
    { key: 'cap', label: 'Stabilized cap rate', value: d.stabilizedCapRate, fmt: 'pct',
      pass: d.stabilizedCapRate >= 0.07, strong: d.stabilizedCapRate >= 0.08, target: '7%+ · 8% preferred' },
    { key: 'vc', label: 'Value created', value: d.valueCreated, fmt: 'usd',
      pass: d.valueCreated > 0, strong: d.valueCreated > d.equity * 0.5, target: 'Positive vs. total cost' },
  ]
}
