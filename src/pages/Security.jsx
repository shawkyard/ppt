import Seo from '../components/Seo.jsx'
import { Container, Band, Eyebrow, Headline, Reveal } from '../components/ui.jsx'
import { Breadcrumbs, CtaBand } from '../components/Shared.jsx'

const SECTIONS = [
  { h: 'Public research vs. confidential uploads', p: 'Alma treats public company research very differently from information you upload. Public data supports account scoring; confidential inputs—CRM lists, financials, program data—are handled as restricted and are never exposed publicly.' },
  { h: 'Data categories', p: 'We distinguish public/licensed data, account-level inputs you provide, program and transaction data, and generated outputs (scores, scenarios, reports). Each category has its own handling rules.' },
  { h: 'Permitted use', p: 'Your confidential data is used to produce your results. It is not sold, and it is not used to build products for competitors. Any use of aggregated, de-identified benchmarks is described transparently.' },
  { h: 'Access & isolation', p: 'Access follows least privilege, and confidential data is isolated per customer. Uploaded files, account lists, model assumptions, and reports are never exposed in client-side code or public storage.' },
  { h: 'Retention & user controls', p: 'Data is retained only as long as needed to deliver the engagement, and you can request export or deletion. Retention windows are set per engagement.' },
  { h: 'Third parties', p: 'Where enrichment or infrastructure providers are involved, they are bound by contract to appropriate confidentiality and security terms. We name providers and license permissions only when confirmed.' },
]

export default function Security() {
  return (
    <>
      <Seo title="Security, Privacy & Data Use"
           description="How Alma Loyalty handles data: public research vs. confidential uploads, permitted use, access, retention, and user controls."
           path="/security" />
      <Band tone="dark">
        <Container>
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Security & Data Use' }]} />
          <Reveal className="max-w-[820px]">
            <Eyebrow>Security, privacy & data use</Eyebrow>
            <Headline as="h1" text="Your confidential data is treated as confidential." highlight="confidential"
                      className="text-[clamp(30px,4.6vw,52px)] font-semibold mt-2" />
            <p className="text-ondarkmuted text-[clamp(16px,2vw,19px)] mt-6 max-w-[58ch]">
              This page describes how we handle information in operational terms. We do not claim certifications or controls we do not have; where a claim requires verification, we confirm it before relying on it.
            </p>
          </Reveal>
        </Container>
      </Band>

      <Band tone="light">
        <Container>
          <div className="max-w-[820px] mx-auto space-y-8">
            {SECTIONS.map((s) => (
              <Reveal key={s.h}>
                <div>
                  <h2 className="text-xl font-semibold mb-2">{s.h}</h2>
                  <p className="text-onlightmuted text-[15.5px]">{s.p}</p>
                </div>
              </Reveal>
            ))}
            <p className="text-onlightmuted text-[13px] border-l-2 border-brownline/40 pl-4">
              This overview is operational and coordinates with our legal documents. It is not itself a legal contract; the Privacy Policy and Terms of Use govern in case of any conflict, and those are reviewed by qualified counsel before publication.
            </p>
          </div>
        </Container>
      </Band>

      <CtaBand title="Questions about data handling?" highlight="data handling"
               sub="We are happy to walk security and procurement teams through specifics before any data is shared."
               primary={{ label: 'Contact Us', to: '/contact' }}
               secondary={{ label: 'Read the Methodology', to: '/methodology' }} />
    </>
  )
}
