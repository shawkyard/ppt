/*
 * Loyalty Program ROI Engine
 * ==========================
 * ENGINE VERSION: v0.1-PLACEHOLDER
 *
 * ⚠️  These are PLACEHOLDER formulas using standard loyalty-economics math.
 *     They exist so the widget, embed flow, and white-label demo can be
 *     tested end-to-end. The proprietary formulas (from the owner's Excel
 *     models) replace the body of `computeLoyaltyRoi` below. Nothing else
 *     in the product needs to change when that happens — the UI and API
 *     talk only to this one function.
 *
 * Contract:
 *   computeLoyaltyRoi(inputs) -> outputs
 *   All money values are plain numbers in dollars. All *Pct inputs are
 *   percentages as entered by the user (e.g. 35 means 35%), converted to
 *   fractions internally.
 */

/**
 * @typedef {Object} RoiInputs
 * @property {number} monthlyCustomers   Unique active customers per month
 * @property {number} avgTicket          Average transaction value ($)
 * @property {number} visitsPerMonth     Average visits per customer per month
 * @property {number} grossMarginPct     Gross margin on sales (%)
 * @property {number} memberAdoptionPct  Share of customers who join the program (%)
 * @property {number} visitLiftPct       Visit-frequency lift among members (%)
 * @property {number} spendLiftPct       Ticket-size lift among members (%)
 * @property {number} rewardCostPct      Reward/redemption cost as % of member spend
 * @property {number} monthlyProgramCost Software/vendor fee per month ($)
 * @property {number} launchCost         One-time setup cost ($), may be 0
 */

/**
 * @typedef {Object} RoiOutputs
 * @property {number} baselineMonthlyRevenue
 * @property {number} members                     Members enrolled (count)
 * @property {number} incrementalMonthlyRevenue   New revenue created by the program / month
 * @property {number} incrementalAnnualRevenue
 * @property {number} annualRewardCost
 * @property {number} annualProgramCost           Software fees x12 (excludes launch)
 * @property {number} netAnnualProfit             Gross profit on lift − rewards − fees
 * @property {number} roiPct                      Net annual profit / total annual cost
 * @property {number} paybackMonths               Months to recover launch + fees; Infinity if never
 * @property {string} engineVersion
 */

/**
 * @param {RoiInputs} inputs
 * @returns {RoiOutputs}
 */
function computeLoyaltyRoi(inputs) {
  const n = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);
  const pct = (v) => n(v) / 100;

  const monthlyCustomers = n(inputs.monthlyCustomers);
  const avgTicket = n(inputs.avgTicket);
  const visitsPerMonth = n(inputs.visitsPerMonth);
  const margin = pct(inputs.grossMarginPct);
  const adoption = pct(inputs.memberAdoptionPct);
  const visitLift = pct(inputs.visitLiftPct);
  const spendLift = pct(inputs.spendLiftPct);
  const rewardCost = pct(inputs.rewardCostPct);
  const monthlyProgramCost = n(inputs.monthlyProgramCost);
  const launchCost = n(inputs.launchCost);

  const baselineMonthlyRevenue = monthlyCustomers * visitsPerMonth * avgTicket;

  const members = monthlyCustomers * adoption;
  const memberBaselineSpend = members * visitsPerMonth * avgTicket;
  const memberLiftedSpend =
    members * visitsPerMonth * (1 + visitLift) * avgTicket * (1 + spendLift);

  const incrementalMonthlyRevenue = memberLiftedSpend - memberBaselineSpend;
  const incrementalAnnualRevenue = incrementalMonthlyRevenue * 12;

  const monthlyRewardCost = memberLiftedSpend * rewardCost;
  const annualRewardCost = monthlyRewardCost * 12;
  const annualProgramCost = monthlyProgramCost * 12;

  const monthlyGrossProfitLift = incrementalMonthlyRevenue * margin;
  const netMonthlyProfit =
    monthlyGrossProfitLift - monthlyRewardCost - monthlyProgramCost;
  const netAnnualProfit = netMonthlyProfit * 12;

  const totalAnnualCost = annualRewardCost + annualProgramCost + launchCost;
  const roiPct = totalAnnualCost > 0 ? (netAnnualProfit / totalAnnualCost) * 100 : 0;

  const paybackMonths =
    netMonthlyProfit > 0 ? launchCost / netMonthlyProfit : launchCost === 0 ? 0 : Infinity;

  return {
    baselineMonthlyRevenue,
    members,
    incrementalMonthlyRevenue,
    incrementalAnnualRevenue,
    annualRewardCost,
    annualProgramCost,
    netAnnualProfit,
    roiPct,
    paybackMonths,
    engineVersion: 'v0.1-PLACEHOLDER',
  };
}

/*
 * Full wizard model (BBP ROI Modeling flow).
 * Step order: Baseline → Loyalty Assumptions → Costs & TCO → 5-Year Outlook → Executive Report.
 *
 * ⚠️  PLACEHOLDER math, same contract rule as above: the proprietary Excel
 *     formulas replace the body of `computeWizardModel`; the wizard UI only
 *     reads the returned fields.
 *
 * Invariants the UI relies on (keep these when swapping formulas in):
 *  - No output is ever NaN; division guards return 0.
 *  - paybackMonths is Infinity when the program never pays back.
 *  - totalCustomers = annualRevenue / (aov × purchaseFrequency).
 *  - aovIncremental + freqIncremental === grossIncrementalRevenue (year 1).
 */

/**
 * @typedef {Object} WizardInputs
 * Baseline:
 * @property {number} annualRevenue        Merchant annual revenue ($)
 * @property {number} aov                  Average order value ($)
 * @property {number} purchaseFrequency   Purchases per customer per YEAR
 * Loyalty assumptions:
 * @property {number} enrollmentRatePct   % of customers who enroll
 * @property {number} activeRatePct       % of enrolled who stay active
 * @property {number} aovLiftPct          AOV lift among active members (%)
 * @property {number} freqLiftPct         Frequency lift among active members (%)
 * Costs & TCO:
 * @property {number} softwareCost        Software/ARR per year ($)
 * @property {number} setupFees           One-time ($)
 * @property {number} implementation      One-time ($)
 * @property {number} marketingCost       Per year ($)
 * @property {number} laborCost           Per year ($)
 * @property {number} miscCost            Per year ($)
 * @property {number} rewardsCostPct      Rewards as % of active-member (lifted) spend
 * Outlook:
 * @property {number} peakEnrollmentYear  Year enrollment reaches target (1-5)
 * @property {number} retentionRatePct    Enrolled members retained year over year (%)
 */
function computeWizardModel(inputs) {
  const n = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);
  const pct = (v) => n(v) / 100;
  const div = (a, b) => (b > 0 ? a / b : 0);

  const annualRevenue = n(inputs.annualRevenue);
  const aov = n(inputs.aov);
  const freq = n(inputs.purchaseFrequency);
  const enrollRate = pct(inputs.enrollmentRatePct);
  const activeRate = pct(inputs.activeRatePct);
  const aovLift = pct(inputs.aovLiftPct);
  const freqLift = pct(inputs.freqLiftPct);
  const rewardsRate = pct(inputs.rewardsCostPct);

  const oneTimeCost = n(inputs.setupFees) + n(inputs.implementation);
  const recurringCost =
    n(inputs.softwareCost) + n(inputs.marketingCost) + n(inputs.laborCost) + n(inputs.miscCost);

  const peakYear = Math.min(5, Math.max(1, Math.round(n(inputs.peakEnrollmentYear) || 1)));
  const retention = Math.min(1, Math.max(0, pct(inputs.retentionRatePct ?? 100)));

  // --- Baseline ---
  const totalCustomers = div(annualRevenue, aov * freq);

  // --- Funnel (steady state, year 1 at full ramp) ---
  const enrolledTarget = totalCustomers * enrollRate;
  const activeTarget = enrolledTarget * activeRate;

  // Per-active-member spend
  const baseSpendPerActive = aov * freq;
  const liftedSpendPerActive = aov * (1 + aovLift) * freq * (1 + freqLift);
  const incrementalPerActive = liftedSpendPerActive - baseSpendPerActive;

  // Year-1 incremental revenue breakdown (at target funnel)
  const activeBaseRevenue = activeTarget * baseSpendPerActive;
  const aovIncremental = activeBaseRevenue * aovLift;
  const freqIncremental = activeBaseRevenue * freqLift * (1 + aovLift);
  const grossIncrementalRevenue = activeBaseRevenue * ((1 + aovLift) * (1 + freqLift) - 1);

  // --- 5-year projection ---
  // Enrollment ramps linearly to target by peakYear, then holds; retention
  // shrinks the standing base each year after peak (placeholder dynamics).
  const years = [];
  let cumNet = 0;
  let cumCosts = 0;
  let cumIncRevenue = 0;
  for (let t = 1; t <= 5; t++) {
    const ramp = Math.min(t / peakYear, 1);
    const retentionFactor = t > peakYear ? Math.pow(retention, t - peakYear) : 1;
    const active = activeTarget * ramp * retentionFactor;
    const incRevenue = active * incrementalPerActive;
    const memberLiftedRevenue = active * liftedSpendPerActive;
    const rewardsCost = memberLiftedRevenue * rewardsRate;
    const programCosts = recurringCost + rewardsCost + (t === 1 ? oneTimeCost : 0);
    const netProfit = incRevenue - programCosts;
    cumNet += netProfit;
    cumCosts += programCosts;
    cumIncRevenue += incRevenue;
    years.push({
      year: t,
      activeMembers: active,
      revPerMember: active > 0 ? liftedSpendPerActive : 0,
      incRevenue,
      programCosts,
      netProfit,
      annualRoiPct: div(netProfit, programCosts) * 100,
      cumRoiPct: div(cumNet, cumCosts) * 100,
    });
  }

  // Payback: walk months assuming each year's net accrues evenly.
  let paybackMonths = Infinity;
  let running = 0;
  for (const y of years) {
    const monthly = y.netProfit / 12;
    for (let m = 1; m <= 12; m++) {
      running += monthly;
      if (running >= 0 && y.netProfit > 0) {
        paybackMonths = (y.year - 1) * 12 + m;
        break;
      }
    }
    if (paybackMonths !== Infinity) break;
  }
  if (cumNet <= 0) paybackMonths = Infinity;

  const year1 = years[0];
  const totalInvestmentYear1 = year1.programCosts;

  return {
    // Baseline
    totalCustomers,
    baselineRevenue: annualRevenue,
    // Funnel
    enrolledMembers: enrolledTarget,
    activeMembers: activeTarget,
    // Year-1 revenue breakdown
    aovIncremental,
    freqIncremental,
    grossIncrementalRevenue,
    // Headline KPIs
    totalInvestmentYear1,
    annualProfitImpact: year1.netProfit,
    netValueCreated5yr: cumNet,
    roiMultiplePct: div(cumNet, cumCosts) * 100,
    paybackMonths,
    cumIncRevenue5yr: cumIncRevenue,
    cumCosts5yr: cumCosts,
    // Projection table
    years,
    engineVersion: 'v0.2-PLACEHOLDER',
  };
}

// Works as a classic <script> (browser global) and as a Node/ESM import.
if (typeof window !== 'undefined') {
  window.LoyaltyRoiEngine = { computeLoyaltyRoi, computeWizardModel };
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { computeLoyaltyRoi, computeWizardModel };
}
