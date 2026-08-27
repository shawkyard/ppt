/*
 * Proves the JS engine matches the Excel "Master Control Center" workbook.
 * Every expected value below is a CACHED VALUE read from the workbook itself
 * (Canonical Model, 5-Year Model, QA Tests sheets) — the engine must
 * reproduce Excel to the penny.
 * Run: npm run test:roi
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const src = readFileSync(join(here, '../public/roi/formulas.js'), 'utf8');
const mod = { exports: {} };
new Function('module', 'window', src)(mod, undefined);
const { computeLoyaltyRoi, computeCanonicalModel, computeFiveYear, computeMultiChannel, CHANNEL_SPECS } = mod.exports;

let failures = 0;
function approx(name, actual, expected, tol = 0.01) {
  const ok = actual === expected || Math.abs(actual - expected) <= tol;
  if (!ok) { failures++; console.error(`  ✗ ${name}: got ${actual}, expected ${expected}`); }
  else console.log(`  ✓ ${name} = ${expected}`);
}

// Scenario Inputs (workbook 'Scenario Inputs' C/D/E columns)
const SCENARIOS = {
  conservative: {
    annualRevenue: 1e9, aov: 235, purchaseFrequency: 3, grossMargin: 0.5,
    enrollmentRate: 0.25, activeRate: 0.45, aovLift: 0.08, pfLift: 0.08,
    rewardRate: 0.02, platformCost: 100000, implementationCost: 75000,
    integrationCost: 75000, laborCost: 40000, marketingCost: 50000,
    servicesCost: 25000, otherCost: 15000,
    rampByYear: [0.6, 0.8, 0.95, 1, 1], costInflation: 0.03, discountRate: 0.1,
  },
  base: {
    annualRevenue: 1e9, aov: 235, purchaseFrequency: 3, grossMargin: 0.5,
    enrollmentRate: 0.35, activeRate: 0.6, aovLift: 0.15, pfLift: 0.15,
    rewardRate: 0.025, platformCost: 150000, implementationCost: 25000,
    integrationCost: 50000, laborCost: 25000, marketingCost: 50000,
    servicesCost: 25000, otherCost: 0,
    rampByYear: [0.7, 0.9, 1, 1, 1], costInflation: 0.03, discountRate: 0.1,
  },
  aggressive: {
    annualRevenue: 1e9, aov: 235, purchaseFrequency: 3, grossMargin: 0.5,
    enrollmentRate: 0.45, activeRate: 0.7, aovLift: 0.22, pfLift: 0.22,
    rewardRate: 0.03, platformCost: 250000, implementationCost: 150000,
    integrationCost: 125000, laborCost: 75000, marketingCost: 100000,
    servicesCost: 50000, otherCost: 25000,
    rampByYear: [0.8, 0.95, 1, 1, 1], costInflation: 0.03, discountRate: 0.1,
  },
};

// ── Canonical Model, Base scenario (workbook column D cached values) ──
console.log('Canonical Model — Base scenario vs workbook:');
const b = computeCanonicalModel(SCENARIOS.base);
approx('customers', b.customers, 1418439.7163120566);
approx('enrolledMembers', b.enrolledMembers, 496453.9007092198);
approx('activeMembers', b.activeMembers, 297872.34042553185);
approx('baselineActiveRevenue', b.baselineActiveRevenue, 209999999.99999994);
approx('projectedAov', b.projectedAov, 270.25);
approx('projectedPf', b.projectedPf, 3.4499999999999997, 1e-9);
approx('aovOnlyLift', b.aovOnlyLift, 31499999.999999993);
approx('pfOnlyLift', b.pfOnlyLift, 31499999.999999974);
approx('synergyLift', b.synergyLift, 4724999.999999996);
approx('incrementalRevenue', b.incrementalRevenue, 67724999.99999997);
approx('bridgeCheck ≈ 0', b.bridgeCheck, 0);
approx('incrementalGrossProfit', b.incrementalGrossProfit, 33862499.999999985);
approx('rewardsCost', b.rewardsCost, 1693124.9999999993);
approx('recurringFixedCosts', b.recurringFixedCosts, 250000);
approx('oneTimeCosts', b.oneTimeCosts, 75000);
approx('totalInvestment', b.totalInvestment, 2018124.9999999993);
approx('netContribution', b.netContribution, 31844374.999999985);
approx('netRoi', b.netRoi, 15.779188603282748, 1e-9);
approx('benefitCostMultiple', b.benefitCostMultiple, 16.779188603282748, 1e-9);
approx('paybackMonths', b.paybackMonths, 0.7604953779121116, 1e-9);
approx('incRevShareOfCompany', b.incRevenueShareOfCompany, 0.06772499999999997, 1e-9);
approx('contributionPerActive', b.contributionPerActive, 107.99718749999998, 1e-6);
approx('breakEvenActiveMembers', b.breakEvenActiveMembers, 3009.3376274266407, 1e-6);
if (b.modelGate !== 'READY') { failures++; console.error('  ✗ modelGate should be READY'); }
else console.log('  ✓ modelGate = READY');

// ── Conservative & Aggressive headline values ──
console.log('Conservative / Aggressive scenarios vs workbook:');
const c = computeCanonicalModel(SCENARIOS.conservative);
approx('cons. incrementalRevenue', c.incrementalRevenue, 18720000.000000015, 0.1);
approx('cons. netContribution', c.netContribution, 8605600.000000007, 0.1);
approx('cons. netRoi', c.netRoi, 11.407211028632032, 1e-9);
approx('cons. paybackMonths', c.paybackMonths, 1.0519661615692102, 1e-9);
const a = computeCanonicalModel(SCENARIOS.aggressive);
approx('aggr. incrementalRevenue', a.incrementalRevenue, 153846000, 0.1);
approx('aggr. netContribution', a.netContribution, 71532620, 0.1);
approx('aggr. netRoi', a.netRoi, 13.270422493404917, 1e-9);
// Scenario ordering check (workbook 'Checks' A12): C ≤ B ≤ A
if (!(c.incrementalRevenue <= b.incrementalRevenue && b.incrementalRevenue <= a.incrementalRevenue)) {
  failures++; console.error('  ✗ scenario order violated');
} else console.log('  ✓ scenario order C ≤ B ≤ A');

// ── 5-Year Model, Base scenario (workbook cached values) ──
console.log('5-Year Model — Base scenario vs workbook:');
const f = computeFiveYear(SCENARIOS.base);
approx('Y1 activeMembers', f.years[0].activeMembers, 208510.63829787227, 1e-6);
approx('Y1 incRevenue', f.years[0].incRevenue, 47407499.99999998);
approx('Y1 grossProfit', f.years[0].grossProfit, 23703749.99999999);
approx('Y1 rewardsCost', f.years[0].rewardsCost, 1185187.4999999995);
approx('Y1 recurringCosts', f.years[0].recurringCosts, 250000);
approx('Y1 oneTimeCosts', f.years[0].oneTimeCosts, 75000);
approx('Y1 totalInvestment', f.years[0].totalInvestment, 1510187.4999999995);
approx('Y1 netContribution', f.years[0].netContribution, 22193562.49999999);
approx('Y1 annualRoi', f.years[0].annualRoi, 14.69589868807681, 1e-9);
approx('Y2 netContribution', f.years[1].netContribution, 28694937.49999999);
approx('Y3 recurringCosts (inflated)', f.years[2].recurringCosts, 265225);
approx('Y5 recurringCosts (inflated)', f.years[4].recurringCosts, 281377.20249999996);
approx('Y5 netContribution', f.years[4].netContribution, 31887997.797499985);
approx('Y5 cumulativeNet', f.years[4].cumulativeNet, 146576841.04749995);
approx('Y5 cumulativeRoi', f.years[4].cumulativeRoi, 15.948458299350653, 1e-9);
approx('Y5 netPerActive', f.years[4].netPerActive, 107.05256403446425, 1e-6);
approx('5yr incRevenue', f.fiveYearIncRevenue, 311534999.9999999);
approx('5yr investment', f.fiveYearInvestment, 9190658.952499997);
approx('5yr netContribution', f.fiveYearNetContribution, 146576841.04749995);
approx('5yr NPV', f.fiveYearNpv, 109446317.34124586);
// One-time costs Year 1 only (workbook QA Tests A22)
if (f.years.slice(1).some((y) => y.oneTimeCosts !== 0)) {
  failures++; console.error('  ✗ one-time costs leaked past Year 1');
} else console.log('  ✓ one-time costs Year 1 only');

// ── QA Tests sheet: lift compounds exactly once ──
console.log('QA unit tests (workbook QA Tests sheet):');
const qa = [
  ['No lift',           100, 100, 2, 0,    0,    0],
  ['AOV only +10%',     100, 100, 2, 0.10, 0,    2000],
  ['PF only +10%',      100, 100, 2, 0,    0.10, 2000],
  ['Both +10% = 21%',   100, 100, 2, 0.10, 0.10, 4200],
  ['Both +18% = 39.24%',100, 100, 2, 0.18, 0.18, 7848],
  ['Zero active',       0,   100, 2, 0.20, 0.20, 0],
  ['High PF, AOV only', 50,  80, 12, 0.05, 0,    2400],
  ['High AOV, PF only', 25,  500, 4, 0,    0.25, 12500],
];
for (const [label, active, aov, pf, aovLift, pfLift, expected] of qa) {
  const m = computeCanonicalModel({
    uniqueCustomers: active, enrollmentRate: 1, activeRate: 1,
    aov, purchaseFrequency: pf, aovLift, pfLift,
    grossMargin: 0.5, rewardRate: 0,
    platformCost: 0, laborCost: 0, marketingCost: 0, servicesCost: 0,
    otherCost: 0, implementationCost: 0, integrationCost: 0,
    annualRevenue: 0,
  });
  approx(label, m.incrementalRevenue, expected);
}

// ── Guardrails (workbook QA qualitative tests + Checks) ──
console.log('Guardrails:');
const neg = computeCanonicalModel({ ...SCENARIOS.base, aovLift: 0, pfLift: 0 });
if (neg.paybackMonths !== Infinity) { failures++; console.error('  ✗ negative net → payback must be Infinity ("No payback")'); }
else console.log('  ✓ negative net contribution → "No payback"');
const zeroInv = computeCanonicalModel({
  ...SCENARIOS.base, rewardRate: 0, platformCost: 0, laborCost: 0, marketingCost: 0,
  servicesCost: 0, otherCost: 0, implementationCost: 0, integrationCost: 0,
});
if (zeroInv.netRoi !== null) { failures++; console.error('  ✗ zero investment → ROI must be null ("N/M")'); }
else console.log('  ✓ zero investment → ROI "N/M"');
const gated = computeCanonicalModel({ ...SCENARIOS.base, identityAvailable: false });
approx('identity gate: PF lift zeroed', gated.pfOnlyLift, 0);
if (!gated.modelGate.startsWith('LIMIT PF')) { failures++; console.error('  ✗ identity gate message'); }
else console.log('  ✓ identity gate flagged');
const junk = computeCanonicalModel({ annualRevenue: 'abc', aov: null, purchaseFrequency: undefined });
for (const [k, v] of Object.entries(junk)) {
  if (typeof v === 'number' && Number.isNaN(v)) { failures++; console.error(`  ✗ ${k} is NaN`); }
}
console.log('  ✓ invalid inputs never produce NaN');

// ── Multi-channel model ──
console.log('Multi-channel:');
const sharedBase = {
  grossMargin: 0.5, activeRate: 0.6, aovLift: 0.15, pfLift: 0.15,
  identityAvailable: true, rewardRate: 0.025,
  platformCost: 150000, implementationCost: 25000, integrationCost: 50000,
  laborCost: 25000, marketingCost: 50000, servicesCost: 25000, otherCost: 0,
  rampByYear: [0.7, 0.9, 1, 1, 1], costInflation: 0.03, discountRate: 0.1,
};
// E-commerce alone with Base-scenario numbers must equal the single-channel
// canonical Base scenario exactly.
const mc1 = computeMultiChannel(sharedBase, [
  { key: 'ecommerce', annualRevenue: 1e9, aov: 235, purchaseFrequency: 3, enrollmentRate: 0.35 },
]);
approx('ecom-only = Base customers', mc1.customers, b.customers, 1e-6);
approx('ecom-only = Base incRevenue', mc1.incrementalRevenue, b.incrementalRevenue, 0.01);
approx('ecom-only = Base totalInvestment', mc1.totalInvestment, b.totalInvestment, 0.01);
approx('ecom-only = Base netContribution', mc1.netContribution, b.netContribution, 0.01);
approx('ecom-only = Base 5yr net', mc1.fiveYearNetContribution, f.fiveYearNetContribution, 0.01);
approx('ecom-only = Base 5yr NPV', mc1.fiveYearNpv, f.fiveYearNpv, 0.01);

// CPG recruitment ceiling: 35% requested clamps to the 4% receipt-processing cap.
// CPG: $250M revenue, $12 AOV, 24 purchases/yr → 868,055.56 customers;
// enrolled at capped 4% = 34,722.22; active 60% = 20,833.33.
const mc2 = computeMultiChannel(sharedBase, [
  { key: 'cpg', annualRevenue: 250e6, aov: 12, purchaseFrequency: 24, enrollmentRate: 0.35 },
]);
approx('CPG customers', mc2.channels[0].customers, 868055.5555555555, 1e-4);
approx('CPG enrollment clamped to 4%', mc2.channels[0].enrollmentRateApplied, 0.04, 1e-12);
approx('CPG enrolled (capped)', mc2.channels[0].enrolledMembers, 34722.22222222222, 1e-4);
if (!mc2.channels[0].enrollmentCapped) { failures++; console.error('  ✗ CPG cap flag missing'); }
else console.log('  ✓ CPG cap flagged');
if (CHANNEL_SPECS.cpg.enrollMax !== 0.04) { failures++; console.error('  ✗ CPG ceiling should be 4%'); }
else console.log('  ✓ CPG ceiling = 4%');

// User-adjustable ceilings and per-channel active rates.
if (CHANNEL_SPECS.pos.enrollMax !== 0.80) { failures++; console.error('  ✗ POS default ceiling should be 80%'); }
else console.log('  ✓ POS default ceiling = 80%');
const mc3 = computeMultiChannel(sharedBase, [
  // Override the CPG ceiling per deal (user-editable): 10% instead of 4%.
  { key: 'cpg', annualRevenue: 250e6, aov: 12, purchaseFrequency: 24, enrollmentRate: 0.35, enrollMax: 0.10 },
]);
approx('user ceiling override applied', mc3.channels[0].enrollmentRateApplied, 0.10, 1e-12);
const mc4 = computeMultiChannel(sharedBase, [
  // Per-channel active rate: 50% here vs 60% shared.
  { key: 'ecommerce', annualRevenue: 1e9, aov: 235, purchaseFrequency: 3, enrollmentRate: 0.35, activeRate: 0.5 },
]);
approx('per-channel active rate', mc4.activeMembers, b.enrolledMembers * 0.5, 1e-4);

// Blend invariant: two channels = sum of each channel computed alone
// (revenue side), with program costs applied exactly once.
const chA = { key: 'ecommerce', annualRevenue: 1e9, aov: 235, purchaseFrequency: 3, enrollmentRate: 0.35 };
const chB = { key: 'cpg', annualRevenue: 250e6, aov: 12, purchaseFrequency: 24, enrollmentRate: 0.04 };
const mcBoth = computeMultiChannel(sharedBase, [chA, chB]);
const aloneA = computeMultiChannel(sharedBase, [chA]);
const aloneB = computeMultiChannel(sharedBase, [chB]);
approx('blend: customers sum', mcBoth.customers, aloneA.customers + aloneB.customers, 1e-4);
approx('blend: incRevenue sum', mcBoth.incrementalRevenue, aloneA.incrementalRevenue + aloneB.incrementalRevenue, 0.01);
approx('blend: active sum', mcBoth.activeMembers, aloneA.activeMembers + aloneB.activeMembers, 1e-4);
const expectedInvestment = mcBoth.incrementalRevenue * 0.025 + 250000 + 75000;
approx('blend: one cost denominator', mcBoth.totalInvestment, expectedInvestment, 0.01);
approx('blend: bridge ≈ 0', mcBoth.bridgeCheck, 0);

// ── Compact widget (canonical simple rewards mode) ──
// customers 1200, ticket $28, 2 visits/mo, margin 60%, adoption 35%,
// visit lift 20%, spend lift 10%, rewards 5% of incremental, fee $299/mo,
// launch $1,500. Incremental/mo = 420×2×28×(1.2×1.1−1) = 7,526.40;
// rewards 376.32; net/mo = 4,515.84 − 376.32 − 299 = 3,840.52 → 46,086.24/yr;
// ROI = 46,086.24 / (4,515.84×... ) — denom = 4,515.84 + 3,588 + 1,500? No:
// annualRewards 4,515.84 + annualFees 3,588 + launch 1,500 = 9,603.84 →
// 479.87%; payback = 1,500 / 3,840.52 = 0.39057 mo.
console.log('Compact widget:');
const w = computeLoyaltyRoi({
  monthlyCustomers: 1200, avgTicket: 28, visitsPerMonth: 2, grossMarginPct: 60,
  memberAdoptionPct: 35, visitLiftPct: 20, spendLiftPct: 10, rewardCostPct: 5,
  monthlyProgramCost: 299, launchCost: 1500,
});
approx('incrementalAnnualRevenue', w.incrementalAnnualRevenue, 90316.8);
approx('annualRewardCost', w.annualRewardCost, 4515.84);
approx('netAnnualProfit', w.netAnnualProfit, 46086.24);
approx('roiPct', w.roiPct, 479.8729, 0.001);
approx('paybackMonths', w.paybackMonths, 0.39057, 0.0001);

if (failures > 0) {
  console.error(`\n${failures} check(s) FAILED`);
  process.exit(1);
}
console.log('\nAll ROI engine checks passed — JS matches the Excel workbook.');
