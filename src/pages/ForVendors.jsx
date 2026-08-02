import { Link } from 'react-router-dom'
import Seo from '../components/Seo.jsx'
import { Container, Band, Eyebrow, Headline, Reveal, Card, DarkCard, Btn, Arrow } from '../components/ui.jsx'
import { Breadcrumbs, CtaBand } from '../components/Shared.jsx'
import { VENDOR_ROLES } from '../content/roles.js'

const JOURNEY = [
  { h: 'Define ICP & TAM', p: 'Set the profile that fits your platform and services.' },
  { h: 'Rank by economic fit', p: 'Prioritize the accounts most likely to have a credible business case.' },
  { h: 'Build the account brief', p: 'Evidence, likely drivers, objections, and the right model.' },
  { h: 'Choose the calculator', p: 'The model that matches the prospect’s business and channel.' },
  { h: 'Create the business case', p: 'Prospect-specific scenarios, break-even, and confidence.' },
  { h: 'Message by stakeholder', p: 'Finance, marketing, loyalty, IT, and procurement each hear what matters.' },
  { h: 'Build the proposal', p: 'An ROI-centered proposal with input-to-statement traceability.' },
  { h: 'Track through renewal', p: 'Compare the original case with actuals to protect and expand.' },
]

const PRODUCTS = [
  { icon: '◎', h: 'Pre-Scope Intelligence', p: 'Rank accounts by likely economic fit.', to: '/for-vendors/pre-scope' },
  { icon: '⚖', h: 'Account Prioritization', p: 'Turn a TAM into a focused pursuit list.', to: '/for-vendors/account-prioritization' },
  { icon: '◆', h: 'Vendor Sales Toolkit', p: 'From target account to proposal.', to: '/for-vendors/sales-toolkit' },
  { icon: '◫', h: 'White-Label Calculators', p: 'Your brand, Alma’s methodology.', to: '/for-vendors/white-label' },
  { icon: '⎙', h: 'ROI Reports & Proposals', p: 'Lead the proposal with the business case.', to: '/for-vendors/roi-reports' },
  { icon: '▤', h: 'Portfolio Intelligence', p: 'Case vs. actuals across your book.', to: '/for-vendors/portfolio' },
]

export default function ForVendors() {
  return (
    <>
      <Seo title="For Loyalty Vendors"
           description="Give every loyalty sale a stronger financial reason to move forward. Find better-fit accounts, prove ROI in discovery, and close with a defensible business case."
           path="/for-vendors" />
      <Band tone="dark">
        <Container>
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'For Vendors' }]} />
          <Reveal className="max-w-[820px]">
            <Eyebrow>For loyalty vendors</Eyebrow>
            <Headline as="h1" text="Give every loyalty sale a stronger financial reason to move forward." highlight="a stronger financial reason"
                      className="text-[clamp(32px,5vw,56px)] font-semibold mt-2" />
            <p className="text-ondarkmuted text-[clamp(16px,2vw,19px)] mt-6 max-w-[60ch]">
              Find better-fit accounts, bring credible ROI into discovery, and help prospects understand what must be true for their program to pay back. (Loyalty vendors are the software developers and service companies that sell loyalty solutions to brands—Alma adds an ROI and decision layer, it does not replace your platform.)
            </p>
            <div className="flex gap-3 mt-8 flex-wrap">
              <Btn to="/for-vendors/pre-scope" variant="primary">Score My Account List <Arrow /></Btn>
              <Btn to="/for-vendors/sales-toolkit" variant="outline-dark">See the Vendor Sales Toolkit</Btn>
            </div>
          </Reveal>
        </Container>
      </Band>

      {/* Journey */}
      <Band tone="light">
        <Container>
          <Reveal className="text-center max-w-[660px] mx-auto mb-14">
            <Eyebrow>The vendor journey</Eyebrow>
            <h2 className="text-[clamp(28px,4vw,44px)] font-semibold mt-2">From account list to renewal.</h2>
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

      {/* Products */}
      <Band tone="dark">
        <Container>
          <Reveal className="text-center max-w-[660px] mx-auto mb-14">
            <Eyebrow>Vendor solutions</Eyebrow>
            <h2 className="text-[clamp(28px,4vw,44px)] font-semibold mt-2">A connected system, one methodology.</h2>
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

      {/* Role matrix */}
      <Band tone="light">
        <Container>
          <Reveal className="text-center max-w-[660px] mx-auto mb-12">
            <Eyebrow>Value by role</Eyebrow>
            <h2 className="text-[clamp(28px,4vw,44px)] font-semibold mt-2">What each team gets.</h2>
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
                {VENDOR_ROLES.map((r) => (
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

      <CtaBand title="Score your market and sell with proof." highlight="sell with proof"
               sub="Bring an account list and we will show how prioritization and ROI change your pipeline."
               primary={{ label: 'Score My Account List', to: '/for-vendors/pre-scope' }}
               secondary={{ label: 'Book a Strategy Call', to: '/contact' }} />
    </>
  )
}
