import { useState } from 'react'
import Seo from '../components/Seo.jsx'
import { Container, Band, Eyebrow, Headline, Reveal, Btn, Arrow, IllustrativeNote } from '../components/ui.jsx'
import { Breadcrumbs, CtaBand } from '../components/Shared.jsx'

const QUESTIONS = [
  { id: 'model', q: 'What is your business model?', opts: [
    { v: 'b2c', l: 'B2C — sell to consumers' },
    { v: 'b2b', l: 'B2B / channel / partner' },
    { v: 'sub', l: 'Subscription or membership' },
  ]},
  { id: 'freq', q: 'How often does a typical customer buy?', opts: [
    { v: 'high', l: 'Frequently (weekly / monthly)' },
    { v: 'mid', l: 'Occasionally (a few times a year)' },
    { v: 'low', l: 'Rarely (once a year or less)' },
  ]},
  { id: 'margin', q: 'What is your gross margin like?', opts: [
    { v: 'high', l: 'Healthy (50%+)' },
    { v: 'mid', l: 'Moderate (25–50%)' },
    { v: 'low', l: 'Thin (under 25%)' },
  ]},
  { id: 'data', q: 'How well can you identify customers across purchases?', opts: [
    { v: 'high', l: 'Well — most purchases are identified' },
    { v: 'mid', l: 'Partly — some are identified' },
    { v: 'low', l: 'Poorly — mostly anonymous' },
  ]},
]

function profile(a) {
  const notes = []
  let structure = 'a points or visit-based program'
  if (a.model === 'sub') structure = 'a paid / subscription loyalty structure'
  else if (a.model === 'b2b') structure = 'a partner or share-of-wallet program'
  else if (a.freq === 'high') structure = 'a frequency-focused points program'
  else if (a.margin === 'low') structure = 'an experiential or threshold-reward program (to protect margin)'
  else if (a.freq === 'low') structure = 'a tiered or high-value benefit program'

  if (a.data === 'low') notes.push('Improving customer identification is the first priority—without it, results are hard to measure and the program is hard to run.')
  if (a.margin === 'low') notes.push('With thin margins, reward cost is the deciding factor. Favor low-cost or partner-funded benefits over broad discounts.')
  if (a.freq === 'low') notes.push('Low purchase frequency limits points-style mechanics; retention and lifetime value usually matter more than visit count.')
  if (a.model === 'b2b') notes.push('B2B economics turn on retaining and expanding a few high-value accounts, not many small transactions.')
  if (notes.length === 0) notes.push('Your profile supports a straightforward program; focus early effort on activating members and measuring incremental behavior.')

  const calc = a.model === 'sub' ? { l: 'Subscription & Paid Loyalty ROI', to: '/channels/subscription' }
    : a.model === 'b2b' ? { l: 'B2B, Partner & Channel Loyalty ROI', to: '/channels/b2b' }
    : a.freq === 'high' ? { l: 'Purchase-Frequency Lift', to: '/for-brands/purchase-frequency' }
    : { l: 'Improve Retention & CLV', to: '/for-brands/retention' }

  return { structure, notes, calc }
}

export default function ProgramMatcher() {
  const [answers, setAnswers] = useState({})
  const done = QUESTIONS.every((q) => answers[q.id])
  const result = done ? profile(answers) : null

  return (
    <>
      <Seo title="Loyalty Program Matcher"
           description="Find the loyalty approach that fits your economics, customers, and operating reality. A guided assessment with a transparent fit profile—not an automatic vendor endorsement."
           path="/program-matcher" />
      <Band tone="dark">
        <Container>
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'For Brands', to: '/for-brands' }, { label: 'Program Matcher' }]} />
          <Reveal className="max-w-[820px]">
            <Eyebrow>Program Matcher</Eyebrow>
            <Headline as="h1" text="Find the loyalty approach that fits your economics, customers, and operating reality." highlight="fits your economics"
                      className="text-[clamp(30px,4.6vw,52px)] font-semibold mt-2" />
            <p className="text-ondarkmuted text-[clamp(16px,2vw,19px)] mt-6 max-w-[58ch]">
              Answer four quick questions for a transparent fit profile. This is a starting point that explains tradeoffs—not an automatic endorsement of any single vendor.
            </p>
          </Reveal>
        </Container>
      </Band>

      <Band tone="cream">
        <Container>
          <div className="max-w-[820px] mx-auto grid gap-6">
            {QUESTIONS.map((q) => (
              <div key={q.id} className="bg-cream border border-brownline/25 rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4">{q.q}</h3>
                <div className="flex flex-wrap gap-2.5">
                  {q.opts.map((o) => (
                    <button key={o.v} onClick={() => setAnswers((a) => ({ ...a, [q.id]: o.v }))}
                            className={`px-4 py-2.5 rounded-xl text-[14px] font-medium border transition-colors ${answers[q.id] === o.v ? 'bg-orange text-[#241206] border-orange' : 'border-brownline/40 text-onlightmuted hover:border-orange'}`}>
                      {o.l}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {result && (
              <div className="bg-ink text-ondark border border-orange/40 rounded-2xl p-8">
                <Eyebrow>Your fit profile</Eyebrow>
                <h3 className="text-2xl font-semibold mt-2 mb-4 text-ondark">Your economics point toward {result.structure}.</h3>
                <ul className="space-y-2.5 mb-6">
                  {result.notes.map((n, i) => (
                    <li key={i} className="flex gap-3 text-ondarkmuted text-[15px]"><span className="text-orange flex-none">›</span>{n}</li>
                  ))}
                </ul>
                <div className="flex gap-3 flex-wrap">
                  <Btn to={result.calc.to} variant="primary">Model this: {result.calc.l} <Arrow /></Btn>
                  <Btn to="/contact" variant="outline-dark">Discuss with our team</Btn>
                </div>
                <IllustrativeNote tone="dark">This fit profile is guidance based on your answers, not a vendor recommendation. Alma discloses any paid relationship or limited vendor pool where one exists.</IllustrativeNote>
              </div>
            )}
          </div>
        </Container>
      </Band>

      <CtaBand title="Turn a fit profile into a real business case." highlight="a real business case"
               sub="Match points you to a structure; the estimator tells you whether it pays back."
               primary={{ label: 'Estimate Loyalty ROI', to: '/estimator' }}
               secondary={{ label: 'Talk With the Team', to: '/contact' }} />
    </>
  )
}
