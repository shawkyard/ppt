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
const { computeLoyaltyRoi } = mod.exports;

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

if (failures > 0) {
  console.error(`\n${failures} check(s) FAILED`);
  process.exit(1);
}
console.log('\nAll ROI engine checks passed.');
