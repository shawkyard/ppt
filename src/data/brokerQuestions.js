// Shared broker-question template, grouped by section. Used on the Broker
// Questions screen for every deal; users can add deal-specific questions too.

export const BROKER_QUESTION_SECTIONS = [
  { section: 'Rent roll', questions: [
    'Can you send a certified current rent roll with lease start/end dates?',
    'How many units are down/offline or non-revenue?',
    'What are the last five signed leases and their effective rents?',
    'What concessions are being offered today?',
  ]},
  { section: 'T12 financials', questions: [
    'Please provide a trailing-12 with monthly detail.',
    'Which expense lines are owner-paid vs. tenant-paid?',
    'Any one-time or non-recurring items in the T12?',
  ]},
  { section: 'Occupancy', questions: [
    'What is trailing-3 physical AND economic occupancy?',
    'What is current delinquency and bad debt?',
    'What is the renewal rate and average tenure?',
  ]},
  { section: 'Capex & renovation history', questions: [
    'What capital has been spent in the last 5 years (roofs, HVAC, plumbing, parking)?',
    'How many units are already renovated, and to what spec?',
    'What is the current renovation premium being achieved?',
  ]},
  { section: 'Insurance', questions: [
    'What is the current insurance premium and carrier?',
    'Any open claims, or wind/flood/named-storm exposure?',
  ]},
  { section: 'Taxes', questions: [
    'What is the current assessed value and millage?',
    'What is the expected reassessment on sale?',
  ]},
  { section: 'Utilities', questions: [
    'Are utilities master-metered or sub-metered?',
    'Is there a RUBS program? What is currently recovered?',
  ]},
  { section: 'Seller motivation', questions: [
    'Why is the seller selling, and what is the timeline?',
    'How firm is the asking price given days on market?',
    'Is there assumable debt or any prepayment consideration?',
  ]},
  { section: 'Financing / debt', questions: [
    'Is there in-place financing that can be assumed?',
    'Are there any existing loan covenants or lockouts?',
  ]},
  { section: 'Pro forma challenge', questions: [
    'What comps support the pro forma market rents?',
    'What renovation scope and timeline does the pro forma assume?',
    'Does the deal still work if rents grow 0% for 24 months?',
  ]},
]
