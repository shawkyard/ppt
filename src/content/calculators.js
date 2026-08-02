// Calculator & Model Library — 50+ distinct modeling applications, differentiated
// by business model, channel, program structure, and decision.

// access: Public | Gated | Vendor-only | Custom
// for: Both | Vendors | Brands

const c = (name, group, forWho, decision, access, time) => ({ name, group, for: forWho, decision, access, time })

export const CALCULATORS = [
  // Core estimation
  c('Loyalty Opportunity Estimator', 'Core estimation', 'Both', 'Could loyalty make money for this business?', 'Public', '2–4 min'),
  c('Full Program ROI Model', 'Core estimation', 'Both', 'What is the complete ROI once every cost and behavior is included?', 'Gated', '10 min'),
  c('Business-Case Builder', 'Core estimation', 'Brands', 'How do I assemble an executive-ready case?', 'Gated', '15 min'),
  c('Break-Even Calculator', 'Core estimation', 'Both', 'How many active members must participate to break even?', 'Public', '2 min'),
  c('Scenario Comparison', 'Core estimation', 'Both', 'How do conservative, expected, and upside outcomes compare?', 'Public', '3 min'),
  c('Sensitivity & Confidence Range', 'Core estimation', 'Both', 'Which inputs move the result most, and how confident is it?', 'Gated', '5 min'),

  // Revenue & profit
  c('Incremental Revenue Calculator', 'Revenue & profit', 'Both', 'How much new revenue is truly attributable to loyalty?', 'Public', '3 min'),
  c('Incremental Gross-Profit Calculator', 'Revenue & profit', 'Both', 'What does loyalty add after cost of goods?', 'Public', '3 min'),
  c('Net Contribution Model', 'Revenue & profit', 'Both', 'What is left after rewards and operating cost?', 'Gated', '5 min'),

  // Member behavior
  c('Member Enrollment Opportunity', 'Member behavior', 'Both', 'How many members can realistically be recruited?', 'Public', '2 min'),
  c('Active-Member Conversion', 'Member behavior', 'Both', 'What is the value of turning enrolled members active?', 'Public', '3 min'),
  c('Purchase-Frequency Lift', 'Member behavior', 'Both', 'What is a realistic, profitable frequency increase worth?', 'Public', '3 min'),
  c('Average-Order-Value Lift', 'Member behavior', 'Both', 'What does a bigger basket add after margin?', 'Public', '3 min'),
  c('Retention & Churn Improvement', 'Member behavior', 'Both', 'What is improved retention worth after save costs?', 'Gated', '5 min'),
  c('Customer-Lifetime-Value Impact', 'Member behavior', 'Both', 'How does loyalty change CLV net of cost?', 'Gated', '5 min'),
  c('Win-Back Program Economics', 'Member behavior', 'Brands', 'Is reactivating lapsed customers worth the offer cost?', 'Gated', '5 min'),
  c('Cross-Sell & Category Expansion', 'Member behavior', 'Both', 'What is the value of expanding into new categories?', 'Gated', '5 min'),
  c('Member Acquisition Cost & Payback', 'Member behavior', 'Both', 'How long until an acquired member pays back?', 'Gated', '4 min'),

  // Reward & cost design
  c('Reward-Cost & Funding Model', 'Reward & cost design', 'Both', 'What will rewards cost, and how are they funded?', 'Public', '4 min'),
  c('Points Issuance & Redemption', 'Reward & cost design', 'Both', 'How do earn and burn rates affect cost?', 'Gated', '5 min'),
  c('Points Liability & Breakage', 'Reward & cost design', 'Both', 'What liability accrues, and how does breakage change it?', 'Gated', '5 min'),
  c('Tier Economics', 'Reward & cost design', 'Both', 'Do tiers create enough behavior to justify their benefits?', 'Gated', '6 min'),
  c('Discount vs. Experiential Benefit', 'Reward & cost design', 'Brands', 'Which reward type creates more profitable behavior?', 'Public', '3 min'),
  c('Offer & Benefit Optimization', 'Reward & cost design', 'Both', 'Which benefit mix maximizes profitable participation?', 'Custom', '—'),
  c('Personalization Impact Scenarios', 'Reward & cost design', 'Both', 'What is targeted personalization worth vs. broad offers?', 'Gated', '6 min'),

  // Program structures
  c('Paid / Subscription Loyalty Economics', 'Program structures', 'Both', 'Do fees and retention justify the benefits?', 'Gated', '6 min'),
  c('Partner-Funded Rewards', 'Program structures', 'Both', 'How much value can partners fund?', 'Gated', '5 min'),
  c('Coalition Loyalty Economics', 'Program structures', 'Both', 'How do shared programs split cost and value?', 'Custom', '—'),
  c('Referral-Program Economics', 'Program structures', 'Both', 'Is referred-member value above referral cost?', 'Public', '3 min'),
  c('Card-Linked Offer Economics', 'Program structures', 'Both', 'What do card-linked offers add net of funding?', 'Gated', '5 min'),
  c('Cashback-Program Economics', 'Program structures', 'Both', 'Does cashback drive enough incremental behavior?', 'Gated', '5 min'),
  c('Promotion Incrementality', 'Program structures', 'Brands', 'How much promo lift is incremental vs. pulled-forward?', 'Gated', '5 min'),
  c('Gamification Economics', 'Program structures', 'Both', 'Does game-based engagement pay for itself?', 'Gated', '5 min'),
  c('Loyalty-Game Participation & Prize', 'Program structures', 'Both', 'What prize budget fits expected participation?', 'Custom', '—'),

  // Channels
  c('E-commerce Loyalty', 'Channels', 'Both', 'What is the case for an online program?', 'Public', '3 min'),
  c('Store & In-Person Loyalty', 'Channels', 'Both', 'What is the case for in-store loyalty?', 'Public', '3 min'),
  c('Omnichannel Loyalty', 'Channels', 'Both', 'What is the net cross-channel case?', 'Gated', '6 min'),
  c('Call-Center & Assisted-Sales Loyalty', 'Channels', 'Both', 'Does loyalty lift assisted-sales value?', 'Gated', '5 min'),
  c('Marketplace Loyalty', 'Channels', 'Both', 'How does loyalty work across many sellers?', 'Custom', '—'),
  c('Franchise & Multi-Location Loyalty', 'Channels', 'Both', 'How do economics vary across locations?', 'Gated', '6 min'),
  c('Restaurant & Hospitality Loyalty', 'Channels', 'Both', 'What survives thin margins and high frequency?', 'Public', '3 min'),
  c('Travel Loyalty', 'Channels', 'Both', 'How do points and tiers perform in travel?', 'Custom', '—'),
  c('Financial-Services Loyalty', 'Channels', 'Both', 'What is the case with regulated products?', 'Custom', '—'),
  c('B2B, Channel & Partner Loyalty', 'Channels', 'Both', 'What is retention and share-of-wallet worth?', 'Gated', '6 min'),

  // Vendor & portfolio
  c('Multi-Brand Portfolio Model', 'Vendor & portfolio', 'Vendors', 'How do programs compare across a portfolio?', 'Vendor-only', '—'),
  c('Program Migration & Replacement Case', 'Vendor & portfolio', 'Both', 'Is switching platforms justified financially?', 'Gated', '8 min'),
  c('Loyalty Technology Total Cost of Ownership', 'Vendor & portfolio', 'Both', 'What is the full multi-year cost of the stack?', 'Gated', '6 min'),
  c('Vendor Proposal ROI Model', 'Vendor & portfolio', 'Vendors', 'How do I present ROI in a proposal?', 'Vendor-only', '—'),
  c('Sales-Deal Value Model', 'Vendor & portfolio', 'Vendors', 'What is a specific deal worth to pursue?', 'Vendor-only', '—'),
  c('Customer-Success Value-Realization', 'Vendor & portfolio', 'Vendors', 'How do I prove value before renewal?', 'Vendor-only', '—'),
  c('Renewal & Expansion Business Case', 'Vendor & portfolio', 'Vendors', 'What is the case for renewal and expansion?', 'Vendor-only', '—'),
]

export const CAL_GROUPS = [...new Set(CALCULATORS.map((x) => x.group))]
export const CAL_ACCESS = ['Public', 'Gated', 'Vendor-only', 'Custom']
export const CAL_AUDIENCE = ['Both', 'Vendors', 'Brands']
