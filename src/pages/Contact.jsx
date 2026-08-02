import { useState } from 'react'
import Seo from '../components/Seo.jsx'
import { Container, Band, Eyebrow, Headline, Reveal } from '../components/ui.jsx'
import { Breadcrumbs } from '../components/Shared.jsx'

const ROLES = [
  { v: 'vendor', l: 'Loyalty vendor', p: 'I sell loyalty software or services.' },
  { v: 'brand', l: 'Brand', p: 'I run or plan a program.' },
  { v: 'partner', l: 'Consultant / partner', p: 'I advise or implement for others.' },
  { v: 'other', l: 'Something else', p: 'Analyst, investor, or exploring.' },
]

const NEXT = {
  vendor: 'We will show how account scoring and prospect-specific ROI fit your sales motion, and set up a walkthrough with a sample list.',
  brand: 'We will help you build a conservative business case and, if you have a live program, scope an ROI audit.',
  partner: 'We will discuss white-label and portfolio options and how Alma fits your engagements.',
  other: 'We will point you to the methodology and the resources most relevant to your question.',
}

export default function Contact() {
  const [role, setRole] = useState('')
  const [sent, setSent] = useState(false)

  return (
    <>
      <Seo title="Contact & Book a Strategy Call"
           description="Tell us whether you are a loyalty vendor, a brand, or a partner, and we will point you to the fastest path to value."
           path="/contact" />
      <Band tone="dark">
        <Container>
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Contact' }]} />
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 items-start">
            <Reveal>
              <Eyebrow>Contact</Eyebrow>
              <Headline as="h1" text="Let’s find out what loyalty could be worth." highlight="what loyalty could be worth"
                        className="text-[clamp(30px,4.4vw,50px)] font-semibold mt-2" />
              <p className="text-ondarkmuted text-[17px] mt-6 max-w-[48ch]">
                Pick what describes you and we will only ask what we need. No spam, no sharing your inputs—see the Security &amp; Data Use page for how we handle information.
              </p>
              <div className="mt-8 space-y-3 text-ondarkmuted text-[15px]">
                <p>› Prefer to explore first? Run the <a href="/estimator" className="text-orange">Loyalty Opportunity Estimator</a>.</p>
                <p>› Want the logic? Read the <a href="/methodology" className="text-orange">methodology</a>.</p>
              </div>
            </Reveal>

            <Reveal>
              <div className="bg-ink3 border border-brownline/40 rounded-2xl p-8">
                {sent ? (
                  <div role="status" className="text-center py-8">
                    <div className="text-orange text-4xl mb-4">✓</div>
                    <h2 className="text-2xl font-semibold text-ondark mb-2">Thanks — you’re set.</h2>
                    <p className="text-ondarkmuted">{NEXT[role] || 'We will be in touch shortly with the most relevant next step.'}</p>
                    <p className="text-ondarkdim text-sm mt-4">This is a demonstration form; no data was transmitted.</p>
                  </div>
                ) : (
                  <form onSubmit={(e) => { e.preventDefault(); setSent(true) }}>
                    <div className="mb-6">
                      <label className="block text-[13px] font-semibold text-ondark mb-3">I am a…</label>
                      <div className="grid sm:grid-cols-2 gap-2.5">
                        {ROLES.map((r) => (
                          <button type="button" key={r.v} onClick={() => setRole(r.v)}
                                  className={`text-left p-3.5 rounded-xl border transition-colors ${role === r.v ? 'border-orange bg-[rgba(221,106,43,0.12)]' : 'border-brownline/40 hover:border-orange/60'}`}>
                            <div className="font-semibold text-ondark text-[14px]">{r.l}</div>
                            <div className="text-ondarkdim text-[12px] mt-0.5">{r.p}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                    {[
                      { id: 'name', label: 'Name', type: 'text' },
                      { id: 'email', label: 'Work email', type: 'email' },
                      { id: 'company', label: 'Company', type: 'text' },
                    ].map((f) => (
                      <div className="mb-4" key={f.id}>
                        <label htmlFor={f.id} className="block text-[13px] font-semibold text-ondark mb-1.5">{f.label}</label>
                        <input id={f.id} type={f.type} required
                               className="w-full bg-ink border border-brownline/40 rounded-lg px-3.5 py-2.5 text-ondark placeholder-ondarkdim focus:outline-none focus:border-orange" />
                      </div>
                    ))}
                    <div className="mb-6">
                      <label htmlFor="msg" className="block text-[13px] font-semibold text-ondark mb-1.5">What are you trying to figure out? <span className="text-ondarkdim font-normal">(optional)</span></label>
                      <textarea id="msg" rows={3}
                                className="w-full bg-ink border border-brownline/40 rounded-lg px-3.5 py-2.5 text-ondark placeholder-ondarkdim focus:outline-none focus:border-orange" />
                    </div>
                    <button type="submit" className="btn-primary w-full">Book a Strategy Call →</button>
                    <p className="text-ondarkdim text-[12px] mt-3 text-center">We reply within one business day. Your inputs are never sold or shared.</p>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </Container>
      </Band>
    </>
  )
}
