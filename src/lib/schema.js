// Default ("illustrative") inputs mirroring the Stonebrook RV Park & Destination
// Resort 10-Year Underwriting Model. Every value here is an unsourced default and
// is labeled as an assumption until a document or the reviewer overrides it.

export const SCENARIOS = ['current', 'proforma', 'target']
export const SCENARIO_LABEL = {
  current: 'Current / Reality',
  proforma: 'Seller Pro Forma',
  target: 'Our Target Plan',
}

// Provenance labels drawn from the master-prompt truth rules.
export const PROVENANCE = {
  verified: { label: 'Verified actual', tone: 'good' },
  reported: { label: 'Reported / from docs', tone: 'info' },
  seller: { label: 'Seller / broker claim', tone: 'warn' },
  market: { label: 'Market-supported', tone: 'info' },
  estimated: { label: 'Estimated', tone: 'estimate' },
  assumption: { label: 'Assumption (default)', tone: 'assume' },
  calculated: { label: 'Calculated', tone: 'muted' },
  missing: { label: 'Missing', tone: 'bad' },
}

// Confirmation-step modes and how they map to a stored provenance source.
export const MODE_SOURCE = {
  read: 'reported',      // extracted from docs, confident
  unsure: 'seller',      // read but low confidence — verify
  estimated: 'estimated', // derived from other factors
  manual: 'verified',    // user typed / confirmed
  default: 'assumption', // untouched illustrative default
}

function scen(current, proforma, target) {
  return { current, proforma, target }
}

// ---- Default input set (illustrative $7.0M destination RV resort) ----
export function defaultInputs() {
  return {
    propertyName: 'Illustrative Destination RV Resort',
    location: 'Replace with property address',
    state: '',
    archetype: 'Destination family resort',

    // Property & acquisition (scalars)
    existingSites: 120,
    purchasePrice: 7_000_000,
    fullBuildSites: 210,
    expansionAcres: 20,
    exitCap: 0.08,
    sellingCosts: 0.02,

    // Debt
    ltv: 0.75,
    interestRate: 0.07,
    amortYears: 25,
    ioYears: 0,
    loanTermYears: 10,

    // Equity-funded costs, escrows & syndication
    closingPct: 0.025,
    acqFeePct: 0.01,
    financingPct: 0.01,
    repairEscrow: 150_000,
    expansionEscrow: 2_700_000,
    amenityCapex: 2_300_000,
    operatingReserve: 800_000,
    taxReserve: 75_000,
    insuranceReserve: 100_000,
    assetMgmtFeePct: 0.01,
    outsideEquityPct: 0.8,
    outsideDistPct: 0.8,
    reservePerSite: 600,

    // Trifecta thresholds
    gates: {
      minCoC: 0.12, minDSCR: 1.4, minCap: 0.07,
      prefCoC: 0.15, prefDSCR: 1.6, prefCap: 0.08,
      strikeCoC: 0.2, strikeDSCR: 1.6, strikeCap: 0.08, strikeSites: 200,
    },

    // Three-scenario operating assumptions
    op: {
      y1Occ: scen(0.65, 0.72, 0.6),
      y2Occ: scen(0.66, 0.74, 0.72),
      y3Occ: scen(0.67, 0.75, 0.82),
      y4Occ: scen(0.68, 0.76, 0.84),
      y1Rate: scen(650, 800, 700),
      y2Rate: scen(660, 825, 780),
      rateGrowth: scen(0.02, 0.025, 0.03),
      y1Anc: scen(200_000, 300_000, 300_000),
      y2Anc: scen(205_000, 330_000, 450_000),
      ancGrowth: scen(0.02, 0.025, 0.03),
      y1OpEx: scen(700_000, 800_000, 900_000),
      opexGrowth: scen(0.03, 0.035, 0.05),
      mgmtFeePct: scen(0.04, 0.04, 0.04),
      y1Draw: scen(0, 0, 2_700_000),
      y2Draw: scen(0, 0, 2_300_000),
      y3Draw: scen(0, 0, 0),
    },

    // Non-management expense allocation (shares of Year-1 OpEx)
    alloc: {
      payroll: scen(0.25, 0.25, 0.25),
      grounds: scen(0.15, 0.15, 0.15),
      utilities: scen(0.15, 0.15, 0.15),
      taxes: scen(0.15, 0.15, 0.15),
      insurance: scen(0.1, 0.1, 0.1),
      resfees: scen(0.08, 0.08, 0.08),
      marketing: scen(0.05, 0.05, 0.05),
      cogs: scen(0.05, 0.05, 0.05),
      admin: scen(0.02, 0.02, 0.02),
    },

    // Full-build site & accommodation mix
    mix: {
      longTermPads: scen(50, 55, 70),
      stdTransient: scen(70, 75, 100),
      premium: scen(0, 5, 20),
      tentGlamp: scen(0, 5, 20),
      cabins: scen(4, 6, 8),
      parkModel: scen(0, 2, 10),
      groupHomes: scen(0, 0, 4),
      storage: scen(40, 60, 80),
    },

    // Year-3 revenue engine
    rev: {
      ltRate: scen(600, 700, 750),
      ltOcc: scen(0.85, 0.9, 0.9),
      stdADR: scen(45, 55, 60),
      stdOcc: scen(0.3, 0.4, 0.45),
      premADR: scen(75, 85, 90),
      premOcc: scen(0.4, 0.5, 0.55),
      tentADR: scen(30, 35, 35),
      tentOcc: scen(0.2, 0.25, 0.3),
      cabinADR: scen(100, 120, 125),
      cabinOcc: scen(0.3, 0.4, 0.4),
      pmADR: scen(150, 150, 175),
      pmOcc: scen(0.35, 0.4, 0.5),
      groupADR: scen(225, 225, 250),
      groupOcc: scen(0.35, 0.4, 0.45),
      storageRate: scen(70, 70, 70),
      storageOcc: scen(0.75, 0.75, 0.75),
      store: scen(140_000, 160_000, 250_000),
      waterRec: scen(0, 50_000, 250_000),
      groupEvents: scen(20_000, 50_000, 180_000),
    },

    // Destination readiness (9 evidence tests): 'Yes' | 'Partial' | 'No'
    ready: {
      expandable: scen('No', 'Partial', 'Yes'),
      cabinsSupported: scen('Partial', 'Partial', 'Yes'),
      parkModelSupported: scen('No', 'Partial', 'Yes'),
      playgrounds: scen('No', 'Partial', 'Yes'),
      arrivalBeauty: scen('No', 'Partial', 'Yes'),
      groupFacilities: scen('No', 'Partial', 'Yes'),
      waterAccess: scen('No', 'Partial', 'Yes'),
      rentalFleet: scen('No', 'Partial', 'Yes'),
      utilityCapacity: scen('No', 'Partial', 'Yes'),
    },
  }
}

export const READY_LABELS = {
  expandable: 'Expandable to full-build site count',
  cabinsSupported: 'Cabins / non-RV lodging supported',
  parkModelSupported: 'Park-model / tiny / group homes supported',
  playgrounds: 'Playgrounds & family amenities funded',
  arrivalBeauty: 'Beautiful arrival, landscape, shade & lighting',
  groupFacilities: 'Company / reunion / group facilities funded',
  waterAccess: 'Legal river / lake / ocean access verified',
  rentalFleet: 'Rental fleet, safety, permits & insurance verified',
  utilityCapacity: 'Electric / water / wastewater capacity verified',
}

// The "key assumptions" reviewers scan first, driving the editable panel.
// path = dot path into inputs. scenario:true => has current/proforma/target.
export const KEY_FIELDS = [
  { group: 'Acquisition', fields: [
    { path: 'purchasePrice', label: 'Purchase / asking price', type: 'money' },
    { path: 'existingSites', label: 'Existing operating sites', type: 'int' },
    { path: 'fullBuildSites', label: 'Full-build site count', type: 'int' },
    { path: 'expansionAcres', label: 'Expansion / destination acres', type: 'num2' },
    { path: 'exitCap', label: 'Exit cap rate', type: 'pct' },
  ]},
  { group: 'Debt', fields: [
    { path: 'ltv', label: 'Loan-to-value', type: 'pct' },
    { path: 'interestRate', label: 'Interest rate', type: 'pct' },
    { path: 'amortYears', label: 'Amortization (years)', type: 'int' },
    { path: 'loanTermYears', label: 'Loan term (years)', type: 'int' },
  ]},
  { group: 'Equity, escrows & reserves', fields: [
    { path: 'closingPct', label: 'Closing costs (% price)', type: 'pct' },
    { path: 'acqFeePct', label: 'Acquisition fee (% price)', type: 'pct' },
    { path: 'repairEscrow', label: 'Immediate repair escrow', type: 'money' },
    { path: 'expansionEscrow', label: 'Site / accommodation expansion escrow', type: 'money' },
    { path: 'amenityCapex', label: 'Destination beauty & amenity CapEx', type: 'money' },
    { path: 'operatingReserve', label: 'Operating reserve', type: 'money' },
    { path: 'taxReserve', label: 'Tax reserve', type: 'money' },
    { path: 'insuranceReserve', label: 'Insurance reserve', type: 'money' },
    { path: 'reservePerSite', label: 'Replacement reserve / full-build site', type: 'money' },
  ]},
  { group: 'Operating assumptions', scenario: true, fields: [
    { path: 'op.y1Occ', label: 'Year-1 economic occupancy', type: 'pct' },
    { path: 'op.y3Occ', label: 'Year-3 economic occupancy', type: 'pct' },
    { path: 'op.y4Occ', label: 'Year-4+ stabilized occupancy', type: 'pct' },
    { path: 'op.y1Rate', label: 'Year-1 monthly rev / available site', type: 'money' },
    { path: 'op.rateGrowth', label: 'Year-4+ site revenue growth', type: 'pct' },
    { path: 'op.y1Anc', label: 'Year-1 lodging/storage/ancillary', type: 'money' },
    { path: 'op.y3Anc', label: 'Year-3 lodging/storage/ancillary', type: 'money' },
    { path: 'op.y1OpEx', label: 'Year-1 non-management OpEx', type: 'money' },
    { path: 'op.opexGrowth', label: 'Annual OpEx growth', type: 'pct' },
    { path: 'op.mgmtFeePct', label: 'Management fee (% EGI)', type: 'pct' },
  ]},
  { group: 'Year-3 revenue drivers', scenario: true, fields: [
    { path: 'rev.ltRate', label: 'Long-term monthly rate', type: 'money' },
    { path: 'rev.ltOcc', label: 'Long-term occupancy', type: 'pct' },
    { path: 'rev.stdADR', label: 'Transient ADR', type: 'money' },
    { path: 'rev.stdOcc', label: 'Transient occupancy', type: 'pct' },
    { path: 'rev.premADR', label: 'Premium / waterfront ADR', type: 'money' },
    { path: 'rev.premOcc', label: 'Premium occupancy', type: 'pct' },
    { path: 'rev.store', label: 'Store / propane / laundry / activities', type: 'money' },
  ]},
  { group: 'Full-build site mix', scenario: true, fields: [
    { path: 'mix.longTermPads', label: 'Long-term RV pads', type: 'int' },
    { path: 'mix.stdTransient', label: 'Standard transient RV pads', type: 'int' },
    { path: 'mix.premium', label: 'Premium / waterfront pads', type: 'int' },
    { path: 'mix.tentGlamp', label: 'Tent / glamping sites', type: 'int' },
    { path: 'mix.cabins', label: 'Cabins', type: 'int' },
    { path: 'mix.parkModel', label: 'Park-model / tiny homes', type: 'int' },
    { path: 'mix.groupHomes', label: 'Group / family homes', type: 'int' },
    { path: 'mix.storage', label: 'Storage spaces', type: 'int' },
  ]},
]

// ---- generic path helpers on the inputs tree ----
export function getPath(obj, path) {
  return path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj)
}
export function setPath(obj, path, value) {
  const keys = path.split('.')
  const last = keys.pop()
  let cur = obj
  for (const k of keys) {
    if (cur[k] == null || typeof cur[k] !== 'object') cur[k] = {}
    cur = cur[k]
  }
  cur[last] = value
  return obj
}
