// 5 demo properties, one per decision band. Realistic illustrative numbers.
// Each carries three scenarios: current (reality), broker (story), strike (ours).
// provenance tags which world each column comes from.

export const demoProperties = [
  // 1) STRONG LEAD — 88
  {
    id: 'prop-hsv-oak', name: 'Oakleaf Village', address: '1420 Cullman Rd', city: 'Cullman, AL',
    marketId: 'mkt-hsv', propertyClass: 'C', areaClass: 'B', yearBuilt: 1986, units: 120,
    askingPrice: 9_600_000, exitCapRate: 0.0625, estimatedCapexPerUnit: 12_000, closingCostsPct: 0.025,
    reserves: 300_000, ltv: 0.65, interestRate: 0.065, amortYears: 30, riskSpread: 0.0075,
    sourceLevel: 'listing-ext', listingAgeDays: 68, dealStatus: 'New',
    scenarios: {
      current: { avgRent: 820, occupancy: 0.86, expenseRatio: 0.56, otherIncomeAnnual: 40_000 },
      broker:  { avgRent: 1075, occupancy: 0.95, expenseRatio: 0.44, otherIncomeAnnual: 160_000 },
      strike:  { avgRent: 1040, occupancy: 0.93, expenseRatio: 0.47, otherIncomeAnnual: 120_000 },
    },
    provenance: { current: 'EXT', broker: 'BR', strike: 'CALC' },
    submarketQuality: 10, conditionFit: 9, capexFeasibility: 8, brokerOptimismRisk: 2, debtStrikeFactor: 8,
    thesisFor: 'Textbook C-in-B value-add in a High-Priority-Hunt market: 27% rent gap, 14% vacancy to burn down, weak other income, absentee management.',
    thesisAgainst: 'Older 1980s stock — deferred maintenance could exceed the $12k/unit budget. Confirm scope before hard money.',
    pain: 'Absentee owner, 14% vacancy, rents ~27% under market, laundry/parking income barely collected.',
    fixableUpside: 'Interior renovation on turns, lease up the down units, add RUBS + covered parking + pet/fee income, professionalize management.',
    marketReason: 'Huntsville/Cullman is a Continuing Emerging (3+ yr) market — aerospace/defense + advanced manufacturing anchors, steady in-migration.',
    missingDocs: ['T-12 operating statements', 'Certified rent roll with lease dates', 'Unit renovation status', 'Trailing utility bills (RUBS)', 'Capex / deferred-maintenance history'],
    risks: [
      { category: 'Capex risk', severity: 'High', likelihood: 'Medium', notes: 'Deferred maintenance may exceed $12k/unit.', mitigation: 'Full PCA + 10% contingency before hard money.', status: 'Open' },
      { category: 'Debt risk', severity: 'Medium', likelihood: 'Medium', notes: 'Rate environment at close.', mitigation: 'Rate-cap quote; stress at +150bps; agency vs. bridge.', status: 'Open' },
      { category: 'Rent risk', severity: 'Medium', likelihood: 'Low', notes: 'Reno premium may underdeliver.', mitigation: 'Prove $220 premium on a 6-unit test batch first.', status: 'Open' },
      { category: 'Missing data risk', severity: 'Medium', likelihood: 'High', notes: 'No T-12/rent roll yet.', mitigation: 'Request full package before LOI.', status: 'Open' },
    ],
    nextAction: 'Request full OM, T-12, and rent roll today. Line up a site walk within 2 weeks.',
  },

  // 2) WORTH REQUESTING OM — 76
  {
    id: 'prop-chs-mag', name: 'Magnolia Row', address: '55 Ashley Point', city: 'North Charleston, SC',
    marketId: 'mkt-chs', propertyClass: 'C', areaClass: 'B', yearBuilt: 1994, units: 88,
    askingPrice: 11_500_000, exitCapRate: 0.0575, estimatedCapexPerUnit: 10_000, closingCostsPct: 0.025,
    reserves: 250_000, ltv: 0.6, interestRate: 0.065, amortYears: 30, riskSpread: 0.0075,
    sourceLevel: 'listing', listingAgeDays: 41, dealStatus: 'New',
    scenarios: {
      current: { avgRent: 1150, occupancy: 0.88, expenseRatio: 0.50, otherIncomeAnnual: 60_000 },
      broker:  { avgRent: 1350, occupancy: 0.95, expenseRatio: 0.42, otherIncomeAnnual: 130_000 },
      strike:  { avgRent: 1300, occupancy: 0.93, expenseRatio: 0.45, otherIncomeAnnual: 100_000 },
    },
    provenance: { current: 'EXT', broker: 'BR', strike: 'CALC' },
    submarketQuality: 9, conditionFit: 9, capexFeasibility: 7, brokerOptimismRisk: 4, debtStrikeFactor: 7,
    thesisFor: 'Partially updated asset in a strong coastal growth market with a real ~13% rent gap and under-captured fees.',
    thesisAgainst: 'Charleston pricing is rich (low going-in cap) and new supply is a factor; the deal needs the strike rents to hold.',
    pain: 'Rents lag ~13%, other income under-collected, loose self-management, some units still classic.',
    fixableUpside: 'Light interior refresh, push rents on turns, add fee income, tighten expenses toward stabilized.',
    marketReason: 'Charleston/Lowcountry is Continuing Emerging — advanced manufacturing, strong migration; watch supply.',
    missingDocs: ['T-12', 'Rent roll', 'Which units already renovated', 'Tax reassessment estimate on sale', 'Insurance quote (coastal)'],
    risks: [
      { category: 'Exit cap risk', severity: 'High', likelihood: 'Medium', notes: 'Low going-in cap; exit assumption sensitive.', mitigation: 'Stress exit cap +50–75bps.', status: 'Open' },
      { category: 'Insurance risk', severity: 'Medium', likelihood: 'Medium', notes: 'Coastal wind/insurance cost.', mitigation: 'Bind a real quote before LOI.', status: 'Open' },
      { category: 'Broker optimism risk', severity: 'Medium', likelihood: 'Medium', notes: 'Pro forma rents aggressive.', mitigation: 'Underwrite to independent comps.', status: 'Open' },
      { category: 'Tax reassessment risk', severity: 'Medium', likelihood: 'High', notes: 'Reassessment on sale.', mitigation: 'Model millage on new basis.', status: 'Open' },
    ],
    nextAction: 'Request OM + T-12; validate rent comps and get a coastal insurance quote before deeper work.',
  },

  // 3) WATCHLIST — 62
  {
    id: 'prop-aus-sab', name: 'Sablewood Apartments', address: '900 Old Settlers Blvd', city: 'Round Rock, TX',
    marketId: 'mkt-aus', propertyClass: 'B-', areaClass: 'B', yearBuilt: 2003, units: 200,
    askingPrice: 34_000_000, exitCapRate: 0.05, estimatedCapexPerUnit: 9_000, closingCostsPct: 0.02,
    reserves: 400_000, ltv: 0.6, interestRate: 0.065, amortYears: 30, riskSpread: 0.0075,
    sourceLevel: 'listing', listingAgeDays: 96, dealStatus: 'Watch',
    scenarios: {
      current: { avgRent: 1400, occupancy: 0.88, expenseRatio: 0.45, otherIncomeAnnual: 180_000 },
      broker:  { avgRent: 1600, occupancy: 0.95, expenseRatio: 0.38, otherIncomeAnnual: 320_000 },
      strike:  { avgRent: 1520, occupancy: 0.92, expenseRatio: 0.42, otherIncomeAnnual: 240_000 },
    },
    provenance: { current: 'EXT', broker: 'BR', strike: 'CALC' },
    submarketQuality: 8, conditionFit: 7, capexFeasibility: 8, brokerOptimismRisk: 4, debtStrikeFactor: 7,
    thesisFor: 'Good bones and real operational upside (concessions/vacancy from supply), light-lift interiors.',
    thesisAgainst: 'Austin is Pre-Emerging on a supply-driven reset; low going-in cap and near-term rent pressure. Only works on a price reset.',
    pain: 'Occupancy soft from new-supply concessions; rents burdened; expenses loose.',
    fixableUpside: 'Operational cleanup, burn off concessions as supply absorbs, modest interior premium.',
    marketReason: 'Austin/Round Rock reset to Pre-Emerging (Watchlist) — long-term growth, heavy near-term supply.',
    missingDocs: ['T-12', 'Rent roll with concessions detail', 'Trailing 3-month occupancy', 'Supply pipeline within 3 miles'],
    risks: [
      { category: 'Market risk', severity: 'High', likelihood: 'Medium', notes: 'Near-term supply glut suppresses rents.', mitigation: 'Underwrite flat rents 24 months; require price reset.', status: 'Open' },
      { category: 'Vacancy risk', severity: 'Medium', likelihood: 'High', notes: 'Concession-driven occupancy.', mitigation: 'Model concessions explicitly.', status: 'Open' },
      { category: 'Exit cap risk', severity: 'High', likelihood: 'Medium', notes: '5% going-in leaves no cushion.', mitigation: 'Stress exit +75bps.', status: 'Open' },
    ],
    nextAction: 'Hold. Signal interest only at a materially reset basis; revisit if price drops.',
  },

  // 4) PASS UNLESS PRICE DROPS — 47
  {
    id: 'prop-nash-har', name: 'Harpeth Bend', address: '2100 Old Hickory Blvd', city: 'Nashville, TN',
    marketId: 'mkt-nash', propertyClass: 'B', areaClass: 'B', yearBuilt: 2007, units: 150,
    askingPrice: 27_000_000, exitCapRate: 0.05, estimatedCapexPerUnit: 8_000, closingCostsPct: 0.02,
    reserves: 300_000, ltv: 0.6, interestRate: 0.065, amortYears: 30, riskSpread: 0.0075,
    sourceLevel: 'listing', listingAgeDays: 132, dealStatus: 'Review',
    scenarios: {
      current: { avgRent: 1300, occupancy: 0.90, expenseRatio: 0.44, otherIncomeAnnual: 120_000 },
      broker:  { avgRent: 1450, occupancy: 0.95, expenseRatio: 0.38, otherIncomeAnnual: 220_000 },
      strike:  { avgRent: 1380, occupancy: 0.93, expenseRatio: 0.42, otherIncomeAnnual: 160_000 },
    },
    provenance: { current: 'EXT', broker: 'BR', strike: 'CALC' },
    submarketQuality: 8, conditionFit: 6, capexFeasibility: 6, brokerOptimismRisk: 6, debtStrikeFactor: 6,
    thesisFor: 'Solid metro fundamentals long term; modest rent gap.',
    thesisAgainst: 'Nashville is NOT flagged emerging (gray), priced up with heavy supply, thin rent gap — the deal leans on the broker pro forma.',
    pain: 'Thin ~6% rent gap, already well-occupied, priced to a low cap; limited organic upside.',
    fixableUpside: 'Minor — some fee income and light interior premium, not enough to carry the basis.',
    marketReason: 'Nashville/Central TN reads Not Emerging on REIndicator; ignore unless manually approved.',
    missingDocs: ['T-12', 'Rent roll', 'Capital needs assessment'],
    risks: [
      { category: 'Market risk', severity: 'High', likelihood: 'Medium', notes: 'Not on the emerging list; supply-heavy.', mitigation: 'Manual override required to pursue.', status: 'Open' },
      { category: 'Rent risk', severity: 'High', likelihood: 'Medium', notes: 'Little rent upside.', mitigation: 'Requires price reset for margin.', status: 'Open' },
      { category: 'Broker optimism risk', severity: 'High', likelihood: 'High', notes: 'Deal works mainly on broker pro forma.', mitigation: 'Reject OM-driven assumptions.', status: 'Open' },
    ],
    nextAction: 'Pass at current price. Reconsider only on a material price drop (20%+) or manual market override.',
  },

  // 5) PASS — 32
  {
    id: 'prop-phx-sum', name: 'Summit at Desert Ridge', address: '21000 N Tatum Blvd', city: 'Phoenix, AZ',
    marketId: 'mkt-phx', propertyClass: 'A-', areaClass: 'B', yearBuilt: 2018, units: 72,
    askingPrice: 18_000_000, exitCapRate: 0.05, estimatedCapexPerUnit: 3_000, closingCostsPct: 0.02,
    reserves: 150_000, ltv: 0.6, interestRate: 0.065, amortYears: 30, riskSpread: 0.0075,
    sourceLevel: 'listing', listingAgeDays: 22, dealStatus: 'Review',
    scenarios: {
      current: { avgRent: 1550, occupancy: 0.95, expenseRatio: 0.40, otherIncomeAnnual: 90_000 },
      broker:  { avgRent: 1620, occupancy: 0.96, expenseRatio: 0.38, otherIncomeAnnual: 110_000 },
      strike:  { avgRent: 1600, occupancy: 0.95, expenseRatio: 0.39, otherIncomeAnnual: 96_000 },
    },
    provenance: { current: 'EXT', broker: 'BR', strike: 'CALC' },
    submarketQuality: 7, conditionFit: 3, capexFeasibility: 5, brokerOptimismRisk: 8, debtStrikeFactor: 5,
    thesisFor: 'Newer, clean, well-located asset — but that is exactly why it is wrong for us.',
    thesisAgainst: 'Stabilized, already renovated, priced to a sub-5 cap in a Not-Emerging market. No value-add lever; pure yield/appreciation bet.',
    pain: 'None to fix — rents at market, expenses tight, occupancy full.',
    fixableUpside: 'Essentially none. Seller already captured the upside.',
    marketReason: 'Phoenix/Central AZ is Not Emerging on REIndicator; supply + affordability headwinds.',
    missingDocs: ['N/A — fails the strategy filter'],
    risks: [
      { category: 'Market risk', severity: 'High', likelihood: 'High', notes: 'Not emerging; supply/affordability headwinds.', mitigation: 'Off-strategy.', status: 'Closed' },
      { category: 'Rent risk', severity: 'High', likelihood: 'High', notes: 'No rent upside.', mitigation: 'None.', status: 'Closed' },
      { category: 'Exit cap risk', severity: 'High', likelihood: 'Medium', notes: 'Sub-5 cap; appreciation-dependent.', mitigation: 'None.', status: 'Closed' },
    ],
    nextAction: 'Pass. Stabilized core deal — outside the value-add mandate.',
  },
]
