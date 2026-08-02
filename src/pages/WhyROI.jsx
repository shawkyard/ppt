import Seo from '../components/Seo.jsx'
import { Container, Band, Eyebrow, Headline, Reveal, Btn, Arrow } from '../components/ui.jsx'
import { Breadcrumbs, CtaBand } from '../components/Shared.jsx'

const POINTS = [
  { h: 'Member revenue can mislead', p: 'A large share of what members spend would have happened without the program. Counting all of it as loyalty revenue overstates the return.' },
  { h: 'Incremental vs. existing behavior', p: 'ROI depends on the change loyalty caused—extra visits, larger baskets, better retention—not on activity you already had.' },
  { h: 'Margin matters', p: 'Revenue is not profit. A program that lifts sales while eroding margin can lose money even as top-line grows.' },
  { h: 'Active members > total enrollment', p: 'Enrollment is easy to buy. Only members who participate in a financially meaningful way move the economics.' },
  { h: 'Cost is more than points', p: 'Reward redemption, liability, technology, implementation, staffing, and service all belong in the calculation.' },
  { h: 'A range beats one forecast', p: 'A single precise number hides uncertainty. A conservative-to-upside range with a confidence level is more honest and more useful.' },
  { h: 'Shared definitions', p: 'Finance and marketing often measure success differently. One ROI language lets them agree before spending.' },
]

const COMPARE = [
  ['Counts all member revenue as loyalty revenue', 'Credits only incremental behavior change'],
  ['Uses enrollment as a proxy for participation', 'Separates active members from names enrolled'],
  ['Reports revenue, ignores margin', 'Converts revenue to gross profit'],
  ['Excludes program and operating costs', 'Includes full cost of creating the value'],
  ['Presents one precise-looking number', 'Presents a range with a confidence level'],
  ['Treats correlation as causation', 'Uses baselines, cohorts, and controls'],
]

export default function WhyROI() {
  return (
    <>
      <Seo title="Why Loyalty ROI"
           description="Member revenue is not the same as loyalty ROI. Why incremental behavior, margin, active members, and full cost decide whether a program creates profit."
           path="/why-loyalty-roi" />
      <Band tone="dark">
        <Container>
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Why Loyalty ROI' }]} />
          <Reveal className="max-w-[820px]">
            <Eyebrow>Why Loyalty ROI</Eyebrow>
            <Headline as="h1" text="Member revenue is not the same as loyalty ROI." highlight="loyalty ROI"
                      className="text-[clamp(34px,5.4vw,58px)] font-semibold mt-2" />
            <p className="text-ondarkmuted text-[clamp(16px,2vw,19px)] mt-6 max-w-[58ch]">
              The most common loyalty mistake is celebrating member revenue that would have happened anyway. Here is what actually determines whether a program makes money.
            </p>
          </Reveal>
        </Container>
      </Band>

      <Band tone="light">
        <Container>
          <div className="grid md:grid-cols-2 gap-x-10 gap-y-8 max-w-[900px] mx-auto">
            {POINTS.map((p, i) => (
              <Reveal key={p.h}>
                <div className="flex gap-4">
                  <span className="font-serif font-semibold text-orange text-2xl flex-none">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="text-xl font-semibold mb-1.5">{p.h}</h3>
                    <p className="text-onlightmuted text-[15px]">{p.p}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Band>

      <Band tone="dark">
        <Container>
          <Reveal className="text-center max-w-[660px] mx-auto mb-12">
            <Eyebrow>The difference in practice</Eyebrow>
            <h2 className="text-[clamp(28px,4vw,44px)] font-semibold mt-2">Weak measurement vs. stronger measurement.</h2>
          </Reveal>
          <div className="max-w-[900px] mx-auto overflow-x-auto">
            <table className="w-full border-collapse text-[14.5px]">
              <thead>
                <tr>
                  <th className="text-left p-4 font-sans text-[12px] uppercase tracking-[0.1em] text-ondarkdim border-b border-[rgba(220,190,150,0.14)]">Weaker measurement</th>
                  <th className="text-left p-4 font-sans text-[12px] uppercase tracking-[0.1em] text-orange border-b border-[rgba(220,190,150,0.14)]">Stronger measurement</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map(([a, b], i) => (
                  <tr key={i}>
                    <td className="p-4 text-ondarkmuted border-b border-[rgba(220,190,150,0.08)]"><span className="text-ondarkdim mr-2">✕</span>{a}</td>
                    <td className="p-4 text-ondark border-b border-[rgba(220,190,150,0.08)]"><span className="text-orange mr-2">✓</span>{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-center mt-10">
            <Btn to="/methodology" variant="primary">Learn how Alma calculates ROI <Arrow /></Btn>
          </div>
        </Container>
      </Band>

      <CtaBand title="See what loyalty is really worth to your business." highlight="really worth"
               sub="Run the estimator with your own numbers and watch incremental profit, cost, and ROI update live."
               primary={{ label: 'Estimate Loyalty ROI', to: '/estimator' }}
               secondary={{ label: 'Read the Methodology', to: '/methodology' }} />
    </>
  )
}
