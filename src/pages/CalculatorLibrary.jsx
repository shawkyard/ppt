import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Seo from '../components/Seo.jsx'
import { Container, Band, Eyebrow, Headline, Reveal, Btn, Arrow } from '../components/ui.jsx'
import { Breadcrumbs, CtaBand } from '../components/Shared.jsx'
import { CALCULATORS, CAL_GROUPS, CAL_ACCESS, CAL_AUDIENCE } from '../content/calculators.js'

const ACCESS_STYLE = {
  Public: 'text-orange border-orange',
  Gated: 'text-ondarkmuted border-brownline/50',
  'Vendor-only': 'text-sand border-sand/50',
  Custom: 'text-ondarkdim border-brownline/40',
}

function Pill({ active, onClick, children }) {
  return (
    <button onClick={onClick}
            className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium border transition-colors ${active ? 'bg-orange text-[#241206] border-orange' : 'border-brownline/40 text-onlightmuted hover:border-orange hover:text-orange'}`}>
      {children}
    </button>
  )
}

export default function CalculatorLibrary() {
  const [group, setGroup] = useState('All')
  const [audience, setAudience] = useState('All')
  const [access, setAccess] = useState('All')

  const filtered = useMemo(() => CALCULATORS.filter((c) =>
    (group === 'All' || c.group === group) &&
    (audience === 'All' || c.for === audience || c.for === 'Both') &&
    (access === 'All' || c.access === access)
  ), [group, audience, access])

  return (
    <>
      <Seo title="Calculator & Model Library"
           description="The right loyalty model for the decision in front of you. Browse 50+ ROI calculators by goal, audience, channel, and program type."
           path="/calculators" />
      <Band tone="dark">
        <Container>
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Calculator Library' }]} />
          <Reveal className="max-w-[820px]">
            <Eyebrow>Calculator & model library</Eyebrow>
            <Headline as="h1" text="The right loyalty model for the decision in front of you." highlight="the decision in front of you"
                      className="text-[clamp(32px,5vw,56px)] font-semibold mt-2" />
            <p className="text-ondarkmuted text-[clamp(16px,2vw,19px)] mt-6 max-w-[58ch]">
              More than 50 distinct models—differentiated by business model, channel, program structure, and decision. Each shows who it is for, the decision it supports, and whether it is public, gated, vendor-only, or custom.
            </p>
            <div className="mt-8">
              <Btn to="/estimator" variant="primary">Start with the Loyalty Opportunity Estimator <Arrow /></Btn>
            </div>
          </Reveal>
        </Container>
      </Band>

      <Band tone="light">
        <Container>
          {/* Filters */}
          <div className="mb-8 space-y-4">
            <div>
              <div className="text-[11px] uppercase tracking-[0.12em] text-onlightmuted mb-2 font-semibold">Family</div>
              <div className="flex flex-wrap gap-2">
                <Pill active={group === 'All'} onClick={() => setGroup('All')}>All</Pill>
                {CAL_GROUPS.map((g) => <Pill key={g} active={group === g} onClick={() => setGroup(g)}>{g}</Pill>)}
              </div>
            </div>
            <div className="flex flex-wrap gap-8">
              <div>
                <div className="text-[11px] uppercase tracking-[0.12em] text-onlightmuted mb-2 font-semibold">Audience</div>
                <div className="flex flex-wrap gap-2">
                  <Pill active={audience === 'All'} onClick={() => setAudience('All')}>All</Pill>
                  {CAL_AUDIENCE.map((a) => <Pill key={a} active={audience === a} onClick={() => setAudience(a)}>{a}</Pill>)}
                </div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-[0.12em] text-onlightmuted mb-2 font-semibold">Access</div>
                <div className="flex flex-wrap gap-2">
                  <Pill active={access === 'All'} onClick={() => setAccess('All')}>All</Pill>
                  {CAL_ACCESS.map((a) => <Pill key={a} active={access === a} onClick={() => setAccess(a)}>{a}</Pill>)}
                </div>
              </div>
            </div>
            <div className="text-sm text-onlightmuted">{filtered.length} models</div>
          </div>

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((c) => (
              <div key={c.name} className="bg-cream border border-brownline/25 rounded-2xl p-6 flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-[17px] font-semibold leading-snug">{c.name}</h3>
                  <span className={`text-[10.5px] font-bold uppercase tracking-[0.06em] border rounded-full px-2 py-0.5 whitespace-nowrap ${ACCESS_STYLE[c.access]}`}>{c.access}</span>
                </div>
                <p className="text-onlightmuted text-[14px] flex-1">{c.decision}</p>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-brownline/20 text-[12px] text-onlightmuted">
                  <span>{c.group}</span>
                  <span>{c.for === 'Both' ? 'Vendors & brands' : c.for} · {c.time}</span>
                </div>
              </div>
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="text-center text-onlightmuted py-16">No models match those filters. Try widening your selection.</p>
          )}
        </Container>
      </Band>

      <CtaBand title="Not sure which model fits?" highlight="which model fits"
               sub="Start with the estimator for a quick read, or tell us the decision and we will point you to the right model."
               primary={{ label: 'Estimate Loyalty ROI', to: '/estimator' }}
               secondary={{ label: 'Talk With the Team', to: '/contact' }} />
    </>
  )
}
