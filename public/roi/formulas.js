/*
 * Loyalty Program ROI Engine
 * ==========================
 * ENGINE VERSION: v1.0-CANONICAL
 *
 * Ported from the owner's "Alma Loyalty CRM ROI Master Control Center"
 * workbook — sheets: Formula Canon, Canonical Model, 5-Year Model,
 * Scenario Inputs, Input Dictionary, QA Tests, Checks. The JS below
 * reproduces those formulas exactly; scripts/test-roi-formulas.mjs proves
 * every output against the workbook's own calculated values.
 *
 * Conventions (matching the workbook):
 *  - All rates are FRACTIONS (0.15 = 15%), exactly as Excel stores them.
 *  - Money values are plain dollar numbers.
 *  - Guards: IFERROR-style division → 0; zero investment → ROI/multiple null
 *    ("N/M"); non-positive net contribution → paybackMonths Infinity
 *    ("No payback"); PF lift requires repeat identity (identity gate).
 *
 * Canon rules encoded here:
 *  - Incremental revenue = AOV-only + PF-only + synergy, and must reconcile
 *    ("bridge") with Active × (projected − baseline) revenue. Count synergy
 *    exactly once.
 *  - Revenue is not profit: gross margin applies before any ROI math.
 *  - One denominator: rewards + recurring + one-time all feed Total
 *    Investment. Net ROI = net ÷ investment (no +1 — that would be the
 *    benefit-cost multiple, a separate metric).
 */

function n(v) { return Number.isFinite(Number(v)) ? Number(v) : 0; }
function div(a, b) { return b > 0 ? a / b : 0; }

/**
 * Single-year canonical model — "Canonical Model" sheet.
 *
 * @param {Object} i
 * @param {number}  i.annualRevenue       $ / year
 * @param {number}  [i.uniqueCustomers]   Actual customers (preferred when known)
 * @param {number}  i.aov                 $ / order
 * @param {number}  i.purchaseFrequency   Orders / customer / year
 * @param {number}  i.grossMargin         Fraction (0.5 = 50%)
 * @param {number}  i.enrollmentRate      Fraction of customers
 * @param {number}  i.activeRate          Fraction of enrolled
 * @param {number}  i.aovLift             Fraction
 * @param {number}  i.pfLift              Fraction (gated on identity)
 * @param {boolean} [i.identityAvailable=true]  Repeat identity observable?
 * @param {number}  i.rewardRate          Fraction of incremental revenue (simple mode)
 * @param {number}  i.platformCost        $ recurring / year
 * @param {number}  i.laborCost           $ recurring / year
 * @param {number}  i.marketingCost       $ recurring / year
 * @param {number}  i.servicesCost        $ recurring / year
 * @param {number}  i.otherCost           $ recurring / year
 * @param {number}  i.implementationCost  $ one-time (Year 1)
 * @param {number}  i.integrationCost     $ one-time (Year 1)
 */
function computeCanonicalModel(i) {
  const identity = i.identityAvailable !== false;

  const revenue = n(i.annualRevenue);
  const aov = n(i.aov);
  const pf = n(i.purchaseFrequency);
  const margin = n(i.grossMargin);
  const aovLift = n(i.aovLift);
  const pfLift = identity ? n(i.pfLift) : 0; // identity gate: no PF uplift without repeat identity

  // Estimated customers: Revenue ÷ (AOV × PF); actual customers win when given.
  const customers = n(i.uniqueCustomers) > 0 ? n(i.uniqueCustomers) : div(revenue, aov * pf);
  const enrolledMembers = customers * n(i.enrollmentRate);
  const activeMembers = enrolledMembers * n(i.activeRate);

  const baselineActiveRevenue = activeMembers * aov * pf;
  const projectedAov = aov * (1 + aovLift);
  const projectedPf = pf * (1 + pfLift);

  // Driver bridge — count synergy exactly once.
  const aovOnlyLift = activeMembers * pf * (projectedAov - aov);
  const pfOnlyLift = activeMembers * aov * (projectedPf - pf);
  const synergyLift = activeMembers * (projectedAov - aov) * (projectedPf - pf);
  const incrementalRevenue = aovOnlyLift + pfOnlyLift + synergyLift;
  const bridgeCheck =
    incrementalRevenue - ((activeMembers * projectedAov * projectedPf) - baselineActiveRevenue);

  const incrementalGrossProfit = incrementalRevenue * margin;

  // Rewards, simple mode: % of incremental revenue.
  const rewardsCost = incrementalRevenue * n(i.rewardRate);
  const recurringFixedCosts =
    n(i.platformCost) + n(i.laborCost) + n(i.marketingCost) + n(i.servicesCost) + n(i.otherCost);
  const oneTimeCosts = n(i.implementationCost) + n(i.integrationCost);
  const totalInvestment = rewardsCost + recurringFixedCosts + oneTimeCosts;

  const netContribution = incrementalGrossProfit - totalInvestment;
  const netRoi = totalInvestment > 0 ? netContribution / totalInvestment : null;          // "N/M"
  const benefitCostMultiple = totalInvestment > 0 ? incrementalGrossProfit / totalInvestment : null;
  const paybackMonths = netContribution > 0 ? totalInvestment / (netContribution / 12) : Infinity;

  const incRevenueShareOfCompany = div(incrementalRevenue, revenue);
  const contributionPerActive =
    activeMembers > 0 ? (incrementalGrossProfit - rewardsCost) / activeMembers : 0;
  const breakEvenActiveMembers =
    contributionPerActive > 0 ? (recurringFixedCosts + oneTimeCosts) / contributionPerActive : null;

  const modelGate = !identity
    ? 'LIMIT PF: identity unavailable'
    : Math.abs(bridgeCheck) > 0.01
      ? 'BLOCK: bridge failed'
      : 'READY';

  return {
    customers, enrolledMembers, activeMembers,
    baselineActiveRevenue, projectedAov, projectedPf,
    aovOnlyLift, pfOnlyLift, synergyLift,
    incrementalRevenue, bridgeCheck,
    incrementalGrossProfit,
    rewardsCost, recurringFixedCosts, oneTimeCosts, totalInvestment,
    netContribution, netRoi, benefitCostMultiple, paybackMonths,
    incRevenueShareOfCompany, contributionPerActive, breakEvenActiveMembers,
    modelGate,
    engineVersion: 'v1.0-CANONICAL',
  };
}

/**
 * Five-year projection — "5-Year Model" sheet.
 * Ramp applies to member value; recurring costs inflate; one-time costs hit
 * Year 1 only; net contributions discount to NPV. Organic growth is never
 * hidden inside loyalty value.
 *
 * @param {Object} i  Same fields as computeCanonicalModel, plus:
 * @param {number[]} [i.rampByYear]     5 fractions, default [0.7,0.9,1,1,1] (Base)
 * @param {number}   [i.costInflation]  Fraction / year, default 0.03
 * @param {number}   [i.discountRate]   Fraction / year, default 0.10
 */
function computeFiveYear(i) {
  const m = computeCanonicalModel(i);
  const ramp = Array.isArray(i.rampByYear) && i.rampByYear.length === 5
    ? i.rampByYear.map(n) : [0.7, 0.9, 1, 1, 1];
  const inflation = i.costInflation == null ? 0.03 : n(i.costInflation);
  const discount = i.discountRate == null ? 0.10 : n(i.discountRate);
  const margin = n(i.grossMargin);
  const rewardRate = n(i.rewardRate);

  const years = [];
  let cumNet = 0, cumInvestment = 0, npv = 0, cumIncRevenue = 0;
  for (let t = 1; t <= 5; t++) {
    const r = ramp[t - 1];
    const activeMembers = m.activeMembers * r;
    const incRevenue = m.incrementalRevenue * r;
    const grossProfit = incRevenue * margin;
    const rewardsCost = incRevenue * rewardRate;
    const recurringCosts = m.recurringFixedCosts * Math.pow(1 + inflation, t - 1);
    const oneTimeCosts = t === 1 ? m.oneTimeCosts : 0;
    const totalInvestment = rewardsCost + recurringCosts + oneTimeCosts;
    const netContribution = grossProfit - totalInvestment;
    const discountFactor = 1 / Math.pow(1 + discount, t);

    cumNet += netContribution;
    cumInvestment += totalInvestment;
    npv += netContribution * discountFactor;
    cumIncRevenue += incRevenue;

    years.push({
      year: t, ramp: r, activeMembers, incRevenue, grossProfit,
      rewardsCost, recurringCosts, oneTimeCosts, totalInvestment,
      netContribution, discountFactor,
      presentValue: netContribution * discountFactor,
      cumulativeNet: cumNet,
      annualRoi: totalInvestment > 0 ? netContribution / totalInvestment : null,
      cumulativeRoi: cumInvestment > 0 ? cumNet / cumInvestment : null,
      netPerActive: activeMembers > 0 ? netContribution / activeMembers : 0,
    });
  }

  return {
    ...m,
    years,
    fiveYearIncRevenue: cumIncRevenue,
    fiveYearInvestment: cumInvestment,
    fiveYearNetContribution: cumNet,
    fiveYearNpv: npv,
  };
}

/*
 * Compact-widget model (Tier-1 quick embed). Same canonical economics on a
 * reduced input set: monthly business metrics in, single-year outputs out.
 * Rewards follow the canon's simple mode: % of INCREMENTAL revenue.
 */
function computeLoyaltyRoi(inputs) {
  const pct = (v) => n(v) / 100; // widget inputs arrive as whole percents

  const monthlyCustomers = n(inputs.monthlyCustomers);
  const avgTicket = n(inputs.avgTicket);
  const visitsPerMonth = n(inputs.visitsPerMonth);
  const margin = pct(inputs.grossMarginPct);
  const adoption = pct(inputs.memberAdoptionPct);
  const visitLift = pct(inputs.visitLiftPct);
  const spendLift = pct(inputs.spendLiftPct);
  const rewardRate = pct(inputs.rewardCostPct);
  const monthlyProgramCost = n(inputs.monthlyProgramCost);
  const launchCost = n(inputs.launchCost);

  const baselineMonthlyRevenue = monthlyCustomers * visitsPerMonth * avgTicket;
  const members = monthlyCustomers * adoption;
  const memberBaselineSpend = members * visitsPerMonth * avgTicket;
  const memberLiftedSpend =
    members * visitsPerMonth * (1 + visitLift) * avgTicket * (1 + spendLift);

  const incrementalMonthlyRevenue = memberLiftedSpend - memberBaselineSpend;
  const incrementalAnnualRevenue = incrementalMonthlyRevenue * 12;

  const monthlyRewardCost = incrementalMonthlyRevenue * rewardRate;
  const annualRewardCost = monthlyRewardCost * 12;
  const annualProgramCost = monthlyProgramCost * 12;

  const monthlyGrossProfitLift = incrementalMonthlyRevenue * margin;
  const netMonthlyProfit = monthlyGrossProfitLift - monthlyRewardCost - monthlyProgramCost;
  const netAnnualProfit = netMonthlyProfit * 12;

  const totalAnnualCost = annualRewardCost + annualProgramCost + launchCost;
  const roiPct = totalAnnualCost > 0 ? (netAnnualProfit / totalAnnualCost) * 100 : 0;
  const paybackMonths =
    netMonthlyProfit > 0 ? launchCost / netMonthlyProfit : launchCost === 0 ? 0 : Infinity;

  return {
    baselineMonthlyRevenue, members,
    incrementalMonthlyRevenue, incrementalAnnualRevenue,
    annualRewardCost, annualProgramCost,
    netAnnualProfit, roiPct, paybackMonths,
    engineVersion: 'v1.0-CANONICAL',
  };
}

// Works as a classic <script> (browser global) and as a Node/ESM import.
if (typeof window !== 'undefined') {
  window.LoyaltyRoiEngine = { computeLoyaltyRoi, computeCanonicalModel, computeFiveYear };
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { computeLoyaltyRoi, computeCanonicalModel, computeFiveYear };
}
