// Sourcing Rules Engine. Strict, user-controlled criteria that every candidate
// listing must pass before it enters the pipeline. Pure functions — no fetching,
// no crawling. Runs against listings you paste/import (compliant sourcing).
import { marketGate } from './reindicator.js'

export const DEFAULT_RULES = {
  approvedMarketsOnly: true,   // only Green/hunt (or manually approved) markets
  unitsMin: 40,
  unitsMax: 400,
  pricePerUnitMax: 200000,
  askingMin: 2000000,
  askingMax: 40000000,
  minRentGapPct: 0.10,         // must have >= this much rent upside
  avoidClasses: ['A', 'A-'],   // avoid luxury / already-stabilized
  staleDaysBonus: 60,          // DOM >= this = negotiable seller (informational)
  returnTopN: 5,
}

const n = (v) => { const x = Number(v); return Number.isNaN(x) ? 0 : x }

// Match a listing's market text to a known market (by name/state substring).
export function matchMarket(listing, markets) {
  const q = `${listing.market || ''}`.toLowerCase().trim()
  if (!q) return null
  return markets.find((m) =>
    q.includes(m.marketName.toLowerCase()) || m.marketName.toLowerCase().includes(q) ||
    q.includes(m.state.toLowerCase()) && q.length <= 4
  ) || markets.find((m) => q.split(/[,\/ ]+/).some((w) => w && m.marketName.toLowerCase().includes(w)))
}

export function evaluateListing(listing, rules, markets) {
  const market = matchMarket(listing, markets)
  const gate = market ? marketGate(market) : null
  const units = n(listing.units)
  const price = n(listing.price)
  const ppu = units ? price / units : 0
  const curRent = n(listing.currentRent)
  const mktRent = n(listing.marketRent)
  const gap = curRent ? (mktRent - curRent) / curRent : 0
  const cls = `${listing.class || ''}`.trim().toUpperCase()
  const dom = n(listing.dom)

  const checks = [
    { key: 'market', label: 'Approved market',
      ok: !rules.approvedMarketsOnly || (gate && gate.gate === 'hunt'),
      detail: market ? `${market.marketName} · ${gate.priority}` : 'market not matched' },
    { key: 'units', label: `Units ${rules.unitsMin}–${rules.unitsMax}`,
      ok: units >= rules.unitsMin && units <= rules.unitsMax, detail: `${units} units` },
    { key: 'ppu', label: `≤ ${fmtUsd(rules.pricePerUnitMax)}/unit`,
      ok: ppu > 0 && ppu <= rules.pricePerUnitMax, detail: `${fmtUsd(Math.round(ppu))}/unit` },
    { key: 'ask', label: `Price ${fmtUsd(rules.askingMin)}–${fmtUsd(rules.askingMax)}`,
      ok: price >= rules.askingMin && price <= rules.askingMax, detail: fmtUsd(price) },
    { key: 'rent', label: `Rent upside ≥ ${Math.round(rules.minRentGapPct * 100)}%`,
      ok: gap >= rules.minRentGapPct, detail: `${Math.round(gap * 100)}% gap` },
    { key: 'class', label: 'Not luxury / stabilized',
      ok: !cls || !rules.avoidClasses.includes(cls), detail: cls ? `class ${cls}` : 'class n/a' },
  ]
  const pass = checks.every((c) => c.ok)
  // Fit score = weighted by rent gap, price headroom, market strength (0–100).
  const rentScore = Math.min(1, Math.max(0, gap / 0.25))
  const ppuScore = ppu ? Math.min(1, Math.max(0, (rules.pricePerUnitMax - ppu) / rules.pricePerUnitMax)) : 0
  const mktScore = gate?.gate === 'hunt' ? 1 : gate?.gate === 'watch' ? 0.5 : 0.2
  const fitScore = Math.round((rentScore * 45 + ppuScore * 25 + mktScore * 30))
  const stale = dom >= rules.staleDaysBonus
  return { listing, market, checks, pass, fitScore, stale, ppu, gap }
}

export function screenListings(listings, rules, markets) {
  const results = listings.map((l) => evaluateListing(l, rules, markets))
  const passed = results.filter((r) => r.pass).sort((a, b) => b.fitScore - a.fitScore)
  const topN = passed.slice(0, rules.returnTopN)
  return { results, passed, topN }
}

// Parse a simple CSV (header row + rows). Tolerant of spaces/case in headers.
export function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/).filter((l) => l.trim())
  if (lines.length < 2) return []
  const norm = (s) => s.toLowerCase().replace(/[^a-z]/g, '')
  const headers = lines[0].split(',').map(norm)
  const map = { name: 'name', market: 'market', units: 'units', price: 'price',
    currentrent: 'currentRent', marketrent: 'marketRent', class: 'class', dom: 'dom', address: 'address' }
  return lines.slice(1).map((line) => {
    const cells = splitCsvLine(line)
    const row = {}
    headers.forEach((h, i) => { const key = map[h]; if (key) row[key] = (cells[i] || '').trim() })
    return row
  })
}
function splitCsvLine(line) {
  const out = []; let cur = ''; let q = false
  for (const ch of line) {
    if (ch === '"') q = !q
    else if (ch === ',' && !q) { out.push(cur); cur = '' }
    else cur += ch
  }
  out.push(cur)
  return out
}

export const SAMPLE_CSV = `name,market,units,price,currentRent,marketRent,class,dom
Brookhaven Flats,Huntsville,110,9350000,840,1060,C,80
Gulf Breeze Apartments,Mobile,64,7040000,910,1080,C,45
Palm Terrace,Phoenix,90,22500000,1500,1560,A,12
Riverside Court,Charleston,72,15840000,1180,1330,C,52
Tiny Cottages,Huntsville,18,2160000,700,900,C,120`

function fmtUsd(v) {
  if (v == null || Number.isNaN(v)) return '—'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0, notation: v >= 1e6 ? 'compact' : 'standard' }).format(v)
}
