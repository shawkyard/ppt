// Scalable "Display Data" layer system — mirrors REIndicator's layer + year
// picker, and supports MANY layer types, each with its OWN legend/buckets
// (Emerging Status, Growth Groups, Pre-Emerging Event metrics, Employment LQ,
// Growth/Risk trends).
//
// Real layers (category "Market Signal") are colored from data we have.
// Every other layer is "enterable": you fill in values by hand per market /
// year (7 at a time is fine). Until a cell is entered it shows a clearly-
// flagged DEMO color; once you set it, it's YOUR DATA and persists locally.
import { INDICATORS, INDICATOR_ORDER, marketGate } from './reindicator.js'

// Year axis (REIndicator history goes back to 1993).
export const YEAR_MIN = 1993
export const YEAR_MAX = new Date().getFullYear()
export const YEARS = Array.from({ length: YEAR_MAX - YEAR_MIN + 1 }, (_, i) => YEAR_MAX - i)

function hash(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) }
  return h >>> 0
}

// ---- Legend palettes (from REIndicator screenshots) ----------------------
const LEGENDS = {
  lq: [
    { key: 'HIGH', label: 'High', color: '#16A34A' },
    { key: 'MEDIUM', label: 'Medium', color: '#EAB308' },
    { key: 'LOW', label: 'Low', color: '#AAB2C2' },
    { key: 'NA', label: 'N/A', color: '#EDEBF2' },
  ],
  growth: [
    { key: 'superstars', label: 'Superstars', color: '#8FD98A' },
    { key: 'stars', label: 'Stars', color: '#1E7A32' },
    { key: 'moderates', label: 'Moderates', color: '#F4E63C' },
    { key: 'laggards', label: 'Laggards', color: '#F2971F' },
    { key: 'declining', label: 'Declining', color: '#3A34C4' },
    { key: 'new', label: 'New — data pending', color: '#9AA0A6' },
  ],
  count: [
    { key: 'veryhigh', label: 'Very High (7+)', color: '#D9463A' },
    { key: 'high', label: 'High (5–6)', color: '#F0936B' },
    { key: 'moderate', label: 'Moderate (3–4)', color: '#F2C94C' },
    { key: 'low', label: 'Low (1–2)', color: '#7FB77E' },
    { key: 'none', label: 'None (0)', color: '#9AA0A6' },
    { key: 'insufficient', label: 'Insufficient', color: '#EDEBF2' },
  ],
  length: [
    { key: 'high', label: 'High (>5 yrs)', color: '#F08A5D' },
    { key: 'aboveavg', label: 'Above avg (3–5)', color: '#F2C94C' },
    { key: 'nearavg', label: 'Near avg (1–3)', color: '#7FB77E' },
    { key: 'belowavg', label: 'Below avg (0–1)', color: '#D8B4E2' },
    { key: 'none', label: 'None', color: '#9AA0A6' },
    { key: 'insufficient', label: 'Insufficient', color: '#EDEBF2' },
  ],
  conversion: [
    { key: 'high', label: 'High (67–100%)', color: '#F08A5D' },
    { key: 'moderate', label: 'Moderate (34–66%)', color: '#F2C94C' },
    { key: 'low', label: 'Low (1–33%)', color: '#7FB77E' },
    { key: 'none', label: 'None (0%)', color: '#9AA0A6' },
    { key: 'na', label: 'N/A — new market', color: '#3A3A3A' },
    { key: 'insufficient', label: 'Insufficient', color: '#EDEBF2' },
  ],
}

const colorMapOf = (legend) => Object.fromEntries(legend.map((e) => [e.key, e.color]))
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

// Build an enterable layer with its own legend. Demo coloring is deterministic
// per market·layer·year so the filter system is fully functional pre-import.
function enterable(category, name, legendKey, { yearAware = true, prefix = 'lyr' } = {}) {
  const legend = LEGENDS[legendKey]
  const cmap = colorMapOf(legend)
  const keys = legend.map((e) => e.key)
  const id = `${prefix}-${slug(name)}`
  return {
    id, category, name, yearAware, demo: true, enterable: true, legend, colorMap: cmap,
    colorFor: (m, year) => cmap[keys[hash(`${id}|${year}|${m.id}`) % keys.length]],
  }
}

// ---- Real, data-backed layers -------------------------------------------
const HEX = { green: '#16A34A', yellow: '#EAB308', turq: '#0D9488', gray: '#AAB2C2', white: '#EDEBF2' }
const SIGNAL_LAYERS = [
  {
    id: 'status', category: 'Market Signal', name: 'Emerging Market Status', yearAware: false, demo: false, enterable: false,
    legend: INDICATOR_ORDER.map((k) => ({ key: k, label: INDICATORS[k].label, sub: INDICATORS[k].sub, color: INDICATORS[k].color })),
    colorFor: (m) => (INDICATORS[m.indicatorColor] || INDICATORS.white).color,
  },
  {
    id: 'priority', category: 'Market Signal', name: 'Search Priority', yearAware: false, demo: false, enterable: false,
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
    id: 'confidence', category: 'Market Signal', name: 'Data Confidence', yearAware: false, demo: false, enterable: false,
    legend: [
      { key: 'High', label: 'High confidence', color: HEX.green },
      { key: 'Medium', label: 'Medium confidence', color: HEX.yellow },
      { key: 'Needs verification', label: 'Needs verification', color: HEX.gray },
    ],
    colorFor: (m) => ({ High: HEX.green, Medium: HEX.yellow, 'Needs verification': HEX.gray }[m.confidence] || HEX.gray),
  },
]

const LQ_SECTORS = [
  'Federal Government (Civilian)', 'State & Local Government', 'Leisure & Hospitality', 'Other Services',
  'Education & Health', 'Manufacturing', 'Construction', 'Professional & Business Services', 'Information',
  'Financial Activities', 'Trade, Transport & Utilities', 'Natural Resources & Mining', 'Unclassified',
]
const TRENDS = ['Job Growth', 'Population Growth', 'Wage Growth', 'Rent Growth', 'New Supply Risk', 'Affordability']

// The SELLING feature: Emerging status by year — scrub / animate 1993→present.
// Enterable (fill in "7 at a time"); unentered cells fall back to current status
// (no invented history). colorMap uses the 5 real status colors.
const STATUS_LEGEND = INDICATOR_ORDER.map((k) => ({ key: k, label: INDICATORS[k].label, sub: INDICATORS[k].sub, color: INDICATORS[k].color }))
const STATUS_HISTORY = {
  id: 'status-history', category: 'Emerging Status History', name: 'Emerging Markets (by year)',
  yearAware: true, demo: false, enterable: true, legend: STATUS_LEGEND,
  colorMap: Object.fromEntries(INDICATOR_ORDER.map((k) => [k, INDICATORS[k].color])),
  colorFor: (m) => (INDICATORS[m.indicatorColor] || INDICATORS.white).color,
}

export const MAP_LAYERS = [
  ...SIGNAL_LAYERS,
  STATUS_HISTORY,
  enterable('Growth Groups', 'Market Growth Groups (10-yr)', 'growth', { yearAware: false, prefix: 'grp' }),
  enterable('Growth Groups', 'Growth in the 2020s', 'growth', { yearAware: false, prefix: 'grp' }),
  enterable('Emerging Events', 'Count of Pre-Emerging Events', 'count', { prefix: 'evt' }),
  enterable('Emerging Events', 'Average Length of Emerging Events', 'length', { prefix: 'evt' }),
  enterable('Emerging Events', '% Pre-Emerging → Emerging', 'conversion', { prefix: 'evt' }),
  ...LQ_SECTORS.map((s) => enterable('Employment (Location Quotient)', `LQ ${s}`, 'lq', { prefix: 'lq' })),
  ...TRENDS.map((s) => enterable('Growth & Risk Trends', s, 'lq', { prefix: 'trend' })),
]

export const CATEGORIES = ['Market Signal', 'Emerging Status History', 'Growth Groups', 'Emerging Events', 'Employment (Location Quotient)', 'Growth & Risk Trends']
export const layersInCategory = (cat) => MAP_LAYERS.filter((l) => l.category === cat)
export const getLayer = (id) => MAP_LAYERS.find((l) => l.id === id) || MAP_LAYERS[0]
