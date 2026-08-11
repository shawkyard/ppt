// Illustrative accounts for the pre-scope engine. Numbers are estimates, not
// verified company data. Verano matches the opportunity-report template exactly;
// the other two exist to show the ACT NOW / WATCH / DROP spread.

export const DEMO_BRANDS = [
  {
    name: 'Verano Fresh Kitchen',
    segment: 'fastCasual',
    revenue: 400_000_000,
    units: 160,
    vendorFit: 8, // Alma's modeled fit for a restaurant-native vendor
    inputs: {
      aov: 26,
      purchaseFrequency: 22,
      activeMembers: 300_000,
      grossMargin: 0.35,
      aovLift: 0.07,
      pfLift: 0.12,
      rewardCostRate: 0.014,
      costs: { software: 420_000, labor: 380_000, marketing: 900_000, misc: 300_000 },
    },
    provenance: {
      aov: 'estimate', purchaseFrequency: 'estimate', grossMargin: 'estimate',
      aovLift: 'modeled', pfLift: 'modeled', rewardCostRate: 'high', activeMembers: 'modeled',
    },
  },
  {
    // Positive but not strong enough to clear the 2.0x green bar — low frequency
    // caps the frequency lever. Most inputs left to the segment prior on purpose.
    name: 'Harbor & Vine Apparel',
    segment: 'apparel',
    revenue: 120_000_000,
    units: 40,
    vendorFit: 6,
    inputs: {},
    provenance: {},
  },
  {
    // Big-ticket, rarely-repeated purchase — the profile loyalty economics
    // reject. High AOV can't compensate for near-zero repeat behavior.
    name: 'Meridian Home Furnishings',
    segment: 'generic',
    revenue: 90_000_000,
    units: 25,
    vendorFit: 3,
    inputs: {
      aov: 900,
      purchaseFrequency: 1.5,
      activeMembers: 23_000,
      grossMargin: 0.45,
      aovLift: 0.03,
      pfLift: 0.02,
      rewardCostRate: 0.015,
    },
    provenance: { aov: 'estimate', purchaseFrequency: 'estimate', activeMembers: 'modeled' },
  },
]
