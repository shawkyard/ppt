// Scalable "Display Data" layer system — like REIndicator's layer + year picker.
// A layer is chosen by Category → Layer → Year. Selecting one changes the map's
// corner label, legend, and bubble colors.
//
// TWO kinds of layers:
//  1) REAL (category "Market Signal") — colored truthfully from data we have.
//  2) DEMO (Employment LQ + Growth/Risk trends, year-aware 1993–present) —
//     placeholder HIGH/MEDIUM/LOW/N/A coloring so the filtering system is fully
//     functional. These are clearly flagged `demo:true`; drop real values into
//     `DEMO_DATA_HOOK` (or replace colorFor) when you import them. We do NOT
//     present invented numbers as real.
import { INDICATORS, INDICATOR_ORDER, marketGate } from './reindicator.js'

const HEX = { green: '#16A34A', yellow: '#EAB308', turq: '#0D9488', gray: '#AAB2C2', white: '#EDEBF2' }

// LQ legend matches REIndicator: HIGH / MEDIUM / LOW / N/A
const LQ_LEGEND = [
  { key: 'HIGH', label: 'High', color: HEX.green },
  { key: 'MEDIUM', label: 'Medium', color: HEX.yellow },
  { key: 'LOW', label: 'Low', color: HEX.gray },
  { key: 'NA', label: 'N/A', color: HEX.white },
]
const LQ_COLOR = { HIGH: HEX.green, MEDIUM: HEX.yellow, LOW: HEX.gray, NA: HEX.white }

// Year axis (matches REIndicator history back to 1993).
export const YEAR_MIN = 1993
export const YEAR_MAX = new Date().getFullYear()
export const YEARS = Array.from({ length: YEAR_MAX - YEAR_MIN + 1 }, (_, i) => YEAR_MAX - i)

// Deterministic bucket so demo layers are stable and vary by layer + year.
function hash(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) }
  return h >>> 0
}
// Override hook: DEMO_DATA_HOOK[layerId]?.[year]?.[marketId] = 'HIGH'|'MEDIUM'|'LOW'|'NA'
export const DEMO_DATA_HOOK = {}
function demoBucket(layerId, year, m) {
  const real = DEMO_DATA_HOOK[layerId]?.[year]?.[m.id]
  if (real) return real
  const r = hash(`${layerId}|${year}|${m.id}`) % 100
  if (r < 24) return 'HIGH'
  if (r < 62) return 'MEDIUM'
  if (r < 90) return 'LOW'
  return 'NA'
}

// ---- Real, data-backed layers -------------------------------------------
const SIGNAL_LAYERS = [
  {
    id: 'status', category: 'Market Signal', name: 'Emerging Market Status', yearAware: false, demo: false,
    legend: INDICATOR_ORDER.map((k) => ({ key: k, label: INDICATORS[k].label, sub: INDICATORS[k].sub, color: INDICATORS[k].color })),
    colorFor: (m) => (INDICATORS[m.indicatorColor] || INDICATORS.white).color,
  },
  {
    id: 'priority', category: 'Market Signal', name: 'Search Priority', yearAware: false, demo: false,
    legend: [
      { key: 'hunt', label: 'High Priority Hunt', color: HEX.green },
      { key: 'limited', label: 'Limited Hunt', color: HEX.yellow },
      { key: 'watch', label: 'Watchlist / Early', color: HEX.turq },
      { key: 'ignore', label: 'Ignore unless approved', color: HEX.gray },
      { key: 'review', label: 'Manual Review', color: HEX.white },
    ],
    colorFor: (m) => ({ hunt: HEX.green, limited: HEX.yellow, watch: HEX.turq, ignore: HEX.gray, review: HEX.white }[(m.gate || marketGate(m)).gate] || HEX.white),
  },
  {
    id: 'confidence', category: 'Market Signal', name: 'Data Confidence', yearAware: false, demo: false,
    legend: [
      { key: 'High', label: 'High confidence', color: HEX.green },
      { key: 'Medium', label: 'Medium confidence', color: HEX.yellow },
      { key: 'Needs verification', label: 'Needs verification', color: HEX.gray },
    ],
    colorFor: (m) => ({ High: HEX.green, Medium: HEX.yellow, 'Needs verification': HEX.gray }[m.confidence] || HEX.gray),
  },
]

// ---- Demo, year-aware layers (import real values later) ------------------
const LQ_SECTORS = [
  'Federal Government (Civilian)', 'State & Local Government', 'Leisure & Hospitality', 'Other Services',
  'Education & Health', 'Manufacturing', 'Construction', 'Professional & Business Services', 'Information',
  'Financial Activities', 'Trade, Transport & Utilities', 'Natural Resources & Mining', 'Unclassified',
]
const TRENDS = ['Job Growth', 'Population Growth', 'Wage Growth', 'Rent Growth', 'New Supply Risk', 'Affordability']

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
function demoLayer(category, name, prefix) {
  const id = `${prefix}-${slug(name)}`
  return {
    id, category, name: category === 'Employment (Location Quotient)' ? `LQ ${name}` : name,
    yearAware: true, demo: true, legend: LQ_LEGEND,
    colorFor: (m, year) => LQ_COLOR[demoBucket(id, year, m)],
  }
}

export const MAP_LAYERS = [
  ...SIGNAL_LAYERS,
  ...LQ_SECTORS.map((s) => demoLayer('Employment (Location Quotient)', s, 'lq')),
  ...TRENDS.map((s) => demoLayer('Growth & Risk Trends', s, 'trend')),
]

export const CATEGORIES = ['Market Signal', 'Employment (Location Quotient)', 'Growth & Risk Trends']
export const layersInCategory = (cat) => MAP_LAYERS.filter((l) => l.category === cat)
export const getLayer = (id) => MAP_LAYERS.find((l) => l.id === id) || MAP_LAYERS[0]
