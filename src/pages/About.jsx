import Seo from '../components/Seo.jsx'
import { Container, Band, Eyebrow, Headline, Reveal, DarkCard } from '../components/ui.jsx'
import { Breadcrumbs, CtaBand } from '../components/Shared.jsx'
import { BRAND } from '../content/site.js'

const BELIEFS = [
  { h: 'Conservative by default', p: 'We would rather understate a return we can defend than overstate one we cannot. Credibility compounds.' },
  { h: 'Show the work', p: 'Assumptions, sources, and confidence are part of the answer—not fine print.' },
  { h: 'Incremental, after cost', p: 'Only the change loyalty caused, measured after the full cost of creating it, counts as ROI.' },
  { h: 'A shared language', p: 'When marketing, loyalty, and finance use the same definitions, better decisions follow.' },
]

export default function About() {
  return (
    <>
      <Seo title="About Alma Loyalty"
           description="Making loyalty economics easier to understand, defend, and improve. The mission behind Loyalty ROI Intelligence & Decisioning, powered by Alma AI OS."
           path="/about" />
      <Band tone="dark">
        <Container>
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'About' }]} />
          <Reveal className="max-w-[820px]">
            <Eyebrow>About Alma Loyalty</Eyebrow>
            <Headline as="h1" text="Making loyalty economics easier to understand, defend, and improve." highlight="understand, defend, and improve"
                      className="text-[clamp(30px,4.6vw,52px)] font-semibold mt-2" />
            <p className="text-ondarkmuted text-[clamp(16px,2vw,19px)] mt-6 max-w-[60ch]">
              Loyalty has never lacked enthusiasm; it has lacked a common, honest way to answer one question—can this program create incremental profit, and how do we know? Alma Loyalty exists to give vendors and brands that answer, in language finance and marketing can both trust.
            </p>
          </Reveal>
        </Container>
      </Band>

      <Band tone="light">
        <Container>
          <div className="max-w-[760px] mx-auto">
            <Reveal>
              <Eyebrow>The problem that started it</Eyebrow>
              <h2 className="text-[clamp(26px,3.5vw,38px)] font-semibold mt-2 mb-4">Too many programs are approved on faith and judged on the wrong number.</h2>
              <p className="text-onlightmuted text-[16px] mb-4">
                Programs get funded on optimism and later defended with member revenue—much of which would have happened anyway. When the real question is incremental profit after cost, most reporting simply does not answer it. That gap is where budgets get wasted and good programs get cancelled.
              </p>
              <p className="text-onlightmuted text-[16px]">
                Alma turns customer behavior, company economics, channel mix, program costs, and relevant benchmarks into a defensible range—with the assumptions and confidence shown. The methodology reflects more than a decade of work connecting loyalty strategy to member signup, purchase frequency, average order value, retention, and financial return. It is delivered as a connected suite, {BRAND.endorsement}.
              </p>
            </Reveal>
          </div>
        </Container>
      </Band>

      <Band tone="dark">
        <Container>
          <Reveal className="text-center max-w-[660px] mx-auto mb-14">
            <Eyebrow>What we believe</Eyebrow>
            <h2 className="text-[clamp(28px,4vw,44px)] font-semibold mt-2">{BRAND.vision}</h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {BELIEFS.map((b) => (
              <Reveal key={b.h}><DarkCard className="h-full"><h3 className="text-lg font-semibold text-ondark mb-1.5">{b.h}</h3><p className="text-ondarkmuted text-[14px]">{b.p}</p></DarkCard></Reveal>
            ))}
          </div>
        </Container>
      </Band>

      <CtaBand title="Talk with the team." highlight="the team"
               sub="Tell us whether you sell loyalty or run a program, and we will point you to the fastest path to value."
               primary={{ label: 'Book a Strategy Call', to: '/contact' }}
               secondary={{ label: 'Estimate Loyalty ROI', to: '/estimator' }} />
    </>
  )
}
