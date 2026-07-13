/* =========================================================================
   Alma AI Revenue Hunter — data layer  (window.ALMA)
   -------------------------------------------------------------------------
   This file is the single source of truth the report renders from. It is
   delivered as a JS file (not fetched JSON) so the report opens correctly
   from a local file:// path with no server and no CORS issues. The identical
   payload is mirrored to /data/listings.json for machine consumption.

   INTEGRITY RULE (spec §22): No property, MLS number, status, price, agent,
   HOA fee, or comparable sale in this report is invented. As of the run
   below, live listing data could NOT be verified (portals returned HTTP 403
   to automated access; no authorized MLS feed was available). Therefore the
   PRIMARY verified-listing set is intentionally EMPTY. A single, clearly
   watermarked TEMPLATE record is included ONLY to demonstrate the detail
   layout and scoring engine — it is not a real property.
   ========================================================================= */
window.ALMA = {
  meta: {
    brand: "Alma AI Revenue Hunter",
    tagline: "Alma hunts beyond the ordinary listing search.",
    reportType: "Private Buyer Research",
    realtor: { name: "Chad Buttars", note: "Contact details withheld from this page per privacy rules (§20)." },
    searchDate: "2026-07-13",
    generatedAt: "2026-07-13T00:00:00Z",          // set at build time
    statusCheckedAt: "2026-07-13 (initial run)",
    primaryCities: ["Bountiful, UT", "North Salt Lake, UT", "Centerville, UT", "Woods Cross, UT"],
    nearbyCities: ["West Bountiful, UT", "South Farmington, UT", "adjacent Davis County (~10–15 min)"],
    priceMax: 500000,
    minBeds: 2,
    minBaths: 2,
    counts: {
      sourcesQueried: 8,          // distinct source attempts logged in source-log
      portalsBlocked: 2,          // Redfin, Homes.com returned 403 to automation
      reviewed: 0,                // individual listings actually verified
      verifiedActive: 0,
      primaryRecommendations: 0,
      communityLeads: null        // computed from arrays below at render time
    },
    dataAccess: {
      mlsAuthorized: false,
      portalsAccessible: false,
      note: "Web search returned only aggregate marketing pages; Redfin & Homes.com returned HTTP 403 to automated fetch. Individual active listings, MLS numbers, agent contacts, and comparable sales could not be independently verified from two sources as §11 requires."
    }
  },

  /* ---- Default assumptions used for this initial run (spec §19) ---- */
  assumptions: [
    "Detached home preferred but not mandatory.",
    "Patio homes, twin homes, single-level townhomes, and suitable condos are acceptable.",
    "Garage strongly preferred.",
    "At least one main-level bedroom mandatory; both on main strongly preferred.",
    "At least one main-level full or 3/4 bathroom mandatory; both on main strongly preferred.",
    "Main-level laundry strongly preferred.",
    "55+ community acceptable.",
    "No stated HOA maximum.",
    "Cosmetic updates acceptable; major structural renovation undesirable.",
    "Zero-step entry preferred but not mandatory; one or two manageable steps acceptable.",
    "Basement acceptable when daily living does not require it.",
    "No minimum square footage; financing not assumed."
  ],

  /* ---- Scoring rubric (spec §15) — max points per component ---- */
  rubric: {
    A: { name: "Mandatory Buyer Fit", max: 25 },
    B: { name: "Aging-in-Place Suitability", max: 20 },
    C: { name: "Value vs. Market", max: 15 },
    D: { name: "Resale Strength", max: 15 },
    E: { name: "Condition & Ownership Burden", max: 10 },
    F: { name: "Location Convenience", max: 7 },
    G: { name: "Negotiation Opportunity", max: 5 },
    H: { name: "Research Confidence", max: 3 }
  },

  /* =======================================================================
     PRIMARY VERIFIED LISTINGS — empty by integrity rule (see header).
     When an authorized user verifies a property, push a record shaped like
     the TEMPLATE below into this array; every page updates automatically.
     ======================================================================= */
  listings: [],

  /* A single demonstration record. status flags it as NOT REAL. It renders
     the detail-page layout + scoring engine so Chad can see the finished
     format. It is excluded from all counts and ranked lists. */
  template: {
    id: "template",
    isTemplate: true,
    rank: null,
    classification: "Template",
    confidence: "low",
    status: "TEMPLATE — NOT A REAL LISTING",
    statusCheckedAt: "n/a",
    address: "123 Example Way (replace with a verified address)",
    city: "Bountiful, UT",
    price: null, originalPrice: null,
    priceHistory: [],
    offerRange: { competitive: null, value: null, aggressive: null, probAcceptUnder500k: "Unknown" },
    marketValue: { low: null, base: null, high: null, gapVsList: null, pricePerSqft: null, compMedianPpsf: null, confidence: "Unknown" },
    resale3yr: { conservative: null, base: null, strong: null },
    resale5yr: { conservative: null, base: null, strong: null },
    beds: null, baths: null, propertyType: "Requires Verification", yearBuilt: null,
    sqftTotal: null, sqftMain: null, sqftBasement: null, sqftBasementFinished: null,
    lotSize: "Requires Verification", garageSpaces: null,
    hoa: { fee: null, period: "month", services: [], ageRestricted: "Unknown", rentalRestriction: "Unknown", petRestriction: "Unknown", fiveYearCost: null, resaleImpact: "Unknown" },
    taxesEst: "Requires Verification", insuranceNotes: "Requires Verification", daysOnMarket: null,
    mls: "Requires Verification", brokerage: "Requires Verification",
    agent: "Requires Verification", agentContact: "Requires Verification (public listing only)",
    access: {
      mainLevelBedrooms: "Requires Verification", mainLevelBathrooms: "Requires Verification",
      laundryLocation: "Requires Verification", entrySteps: "Requires in-person verification",
      garageEntrySteps: "Requires in-person verification", shower: "Requires Verification",
      interiorStairsForDailyLiving: "Requires Verification", exteriorMaintenance: "Requires Verification",
      snowRemoval: "Requires Verification"
    },
    condition: { summary: "Requires Verification", repairEstimate: "Preliminary only — not a contractor bid", items: [] },
    services: { grocery: "Requires Verification", pharmacy: "Requires Verification", clinic: "Requires Verification", hospital: "Requires Verification", freewayAccess: "Requires Verification" },
    risks: [],
    comparables: [],
    resaleAnalysis: "Requires Verification",
    negotiationAnalysis: "Requires Verification",
    reasonsToConsider: [],
    topConcerns: [],
    questionsForAgent: [],
    itemsToVerify: [],
    nextAction: "Verify listing status from an authoritative MLS/broker source before any showing.",
    sources: [],
    lat: null, lng: null,
    scores: { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0, H: 0 }
  },

  /* =======================================================================
     COMMUNITY WATCHLIST (spec §6) — leads to hunt inventory BEFORE it lists.
     These are LEADS surfaced from public web search on 2026-07-13. They are
     NOT verified active listings. Each needs on-MLS confirmation of current
     inventory, HOA terms, and age restrictions before relying on it.
     ======================================================================= */
  communities: [
    {
      name: "Eaglewood Estates / Eaglewood area",
      city: "North Salt Lake, UT",
      style: "Mix of ramblers & main-level homes on the East Bench near Eaglewood Golf Course",
      typicalBeds: "3+", typicalBaths: "2+", priceBand: "Often >$500k on the bench — verify main-level ramblers at/under budget",
      hoa: "Varies / Unknown", ageRestricted: "No (general)", zeroStep: "Unknown — hillside; slope a concern",
      snowExterior: "Unknown",
      likelihood: "Medium — established area, periodic resale turnover",
      why: "Concentration of main-level living with mountain/valley access; watch for at-budget ramblers.",
      confidence: "low",
      source: "Web search summary 2026-07-13 (unverified lead)"
    },
    {
      name: "Bountiful East Bench rambler pockets (Val Verda, 400 E / 1500 S grid)",
      city: "Bountiful, UT",
      style: "1950s–70s ramblers/ranches, single-level, many with basements",
      typicalBeds: "3+ (often 2 up + basement)", typicalBaths: "2+", priceBand: "Some under $500k reported for East Bench ramblers",
      hoa: "Typically none (fee-simple)", ageRestricted: "No", zeroStep: "Unknown — many have 1–3 entry steps",
      snowExterior: "Owner responsibility (no HOA)",
      likelihood: "High — deepest single-story inventory pool in South Davis",
      why: "Bountiful did most of its growth in the rambler era; best odds of a main-level match. HOA-free means owner handles snow/maintenance — weigh against aging-in-place goals.",
      confidence: "low",
      source: "Web search summary 2026-07-13 (unverified lead)"
    },
    {
      name: "Centerville single-level pockets",
      city: "Centerville, UT",
      style: "Mixed ramblers and newer main-level product",
      typicalBeds: "3+", typicalBaths: "2+", priceBand: "Verify at/under $500k",
      hoa: "Varies", ageRestricted: "Some newer communities may be 55+", zeroStep: "Unknown",
      snowExterior: "Varies by community",
      likelihood: "Medium",
      why: "Adjacent to Bountiful with newer single-level construction that may include patio-home HOAs.",
      confidence: "low",
      source: "Web search summary 2026-07-13 (unverified lead)"
    }
  ],

  /* =======================================================================
     HIDDEN-OPPORTUNITY BUCKETS (spec §5 / report page 6). Structure ready;
     populated only from verified evidence. Empty until confirmed.
     ======================================================================= */
  hidden: {
    comingSoon: [], backOnMarket: [], backupOffers: [],
    expiredWithdrawn: [], builderInventory: [], priceDropWatch: []
  },

  /* =======================================================================
     REJECTED / EXCLUDED LOG (spec §18). Includes items surfaced in search
     that were correctly excluded — proves search coverage.
     ======================================================================= */
  rejected: [
    { address: "Bridlewood Villas (55+ patio homes)", price: "Unknown", city: "West Jordan, UT",
      source: "Web search 2026-07-13", reason: "Out of target area (Salt Lake County, not South Davis).",
      watchForDrop: false, couldQualify: false },
    { address: "Harvest Gardens (55+ main-floor community)", price: "Unknown", city: "Riverton, UT",
      source: "Web search 2026-07-13", reason: "Out of target area (far south Salt Lake County).",
      watchForDrop: false, couldQualify: false },
    { address: "Generic 'single-story homes' portal result sets (Redfin/Homes.com)", price: "Various", city: "Target cities",
      source: "Redfin & Homes.com", reason: "Portal returned HTTP 403 to automated access — individual listings could not be opened or verified.",
      watchForDrop: false, couldQualify: true }
  ],

  /* =======================================================================
     SOURCE & VERIFICATION LOG (spec §11 / §25). What was queried, when, result.
     ======================================================================= */
  sources: [
    { ts: "2026-07-13", type: "Web search", query: "single level rambler/patio home Bountiful UT <$500k 2bd main-level", result: "Aggregate marketing pages only; no verifiable individual listings", url: "" },
    { ts: "2026-07-13", type: "Web search", query: "55+ patio community NSL/Centerville single story for sale", result: "Community leads (Eaglewood, others); no verifiable individual listings", url: "" },
    { ts: "2026-07-13", type: "Portal fetch", query: "Redfin — North Salt Lake single-story", result: "HTTP 403 Forbidden (automation blocked)", url: "https://www.redfin.com/city/14303/UT/North-Salt-Lake/single-story" },
    { ts: "2026-07-13", type: "Portal fetch", query: "Homes.com — North Salt Lake", result: "HTTP 403 Forbidden (automation blocked)", url: "https://www.homes.com/north-salt-lake-ut/" },
    { ts: "2026-07-13", type: "Broker/aggregator", query: "harvestparkgroup.com / bestutahrealestate.com / utahrealtygroup.com rambler & 55+ pages", result: "Marketing/landing pages; IDX search requires interactive session — not machine-verifiable here", url: "https://www.harvestparkgroup.com/davis-county-utah-real-estate-for-sale/bountiful/rambler-ranch-style-homes/" }
  ],

  /* Concrete research queue for an authorized user to complete verification. */
  researchQueue: [
    "Log into MLS (WFRMLS/UtahRealEstate.com) or have Chad pull an IDX search: cities = Bountiful, North Salt Lake, Centerville, Woods Cross; beds ≥2; baths ≥2; price ≤ $500,000; style = Rambler/Single-level; status = Active + Coming Soon + Backup.",
    "Repeat the MLS search filtered to 55+ / age-restricted and to 'patio home' remarks; also search remarks for 'main level', 'no stairs', 'zero step'.",
    "Pull expired/withdrawn/cancelled in the last 6 months matching the filter (hidden-inventory leads).",
    "For each hit: confirm status from the MLS record + one broker source, capture MLS #, DOM, price history, agent (public), and photos/floor plan.",
    "Run comps: 3–6 sales within 0.5–1.5 mi, last 6–12 months, similar type/age/sqft; record PPSF.",
    "Confirm HOA terms (fee, snow removal, exterior maintenance, age & rental restrictions, reserves/assessments) from HOA docs or listing.",
    "Assess accessibility from photos/floor plan + a showing checklist; label each item Confirmed / Appears likely / Unknown / Requires in-person verification.",
    "Paste verified records into window.ALMA.listings (shape = template) — all pages, tables, map, and exports update automatically."
  ],

  /* Client questions to confirm before/at end of first report (spec §19). */
  clientQuestions: [
    "Is a detached home required, or are twin homes, townhomes, and condos acceptable?",
    "Is a garage required? Is a two-car garage preferred?",
    "Must both bedrooms be on the main level? Must both bathrooms?",
    "Is main-level laundry mandatory?",
    "Is a 55+ community acceptable?",
    "Is there a maximum HOA payment?",
    "Is the buyer comfortable with cosmetic renovations?",
    "Is a zero-step entrance required?",
    "Is there a minimum square footage?",
    "Is there a preferred move-in date?",
    "Are pets involved?",
    "Are there family members or services the buyer needs to stay close to?",
    "Is the buyer paying cash or financing?",
    "Would the buyer consider a property requiring accessibility modifications?"
  ]
};
