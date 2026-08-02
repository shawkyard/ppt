// Role matrices for vendor and brand pages.
export const VENDOR_ROLES = [
  { role: 'CEO / Founder', q: 'Where can we grow efficiently?', a: 'Rank accounts and standardize the ROI story', kpi: 'Pipeline quality, growth, retention', cta: { label: 'Score Our Market', to: '/for-vendors/account-prioritization' } },
  { role: 'CRO / VP Sales', q: 'Which deals deserve focus, and how do we prove value?', a: 'Account prioritization plus prospect-specific ROI', kpi: 'Win rate, deal velocity, deal size', cta: { label: 'Score My Account List', to: '/for-vendors/pre-scope' } },
  { role: 'Account Executive', q: 'What should I say to this prospect?', a: 'Evidence-backed brief, calculator, and stakeholder story', kpi: 'Meetings, stage progression, close rate', cta: { label: 'Build an Account Brief', to: '/for-vendors/sales-toolkit' } },
  { role: 'Presales', q: 'How do I turn discovery into a business case?', a: 'Structured inputs, scenarios, assumptions, and report', kpi: 'Business-case completion', cta: { label: 'Build an ROI Scenario', to: '/estimator' } },
  { role: 'Marketing', q: 'How do we generate better-qualified demand?', a: 'Public and white-label calculators by audience', kpi: 'Qualified conversions', cta: { label: 'Design a Calculator', to: '/for-vendors/white-label' } },
  { role: 'Customer Success', q: 'How do we prove value before renewal?', a: 'Original case versus actuals and health signals', kpi: 'Renewal, expansion, adoption', cta: { label: 'Review My Portfolio', to: '/for-vendors/portfolio' } },
]

export const BRAND_ROLES = [
  { role: 'CMO', q: 'Will this investment create profitable growth?', a: 'Conservative scenarios and break-even case', kpi: 'Incremental profit, payback', cta: { label: 'Build the Business Case', to: '/for-brands/business-case' } },
  { role: 'Loyalty Leader', q: 'Which decisions will improve the program?', a: 'Driver analysis and ranked recommendations', kpi: 'Active members, frequency, AOV', cta: { label: 'Audit My Program', to: '/solutions/roi-audit' } },
  { role: 'CFO', q: 'What is truly incremental, and what will it cost?', a: 'Transparent attribution, full costs, confidence', kpi: 'ROI, margin, payback', cta: { label: 'Review the Methodology', to: '/methodology' } },
  { role: 'E-commerce / Retail', q: 'Which channels and offers create value?', a: 'Channel-specific models and sensitivity', kpi: 'Conversion, basket, repeat rate', cta: { label: 'Choose a Channel Model', to: '/channels/ecommerce' } },
  { role: 'Data / Analytics', q: 'What evidence supports the result?', a: 'Sources, comparisons, assumptions, confidence', kpi: 'Measurement quality', cta: { label: 'Run a Data-Readiness Check', to: '/data-confidence' } },
]
