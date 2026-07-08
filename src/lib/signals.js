// Deal Signals & Outreach — the "seller motivation" engine (apartment analogue
// of a recruiter's contractor-demand signals). Pure functions. Some signals are
// auto-derived from data we have; others are entered manually. Live signal feeds
// (permits, tax records, CMBS maturities, DOM scrapes) are a V2 connector.
import { pct } from './format.js'

export const SIGNALS = [
  { key: 'stale', label: 'Stale listing (90+ days)', weight: 3, auto: true },
  { key: 'highVacancy', label: 'High vacancy', weight: 2, auto: true },
  { key: 'bigRentGap', label: 'Large rent gap (20%+)', weight: 1, auto: true },
  { key: 'priceCut', label: 'Recent price cut', weight: 3 },
  { key: 'deferredMaintenance', label: 'Heavy deferred maintenance', weight: 2 },
  { key: 'absentee', label: 'Absentee / out-of-state owner', weight: 2 },
  { key: 'distress', label: 'Financial distress / partnership split', weight: 3 },
  { key: 'loanMaturity', label: 'Loan maturing < 18 months', weight: 3 },
  { key: 'taxCode', label: 'Tax delinquency / code violations', weight: 2 },
  { key: 'bringOffers', label: 'Broker: “bring offers” / negotiable', weight: 2 },
  { key: 'relisted', label: 'Relisted / failed prior sale', weight: 2 },
  { key: 'receivership', label: 'Receivership / pre-foreclosure', weight: 3 },
]
export const AUTO_KEYS = SIGNALS.filter((s) => s.auto).map((s) => s.key)
export const byKey = Object.fromEntries(SIGNALS.map((s) => [s.key, s]))

export function deriveAuto(p) {
  const s = new Set()
  if ((p.listingAgeDays || 0) >= 90) s.add('stale')
  if ((p.deal?.current?.occupancy ?? 1) <= 0.88) s.add('highVacancy')
  if ((p.deal?.rentGapPct ?? 0) >= 0.20) s.add('bigRentGap')
  return s
}
export function activeSignals(p) {
  return new Set([...deriveAuto(p), ...(p.signals || [])])
}
export function motivationScore(p) {
  const active = activeSignals(p)
  let weight = 0
  for (const s of SIGNALS) if (active.has(s.key)) weight += s.weight
  const score = weight >= 10 ? 5 : weight >= 7 ? 4 : weight >= 4 ? 3 : weight >= 2 ? 2 : 1
  return { score, weight, active }
}
export function topSignals(p) {
  const { active } = motivationScore(p)
  return SIGNALS.filter((s) => active.has(s.key)).sort((a, b) => b.weight - a.weight)
}
export const MOTIVATION_TONE = { 5: 'red', 4: 'red', 3: 'yellow', 2: 'mist', 1: 'mist' }
export const MOTIVATION_LABEL = { 5: 'Very high', 4: 'High', 3: 'Moderate', 2: 'Low', 1: 'Cold' }

export const CONTACT_ROLES = [
  { key: 'broker', label: 'Listing broker' },
  { key: 'owner', label: 'Owner / principal' },
  { key: 'assetManager', label: 'Asset manager' },
  { key: 'lender', label: 'Lender / special servicer' },
  { key: 'propertyManager', label: 'Property manager' },
]

export function buildOutreach(p, { fundName = 'Stonebrook Multifamily', investorName = 'Scott & Alma' } = {}) {
  const c = p.contacts || {}
  const to = firstName(c.broker) || firstName(c.owner) || 'there'
  const market = p.market?.marketName || 'this market'
  const top = topSignals(p)
  const signalLine = top.length
    ? `We noticed ${top.slice(0, 2).map((s) => s.label.toLowerCase()).join(' and ')} — often a sign the timing is right for a clean sale.`
    : `The asset looks like a fit for our value-add box.`
  const gap = pct(p.deal?.rentGapPct ?? 0, 0)
  return [
    `Subject: ${p.name} — ${p.city} · value-add buyer, quick close`,
    ``,
    `Hi ${to},`,
    ``,
    `We're an active value-add multifamily buyer focused on ${market} and similar emerging markets. ${p.name} fits our box: a ${p.propertyClass}-class, ${p.units}-unit asset in a ${p.areaClass}-area with real upside — current rents run about ${gap} under market.`,
    ``,
    `${signalLine} We underwrite to a realistic 18–24 month plan (not a broker pro forma), so our offers hold up in diligence and we can move fast with certainty of close.`,
    ``,
    `Could you send the T-12 and current rent roll so we can firm up a number this week? Happy to sign an NDA and share proof of funds.`,
    ``,
    `Best,`,
    `${investorName}`,
    `${fundName}`,
  ].join('\n')
}

function firstName(full) {
  if (!full) return ''
  return String(full).trim().split(/\s+/)[0]
}
