/*
 * Verifies the ROI engine against hand-computed values.
 * Run: npm run test:roi
 *
 * When the placeholder engine is replaced with the proprietary formulas,
 * replace these expected values with worked examples from the Excel models —
 * ideally 3-4 rows pulled straight from the spreadsheet, so the web engine
 * is proven to match Excel to the penny.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const src = readFileSync(join(here, '../public/roi/formulas.js'), 'utf8');
const mod = { exports: {} };
new Function('module', 'window', src)(mod, undefined);
const { computeLoyaltyRoi, computeWizardModel } = mod.exports;

let failures = 0;
function approx(name, actual, expected, tol = 0.01) {
  const ok = Math.abs(actual - expected) <= tol;
  if (!ok) {
    failures++;
    console.error(`  ✗ ${name}: got ${actual}, expected ${expected}`);
  } else {
    console.log(`  ✓ ${name} = ${expected}`);
  }
}

// Case 1: widget defaults, hand-computed.
// baseline = 1200 * 2 * 28                          = 67,200 / mo
// members  = 1200 * 0.35                            = 420
// member spend before = 420 * 2 * 28                = 23,520
// member spend after  = 420 * (2*1.2) * (28*1.1)    = 31,046.40
// incremental / mo    = 7,526.40  → 90,316.80 / yr
// rewards / mo        = 31,046.40 * 5%              = 1,552.32 → 18,627.84 / yr
// net / mo            = 7,526.40*60% − 1,552.32 − 299 = 2,664.52 → 31,974.24 / yr
// ROI = 31,974.24 / (18,627.84 + 3,588 + 1,500)     = 134.8223…%
// payback = 1,500 / 2,664.52                        = 0.56296… months
console.log('Case 1: widget defaults');
const r1 = computeLoyaltyRoi({
  monthlyCustomers: 1200, avgTicket: 28, visitsPerMonth: 2, grossMarginPct: 60,
  memberAdoptionPct: 35, visitLiftPct: 20, spendLiftPct: 10, rewardCostPct: 5,
  monthlyProgramCost: 299, launchCost: 1500,
});
approx('baselineMonthlyRevenue', r1.baselineMonthlyRevenue, 67200);
approx('members', r1.members, 420);
approx('incrementalMonthlyRevenue', r1.incrementalMonthlyRevenue, 7526.4);
approx('incrementalAnnualRevenue', r1.incrementalAnnualRevenue, 90316.8);
approx('annualRewardCost', r1.annualRewardCost, 18627.84);
approx('annualProgramCost', r1.annualProgramCost, 3588);
approx('netAnnualProfit', r1.netAnnualProfit, 31974.24);
approx('roiPct', r1.roiPct, 134.8223, 0.001);
approx('paybackMonths', r1.paybackMonths, 0.563, 0.001);

// Case 2: zero lift → program is pure cost, ROI negative, payback never.
console.log('Case 2: zero lift');
const r2 = computeLoyaltyRoi({
  monthlyCustomers: 500, avgTicket: 40, visitsPerMonth: 1, grossMarginPct: 50,
  memberAdoptionPct: 30, visitLiftPct: 0, spendLiftPct: 0, rewardCostPct: 5,
  monthlyProgramCost: 199, launchCost: 1000,
});
approx('incrementalAnnualRevenue', r2.incrementalAnnualRevenue, 0);
// rewards: 150 members * 40 * 5% = 300/mo → net = −300 − 199 = −499/mo
approx('netAnnualProfit', r2.netAnnualProfit, -5988);
if (r2.paybackMonths !== Infinity) { failures++; console.error('  ✗ paybackMonths should be Infinity'); }
else console.log('  ✓ paybackMonths = Infinity');
if (r2.roiPct >= 0) { failures++; console.error('  ✗ roiPct should be negative'); }
else console.log(`  ✓ roiPct negative (${r2.roiPct.toFixed(1)}%)`);

// Case 3: garbage in → zeros, never NaN. The widget must never show NaN.
console.log('Case 3: invalid inputs never produce NaN');
const r3 = computeLoyaltyRoi({ monthlyCustomers: 'abc', avgTicket: null });
for (const [k, v] of Object.entries(r3)) {
  if (typeof v === 'number' && Number.isNaN(v)) {
    failures++; console.error(`  ✗ ${k} is NaN`);
  }
}
if (failures === 0) console.log('  ✓ no NaN outputs');

// Case 4: full wizard model, hand-computed.
// customers = 1,200,000 / (50 × 12) = 2,000; enrolled 600; active 300
// base spend/active = 600; lifted = 50×1.1 × 12×1.2 = 792; incremental = 192
// active-base rev = 180,000 → AOV inc 18,000; Freq inc 39,600; gross 57,600
// recurring = 18,000/yr; one-time = 6,000; rewards = 5% of lifted member spend
// peak year 2, retention 90%:
//   Y1 (ramp .5): active 150, incRev 28,800, rewards 5,940, costs 29,940, net −1,140
//   Y2: active 300, incRev 57,600, rewards 11,880, costs 29,880, net 27,720
//   Y3 (.9): active 270, incRev 51,840, costs 28,692, net 23,148
//   Y4 (.81): active 243, incRev 46,656, costs 27,622.80, net 19,033.20
//   Y5 (.729): active 218.7, incRev 41,990.40, costs 26,660.52, net 15,329.88
// 5yr net = 84,091.08; 5yr costs = 142,795.32; ROI = 58.889%; payback = 13 mo
console.log('Case 4: wizard model');
const w = computeWizardModel({
  annualRevenue: 1200000, aov: 50, purchaseFrequency: 12,
  enrollmentRatePct: 30, activeRatePct: 50, aovLiftPct: 10, freqLiftPct: 20,
  softwareCost: 12000, setupFees: 4000, implementation: 2000,
  marketingCost: 6000, laborCost: 0, miscCost: 0, rewardsCostPct: 5,
  peakEnrollmentYear: 2, retentionRatePct: 90,
});
approx('totalCustomers', w.totalCustomers, 2000);
approx('enrolledMembers', w.enrolledMembers, 600);
approx('activeMembers', w.activeMembers, 300);
approx('aovIncremental', w.aovIncremental, 18000);
approx('freqIncremental', w.freqIncremental, 39600);
approx('grossIncrementalRevenue', w.grossIncrementalRevenue, 57600);
approx('breakdown sums to gross', w.aovIncremental + w.freqIncremental, w.grossIncrementalRevenue);
approx('totalInvestmentYear1', w.totalInvestmentYear1, 29940);
approx('annualProfitImpact (Y1)', w.annualProfitImpact, -1140);
approx('Y2 net', w.years[1].netProfit, 27720);
approx('Y5 active', w.years[4].activeMembers, 218.7);
approx('Y5 net', w.years[4].netProfit, 15329.88);
approx('netValueCreated5yr', w.netValueCreated5yr, 84091.08);
approx('cumCosts5yr', w.cumCosts5yr, 142795.32);
approx('roiMultiplePct', w.roiMultiplePct, 58.889, 0.001);
approx('paybackMonths', w.paybackMonths, 13);

// Case 5: the Horizon bug scenario — degenerate inputs must not produce
// nonsense (their build showed Rev/Member $209,000 with 0 members, ROI −597%
// with 0.0-month payback, and negative net styled as positive).
console.log('Case 5: wizard degenerate inputs (the Horizon failure mode)');
const wz = computeWizardModel({
  annualRevenue: 1000, aov: 1000, purchaseFrequency: 1000,
  enrollmentRatePct: 30, activeRatePct: 50, aovLiftPct: 10, freqLiftPct: 10,
  softwareCost: 1000, setupFees: 1000, implementation: 0,
  marketingCost: 1000, laborCost: 1000, miscCost: 1000, rewardsCostPct: 5,
  peakEnrollmentYear: 3, retentionRatePct: 85,
});
for (const [k, v] of Object.entries(wz)) {
  if (typeof v === 'number' && Number.isNaN(v)) { failures++; console.error(`  ✗ ${k} is NaN`); }
}
if (wz.years.some((y) => Number.isNaN(y.revPerMember) || (y.activeMembers === 0 && y.revPerMember !== 0))) {
  failures++; console.error('  ✗ revPerMember nonsense with ~0 members');
} else console.log('  ✓ revPerMember guarded when members ~0');
if (wz.netValueCreated5yr < 0 && wz.paybackMonths !== Infinity) {
  failures++; console.error('  ✗ negative program must have Infinity payback');
} else console.log('  ✓ negative program → payback Never (not 0.0 mo)');

if (failures > 0) {
  console.error(`\n${failures} check(s) FAILED`);
  process.exit(1);
}
console.log('\nAll ROI engine checks passed.');
