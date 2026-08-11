// Orchestration: one account in → the full pre-scope result out, and a whole
// market in → a ranked list out. This is the shape the opportunity report and
// the Horizon screens both read from.

import { computeLoyaltyROI, breakEvenCombinedLift } from './roi.js'
import { fitScore, classify, positiveRoiProbability } from './score.js'
import { segmentPrior, defaultCosts, CONSERVATIVE, CONFIDENCE_WEIGHT } from './defaults.js'

const n = (v, d = 0) => {
  const x = Number(v)
  return Number.isNaN(x) ? d : x
}

// The inputs the ROI engine needs. Anything the account doesn't supply is
// filled from the segment prior and tagged `modeled` in the provenance trail.
const INPUT_KEYS = ['aov', 'purchaseFrequency', 'grossMargin', 'aovLift', 'pfLift', 'rewardCostRate']

function resolveInputs(account) {
  const prior = segmentPrior(account.segment)
  const given = account.inputs || {}
  const provenance = { ...(account.provenance || {}) }

  const resolved = {}
  for (const key of INPUT_KEYS) {
    if (given[key] != null) {
      resolved[key] = n(given[key])
      provenance[key] = provenance[key] || 'estimate'
    } else {
      resolved[key] = prior[key]
      provenance[key] = 'modeled'
    }
  }

  // Active members: use the given number, else derive from revenue and the
  // segment's typical member share of revenue.
  if (given.activeMembers != null) {
    resolved.activeMembers = n(given.activeMembers)
    provenance.activeMembers = provenance.activeMembers || 'estimate'
  } else {
    const revenue = n(account.revenue)
    const baseline = resolved.aov * resolved.purchaseFrequency
    resolved.activeMembers = baseline > 0 ? Math.round((revenue * prior.memberRevenueShare) / baseline) : 0
    provenance.activeMembers = 'modeled'
  }

  // Program costs: given, else scaled to footprint.
  resolved.costs = given.costs || defaultCosts({ revenue: n(account.revenue), units: n(account.units) })
  if (!given.costs) provenance.costs = 'modeled'

  return { resolved, provenance }
}

// Fraction of the load-bearing inputs that are known or well-benchmarked,
// weighted by provenance level. Modeled priors count least.
function evidenceCoverage(provenance) {
  const keys = [...INPUT_KEYS, 'activeMembers']
  const weights = keys.map((k) => CONFIDENCE_WEIGHT[provenance[k]] ?? CONFIDENCE_WEIGHT.unknown)
  return weights.reduce((a, b) => a + b, 0) / weights.length
}

function evidenceRows(resolved, provenance) {
  const keys = [...INPUT_KEYS, 'activeMembers']
  return keys.map((k) => ({
    key: k,
    value: resolved[k],
    provenance: provenance[k] || 'unknown',
    confidence: CONFIDENCE_WEIGHT[provenance[k]] ?? CONFIDENCE_WEIGHT.unknown,
  }))
}

// Run the full pre-scope for a single account.
export function prescopeAccount(account = {}) {
  const { resolved, provenance } = resolveInputs(account)

  // Expected case: the resolved assumptions as-is.
  const expected = computeLoyaltyROI(resolved)

  // Conservative case: discount uplifts and trim margin. No self-selection
  // haircut is applied — the priors already represent net incremental behavior.
  const conservativeInputs = {
    ...resolved,
    aovLift: resolved.aovLift * CONSERVATIVE.upliftFactor,
    pfLift: resolved.pfLift * CONSERVATIVE.upliftFactor,
    grossMargin: Math.max(0, resolved.grossMargin + CONSERVATIVE.marginDelta),
  }
  const conservative = computeLoyaltyROI(conservativeInputs)

  const breakEven = breakEvenCombinedLift(resolved)
  const coverage = evidenceCoverage(provenance)
  const vendorFit = n(account.vendorFit, 5)

  const fit = fitScore({ expected, conservative, coverage, vendorFit })
  const verdict = classify({ expected, conservative, score: fit.score })
  const probability = positiveRoiProbability({ expected, conservative, breakEven, coverage })

  return {
    account: { name: account.name, segment: account.segment, revenue: n(account.revenue), units: n(account.units) },
    inputs: resolved,
    expected,
    conservative,
    breakEven,
    safetyMultiple: breakEven > 0 ? conservative.combinedLiftFactor / breakEven : Infinity,
    fitScore: fit.score,
    fitBreakdown: fit.breakdown,
    verdict,
    positiveRoiProbability: probability,
    evidenceCoverage: coverage,
    evidence: evidenceRows(resolved, provenance),
    vendorFit,
  }
}

// Rank a whole market. Sorted by fit score, then net contribution.
// Percentile is assigned after sorting so the report can say "Top 12%".
export function rankMarket(accounts = []) {
  const scored = accounts.map(prescopeAccount)
  scored.sort((a, b) =>
    (b.fitScore - a.fitScore) || (b.expected.netContribution - a.expected.netContribution))

  const total = scored.length
  return scored.map((r, i) => {
    const percentile = total > 1 ? (total - i) / total : 1 // 1.0 = best
    return { ...r, rank: i + 1, percentile, topPct: Math.max(1, Math.round((1 - percentile) * 100)) }
  })
}

// Portfolio summary — the "30,000 analyzed → 27 ACT NOW" line at the top of a
// vendor's pre-scope.
export function marketSummary(ranked = []) {
  const tally = { total: ranked.length, actNow: 0, watch: 0, drop: 0 }
  for (const r of ranked) {
    if (r.verdict.band === 'green') tally.actNow++
    else if (r.verdict.band === 'amber') tally.watch++
    else tally.drop++
  }
  return tally
}
