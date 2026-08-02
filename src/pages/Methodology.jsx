import Seo from '../components/Seo.jsx'
import { Container, Band, Eyebrow, Headline, Reveal, Card, DarkCard, Btn, Arrow } from '../components/ui.jsx'
import { Breadcrumbs, CtaBand } from '../components/Shared.jsx'

const INPUTS = [
  'Company revenue, and revenue by sales channel',
  'Transaction volume, AOV, and purchase frequency by channel',
  'Gross margin and contribution margin',
  'Customer count and addressable base',
  'Current members and current active members',
  'Realistically recruitable members by channel',
  'Member vs. non-member behavior, and before/after joining',
  'Retention and churn',
  'Pricing position, from extreme discount to extreme luxury',
  'Program structure, points earn/burn, and benefit design',
  'Reward costs, funding, redemption, and breakage',
  'Discount leakage and cannibalization',
  'Technology, implementation, staffing, service, and operating costs',
  'Fraud, gaming, and liability risk where relevant',
]

const GUARDS = [
  'Counting existing revenue as incremental',
  'Double-counting AOV, frequency, retention, and cross-sell',
  'Using enrollment as a substitute for active membership',
  'Ignoring margin, or program and operating costs',
  'Treating correlation as guaranteed causation',
  'Cherry-picking only high-performing members',
  'Applying one industry benchmark to every business',
  'Hiding weak inputs behind a precise-looking output',
]

const COMPARE = [
  'A member’s behavior before and after joining',
  'Loyalty members vs. comparable non-members',
  'Matched cohorts',
  'Test and control groups',
  'Pilot locations or audiences with comparable baselines',
  'Actual results against the original scenario range',
]

const CONF = [
  { l: 'Directional', p: 'Mostly benchmark assumptions. Useful for a first read and prioritization.' },
  { l: 'Moderate', p: 'Some actual company or program data supports the estimate.' },
  { l: 'Strong', p: 'Substantial actual data with good comparability and recency.' },
  { l: 'Measured', p: 'Backed by controlled comparison or observed results.' },
]

export default function Methodology() {
  return (
    <>
      <Seo title="How We Calculate Loyalty ROI"
           description="A clear view of what creates the return—and what it costs. Alma's methodology in plain English: inputs, conservative attribution, costs, scenarios, and confidence."
           path="/methodology" />
      <Band tone="dark">
        <Container>
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Methodology' }]} />
          <Reveal className="max-w-[820px]">
            <Eyebrow>How we calculate loyalty ROI</Eyebrow>
            <Headline as="h1" text="A clear view of what creates the return—and what it costs." highlight="what it costs"
                      className="text-[clamp(32px,5vw,56px)] font-semibold mt-2" />
            <p className="text-ondarkmuted text-[clamp(16px,2vw,19px)] mt-6 max-w-[58ch]">
              No black box, and no proprietary formula on display. This is the logic in plain English—rigorous enough for a CFO, readable by a new loyalty manager.
            </p>
          </Reveal>
        </Container>
      </Band>

      {/* Equation in words */}
      <Band tone="cream">
        <Container>
          <Reveal className="max-w-[760px] mx-auto text-center">
            <div className="font-serif text-[clamp(20px,3.2vw,30px)] font-medium text-onlight">Incremental value from measurable behavior change</div>
            <div className="font-sans text-sm font-bold tracking-[0.2em] uppercase text-orange my-3.5">minus</div>
            <div className="font-serif text-[clamp(20px,3.2vw,30px)] font-medium text-onlight">Rewards, discounts, technology, implementation, staffing, service &amp; operating cost</div>
            <div className="font-sans text-sm font-bold tracking-[0.2em] uppercase text-orange my-3.5">equals</div>
            <div className="font-serif text-[clamp(20px,3.2vw,30px)] font-medium text-orange">Estimated incremental contribution from loyalty</div>
          </Reveal>
          <p className="text-center text-onlightmuted text-[15px] max-w-[640px] mx-auto mt-8">
            No universal model should use the same assumptions for a discount retailer, a luxury brand, a restaurant, a subscription service, and a B2B distributor. Alma tunes inputs and benchmarks to the business in front of it.
          </p>
        </Container>
      </Band>

      {/* Inputs */}
      <Band tone="dark">
        <Container>
          <Reveal className="mb-12 max-w-[660px]">
            <Eyebrow>What the model considers</Eyebrow>
            <h2 className="text-[clamp(28px,4vw,42px)] font-semibold mt-2">Inputs, where the data is available.</h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-x-10 gap-y-2.5 max-w-[900px]">
            {INPUTS.map((it) => (
              <div key={it} className="flex gap-3 text-ondarkmuted text-[14.5px] py-1.5 border-b border-[rgba(220,190,150,0.08)]">
                <span className="text-orange flex-none">•</span>{it}
              </div>
            ))}
          </div>
          <p className="text-ondarkdim text-sm mt-8 max-w-[720px]">
            The methodology draws on a growing cross-company and cross-channel benchmark library to fill gaps when actual data is limited. Benchmarks are labeled as estimates, and actual company data always takes priority.
          </p>
        </Container>
      </Band>

      {/* Conservative attribution */}
      <Band tone="light">
        <Container>
          <div className="grid lg:grid-cols-2 gap-10">
            <Reveal>
              <Eyebrow>Conservative attribution</Eyebrow>
              <h2 className="text-[clamp(26px,3.5vw,38px)] font-semibold mt-2 mb-4">We credit loyalty only for the change it caused.</h2>
              <p className="text-onlightmuted text-[16px] mb-4">
                Alma does not treat all member revenue as loyalty-generated revenue. It focuses on the change that can reasonably be attributed to loyalty—incremental purchase frequency, incremental order value, improved retention, and other measurable behavior—then compares that value with the full cost of creating it.
              </p>
              <h3 className="text-lg font-semibold mb-3 mt-8">Where possible, measurement compares:</h3>
              <ul className="space-y-2">
                {COMPARE.map((it) => (
                  <li key={it} className="flex gap-3 text-onlightmuted text-[15px]"><span className="text-orange flex-none">✓</span>{it}</li>
                ))}
              </ul>
            </Reveal>
            <Reveal>
              <div className="bg-cream border border-brownline/25 rounded-2xl p-8 h-full">
                <h3 className="text-xl font-semibold mb-5">The methodology explicitly guards against:</h3>
                <ul className="space-y-3">
                  {GUARDS.map((it) => (
                    <li key={it} className="flex gap-3 text-onlightmuted text-[15px]"><span className="text-orange flex-none">✕</span>{it}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </Container>
      </Band>

      {/* Confidence */}
      <Band tone="dark">
        <Container>
          <Reveal className="text-center max-w-[660px] mx-auto mb-12">
            <Eyebrow>Confidence, not false precision</Eyebrow>
            <h2 className="text-[clamp(28px,4vw,42px)] font-semibold mt-2">Every estimate says how much to trust it.</h2>
            <p className="text-ondarkmuted text-lg mt-4">Confidence reflects data completeness, source quality, recency, comparability, sample size, model fit, and sensitivity.</p>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CONF.map((c, i) => (
              <Reveal key={c.l}>
                <DarkCard className="h-full">
                  <div className="flex gap-1.5 mb-3">
                    {CONF.map((_, j) => <span key={j} className="flex-1 h-1.5 rounded-full" style={{ background: j <= i ? '#dd6a2b' : 'rgba(120,92,64,0.28)' }} />)}
                  </div>
                  <h3 className="text-lg font-semibold text-ondark mb-1.5">{c.l}</h3>
                  <p className="text-ondarkmuted text-[14px]">{c.p}</p>
                </DarkCard>
              </Reveal>
            ))}
          </div>
          <div className="text-center mt-10">
            <Btn to="/calculators" variant="primary">See the model library <Arrow /></Btn>
          </div>
        </Container>
      </Band>

      <CtaBand title="Put the methodology to work." highlight="to work"
               sub="Run a live estimate, or dig into how data quality and benchmarks shape confidence."
               primary={{ label: 'Estimate Loyalty ROI', to: '/estimator' }}
               secondary={{ label: 'Data, Benchmarks & Confidence', to: '/data-confidence' }} />
    </>
  )
}
