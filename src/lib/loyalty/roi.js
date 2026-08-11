// Loyalty ROI math. Pure functions — no side effects, no formatting.
// This is the honest engine: incremental revenue is the FULL behavioral lift
// (basket term + frequency term + their interaction), never the interaction
// term alone. Benefit-cost and net ROI are reported as separate, labelled
// quantities. Every formula here maps directly to the Alma opportunity report.

const n = (v, d = 0) => {
  const x = Number(v)
  return Number.isNaN(x) ? d : x
}

// One assumption set in → the full annual bridge out.
// inputs: { aov, purchaseFrequency, activeMembers, grossMargin,
//           aovLift, pfLift, rewardCostRate, costs:{software,labor,marketing,misc} }
export function computeLoyaltyROI(inputs = {}) {
  const aov = n(inputs.aov)
  const pf = n(inputs.purchaseFrequency)
  const members = n(inputs.activeMembers)
  const margin = n(inputs.grossMargin, 0.3)
  const aovLift = n(inputs.aovLift)
  const pfLift = n(inputs.pfLift)
  const rewardRate = n(inputs.rewardCostRate)

  const costs = inputs.costs || {}
  const software = n(costs.software)
  const labor = n(costs.labor)
  const marketing = n(costs.marketing)
  const misc = n(costs.misc)
  const fixedCost = software + labor + marketing + misc

  const baselineSpendPerMember = aov * pf
  const newSpendPerMember = aov * (1 + aovLift) * pf * (1 + pfLift)

  // The three components of the behavioral lift. They SUM to the true increment.
  // This is the exact bug the old spreadsheet had — it kept only `interaction`.
  const terms = {
    aov: baselineSpendPerMember * aovLift,
    frequency: baselineSpendPerMember * pfLift,
    interaction: baselineSpendPerMember * aovLift * pfLift,
  }
  const combinedLiftFactor = (1 + aovLift) * (1 + pfLift) - 1 // = aovLift + pfLift + aovLift*pfLift
  const incPerMember = terms.aov + terms.frequency + terms.interaction

  const baselineMemberRevenue = members * baselineSpendPerMember // "B"
  const memberSpendAfter = members * newSpendPerMember
  const incrementalRevenue = members * incPerMember
  const incrementalGrossProfit = incrementalRevenue * margin

  const rewards = memberSpendAfter * rewardRate
  const totalCost = rewards + fixedCost
  const netContribution = incrementalGrossProfit - totalCost

  const benefitCostRatio = totalCost > 0 ? incrementalGrossProfit / totalCost : 0
  const netROI = totalCost > 0 ? (incrementalGrossProfit - totalCost) / totalCost : 0
  // Months of incremental gross profit needed to cover one year of program cost.
  const paybackMonths = incrementalGrossProfit > 0 ? (totalCost / (incrementalGrossProfit / 12)) : Infinity

  return {
    baselineSpendPerMember, newSpendPerMember,
    combinedLiftFactor, terms, incPerMember,
    baselineMemberRevenue, memberSpendAfter,
    incrementalRevenue, incrementalGrossProfit,
    cost: { rewards, software, labor, marketing, misc, total: totalCost },
    netContribution, benefitCostRatio, netROI, paybackMonths,
  }
}

// The combined lift at which incremental gross profit exactly covers total cost.
// Solved in closed form so it needs no search:
//   B*margin*L = fixed + rewardRate*B*(1+L)
//   L = (fixed + rewardRate*B) / (B*(margin - rewardRate))
export function breakEvenCombinedLift(inputs = {}) {
  const aov = n(inputs.aov)
  const pf = n(inputs.purchaseFrequency)
  const members = n(inputs.activeMembers)
  const margin = n(inputs.grossMargin, 0.3)
  const rewardRate = n(inputs.rewardCostRate)
  const costs = inputs.costs || {}
  const fixedCost = n(costs.software) + n(costs.labor) + n(costs.marketing) + n(costs.misc)

  const B = members * aov * pf
  const denom = B * (margin - rewardRate)
  if (denom <= 0) return Infinity // rewards eat the margin — no lift can rescue it
  return (fixedCost + rewardRate * B) / denom
}
