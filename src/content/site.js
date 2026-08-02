// Global site content: positioning strings, navigation, footer.

export const BRAND = {
  name: 'Alma Loyalty',
  endorsement: 'Powered by Alma AI OS™',
  category: 'Loyalty ROI Intelligence & Decisioning',
  shortPositioning:
    'Know whether loyalty will make money—before you spend to build it. Then measure what makes it grow.',
  longPositioning:
    'Alma Loyalty turns customer behavior, company economics, channel mix, program costs, and relevant benchmarks into a defensible range of loyalty outcomes. Vendors use Alma to identify and close the accounts most likely to succeed. Brands use Alma to build the business case, choose the right program, and improve the decisions that drive profitable member behavior.',
  ecosystem:
    'We help loyalty vendors help brands—and help brands create more value for members.',
  vision: 'A common ROI language for every loyalty program.',
}

// Product strip under the hero
export const PRODUCT_STRIP = [
  { icon: '◫', h: 'ROI Calculators', p: 'Model the economics by business type & channel', to: '/calculators' },
  { icon: '◎', h: 'Pre-Scope Intelligence', p: 'Rank accounts by likely economic fit', to: '/for-vendors/pre-scope' },
  { icon: '◆', h: 'Vendor Sales Toolkit', p: 'Turn a target into an ROI-centered proposal', to: '/for-vendors/sales-toolkit' },
  { icon: '◈', h: 'Program Audits', p: 'Find where value is created—and leaked', to: '/solutions/roi-audit' },
  { icon: '▤', h: 'Portfolio Intelligence', p: 'Compare the business case with actuals', to: '/for-vendors/portfolio' },
]

// The four unifying outcomes
export const OUTCOMES = [
  { icon: '◎', h: 'Active members', p: 'Not just names enrolled—people who participate in a financially meaningful way.' },
  { icon: '↻', h: 'Purchase frequency', p: 'More incremental transactions that can be attributed to the program.' },
  { icon: '↑', h: 'Average order value', p: 'More incremental value per transaction—without giving away the margin.' },
  { icon: '♥', h: 'Profitable retention', p: 'More valuable relationships after incentives, service, and operating cost.' },
]

// Top navigation with mega-menu groups
export const NAV = [
  {
    label: 'Why Alma',
    to: '/platform',
    groups: [
      { title: 'Understand', links: [
        { label: 'Platform Overview', to: '/platform' },
        { label: 'Why Loyalty ROI', to: '/why-loyalty-roi' },
        { label: 'How We Calculate ROI', to: '/methodology' },
        { label: 'Data, Benchmarks & Confidence', to: '/data-confidence' },
      ]},
    ],
  },
  {
    label: 'For Vendors',
    to: '/for-vendors',
    groups: [
      { title: 'For loyalty vendors', links: [
        { label: 'Vendor Overview', to: '/for-vendors' },
        { label: 'Pre-Scope Intelligence', to: '/for-vendors/pre-scope' },
        { label: 'Account Prioritization', to: '/for-vendors/account-prioritization' },
        { label: 'Vendor Sales Toolkit', to: '/for-vendors/sales-toolkit' },
      ]},
      { title: 'Scale & prove value', links: [
        { label: 'White-Label Calculators', to: '/for-vendors/white-label' },
        { label: 'ROI Reports & Proposals', to: '/for-vendors/roi-reports' },
        { label: 'Portfolio Intelligence', to: '/for-vendors/portfolio' },
        { label: 'CRM & Proposal Integrations', to: '/for-vendors/integrations' },
      ]},
    ],
  },
  {
    label: 'For Brands',
    to: '/for-brands',
    groups: [
      { title: 'Build & prove', links: [
        { label: 'Brand Overview', to: '/for-brands' },
        { label: 'Build the Business Case', to: '/for-brands/business-case' },
        { label: 'Audit an Existing Program', to: '/solutions/roi-audit' },
        { label: 'Match My Program', to: '/program-matcher' },
      ]},
      { title: 'Improve the drivers', links: [
        { label: 'Increase Active Membership', to: '/for-brands/active-membership' },
        { label: 'Increase Purchase Frequency', to: '/for-brands/purchase-frequency' },
        { label: 'Increase Average Order Value', to: '/for-brands/average-order-value' },
        { label: 'Improve Retention & CLV', to: '/for-brands/retention' },
      ]},
    ],
  },
  {
    label: 'Solutions',
    to: '/calculators',
    groups: [
      { title: 'Core solutions', links: [
        { label: 'ROI Calculators', to: '/calculators' },
        { label: 'ROI Audit', to: '/solutions/roi-audit' },
        { label: 'Benchmarking & Methodology', to: '/methodology' },
        { label: 'Audience Strategy', to: '/for-brands/audience-strategy' },
        { label: 'Loyalty Games', to: '/solutions/loyalty-games' },
        { label: 'Consulting & Custom Modeling', to: '/solutions/consulting' },
      ]},
      { title: 'By channel', links: [
        { label: 'E-commerce Loyalty', to: '/channels/ecommerce' },
        { label: 'Retail & Store Loyalty', to: '/channels/retail' },
        { label: 'Omnichannel Loyalty', to: '/channels/omnichannel' },
        { label: 'Restaurant & Hospitality', to: '/channels/restaurant' },
        { label: 'Subscription & Paid Loyalty', to: '/channels/subscription' },
        { label: 'B2B, Partner & Channel', to: '/channels/b2b' },
      ]},
    ],
  },
  {
    label: 'Resources',
    to: '/resources',
    groups: [
      { title: 'Learn', links: [
        { label: 'How Loyalty ROI Works', to: '/methodology' },
        { label: 'Calculator Library', to: '/calculators' },
        { label: 'Guides & Research', to: '/resources' },
        { label: 'Glossary', to: '/glossary' },
        { label: 'Frequently Asked Questions', to: '/faq' },
      ]},
      { title: 'Company', links: [
        { label: 'About Alma Loyalty', to: '/about' },
        { label: 'Security & Data Use', to: '/security' },
        { label: 'Contact', to: '/contact' },
      ]},
    ],
  },
]

export const FOOTER = [
  {
    title: 'For Vendors',
    links: [
      { label: 'Pre-Scope Intelligence', to: '/for-vendors/pre-scope' },
      { label: 'Account Prioritization', to: '/for-vendors/account-prioritization' },
      { label: 'Vendor Sales Toolkit', to: '/for-vendors/sales-toolkit' },
      { label: 'White-Label Calculators', to: '/for-vendors/white-label' },
      { label: 'Portfolio Intelligence', to: '/for-vendors/portfolio' },
    ],
  },
  {
    title: 'For Brands',
    links: [
      { label: 'Loyalty Opportunity Estimator', to: '/estimator' },
      { label: 'Build the Business Case', to: '/for-brands/business-case' },
      { label: 'ROI Audit', to: '/solutions/roi-audit' },
      { label: 'Program Matcher', to: '/program-matcher' },
      { label: 'Increase Active Membership', to: '/for-brands/active-membership' },
    ],
  },
  {
    title: 'Learn',
    links: [
      { label: 'Methodology', to: '/methodology' },
      { label: 'Data & Confidence', to: '/data-confidence' },
      { label: 'Calculator Library', to: '/calculators' },
      { label: 'Glossary', to: '/glossary' },
      { label: 'FAQ', to: '/faq' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Contact', to: '/contact' },
      { label: 'Security & Data Use', to: '/security' },
      { label: 'Sitemap', to: '/sitemap' },
    ],
  },
]

export const LEGAL_LINKS = [
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms of Use', to: '/terms' },
  { label: 'Accessibility', to: '/accessibility' },
  { label: 'Security', to: '/security' },
]
