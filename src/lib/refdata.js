// Static reference content from the underwriting model's Execution Timeline and
// Risk Register sheets. Displayed as diligence guardrails on every deal.

export const TIMELINE = [
  { period: 'Months 0–3', phase: 'Rights / capacity / close', budget: 0,
    work: 'Confirm title, zoning, site density, water access, flood/wetlands, power, water and wastewater capacity. Close only after fatal constraints are cleared or priced.' },
  { period: 'Months 1–12', phase: 'Pads + core infrastructure', budget: 2_300_000,
    work: 'Build RV/tent pads, roads, electric, water, sewer/septic and connectivity — physical capacity for the destination revenue plan.' },
  { period: 'Months 4–18', phase: 'Ways to stay', budget: 1_650_000,
    work: 'Add cabins, park-model/tiny homes and group/family homes for higher ADR, shoulder-season demand and family/group stays.' },
  { period: 'Months 6–24', phase: 'Beauty + guest experience', budget: 1_050_000,
    work: 'Arrival, landscaping, shade, lighting, playgrounds, gathering spaces, water recreation and group facilities for longer stays and repeat visits.' },
  { period: 'Months 25–36', phase: 'Stabilized Destination Strike', budget: 0,
    work: 'Operate a full stabilized year and verify the finance plus destination gates (Year-3 CoC, DSCR, cap, 200+ sites, readiness).' },
  { period: 'Years 4–10', phase: 'Long hold / exit', budget: 0,
    work: 'Protect the guest experience, reserves, debt paydown and refinance/exit readiness — durable cash flow without eroding quality.' },
]

export const RISK_REGISTER = [
  { risk: 'Seasonality / demand', prob: 'High', treatment: 'Never annualize a peak month — rebuild by month, weekday/weekend, event and shoulder season.' },
  { risk: 'Site expansion / entitlements', prob: 'High', treatment: 'Do not count unentitled sites. Require civil yield plan and written zoning/site-density confirmation.' },
  { risk: 'Electric / water / wastewater capacity', prob: 'High', treatment: 'Cap buildout at verified capacity; confirm septic or treatment limits with engineer and utility.' },
  { risk: 'Flood / wetlands / storm / shoreline', prob: 'High', treatment: 'Exclude constrained land and stress insurance; require survey, FEMA map, wetlands and shoreline review.' },
  { risk: 'Water access rights', prob: 'High', treatment: 'No water premium without enforceable legal and commercial recreation rights.' },
  { risk: 'Boat / ocean rental liability', prob: 'High', treatment: 'Revenue = $0 until permits, operator plan, waivers, maintenance, safety and insurance are cleared.' },
  { risk: 'ADR / occupancy ramp', prob: 'Medium', treatment: 'Use supported product-level assumptions from competitive set, channel data and month-by-month ramp.' },
  { risk: 'Destination capital overrun', prob: 'High', treatment: 'Stress cost and timing together — contractor bids, contingency, draws and change controls.' },
  { risk: 'Insurance / disaster exposure', prob: 'High', treatment: 'Use actual coverage and deductibles; review wind, flood, wildfire and business interruption.' },
  { risk: 'Interest rate / refinance', prob: 'Medium', treatment: 'Use lender terms and stress rate; require quote, rate cap, maturity/refi stress.' },
  { risk: 'Securities / disclosure', prob: 'High', treatment: 'No investor release until securities counsel, CPA, PPM and operating agreement are approved.' },
]
