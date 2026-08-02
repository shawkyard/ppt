import { Link } from 'react-router-dom'
import Seo from '../components/Seo.jsx'
import { Container, Band, Eyebrow, Headline, Reveal, Card, DarkCard, Btn, Arrow } from '../components/ui.jsx'
import { ProductStrip, PathChooser, Outcomes, Faq, CtaBand } from '../components/Shared.jsx'
import Rings from '../components/Rings.jsx'
import Estimator from '../components/Estimator.jsx'
import { BRAND } from '../content/site.js'
import { HOME_FAQS } from '../content/faqs.js'

const STEPS = [
  { h: 'Understand the business', p: 'Customers, channels, frequency, order value, and margin—the real starting point.' },
  { h: 'Build scenarios', p: 'Conservative, expected, and upside outcomes from the data and relevant benchmarks.' },
  { h: 'Find break-even', p: 'The active membership and behavior lift required to pay back.' },
  { h: 'Act on the drivers', p: 'The highest-value decisions across active members, frequency, AOV, and retention.' },
  { h: 'Measure actuals', p: 'Compare real performance against the original case, and improve.' },
]

export default function Home() {
  return (
    <>
      <Seo title="Loyalty ROI Intelligence & Decisioning"
           description="Know whether loyalty will make money before you spend to build it. Alma Loyalty estimates incremental profit, ROI range, payback, and break-even—so vendors close better accounts and brands build a business case finance can believe."
           path="/" />

      {/* HERO */}
      <header className="bg-ink pt-[84px] relative overflow-hidden">
        <div className="absolute w-[900px] h-[900px] right-[-320px] top-[-260px] rounded-full pointer-events-none"
             style={{ background: 'radial-gradient(circle, rgba(221,106,43,0.20), transparent 60%)' }} />
        <Container>
          <div className="grid lg:grid-cols-[1.08fr_0.92fr] gap-10 items-center relative z-10">
            <Reveal>
              <Eyebrow>{BRAND.category}</Eyebrow>
              <Headline as="h1" text="Know whether loyalty will make money—before you spend to build it."
                        highlight="make money"
                        className="text-[clamp(40px,6.2vw,68px)] font-semibold max-w-[16ch]" />
              <p className="text-ondarkmuted text-[clamp(16px,2vw,19px)] max-w-[52ch] mt-6">
                Alma Loyalty estimates the incremental revenue, gross profit, cost, break-even point, and confidence range of a loyalty program. Vendors use it to find and close the right accounts. Brands use it to build the business case and improve the decisions that drive profitable member behavior.
              </p>
              <div className="flex gap-3 mt-8 flex-wrap">
                <Btn to="/estimator" variant="primary">Estimate Loyalty ROI <Arrow /></Btn>
                <Btn to="/for-vendors" variant="outline-dark">Explore Solutions for Vendors</Btn>
              </div>
              <Link to="/methodology" className="inline-flex items-center gap-1.5 mt-6 text-ondarkmuted text-[14.5px] font-medium hover:text-orange">
                See how the methodology works <Arrow />
              </Link>
            </Reveal>
            <Reveal><Rings /></Reveal>
          </div>
        </Container>
        <ProductStrip />
      </header>

      {/* TWO-PATH */}
      <Band tone="light">
        <Container>
          <Reveal className="text-center max-w-[720px] mx-auto mb-14">
            <Eyebrow>Choose your starting point</Eyebrow>
            <h2 className="text-[clamp(28px,4vw,44px)] font-semibold mt-2">{BRAND.ecosystem}</h2>
          </Reveal>
          <PathChooser />
        </Container>
      </Band>

      {/* THE HARD QUESTION */}
      <Band tone="dark">
        <Container>
          <Reveal className="max-w-[820px] mx-auto text-center">
            <Eyebrow>The hard question</Eyebrow>
            <Headline as="h2" text="Member revenue is not the same as loyalty ROI." highlight="loyalty ROI"
                      className="text-[clamp(32px,5vw,58px)] font-medium mt-2" />
            <p className="text-ondarkmuted text-[19px] mt-6">
              A program can generate a great deal of revenue from members and still fail to create incremental profit. Much of that revenue was going to happen anyway. Alma separates the change loyalty actually caused—more active members, more frequent visits, larger baskets, better retention—from revenue you already had, then weighs it against the full cost of creating it.
            </p>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-[18px] max-w-[860px] mx-auto mt-11">
            <Reveal>
              <DarkCard>
                <h4 className="font-sans text-[13px] font-bold uppercase tracking-[0.1em] text-ondarkdim mb-3.5">Weaker measurement</h4>
                <ul className="space-y-2">
                  {['Counts all member revenue as loyalty revenue', 'Uses enrollment as a stand-in for participation', 'Ignores margin and program costs', 'Treats correlation as guaranteed causation', 'Reports one precise-looking number'].map((t) => (
                    <li key={t} className="flex gap-2.5 text-ondarkmuted text-[14.5px]"><span className="text-ondarkdim flex-none">✕</span>{t}</li>
                  ))}
                </ul>
              </DarkCard>
            </Reveal>
            <Reveal>
              <div className="bg-ink3 border border-orange/50 rounded-2xl p-7 h-full">
                <h4 className="font-sans text-[13px] font-bold uppercase tracking-[0.1em] text-orange mb-3.5">The Alma way</h4>
                <ul className="space-y-2">
                  {['Isolates incremental behavior change', 'Separates active members from names enrolled', 'Evaluates value after full program cost', 'Compares members with baselines & controls', 'Shows a range with an honest confidence level'].map((t) => (
                    <li key={t} className="flex gap-2.5 text-ondarkmuted text-[14.5px]"><span className="text-orange flex-none">✓</span>{t}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </Container>
      </Band>

      {/* FOUR OUTCOMES */}
      <Band tone="light">
        <Container>
          <Reveal className="text-center max-w-[660px] mx-auto mb-14">
            <Eyebrow>What drives the return</Eyebrow>
            <h2 className="text-[clamp(28px,4vw,44px)] font-semibold mt-2">Four outcomes every loyalty decision should move.</h2>
            <p className="text-lg mt-4 text-onlightmuted">The estimator below is built on these levers. Change one and watch the economics respond.</p>
          </Reveal>
          <Outcomes />
        </Container>
      </Band>

      {/* HOW IT WORKS */}
      <Band tone="dark">
        <Container>
          <Reveal className="text-center max-w-[660px] mx-auto mb-14">
            <Eyebrow>How it works</Eyebrow>
            <h2 className="text-[clamp(28px,4vw,44px)] font-semibold mt-2">Model the economics before launch. Measure the right changes after.</h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {STEPS.map((s, i) => (
              <Reveal key={s.h}>
                <DarkCard className="h-full">
                  <div className="font-serif font-semibold text-lg w-9 h-9 rounded-[10px] bg-orange text-[#241206] grid place-items-center mb-3">{i + 1}</div>
                  <h3 className="text-[17px] font-semibold text-ondark mb-1.5">{s.h}</h3>
                  <p className="text-ondarkmuted text-[14px]">{s.p}</p>
                </DarkCard>
              </Reveal>
            ))}
          </div>
        </Container>
      </Band>

      {/* ESTIMATOR */}
      <Band tone="cream" id="estimator">
        <Container>
          <Reveal className="text-center max-w-[660px] mx-auto mb-14">
            <Eyebrow>Loyalty Opportunity Estimator</Eyebrow>
            <Headline as="h2" text="Could loyalty make money for this business?" highlight="make money"
                      className="text-[clamp(28px,4vw,44px)] font-semibold mt-2" />
            <p className="text-lg mt-4 text-onlightmuted">Start with a few accessible inputs. Every default is a labeled assumption you can replace with your own data. Results update instantly, with conservative, expected, and upside scenarios.</p>
          </Reveal>
          <Estimator />
        </Container>
      </Band>

      {/* CONNECTED PLATFORM */}
      <Band tone="light">
        <Container>
          <Reveal className="text-center max-w-[660px] mx-auto mb-14">
            <Eyebrow>One connected platform</Eyebrow>
            <h2 className="text-[clamp(28px,4vw,44px)] font-semibold mt-2">Every product runs on the same ROI foundation.</h2>
            <p className="text-lg mt-4 text-onlightmuted">Calculators, audits, account intelligence, sales enablement, and portfolio monitoring all use one methodology—so the numbers stay consistent from first touch to renewal.</p>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-[18px]">
            <Reveal><Card icon="◫" title="Calculators" to="/calculators">A library of 50+ models by business type, channel, and decision.</Card></Reveal>
            <Reveal><Card icon="◈" title="ROI Audit" to="/solutions/roi-audit">Find where a live program creates value—and where it leaks it.</Card></Reveal>
            <Reveal><Card icon="◎" title="Pre-Scope Intelligence" to="/for-vendors/pre-scope">Rank accounts by likely economic fit, with evidence and confidence.</Card></Reveal>
            <Reveal><Card icon="◆" title="Vendor Sales Toolkit" to="/for-vendors/sales-toolkit">Turn a target account into an ROI-centered proposal.</Card></Reveal>
            <Reveal><Card icon="▤" title="Portfolio Intelligence" to="/for-vendors/portfolio">Compare the original business case with actual performance.</Card></Reveal>
            <Reveal><Card icon="⚖" title="Methodology" to="/methodology">Plain-language ROI logic with assumptions and confidence.</Card></Reveal>
          </div>
        </Container>
      </Band>

      {/* FAQ */}
      <Band tone="cream">
        <Container>
          <Reveal className="text-center max-w-[560px] mx-auto mb-14">
            <Eyebrow>Everything you need to know</Eyebrow>
            <h2 className="text-[clamp(28px,4vw,44px)] font-semibold mt-2">Questions finance and marketing both ask.</h2>
          </Reveal>
          <Faq items={HOME_FAQS} />
          <div className="text-center mt-10">
            <Btn to="/faq" variant="outline-light">See all FAQs <Arrow /></Btn>
          </div>
        </Container>
      </Band>

      <CtaBand title="Find out what loyalty could be worth." highlight="worth"
               sub="Send yourself a detailed scenario report, or talk with the team about scoring an account list, auditing a live program, or building an executive-ready business case."
               primary={{ label: 'Estimate Loyalty ROI', to: '/estimator' }}
               secondary={{ label: 'Book a Strategy Call', to: '/contact' }} />
    </>
  )
}
