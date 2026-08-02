import Seo from '../components/Seo.jsx'
import { Container, Band, Eyebrow, Headline, Reveal, Card, DarkCard, Btn, Arrow } from '../components/ui.jsx'
import { Breadcrumbs, CtaBand } from '../components/Shared.jsx'

const HIERARCHY = [
  { h: 'Actual company data', p: 'Your own revenue, customers, margin, and costs. Highest trust.' },
  { h: 'Actual program & channel data', p: 'Real member behavior, redemption, and channel performance.' },
  { h: 'Comparable company or program evidence', p: 'Similar businesses and programs, matched for relevance.' },
  { h: 'Industry & business-model benchmarks', p: 'Cross-company references, labeled as estimates.' },
  { h: 'Clearly labeled assumptions', p: 'Explicit placeholders you can replace as data improves.' },
]

export default function DataConfidence() {
  return (
    <>
      <Seo title="Data, Benchmarks & Confidence"
           description="An estimate is only as useful as the evidence behind it. How Alma ranks data sources, labels assumptions, and expresses confidence."
           path="/data-confidence" />
      <Band tone="dark">
        <Container>
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Data, Benchmarks & Confidence' }]} />
          <Reveal className="max-w-[820px]">
            <Eyebrow>Data, benchmarks & confidence</Eyebrow>
            <Headline as="h1" text="An estimate is only as useful as the evidence behind it." highlight="the evidence behind it"
                      className="text-[clamp(32px,5vw,56px)] font-semibold mt-2" />
            <p className="text-ondarkmuted text-[clamp(16px,2vw,19px)] mt-6 max-w-[58ch]">
              Alma is transparent about where every number comes from. Better evidence produces a stronger result—and the tool always shows what would improve it.
            </p>
          </Reveal>
        </Container>
      </Band>

      <Band tone="light">
        <Container>
          <Reveal className="text-center max-w-[660px] mx-auto mb-14">
            <Eyebrow>Data hierarchy</Eyebrow>
            <h2 className="text-[clamp(28px,4vw,44px)] font-semibold mt-2">Actual data first, assumptions last.</h2>
          </Reveal>
          <div className="max-w-[820px] mx-auto space-y-3">
            {HIERARCHY.map((h, i) => (
              <Reveal key={h.h}>
                <div className="flex gap-4 items-start bg-cream border border-brownline/25 rounded-2xl p-6">
                  <span className="font-serif font-semibold text-orange text-2xl flex-none w-8">{i + 1}</span>
                  <div>
                    <h3 className="text-lg font-semibold">{h.h}</h3>
                    <p className="text-onlightmuted text-[15px] mt-1">{h.p}</p>
                  </div>
                  <span className="ml-auto text-[11px] uppercase tracking-[0.1em] text-onlightmuted whitespace-nowrap self-center">
                    {['Highest', 'High', 'Medium', 'Lower', 'Lowest'][i]} trust
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Band>

      <Band tone="dark">
        <Container>
          <div className="grid lg:grid-cols-3 gap-5">
            <Reveal><DarkCard icon="✓" title="What we know">Inputs backed by your actual data, shown with high confidence and used as-is.</DarkCard></Reveal>
            <Reveal><DarkCard icon="≈" title="What we estimate">Inputs filled by comparable evidence or benchmarks, labeled clearly with lower confidence.</DarkCard></Reveal>
            <Reveal><DarkCard icon="↑" title="What would improve confidence">The specific data that, if added, would move the estimate toward Strong or Measured.</DarkCard></Reveal>
          </div>
          <p className="text-ondarkmuted text-[15px] max-w-[760px] mt-10">
            Each result reveals its assumptions and lets you override any default with your own figure. Source recency, comparability, and sensitivity all feed the confidence level, so you always know how much weight the number can bear.
          </p>
          <div className="mt-10">
            <Btn to="/contact" variant="primary">Run a data-readiness check <Arrow /></Btn>
          </div>
        </Container>
      </Band>

      <CtaBand title="Find out how strong your estimate could be." highlight="how strong"
               sub="A quick data-readiness check shows what you can measure now and what to gather next."
               primary={{ label: 'Run a Data-Readiness Check', to: '/contact' }}
               secondary={{ label: 'See the Methodology', to: '/methodology' }} />
    </>
  )
}
