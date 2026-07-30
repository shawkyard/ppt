// Underwriting engine — a faithful port of the Stonebrook RV Park & Destination
// Resort 10-Year Underwriting Model (all 14 worksheets). Pure functions only.

const YEARS = 10

// ---------- small math ----------
function monthlyPayment(loan, annualRate, amortYears) {
  if (loan <= 0) return 0
  if (annualRate === 0) return loan / (amortYears * 12)
  const r = annualRate / 12
  const n = amortYears * 12
  return (loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

function balanceAfterMonths(loan, annualRate, monthly, months) {
  if (loan <= 0) return 0
  if (annualRate === 0) return Math.max(0, loan - monthly * months)
  const r = annualRate / 12
  const grown = loan * Math.pow(1 + r, months)
  const paid = monthly * ((Math.pow(1 + r, months) - 1) / r)
  return Math.max(0, grown - paid)
}

// IRR via bisection on NPV over a cash-flow array (index = year).
export function irr(cashflows) {
  const hasNeg = cashflows.some((c) => c < 0)
  const hasPos = cashflows.some((c) => c > 0)
  if (!hasNeg || !hasPos) return null
  const npv = (rate) =>
    cashflows.reduce((s, c, t) => s + c / Math.pow(1 + rate, t), 0)
  let lo = -0.9999
  let hi = 10
  let flo = npv(lo)
  let fhi = npv(hi)
  if (flo * fhi > 0) return null
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2
    const fm = npv(mid)
    if (Math.abs(fm) < 1e-7) return mid
    if (flo * fm < 0) { hi = mid; fhi = fm } else { lo = mid; flo = fm }
  }
  return (lo + hi) / 2
}

function equityMultiple(cashflows) {
  const inflow = cashflows.filter((c) => c > 0).reduce((a, b) => a + b, 0)
  const outflow = Math.abs(cashflows.filter((c) => c < 0).reduce((a, b) => a + b, 0))
  return outflow === 0 ? 0 : inflow / outflow
}

// ---------- buildout (per scenario) ----------
function buildout(inp, s) {
  const mix = inp.mix
  const rev = inp.rev
  const g = (o) => o[s]
  const totalRVTent =
    g(mix.longTermPads) + g(mix.stdTransient) + g(mix.premium) + g(mix.tentGlamp)
  const operatingSites = totalRVTent
  const addedSites = Math.max(0, operatingSites - inp.existingSites)
  const y3Occ = g(inp.op.y3Occ)

  const netSiteRev =
    g(mix.longTermPads) * g(rev.ltRate) * 12 * g(rev.ltOcc) +
    g(mix.stdTransient) * g(rev.stdADR) * 365 * g(rev.stdOcc) +
    g(mix.premium) * g(rev.premADR) * 365 * g(rev.premOcc) +
    g(mix.tentGlamp) * g(rev.tentADR) * 365 * g(rev.tentOcc)

  const blendedMonthlyRate =
    operatingSites > 0 && y3Occ > 0
      ? netSiteRev / operatingSites / 12 / y3Occ
      : 0

  const lodgingAnc =
    g(mix.cabins) * g(rev.cabinADR) * 365 * g(rev.cabinOcc) +
    g(mix.parkModel) * g(rev.pmADR) * 365 * g(rev.pmOcc) +
    g(mix.groupHomes) * g(rev.groupADR) * 365 * g(rev.groupOcc) +
    g(mix.storage) * g(rev.storageRate) * 12 * g(rev.storageOcc) +
    g(rev.store) + g(rev.waterRec) + g(rev.groupEvents)

  const readyVals = Object.values(inp.ready).map((o) => o[s])
  const yesCount = readyVals.filter((v) => v === 'Yes').length
  const readiness = yesCount === readyVals.length ? 'READY' : 'PENDING'

  return {
    totalRVTent, operatingSites, addedSites, y3Occ,
    netSiteRev, blendedMonthlyRate, lodgingAnc, yesCount,
    readyTotal: readyVals.length, readiness,
  }
}

// ---------- sources & uses (single, uses scalars) ----------
function sourcesUses(inp) {
  const price = inp.purchasePrice
  const closing = price * inp.closingPct
  const acqFee = price * inp.acqFeePct
  const financing = price * inp.ltv * inp.financingPct
  const escrows =
    inp.repairEscrow + inp.expansionEscrow + inp.amenityCapex +
    inp.operatingReserve + inp.taxReserve + inp.insuranceReserve
  const uses = price + closing + acqFee + financing + escrows
  const seniorDebt = price * inp.ltv
  const totalInvestorCash = uses - seniorDebt
  const downPayment = price - seniorDebt
  const variableCashPct =
    (1 - inp.ltv) + inp.closingPct + inp.acqFeePct + inp.financingPct * inp.ltv
  const fixedUpfrontCash = escrows
  const monthly = monthlyPayment(seniorDebt, inp.interestRate, inp.amortYears)
  const annualDebtService = monthly * 12
  const mortgageConstant = seniorDebt > 0 ? annualDebtService / seniorDebt : 0
  const annualReplacementReserve = inp.fullBuildSites * inp.reservePerSite
  const totalProjectCost = uses
  return {
    price, closing, acqFee, financing, escrows, uses, seniorDebt,
    totalInvestorCash, downPayment, variableCashPct, fixedUpfrontCash,
    monthly, annualDebtService, mortgageConstant, annualReplacementReserve,
    totalProjectCost,
    equityPerSite: inp.fullBuildSites > 0 ? totalInvestorCash / inp.fullBuildSites : 0,
  }
}

// ---------- 10-year P&L (per scenario) ----------
function pnl(inp, s, su, bo) {
  const g = (o) => o[s]
  const op = inp.op
  const alloc = inp.alloc
  const stabilizedSites = bo.operatingSites
  // Only the Target plan ramps its site count over the 24-month buildout:
  // Year 1 = existing plant, Year 2 = midpoint, Year 3+ = full build.
  // Current and Seller Pro Forma hold their stabilized count constant.
  const sitesByYear = (y) => {
    if (s !== 'target') return stabilizedSites
    if (y === 0) return inp.existingSites
    if (y === 1) return inp.existingSites + (inp.fullBuildSites - inp.existingSites) * 0.5
    return stabilizedSites
  }
  const y1OpEx = g(op.y1OpEx)
  const opexGrowth = g(op.opexGrowth)
  const mgmtFee = g(op.mgmtFeePct)

  const occByYear = (y) =>
    y === 0 ? g(op.y1Occ) : y === 1 ? g(op.y2Occ) : y === 2 ? g(op.y3Occ) : g(op.y4Occ)

  const rows = []
  let prevRate = 0
  let prevAnc = 0
  for (let y = 0; y < YEARS; y++) {
    const sites = sitesByYear(y)
    const occ = occByYear(y)
    let rate
    if (y === 0) rate = g(op.y1Rate)
    else if (y === 1) rate = g(op.y2Rate)
    else if (y === 2) rate = bo.blendedMonthlyRate
    else rate = prevRate * (1 + g(op.rateGrowth))
    prevRate = rate

    let anc
    if (y === 0) anc = g(op.y1Anc)
    else if (y === 1) anc = g(op.y2Anc)
    else if (y === 2) anc = bo.lodgingAnc
    else anc = prevAnc * (1 + g(op.ancGrowth))
    prevAnc = anc

    const gpr = sites * rate * 12
    const econLoss = -gpr * (1 - occ)
    const netSiteRev = gpr + econLoss
    const egi = netSiteRev + anc

    const gf = (share) => y1OpEx * g(share) * Math.pow(1 + opexGrowth, y)
    const exp = {
      payroll: gf(alloc.payroll),
      grounds: gf(alloc.grounds),
      utilities: gf(alloc.utilities),
      taxes: gf(alloc.taxes),
      insurance: gf(alloc.insurance),
      resfees: gf(alloc.resfees),
      management: egi * mgmtFee,
      marketing: gf(alloc.marketing),
      cogs: gf(alloc.cogs),
      admin: gf(alloc.admin),
    }
    const totalOpEx = Object.values(exp).reduce((a, b) => a + b, 0)
    const expenseRatio = egi === 0 ? 0 : totalOpEx / egi
    const noi = egi - totalOpEx
    const ds = su.annualDebtService
    const repl = su.annualReplacementReserve
    const draw = y === 0 ? g(op.y1Draw) : y === 1 ? g(op.y2Draw) : g(op.y3Draw)
    const cfbt = noi - ds - repl
    const dscr = ds === 0 ? 0 : noi / ds
    const coc = su.totalInvestorCash === 0 ? 0 : cfbt / su.totalInvestorCash
    const capRate = su.price === 0 ? 0 : noi / su.price
    const yoc = su.totalProjectCost === 0 ? 0 : noi / su.totalProjectCost

    rows.push({
      year: y + 1, sites, occ, rate, gpr, econLoss, netSiteRev, anc, egi,
      exp, totalOpEx, expenseRatio, noi, ds, repl, draw, cfbt, dscr, coc, capRate, yoc,
    })
  }
  return rows
}

// ---------- trifecta status ----------
function statusVsGates(v, min, pref) {
  if (v >= pref) return 'EXCEEDS'
  if (v >= min) return 'MEETS'
  return 'FAIL'
}

function trifecta(inp, scenarioResults) {
  const G = inp.gates
  const out = {}
  for (const s of ['current', 'proforma', 'target']) {
    const r = scenarioResults[s]
    const y3 = r.pnl[2]
    const bo = r.buildout
    const coc = statusVsGates(y3.coc, G.minCoC, G.prefCoC)
    const dscr = statusVsGates(y3.dscr, G.minDSCR, G.prefDSCR)
    const cap = statusVsGates(y3.capRate, G.minCap, G.prefCap)
    const passMin = y3.coc >= G.minCoC && y3.dscr >= G.minDSCR && y3.capRate >= G.minCap
    const strike =
      y3.coc >= G.strikeCoC && y3.dscr >= G.strikeDSCR && y3.capRate >= G.strikeCap &&
      bo.operatingSites >= G.strikeSites && bo.readiness === 'READY'
    let overall
    if (strike) overall = 'DESTINATION STRIKE'
    else if (coc === 'EXCEEDS' && dscr === 'EXCEEDS' && cap === 'EXCEEDS') overall = 'EXCEEDS'
    else if (passMin) overall = 'MEETS'
    else overall = 'FAIL'
    out[s] = {
      coc: { value: y3.coc, status: coc },
      dscr: { value: y3.dscr, status: dscr },
      cap: { value: y3.capRate, status: cap },
      sites: bo.operatingSites,
      readiness: bo.readiness,
      readyCount: bo.yesCount,
      passMin, strike, overall,
    }
  }
  return out
}

// ---------- price correction (per scenario, uses Year-3 NOI) ----------
function priceCorrection(inp, su, scenarioResults) {
  const G = inp.gates
  const out = {}
  for (const s of ['current', 'proforma', 'target']) {
    const noi3 = scenarioResults[s].pnl[2].noi
    const cocCeiling = Math.max(
      0,
      (noi3 - su.annualReplacementReserve - G.minCoC * su.fixedUpfrontCash) /
        (su.mortgageConstant * inp.ltv + G.minCoC * su.variableCashPct)
    )
    const dscrCeiling = Math.max(
      0,
      noi3 / (G.minDSCR * su.mortgageConstant * inp.ltv)
    )
    const capCeiling = Math.max(0, noi3 / G.minCap)
    const recMax = Math.min(inp.purchasePrice, cocCeiling, dscrCeiling, capCeiling)
    const requiredReduction = Math.max(0, inp.purchasePrice - recMax)
    const discount = inp.purchasePrice === 0 ? 0 : requiredReduction / inp.purchasePrice

    const noiForCoC = G.minCoC * su.totalInvestorCash + su.annualDebtService + su.annualReplacementReserve
    const noiForDSCR = G.minDSCR * su.annualDebtService
    const noiForCap = G.minCap * inp.purchasePrice
    const controllingNOI = Math.max(noiForCoC, noiForDSCR, noiForCap)

    out[s] = {
      noi3, cocCeiling, dscrCeiling, capCeiling, recMax, requiredReduction, discount,
      noiForCoC, noiForDSCR, noiForCap, controllingNOI, noiGap: noi3 - controllingNOI,
    }
  }
  return out
}

// ---------- debt schedule ----------
function debtSchedule(inp, su) {
  const rows = []
  let begin = su.seniorDebt
  for (let y = 1; y <= YEARS; y++) {
    const end = balanceAfterMonths(su.seniorDebt, inp.interestRate, su.monthly, 12 * y)
    const principal = begin - end
    const ds = su.annualDebtService
    const interest = ds - principal
    rows.push({ year: y, begin, ds, interest, principal, end })
    begin = end
  }
  return rows
}

// ---------- investor returns (target scenario) ----------
function investorReturns(inp, su, target, debt) {
  const t = target.pnl
  const amFee = (y) => t[y].egi * inp.assetMgmtFeePct
  const distributable = t.map((r, y) => r.cfbt - amFee(y))
  const outsideDist = distributable.map((d) => d * inp.outsideDistPct)

  const y10NOI = t[9].noi
  const grossSale = inp.exitCap > 0 ? y10NOI / inp.exitCap : 0
  const sellCosts = grossSale * inp.sellingCosts
  const remLoan = debt[9].end
  const netSale = grossSale - sellCosts - remLoan
  const outsideSale = netSale * inp.outsideDistPct

  const outsideEquity = su.totalInvestorCash * inp.outsideEquityPct
  const outsideCF = [-outsideEquity]
  for (let y = 0; y < YEARS; y++) {
    let cf = outsideDist[y]
    if (y === YEARS - 1) cf += outsideSale
    outsideCF.push(cf)
  }
  const projectCF = [-su.totalInvestorCash]
  for (let y = 0; y < YEARS; y++) {
    let cf = distributable[y]
    if (y === YEARS - 1) cf += netSale
    projectCF.push(cf)
  }

  // 5-year exit snapshot
  const y5NOI = t[4].noi
  const grossSale5 = inp.exitCap > 0 ? y5NOI / inp.exitCap : 0
  const sellCosts5 = grossSale5 * inp.sellingCosts
  const remLoan5 = debt[4].end
  const netSale5 = grossSale5 - sellCosts5 - remLoan5
  const outsideSale5 = netSale5 * inp.outsideDistPct
  const cf5 = [-outsideEquity]
  for (let y = 0; y < 5; y++) {
    let cf = outsideDist[y]
    if (y === 4) cf += outsideSale5
    cf5.push(cf)
  }

  const avgYield = outsideEquity === 0
    ? 0
    : outsideDist.reduce((a, b) => a + b, 0) / YEARS / outsideEquity

  return {
    distributable, outsideDist, outsideEquity,
    grossSale, sellCosts, remLoan, netSale, outsideSale,
    outsideCF, projectCF,
    investorIRR: irr(outsideCF),
    investorEM: equityMultiple(outsideCF),
    projectIRR: irr(projectCF),
    projectEM: equityMultiple(projectCF),
    avgYield,
    totalDistributions: outsideCF.slice(1).reduce((a, b) => a + b, 0),
    exit5: {
      noi: y5NOI, grossSale: grossSale5, netSale: netSale5,
      irr: irr(cf5), em: equityMultiple(cf5),
    },
  }
}

// ---------- sensitivity (target scenario) ----------
const SENS_CASES = [
  { name: 'Downside', price: 1.1, egi: 0.9, opex: 1.1, rate: 0.09, cap: 1.25, exit: 0.095 },
  { name: 'Conservative', price: 1.05, egi: 0.95, opex: 1.05, rate: 0.08, cap: 1.1, exit: 0.085 },
  { name: 'Base', price: 1.0, egi: 1.0, opex: 1.0, rate: 0.07, cap: 1.0, exit: 0.08 },
  { name: 'Upside', price: 0.95, egi: 1.05, opex: 0.97, rate: 0.065, cap: 0.95, exit: 0.075 },
  { name: 'Stretch', price: 0.9, egi: 1.1, opex: 0.95, rate: 0.06, cap: 0.9, exit: 0.07 },
]

function sensitivity(inp, su, target) {
  const G = inp.gates
  const y3 = target.pnl[2]
  const y10NOI = target.pnl[9].noi
  const baseCapexEsc = inp.expansionEscrow + inp.amenityCapex
  return SENS_CASES.map((c) => {
    const price = inp.purchasePrice * c.price
    const loan = price * inp.ltv
    const monthly = monthlyPayment(loan, c.rate, inp.amortYears)
    const ds = monthly * 12
    const investorCash =
      price * su.variableCashPct + su.fixedUpfrontCash + baseCapexEsc * (c.cap - 1)
    const egi = y3.egi * c.egi
    const opex = y3.totalOpEx * c.opex
    const noi = egi - opex
    const cfbt = noi - ds - su.annualReplacementReserve
    const coc = investorCash === 0 ? 0 : cfbt / investorCash
    const dscr = ds === 0 ? 0 : noi / ds
    const cap = price === 0 ? 0 : noi / price
    const passMin = coc >= G.minCoC && dscr >= G.minDSCR && cap >= G.minCap
    const grossSale10 = c.exit > 0 ? y10NOI / c.exit : 0
    const remLoan10 = balanceAfterMonths(loan, c.rate, monthly, 120)
    const netSale10 = grossSale10 * (1 - inp.sellingCosts) - remLoan10
    return { name: c.name, price, ds, investorCash, noi, coc, dscr, cap, passMin, netSale10, drivers: c }
  })
}

function breakEven(inp, su, target) {
  const G = inp.gates
  const y3 = target.pnl[2]
  const noiForCoC = G.minCoC * su.totalInvestorCash + su.annualDebtService + su.annualReplacementReserve
  const noiForDSCR = G.minDSCR * su.annualDebtService
  const noiForCap = G.minCap * inp.purchasePrice
  const controllingNOI = Math.max(noiForCoC, noiForDSCR, noiForCap)
  const beOcc = y3.gpr === 0 ? 0 : Math.max(0, Math.min(1, (controllingNOI + y3.totalOpEx - y3.anc) / y3.gpr))
  const beRate = (y3.sites * 12 * y3.occ) === 0 ? 0 : Math.max(0, (controllingNOI + y3.totalOpEx - y3.anc) / (y3.sites * 12 * y3.occ))
  const maxOpEx = Math.max(0, y3.egi - controllingNOI)
  const maxCapexBudget = Math.max(
    0,
    (y3.noi - su.annualDebtService - su.annualReplacementReserve) / G.minCoC -
      (su.totalInvestorCash - (inp.expansionEscrow + inp.amenityCapex))
  )
  return { controllingNOI, noiGap: y3.noi - controllingNOI, beOcc, beRate, maxOpEx, maxCapexBudget }
}

// ---------- model checks / release gate ----------
function checks(inp, su, scenarioResults, target) {
  const allocSum = (s) =>
    Object.values(inp.alloc).reduce((a, o) => a + o[s], 0)
  const bo = scenarioResults.target.buildout
  const y3 = target.pnl[2]
  const debtMinBalance = 0 // amortizing loan never goes negative by construction
  const list = [
    { name: 'Sources equal uses', ok: Math.abs(su.uses - (su.seniorDebt + su.totalInvestorCash)) < 1e-6, hint: 'Review Sources & Uses' },
    { name: 'Expense allocation — Current = 100%', ok: Math.abs(allocSum('current') - 1) < 1e-4, hint: 'Shares must total 100%' },
    { name: 'Expense allocation — Pro Forma = 100%', ok: Math.abs(allocSum('proforma') - 1) < 1e-4, hint: 'Shares must total 100%' },
    { name: 'Expense allocation — Target = 100%', ok: Math.abs(allocSum('target') - 1) < 1e-4, hint: 'Shares must total 100%' },
    { name: 'Target draws equal destination escrows', ok: Math.abs((inp.op.y1Draw.target + inp.op.y2Draw.target + inp.op.y3Draw.target) - (inp.expansionEscrow + inp.amenityCapex)) < 1, hint: 'Reconcile buildout draws to escrows' },
    { name: 'Operating reserve covers Yr 1–2 deficits', ok: inp.operatingReserve >= Math.max(0, -target.pnl[0].cfbt) + Math.max(0, -target.pnl[1].cfbt), hint: 'Fund the disclosed 24-month shortfall' },
    { name: 'Year-3 Target CoC ≥ minimum', ok: y3.coc >= inp.gates.minCoC, hint: 'Reprice or improve supported NOI' },
    { name: 'Year-3 Target DSCR ≥ minimum', ok: y3.dscr >= inp.gates.minDSCR, hint: 'Reprice, improve NOI, or change debt' },
    { name: 'Year-3 Target cap ≥ minimum', ok: y3.capRate >= inp.gates.minCap, hint: 'Reprice or improve supported NOI' },
    { name: 'Full-build RV/tent sites ≥ 200', ok: bo.operatingSites >= inp.gates.strikeSites, hint: 'Support at least 200 full-build sites' },
    { name: 'Destination readiness (9 tests)', ok: bo.yesCount === bo.readyTotal, hint: 'All nine destination tests need evidence' },
    { name: 'Exit cap above zero', ok: inp.exitCap > 0, hint: 'Enter a positive exit cap' },
  ]
  const fails = list.filter((c) => !c.ok).length
  return { list, fails, release: fails === 0 }
}

// ---------- top-level decision ----------
function decision(tri, price) {
  const t = tri.target
  if (t.strike) return { verdict: 'PASS', flavor: 'Destination Strike', tone: 'strike' }
  if (t.overall === 'EXCEEDS') return { verdict: 'PASS', flavor: 'Exceeds preferred buffer', tone: 'pass' }
  if (t.overall === 'MEETS') return { verdict: 'PASS', flavor: 'Meets minimum gates', tone: 'pass' }
  // Target fails a gate. Reprice if a meaningful positive supportable price exists.
  const rec = price.target.recMax
  const cut = price.target.discount
  if (rec > 0 && cut < 0.5) {
    return { verdict: 'REPRICE', flavor: `Cut ~${(cut * 100).toFixed(0)}% to work`, tone: 'reprice' }
  }
  return { verdict: 'REJECT', flavor: 'No defensible price at plan', tone: 'reject' }
}

// ---------- assumptions audit ----------
// Everything still labeled 'assumption' (illustrative default, no evidence).
export function assumptionCount(meta) {
  let assume = 0
  let backed = 0
  for (const k of Object.keys(meta || {})) {
    const src = meta[k]?.source
    if (src === 'assumption' || src == null) assume++
    else backed++
  }
  return { assume, backed }
}

// ---------- entry point ----------
export function runModel(inp) {
  const su = sourcesUses(inp)
  const scenarioResults = {}
  for (const s of ['current', 'proforma', 'target']) {
    const bo = buildout(inp, s)
    scenarioResults[s] = { buildout: bo, pnl: pnl(inp, s, su, bo) }
  }
  const tri = trifecta(inp, scenarioResults)
  const price = priceCorrection(inp, su, scenarioResults)
  const debt = debtSchedule(inp, su)
  const returns = investorReturns(inp, su, scenarioResults.target, debt)
  const sens = sensitivity(inp, su, scenarioResults.target)
  const be = breakEven(inp, su, scenarioResults.target)
  const chk = checks(inp, su, scenarioResults, scenarioResults.target)
  const dec = decision(tri, price)
  return {
    su, scenarios: scenarioResults, trifecta: tri, price, debt,
    returns, sensitivity: sens, breakEven: be, checks: chk, decision: dec,
  }
}
