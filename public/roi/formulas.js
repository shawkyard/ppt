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

// Works as a classic <script> (browser global) and as a Node/ESM import.
if (typeof window !== 'undefined') {
  window.LoyaltyRoiEngine = { computeLoyaltyRoi };
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { computeLoyaltyRoi };
}
