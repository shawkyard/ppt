import { Link } from 'react-router-dom'
import Seo from '../components/Seo.jsx'
import { Container, Band, Eyebrow, Headline, Reveal, Btn, Arrow } from '../components/ui.jsx'
import { Breadcrumbs, CtaBand } from '../components/Shared.jsx'
import { BRAND_ROLES } from '../content/roles.js'

const JOURNEY = [
  { h: 'Assess the fit', p: 'Does loyalty fit your economics in the first place?' },
  { h: 'Define audience & behavior', p: 'The customers and behaviors worth investing in.' },
  { h: 'Build conservative scenarios', p: 'Conservative, expected, and upside from your baseline.' },
  { h: 'Identify break-even', p: 'The active membership and lift required to pay back.' },
  { h: 'Choose structure & technology', p: 'Program design and the right platform or partner.' },
  { h: 'Launch with a measurement plan', p: 'Cohorts and controls set up before go-live.' },
  { h: 'Compare actuals to the case', p: 'Prove the return and catch drift early.' },
  { h: 'Improve the drivers', p: 'Active members, frequency, AOV, and retention.' },
]

const PRODUCTS = [
  { icon: '❑', h: 'Build the Business Case', p: 'An executive-ready financial case.', to: '/for-brands/business-case' },
  { icon: '◈', h: 'ROI Audit', p: 'Find value and leakage in a live program.', to: '/solutions/roi-audit' },
  { icon: '◎', h: 'Increase Active Membership', p: 'Value activation, not just enrollment.', to: '/for-brands/active-membership' },
  { icon: '↻', h: 'Increase Purchase Frequency', p: 'Profitable visits, not just messages.', to: '/for-brands/purchase-frequency' },
  { icon: '↑', h: 'Increase Average Order Value', p: 'Bigger baskets that keep their margin.', to: '/for-brands/average-order-value' },
  { icon: '♥', h: 'Improve Retention & CLV', p: 'Keep relationships worth keeping.', to: '/for-brands/retention' },
]

export default function ForBrands() {
  return (
    <>
      <Seo title="For Brands"
           description="Build a loyalty program finance can believe—and members will value. Assess fit, build the business case, and improve the decisions that drive profitable behavior."
           path="/for-brands" />
      <Band tone="dark">
        <Container>
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'For Brands' }]} />
          <Reveal className="max-w-[820px]">
            <Eyebrow>For brands</Eyebrow>
            <Headline as="h1" text="Build a loyalty program finance can believe—and members will value." highlight="finance can believe"
                      className="text-[clamp(32px,5vw,56px)] font-semibold mt-2" />
            <p className="text-ondarkmuted text-[clamp(16px,2vw,19px)] mt-6 max-w-[60ch]">
              Give finance a conservative case they can approve and marketing a plan they can run. Then improve the decisions that drive active membership, frequency, average order value, and profitable retention.
            </p>
            <div className="flex gap-3 mt-8 flex-wrap">
              <Btn to="/for-brands/business-case" variant="primary">Build My Loyalty Business Case <Arrow /></Btn>
              <Btn to="/solutions/roi-audit" variant="outline-dark">Audit an Existing Program</Btn>
            </div>
          </Reveal>
        </Container>
      </Band>

      <Band tone="light">
        <Container>
          <Reveal className="text-center max-w-[660px] mx-auto mb-14">
            <Eyebrow>The brand journey</Eyebrow>
            <h2 className="text-[clamp(28px,4vw,44px)] font-semibold mt-2">From idea to measured improvement.</h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {JOURNEY.map((s, i) => (
              <Reveal key={s.h}>
                <div className="bg-cream border border-brownline/25 rounded-2xl p-6 h-full">
                  <div className="font-serif font-semibold text-orange text-lg mb-2">{String(i + 1).padStart(2, '0')}</div>
                  <h3 className="text-[16px] font-semibold mb-1.5">{s.h}</h3>
                  <p className="text-onlightmuted text-[14px]">{s.p}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Band>

      <Band tone="dark">
        <Container>
          <Reveal className="text-center max-w-[660px] mx-auto mb-14">
            <Eyebrow>Improve the drivers</Eyebrow>
            <h2 className="text-[clamp(28px,4vw,44px)] font-semibold mt-2">Where brands create value.</h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-[18px]">
            {PRODUCTS.map((p) => (
              <Reveal key={p.h}>
                <Link to={p.to} className="block bg-ink3 border border-[rgba(220,190,150,0.14)] rounded-2xl p-7 transition-all hover:border-orange/50 hover:-translate-y-1 h-full">
                  <div className="w-11 h-11 rounded-[10px] text-orange grid place-items-center text-xl mb-4" style={{ background: 'rgba(221,106,43,0.12)' }}>{p.icon}</div>
                  <h3 className="text-lg font-semibold text-ondark mb-1.5">{p.h}</h3>
                  <p className="text-ondarkmuted text-[14.5px]">{p.p}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </Band>

      <Band tone="light">
        <Container>
          <Reveal className="text-center max-w-[660px] mx-auto mb-12">
            <Eyebrow>Value by role</Eyebrow>
            <h2 className="text-[clamp(28px,4vw,44px)] font-semibold mt-2">One language for the whole team.</h2>
          </Reveal>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[14px] min-w-[720px]">
              <thead>
                <tr className="text-left">
                  {['Role', 'Primary question', 'Alma answer', 'KPI', ''].map((h) => (
                    <th key={h} className="p-4 font-sans text-[12px] uppercase tracking-[0.08em] text-onlightmuted border-b border-brownline/30">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {BRAND_ROLES.map((r) => (
                  <tr key={r.role} className="align-top">
                    <td className="p-4 font-semibold text-onlight border-b border-brownline/15">{r.role}</td>
                    <td className="p-4 text-onlightmuted border-b border-brownline/15">{r.q}</td>
                    <td className="p-4 text-onlightmuted border-b border-brownline/15">{r.a}</td>
                    <td className="p-4 text-onlightmuted border-b border-brownline/15">{r.kpi}</td>
                    <td className="p-4 border-b border-brownline/15"><Link to={r.cta.to} className="text-orange font-semibold whitespace-nowrap">{r.cta.label} →</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </Band>

      <CtaBand title="Build a case finance can believe." highlight="finance can believe"
               sub="Start with a five-minute estimate, then build the executive-ready business case with our team."
               primary={{ label: 'Build My Business Case', to: '/for-brands/business-case' }}
               secondary={{ label: 'Match My Program', to: '/program-matcher' }} />
    </>
  )
}
