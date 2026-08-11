// Runnable checks + a printed demo. No test runner or deps required:
//   node src/lib/loyalty/verify.mjs
// Exits non-zero if any assertion fails.

import assert from 'node:assert/strict'
import { computeLoyaltyROI, breakEvenCombinedLift } from './roi.js'
import { prescopeAccount, rankMarket, marketSummary } from './prescope.js'
import { DEMO_BRANDS } from './demoBrands.js'

const usd = (v) => (Math.abs(v) >= 1e6 ? `$${(v / 1e6).toFixed(1)}M` : `$${Math.round(v).toLocaleString()}`)
const pct = (v) => `${(v * 100).toFixed(1)}%`
const x = (v) => `${v.toFixed(2)}×`
const near = (a, b, tol, msg) => assert.ok(Math.abs(a - b) <= tol, `${msg}: ${a} vs ${b} (tol ${tol})`)

let checks = 0
const ok = (label) => { checks++; console.log(`  ✓ ${label}`) }

console.log('\nLOYALTY ENGINE — verification\n' + '─'.repeat(52))

// 1. The anti-bug check: the three lift terms MUST sum to the true increment.
//    The old spreadsheet kept only `interaction`; this proves we don't.
{
  const r = computeLoyaltyROI({
    aov: 26, purchaseFrequency: 22, activeMembers: 300_000, grossMargin: 0.35,
    aovLift: 0.07, pfLift: 0.12, rewardCostRate: 0.014,
    costs: { software: 420_000, labor: 380_000, marketing: 900_000, misc: 300_000 },
  })
  const summed = r.terms.aov + r.terms.frequency + r.terms.interaction
  near(summed, r.incPerMember, 1e-6, 'three terms sum to increment')
  // The interaction term alone is a tiny fraction — the exact trap we avoid.
  assert.ok(r.terms.interaction / r.incPerMember < 0.06, 'interaction term is small vs. full lift')
  ok(`full lift $${r.incPerMember.toFixed(2)}/member is ${(r.incPerMember / r.terms.interaction).toFixed(0)}× the interaction term alone`)
}

// 2. Break-even closed form: at the break-even lift, net contribution is ~0.
{
  const base = {
    aov: 26, purchaseFrequency: 22, activeMembers: 300_000, grossMargin: 0.35,
    aovLift: 0, pfLift: 0, rewardCostRate: 0.014,
    costs: { software: 420_000, labor: 380_000, marketing: 900_000, misc: 300_000 },
  }
  const L = breakEvenCombinedLift(base)
  const atBreakEven = computeLoyaltyROI({ ...base, aovLift: L, pfLift: 0 })
  near(atBreakEven.netContribution, 0, 1, 'net contribution is zero at break-even lift')
  ok(`break-even combined lift solves to ${pct(L)} (net contribution ≈ $0 there)`)
}

// 3. Verano matches the opportunity-report template.
{
  const r = prescopeAccount(DEMO_BRANDS[0])
  near(r.expected.benefitCostRatio, 2.44, 0.05, 'Verano expected BCR')
  near(r.expected.netROI, 1.44, 0.05, 'Verano expected net ROI')
  near(r.conservative.benefitCostRatio, 1.33, 0.05, 'Verano conservative BCR')
  near(r.breakEven, 0.0764, 0.002, 'Verano break-even lift')
  assert.equal(r.verdict.label, 'ACT NOW', 'Verano verdict is ACT NOW')
  ok(`Verano → ${r.verdict.label}, fit ${r.fitScore}, expected ${x(r.expected.benefitCostRatio)} / conservative ${x(r.conservative.benefitCostRatio)}`)
}

// 4. The spread: at least one WATCH and one DROP in the demo set.
{
  const bands = DEMO_BRANDS.map((b) => prescopeAccount(b).verdict.band)
  assert.ok(bands.includes('amber'), 'demo set has a WATCH')
  assert.ok(bands.includes('red'), 'demo set has a DROP')
  ok('demo set spans ACT NOW / WATCH / DROP')
}

console.log('─'.repeat(52))
console.log(`ALL ${checks} CHECKS PASSED\n`)

// ── Printed demo ─────────────────────────────────────────────────────────────
const ranked = rankMarket(DEMO_BRANDS)
const sum = marketSummary(ranked)

console.log('MARKET PRE-SCOPE')
console.log(`  ${sum.total} accounts analyzed  →  ${sum.actNow} ACT NOW · ${sum.watch} WATCH · ${sum.drop} DROP\n`)
console.log('  ' + 'ACCOUNT'.padEnd(26) + 'VERDICT'.padEnd(9) + 'FIT'.padEnd(5) + 'EXP BCR'.padEnd(9) + 'CONS BCR'.padEnd(10) + 'NET ROI'.padEnd(9) + 'P(+ROI)')
for (const r of ranked) {
  console.log('  ' +
    r.account.name.padEnd(26) +
    r.verdict.label.padEnd(9) +
    String(r.fitScore).padEnd(5) +
    x(r.expected.benefitCostRatio).padEnd(9) +
    x(r.conservative.benefitCostRatio).padEnd(10) +
    (r.expected.netROI >= 0 ? '+' : '') + pct(r.expected.netROI).padEnd(8) +
    pct(r.positiveRoiProbability))
}

console.log('\nVERANO — ANNUAL BRIDGE (expected case)')
const v = prescopeAccount(DEMO_BRANDS[0])
const row = (l, val) => console.log('  ' + l.padEnd(38) + val)
row('Active members', v.inputs.activeMembers.toLocaleString())
row('Baseline spend / member', usd(v.expected.baselineSpendPerMember))
row('  + AOV lift', `+${usd(v.expected.terms.aov)}`)
row('  + Frequency lift', `+${usd(v.expected.terms.frequency)}`)
row('  + Interaction', `+${usd(v.expected.terms.interaction)}`)
row('Incremental spend / member', usd(v.expected.incPerMember))
row('Incremental revenue', usd(v.expected.incrementalRevenue))
row('Incremental gross profit', usd(v.expected.incrementalGrossProfit))
row('− Program cost', `−${usd(v.expected.cost.total)}`)
row('Net annual contribution', usd(v.expected.netContribution))
row('Break-even combined lift', pct(v.breakEven))
row('Payback', `${v.expected.paybackMonths.toFixed(1)} months`)
console.log('')
