// Source levels + provenance labels. Every underwriting input can be tagged so
// Scott & Alma always know how solid a number is.

export const SOURCE_LEVELS = [
  { level: 1, key: 'listing', label: 'Listing Only', desc: 'Public listing data only — treat with caution.' },
  { level: 2, key: 'listing-ext', label: 'Listing + External Research', desc: 'Listing plus independent research/comps.' },
  { level: 3, key: 'om', label: 'OM / Broker Package', desc: 'Offering memorandum / broker package received.' },
  { level: 4, key: 'full', label: 'Full Operating Package', desc: 'OM + rent roll + T12 + operating detail.' },
]

// Provenance tags shown next to individual figures.
export const SOURCE_LABELS = {
  OM: { code: 'OM', name: 'Offering memorandum', tone: 'gold' },
  RR: { code: 'RR', name: 'Rent roll', tone: 'gold' },
  T12: { code: 'T12', name: 'T12 financials', tone: 'gold' },
  BR: { code: 'BR', name: 'Broker claim', tone: 'yellow' },
  EXT: { code: 'EXT', name: 'External research', tone: 'turq' },
  ASM: { code: 'ASM', name: 'Assumption', tone: 'mist' },
  CALC: { code: 'CALC', name: 'Calculated', tone: 'turq' },
  USER: { code: 'USER', name: 'User entered', tone: 'green' },
  MISS: { code: 'MISS', name: 'Missing', tone: 'red' },
  NT: { code: 'NT', name: 'Needs testing', tone: 'red' },
}

export const sourceLevel = (key) => SOURCE_LEVELS.find((s) => s.key === key) || SOURCE_LEVELS[0]
