import Seo from '../components/Seo.jsx'
import { Container, Band, Eyebrow, Headline, Reveal, Card, Btn, Arrow } from '../components/ui.jsx'
import { Breadcrumbs, Faq, CtaBand } from '../components/Shared.jsx'
import Estimator from '../components/Estimator.jsx'

const RESULT_ORDER = [
  'Estimated incremental contribution range',
  'Estimated ROI range',
  'Payback range',
  'Break-even active members',
  'Top value drivers',
  'Top risk or cost drivers',
  'Confidence level',
  'Assumptions and what would improve the result',
]

const FAQS = [
  { q: 'Do I have to enter contact information to see a result?', a: 'No. The estimator gives you a useful high-level result immediately. A richer, downloadable scenario report can be requested afterward.' },
  { q: 'What is the difference between the three scenarios?', a: 'Conservative applies a discounted behavior lift, expected uses your inputs as entered, and upside applies a higher lift. The headline ROI is the expected case; the range shows conservative to upside.' },
  { q: 'Why does it ask for margin and active-member rate?', a: 'Because loyalty ROI is a profit question, not a revenue one—and only active members drive the lift. Leaving those out is how shallow calculators overstate results.' },
]

export default function EstimatorPage() {
  return (
    <>
      <Seo title="Loyalty Opportunity Estimator"
           description="Could loyalty make money for this business? Estimate incremental profit, ROI range, payback, and break-even active members—with conservative, expected, and upside scenarios."
           path="/estimator" />

      <Band tone="dark">
        <Container>
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Calculators', to: '/calculators' }, { label: 'Loyalty Opportunity Estimator' }]} />
          <Reveal className="max-w-[820px]">
            <Eyebrow>Loyalty Opportunity Estimator</Eyebrow>
            <Headline as="h1" text="Could loyalty make money for this business?" highlight="make money"
                      className="text-[clamp(34px,5.4vw,58px)] font-semibold mt-2" />
            <p className="text-ondarkmuted text-[clamp(16px,2vw,19px)] mt-6 max-w-[58ch]">
              A progressive calculator that starts simple and lets you go deeper. Estimates are fine—every default is a labeled assumption you can replace with your own data. No contact information required to see a useful result.
            </p>
          </Reveal>
        </Container>
      </Band>

      <Band tone="cream">
        <Container>
          <Estimator />
        </Container>
      </Band>

      <Band tone="dark">
        <Container>
          <Reveal className="max-w-[760px] mx-auto text-center mb-12">
            <Eyebrow>Result hierarchy</Eyebrow>
            <h2 className="text-[clamp(28px,4vw,42px)] font-semibold mt-2">What a complete result shows.</h2>
            <p className="text-ondarkmuted text-lg mt-4">The estimator leads with the numbers that matter, in the order a decision-maker reads them.</p>
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-3 max-w-[820px] mx-auto">
            {RESULT_ORDER.map((r, i) => (
              <Reveal key={r}>
                <div className="flex gap-3 items-center bg-ink3 border border-[rgba(220,190,150,0.14)] rounded-xl p-4">
                  <span className="font-serif font-semibold text-orange text-lg flex-none w-7">{i + 1}</span>
                  <span className="text-ondarkmuted text-[14.5px]">{r}</span>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="text-center mt-10">
            <Btn to="/methodology" variant="outline-dark">See the full methodology <Arrow /></Btn>
          </div>
        </Container>
      </Band>

      <Band tone="light">
        <Container>
          <Reveal className="text-center max-w-[560px] mx-auto mb-12">
            <Eyebrow>Questions</Eyebrow>
            <h2 className="text-[clamp(28px,4vw,40px)] font-semibold mt-2">About the estimator.</h2>
          </Reveal>
          <Faq items={FAQS} />
        </Container>
      </Band>

      <CtaBand title="Want the detailed scenario report?" highlight="detailed scenario report"
               sub="Get a downloadable version with assumptions, sensitivity, and a measurement plan—or talk through the numbers with our team."
               primary={{ label: 'Request the Report', to: '/contact' }}
               secondary={{ label: 'Explore the Calculator Library', to: '/calculators' }} />
    </>
  )
}
