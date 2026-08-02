import { Link } from 'react-router-dom'
import Seo from '../components/Seo.jsx'
import { Container, Band, Eyebrow, Headline, Reveal, Card } from '../components/ui.jsx'
import { Breadcrumbs, CtaBand } from '../components/Shared.jsx'

// Resource hub organized around real questions. Each links to the page that answers it.
const GUIDES = [
  { q: 'How do you measure loyalty ROI?', to: '/methodology' },
  { q: 'What counts as incremental loyalty revenue?', to: '/why-loyalty-roi' },
  { q: 'How many active members are required to break even?', to: '/estimator' },
  { q: 'What is a good loyalty-program ROI?', to: '/methodology' },
  { q: 'How should finance evaluate loyalty?', to: '/why-loyalty-roi' },
  { q: 'How do rewards, points, breakage, and liability affect ROI?', to: '/calculators' },
  { q: 'Why do loyalty programs fail?', to: '/why-loyalty-roi' },
  { q: 'How do vendors prove ROI before implementation?', to: '/for-vendors/roi-reports' },
  { q: 'How do you compare loyalty platforms?', to: '/program-matcher' },
]

const HUBS = [
  { icon: '⚖', h: 'How Loyalty ROI Works', p: 'The methodology in plain English.', to: '/methodology' },
  { icon: '◫', h: 'Calculator Library', p: '50+ models by decision and channel.', to: '/calculators' },
  { icon: '≡', h: 'Glossary', p: 'Loyalty and finance terms, defined simply.', to: '/glossary' },
  { icon: '?', h: 'FAQ', p: 'Credibility, data, accuracy, cost, and security.', to: '/faq' },
]

export default function Resources() {
  return (
    <>
      <Seo title="Resources, Guides & Insights"
           description="Original educational content on loyalty ROI: how to measure it, what counts as incremental, break-even, and how to compare platforms."
           path="/resources" />
      <Band tone="dark">
        <Container>
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Resources' }]} />
          <Reveal className="max-w-[820px]">
            <Eyebrow>Resources, guides & insights</Eyebrow>
            <Headline as="h1" text="Straight answers to the questions loyalty teams actually ask." highlight="straight answers"
                      className="text-[clamp(30px,4.6vw,52px)] font-semibold mt-2" />
            <p className="text-ondarkmuted text-[clamp(16px,2vw,19px)] mt-6 max-w-[58ch]">
              Educational content built around real decisions—no fluff, no invented statistics. Each question links to the page that answers it in depth.
            </p>
          </Reveal>
        </Container>
      </Band>

      <Band tone="light">
        <Container>
          <Reveal className="mb-10">
            <Eyebrow>Start here</Eyebrow>
            <h2 className="text-[clamp(26px,3.5vw,40px)] font-semibold mt-2">Core hubs.</h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-[18px] mb-16">
            {HUBS.map((h) => (
              <Reveal key={h.h}><Card icon={h.icon} title={h.h} to={h.to}>{h.p}</Card></Reveal>
            ))}
          </div>

          <Reveal className="mb-8">
            <Eyebrow>By question</Eyebrow>
            <h2 className="text-[clamp(26px,3.5vw,40px)] font-semibold mt-2">Guides &amp; research.</h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {GUIDES.map((g) => (
              <Reveal key={g.q}>
                <Link to={g.to} className="block bg-cream border border-brownline/25 rounded-2xl p-6 transition-all hover:border-orange/50 hover:-translate-y-1 h-full">
                  <h3 className="text-[16px] font-semibold leading-snug">{g.q}</h3>
                  <span className="text-orange text-[13px] font-semibold mt-3 inline-block">Read →</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </Band>

      <CtaBand title="Prefer to see it on your own numbers?" highlight="your own numbers"
               sub="The estimator turns these ideas into a result for your business in a few minutes."
               primary={{ label: 'Estimate Loyalty ROI', to: '/estimator' }}
               secondary={{ label: 'Browse Calculators', to: '/calculators' }} />
    </>
  )
}
