// REIndicator legend + Market Gate rules.
// Version 1 statuses are approximate from screenshot review — verify before use.

export const INDICATORS = {
  green:  { key: 'green',  label: 'Continuing Emerging', sub: '3+ years',      color: '#2E7D5B', priority: 'High Priority Hunt' },
  yellow: { key: 'yellow', label: 'New Emerging',        sub: 'only 2 years',  color: '#DFFF00', priority: 'Limited Hunt' },
  turq:   { key: 'turq',   label: 'Pre-Emerging',        sub: 'early signal',  color: '#4DD6D0', priority: 'Watchlist / Early Hunt' },
  gray:   { key: 'gray',   label: 'Not Emerging',        sub: '',              color: '#64748B', priority: 'Ignore unless approved' },
  white:  { key: 'white',  label: 'Insufficient Data',   sub: '',              color: '#E5E7EB', priority: 'Manual Review' },
}

export const INDICATOR_ORDER = ['green', 'yellow', 'turq', 'gray', 'white']

// Effective gate: a manual override to "approved" promotes any market to a hunt.
export function marketGate(market) {
  const ind = INDICATORS[market.indicatorColor] || INDICATORS.white
  if (market.manualOverride === 'approved') {
    return { ...ind, priority: 'Manually Approved — Hunt', gate: 'hunt', overridden: true }
  }
  if (market.manualOverride === 'ignore') {
    return { ...ind, priority: 'Manually Ignored', gate: 'ignore', overridden: true }
  }
  const gate =
    market.indicatorColor === 'green' ? 'hunt' :
    market.indicatorColor === 'yellow' ? 'limited' :
    market.indicatorColor === 'turq' ? 'watch' :
    market.indicatorColor === 'gray' ? 'ignore' : 'review'
  return { ...ind, gate, overridden: false }
}

export const GATE_TONE = {
  hunt: 'green', limited: 'yellow', watch: 'turq', ignore: 'mist', review: 'softgray',
}
