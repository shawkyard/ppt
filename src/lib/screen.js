// Destination-park hard screen + best-to-worst score (Alma AI OS Hunter rules).
// Runs BEFORE deep underwriting matters: a fast QUALIFIED / CONDITIONAL / REJECTED
// read on whether a park is a real destination resort in a workable jurisdiction.

// Landlord/owner-friendly jurisdiction registry. This is a DEFAULT starting point
// only — the source spec requires current evidence, effective dates, source URLs and
// admin approval before a state is truly "Approved". Treat 'conditional' as
// "searchable pending documented legal review", never as legal advice.
export const JURISDICTION = {
  // Commonly cited owner-friendly — conditional pending verification
  conditional: ['TX', 'FL', 'GA', 'AL', 'TN', 'IN', 'AZ', 'CO', 'KY', 'AR', 'MS', 'NC', 'SC', 'OH', 'MO', 'ID', 'UT', 'WY', 'OK', 'KS', 'NE', 'WV', 'VA', 'PA', 'LA', 'ND', 'SD', 'MT', 'NV', 'NM', 'IA', 'WI', 'NH', 'AK'],
  // Strongly tenant-protective — excluded by default
  excluded: ['CA', 'NY', 'NJ', 'OR', 'WA', 'MA', 'MD', 'DC', 'VT', 'MN', 'IL', 'HI', 'CT', 'RI', 'ME', 'MI', 'DE'],
}

const STATE_NAMES = {
  alabama: 'AL', alaska: 'AK', arizona: 'AZ', arkansas: 'AR', california: 'CA',
  colorado: 'CO', connecticut: 'CT', delaware: 'DE', florida: 'FL', georgia: 'GA',
  hawaii: 'HI', idaho: 'ID', illinois: 'IL', indiana: 'IN', iowa: 'IA', kansas: 'KS',
  kentucky: 'KY', louisiana: 'LA', maine: 'ME', maryland: 'MD', massachusetts: 'MA',
  michigan: 'MI', minnesota: 'MN', mississippi: 'MS', missouri: 'MO', montana: 'MT',
  nebraska: 'NE', nevada: 'NV', 'new hampshire': 'NH', 'new jersey': 'NJ',
  'new mexico': 'NM', 'new york': 'NY', 'north carolina': 'NC', 'north dakota': 'ND',
  ohio: 'OH', oklahoma: 'OK', oregon: 'OR', pennsylvania: 'PA', 'rhode island': 'RI',
  'south carolina': 'SC', 'south dakota': 'SD', tennessee: 'TN', texas: 'TX', utah: 'UT',
  vermont: 'VT', virginia: 'VA', washington: 'WA', 'west virginia': 'WV',
  wisconsin: 'WI', wyoming: 'WY',
}

// Detect a US state code from a location / free text string.
export function detectState(text) {
  if (!text) return ''
  const t = String(text)
  const abbr = t.match(/\b([A-Z]{2})\b(?:\s*\d{5})?/g)
  if (abbr) {
    for (const a of abbr) {
      const code = a.trim().slice(0, 2)
      if ([...JURISDICTION.conditional, ...JURISDICTION.excluded].includes(code)) return code
    }
  }
  const lower = t.toLowerCase()
  for (const [name, code] of Object.entries(STATE_NAMES)) {
    if (lower.includes(name)) return code
  }
  return ''
}

export function jurisdictionStatus(state) {
  if (!state) return { state: '', status: 'unknown', ok: false, tone: 'warn', note: 'No state detected — confirm and run the jurisdiction gate.' }
  if (JURISDICTION.excluded.includes(state)) return { state, status: 'excluded', ok: false, tone: 'bad', note: 'Strongly tenant-protective by default — excluded pending legal review.' }
  if (JURISDICTION.conditional.includes(state)) return { state, status: 'conditional', ok: true, tone: 'good', note: 'Owner-friendly default — searchable pending documented legal review.' }
  return { state, status: 'review', ok: false, tone: 'warn', note: 'Not yet reviewed — requires evidence and admin approval before qualifying.' }
}

// Run the destination screen. Returns verdict + weighted score + itemized checks.
export function runScreen(inp, model) {
  const tgt = model.scenarios.target
  const bo = tgt.buildout
  const mix = inp.mix
  const y3 = tgt.pnl[2]
  const jur = jurisdictionStatus(inp.state)

  const isDestinationArchetype = /destination/i.test(inp.archetype || '')
  const amenities = mix.premium.target + mix.tentGlamp.target + mix.cabins.target +
    mix.parkModel.target + mix.groupHomes.target + inp.rev.waterRec.target
  const hasExpansion = inp.expansionAcres > 0 || bo.operatingSites > inp.existingSites

  // Weighted checks (weight sums to 100).
  const checks = [
    { key: 'jurisdiction', label: `Landlord-friendly jurisdiction${jur.state ? ` (${jur.state})` : ''}`, ok: jur.ok, weight: 20, detail: jur.note },
    { key: 'existing', label: 'Meaningful existing base (100+ sites)', ok: inp.existingSites >= 100, weight: 10, detail: `${inp.existingSites} existing sites`, partial: inp.existingSites >= 50 },
    { key: 'fullbuild', label: 'Path to 200+ total keys', ok: inp.fullBuildSites >= 200 || bo.operatingSites >= 200, weight: 15, detail: `${bo.operatingSites} full-build sites` },
    { key: 'expansion', label: 'Expansion acreage / added sites', ok: hasExpansion, weight: 10, detail: `${inp.expansionAcres} acres · +${bo.addedSites} sites` },
    { key: 'amenities', label: 'Resort amenities & multiple ways to stay', ok: amenities > 0, weight: 10, detail: `${mix.cabins.target} cabins · ${mix.premium.target} premium · ${mix.tentGlamp.target} glamping` },
    { key: 'destination', label: 'Destination positioning (not a stopover)', ok: isDestinationArchetype, weight: 10, detail: inp.archetype },
    { key: 'readiness', label: 'Destination readiness verified', ok: bo.readiness === 'READY', weight: 10, detail: `${bo.yesCount}/9 evidence tests`, partial: bo.yesCount >= 5 },
    { key: 'coc', label: 'Stabilized 20% CoC potential', ok: y3.coc >= inp.gates.strikeCoC, weight: 10, detail: `Year-3 CoC ${(y3.coc * 100).toFixed(1)}%`, partial: y3.coc >= inp.gates.minCoC },
    { key: 'gates', label: 'Meets minimum DSCR & cap gates', ok: y3.dscr >= inp.gates.minDSCR && y3.capRate >= inp.gates.minCap, weight: 5, detail: `DSCR ${y3.dscr.toFixed(2)}x · cap ${(y3.capRate * 100).toFixed(1)}%` },
  ]

  let score = 0
  for (const c of checks) score += c.ok ? c.weight : c.partial ? c.weight * 0.5 : 0
  score = Math.round(score)

  // Hard rejection rules.
  const rejections = []
  if (jur.status === 'excluded') rejections.push('Excluded jurisdiction — tenant-protective state, off-thesis by default.')
  if (bo.operatingSites < 100 && !hasExpansion && amenities === 0)
    rejections.push('Not a destination resort — sub-scale, no expansion, no resort amenities.')

  let verdict
  if (rejections.length) verdict = 'REJECTED'
  else if (score >= 70 && jur.ok) verdict = 'QUALIFIED'
  else verdict = 'CONDITIONAL'

  return { verdict, score, jurisdiction: jur, checks, rejections }
}
