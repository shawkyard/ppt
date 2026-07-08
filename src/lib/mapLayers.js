// "Display Data" map layers — like REIndicator's layer switcher. Selecting a
// layer changes the corner label, the legend, and how market bubbles are colored.
//
// Version 1 only exposes layers we can color TRUTHFULLY from data we actually
// have (emerging status, search priority, confidence). Real employment / LQ
// sector layers (Federal Gov, Leisure & Hospitality, etc.) require a live data
// feed and are listed as locked V2 layers — we do not invent those numbers.
import { INDICATORS, INDICATOR_ORDER, marketGate } from './reindicator.js'

const HEX = { green: '#16A34A', yellow: '#EAB308', turq: '#0D9488', gray: '#AAB2C2', white: '#D9D5E6', red: '#DC2626' }

export const MAP_LAYERS = [
  {
    id: 'status',
    name: 'Emerging Market Status',
    legend: INDICATOR_ORDER.map((k) => ({ key: k, label: INDICATORS[k].label, sub: INDICATORS[k].sub, color: INDICATORS[k].color })),
    colorFor: (m) => (INDICATORS[m.indicatorColor] || INDICATORS.white).color,
  },
  {
    id: 'priority',
    name: 'Search Priority',
    legend: [
      { key: 'hunt', label: 'High Priority Hunt', color: HEX.green },
      { key: 'limited', label: 'Limited Hunt', color: HEX.yellow },
      { key: 'watch', label: 'Watchlist / Early', color: HEX.turq },
      { key: 'ignore', label: 'Ignore unless approved', color: HEX.gray },
      { key: 'review', label: 'Manual Review', color: HEX.white },
    ],
    colorFor: (m) => {
      const g = (m.gate || marketGate(m)).gate
      return { hunt: HEX.green, limited: HEX.yellow, watch: HEX.turq, ignore: HEX.gray, review: HEX.white }[g] || HEX.white
    },
  },
  {
    id: 'confidence',
    name: 'Data Confidence',
    legend: [
      { key: 'High', label: 'High confidence', color: HEX.green },
      { key: 'Medium', label: 'Medium confidence', color: HEX.yellow },
      { key: 'Needs verification', label: 'Needs verification', color: HEX.gray },
    ],
    colorFor: (m) => ({ High: HEX.green, Medium: HEX.yellow, 'Needs verification': HEX.gray }[m.confidence] || HEX.gray),
  },
]

// Shown in the layer picker but not selectable — needs a live data feed.
export const LOCKED_LAYERS = [
  'LQ Federal Government (Civilian)',
  'LQ State & Local Government',
  'LQ Leisure & Hospitality',
  'LQ Other Services',
  'Job Growth', 'Population Growth', 'Rent Growth', 'New Supply Risk',
]

export const getLayer = (id) => MAP_LAYERS.find((l) => l.id === id) || MAP_LAYERS[0]
