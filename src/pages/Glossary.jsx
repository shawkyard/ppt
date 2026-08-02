import { useState } from 'react'
import Seo from '../components/Seo.jsx'
import { Container, Band, Eyebrow, Headline, Reveal } from '../components/ui.jsx'
import { Breadcrumbs, CtaBand } from '../components/Shared.jsx'
import { GLOSSARY } from '../content/glossary.js'

export default function Glossary() {
  const [q, setQ] = useState('')
  const list = GLOSSARY.filter((g) => (g.term + g.def).toLowerCase().includes(q.toLowerCase()))
                       .sort((a, b) => a.term.localeCompare(b.term))
  return (
    <>
      <Seo title="Glossary of Loyalty & Finance Terms"
           description="Loyalty and finance terms defined in plain language: active member, incremental revenue, gross profit, break-even, CLV, breakage, liability, confidence, and more."
           path="/glossary" />
      <Band tone="dark">
        <Container>
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Glossary' }]} />
          <Reveal className="max-w-[820px]">
            <Eyebrow>Glossary</Eyebrow>
            <Headline as="h1" text="Loyalty and finance terms, in plain language." highlight="in plain language"
                      className="text-[clamp(30px,4.6vw,52px)] font-semibold mt-2" />
            <p className="text-ondarkmuted text-[clamp(16px,2vw,19px)] mt-6 max-w-[58ch]">
              Definitions a smart tenth-grader could follow—clear enough for marketing, precise enough for finance.
            </p>
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search terms…"
                   className="mt-8 w-full max-w-md bg-ink3 border border-brownline/40 rounded-xl px-4 py-3 text-ondark placeholder-ondarkdim focus:outline-none focus:border-orange" />
          </Reveal>
        </Container>
      </Band>

      <Band tone="light">
        <Container>
          <div className="max-w-[860px] mx-auto grid sm:grid-cols-2 gap-x-10 gap-y-8">
            {list.map((g) => (
              <div key={g.term} id={g.term.toLowerCase().replace(/[^a-z]+/g, '-')}>
                <h3 className="text-lg font-semibold mb-1.5">{g.term}</h3>
                <p className="text-onlightmuted text-[14.5px]">{g.def}</p>
              </div>
            ))}
          </div>
          {list.length === 0 && <p className="text-center text-onlightmuted py-12">No terms match “{q}”.</p>}
        </Container>
      </Band>

      <CtaBand title="See these ideas working on your numbers." highlight="on your numbers"
               sub="Every term above shows up in the estimator and the methodology."
               primary={{ label: 'Estimate Loyalty ROI', to: '/estimator' }}
               secondary={{ label: 'Read the Methodology', to: '/methodology' }} />
    </>
  )
}
