import Seo from '../components/Seo.jsx'
import { Container, Band, Eyebrow, Headline, Reveal, Card, DarkCard, Btn, Arrow } from '../components/ui.jsx'
import { Breadcrumbs, CtaBand } from '../components/Shared.jsx'
import { BRAND } from '../content/site.js'

const LAYERS = [
  { icon: '◫', h: 'ROI models', p: 'Establish the economic case for a program by business type and channel.' },
  { icon: '▦', h: 'Benchmarks', p: 'Fill gaps when actual data is limited, using comparable, clearly labeled evidence.' },
  { icon: '◱', h: 'Confidence scoring', p: 'Show how much trust to place in each estimate, and what would improve it.' },
  { icon: '◎', h: 'Pre-scope intelligence', p: 'Apply the model to real accounts and rank them by economic fit.' },
  { icon: '◆', h: 'Sales tools', p: 'Turn the result into a prospect conversation and an ROI-centered proposal.' },
  { icon: '◈', h: 'Audits', p: 'Apply the framework to an existing program to find value and leakage.' },
  { icon: '▤', h: 'Portfolio intelligence', p: 'Compare the original business case with actual performance over time.' },
]

const ROLES = [
  { h: 'Vendors', p: 'Prioritize better accounts and sell with a defensible financial story.' },
  { h: 'Brands', p: 'Align marketing and finance around a conservative, transparent business case.' },
  { h: 'Finance', p: 'See what is truly incremental, the full cost, and the confidence behind it.' },
  { h: 'Sales', p: 'Bring prospect-specific ROI into discovery and proposals.' },
  { h: 'Customer success', p: 'Prove value before renewal by comparing the case with actuals.' },
]

export default function Platform() {
  return (
    <>
      <Seo title="Platform Overview"
           description="One ROI foundation, every loyalty decision. See how Alma's calculators, audits, account intelligence, sales enablement, and portfolio monitoring share a single methodology."
           path="/platform" />
      <Band tone="dark">
        <Container>
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Platform Overview' }]} />
          <Reveal className="max-w-[820px]">
            <Eyebrow>Platform Overview</Eyebrow>
            <Headline as="h1" text="One ROI foundation. Every loyalty decision." highlight="One ROI foundation"
                      className="text-[clamp(34px,5.4vw,58px)] font-semibold mt-2" />
            <p className="text-ondarkmuted text-[clamp(16px,2vw,19px)] mt-6 max-w-[58ch]">{BRAND.longPositioning}</p>
            <div className="flex gap-3 mt-8 flex-wrap">
              <Btn to="/estimator" variant="primary">Choose your starting point <Arrow /></Btn>
              <Btn to="/methodology" variant="outline-dark">See the methodology</Btn>
            </div>
          </Reveal>
        </Container>
      </Band>

      <Band tone="light">
        <Container>
          <Reveal className="text-center max-w-[660px] mx-auto mb-14">
            <Eyebrow>The connected system</Eyebrow>
            <h2 className="text-[clamp(28px,4vw,44px)] font-semibold mt-2">Seven layers, one methodology.</h2>
            <p className="text-lg mt-4 text-onlightmuted">Each layer feeds the next, so the numbers stay consistent from first touch to renewal.</p>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-[18px]">
            {LAYERS.map((l) => (
              <Reveal key={l.h}><Card icon={l.icon} title={l.h}>{l.p}</Card></Reveal>
            ))}
          </div>
        </Container>
      </Band>

      <Band tone="dark">
        <Container>
          <Reveal className="text-center max-w-[660px] mx-auto mb-14">
            <Eyebrow>Built for every stakeholder</Eyebrow>
            <h2 className="text-[clamp(28px,4vw,44px)] font-semibold mt-2">The same foundation, framed for each role.</h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {ROLES.map((r) => (
              <Reveal key={r.h}><DarkCard className="h-full"><h3 className="text-lg font-semibold text-ondark mb-1.5">{r.h}</h3><p className="text-ondarkmuted text-[14px]">{r.p}</p></DarkCard></Reveal>
            ))}
          </div>
        </Container>
      </Band>

      <CtaBand title="Choose your starting point." highlight="starting point"
               sub="Whether you sell loyalty or run a program, the fastest way in is a five-minute estimate."
               primary={{ label: 'Estimate Loyalty ROI', to: '/estimator' }}
               secondary={{ label: 'For Vendors', to: '/for-vendors' }} />
    </>
  )
}
