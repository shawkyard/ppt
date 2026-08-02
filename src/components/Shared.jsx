import { Link } from 'react-router-dom'
import { Container, Reveal, Card, Btn, Arrow, Eyebrow, Headline } from './ui.jsx'
import { PRODUCT_STRIP, OUTCOMES } from '../content/site.js'

// Dark product strip under the hero
export function ProductStrip() {
  return (
    <div className="border-t border-[rgba(220,190,150,0.14)] mt-[70px] bg-ink2">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
          {PRODUCT_STRIP.map((p, i) => (
            <Link key={p.h} to={p.to}
                  className={`px-[22px] py-[26px] transition-colors hover:bg-ink3 ${i < PRODUCT_STRIP.length - 1 ? 'lg:border-r border-[rgba(220,190,150,0.14)]' : ''}`}>
              <div className="w-[38px] h-[38px] rounded-[9px] text-orange grid place-items-center text-lg mb-3"
                   style={{ background: 'rgba(221,106,43,0.12)' }}>{p.icon}</div>
              <h4 className="font-sans font-semibold text-[14.5px] text-ondark">{p.h}</h4>
              <p className="text-[12.5px] text-ondarkdim mt-1">{p.p}</p>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  )
}

// Vendor/brand two-path chooser
export function PathChooser() {
  return (
    <div className="grid md:grid-cols-2 gap-5 max-w-[920px] mx-auto">
      <Reveal>
        <div className="bg-cream border border-brownline/25 rounded-2xl p-7 transition-all hover:-translate-y-1 hover:shadow-warm h-full">
          <div className="font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-orange">For loyalty vendors</div>
          <h3 className="text-2xl font-semibold mt-3 mb-2">I sell loyalty software or services</h3>
          <p className="text-onlightmuted text-[15px] mb-4">Find better-fit accounts, bring credible ROI into discovery, and help prospects understand what must be true for their program to pay back. (Vendors are the software developers and service companies that sell loyalty solutions to brands.)</p>
          <Link to="/for-vendors" className="text-orange font-semibold text-[14.5px] inline-flex items-center gap-1.5">Explore vendor solutions <Arrow /></Link>
        </div>
      </Reveal>
      <Reveal>
        <div className="bg-cream border border-brownline/25 rounded-2xl p-7 transition-all hover:-translate-y-1 hover:shadow-warm h-full">
          <div className="font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-orange">For brands</div>
          <h3 className="text-2xl font-semibold mt-3 mb-2">I lead loyalty for a brand</h3>
          <p className="text-onlightmuted text-[15px] mb-4">Build a business case finance can believe, audit an existing program, and identify the highest-value improvements to member behavior.</p>
          <Link to="/for-brands" className="text-orange font-semibold text-[14.5px] inline-flex items-center gap-1.5">Explore brand solutions <Arrow /></Link>
        </div>
      </Reveal>
    </div>
  )
}

// Four outcomes on a light band
export function Outcomes() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[18px]">
      {OUTCOMES.map((o) => (
        <Reveal key={o.h}>
          <Card icon={o.icon} title={o.h}>{o.p}</Card>
        </Reveal>
      ))}
    </div>
  )
}

// Accessible FAQ accordion
export function Faq({ items }) {
  return (
    <div className="max-w-[820px] mx-auto">
      {items.map((it, i) => (
        <details key={i} className="border-b border-brownline/30 py-1.5 group" open={i === 0}>
          <summary className="list-none cursor-pointer py-5 px-1 flex justify-between items-center gap-4 font-serif font-semibold text-[19px] text-onlight">
            {it.q}
            <span className="flex-none w-[26px] h-[26px] rounded-full border border-brownline/40 grid place-items-center text-orange text-lg transition-transform group-open:rotate-45">+</span>
          </summary>
          <div className="px-1 pb-5 text-onlightmuted text-[15.5px] leading-relaxed">{it.a}</div>
        </details>
      ))}
    </div>
  )
}

// Confidence ladder indicator (Directional/Moderate/Strong/Measured)
const LEVELS = ['Directional', 'Moderate', 'Strong', 'Measured']
export function Confidence({ level = 'Directional', tone = 'dark' }) {
  const idx = LEVELS.indexOf(level)
  const box = tone === 'dark' ? 'bg-ink3 border-[rgba(220,190,150,0.14)]' : 'bg-cream border-brownline/25'
  const dim = tone === 'dark' ? 'text-ondarkdim' : 'text-onlightmuted'
  const strong = tone === 'dark' ? 'text-ondark' : 'text-onlight'
  return (
    <div className={`rounded-[10px] border p-4 ${box}`}>
      <div className="flex justify-between items-center">
        <span className={`font-sans text-[11.5px] font-bold uppercase tracking-[0.1em] ${dim}`}>Confidence level</span>
        <span className="font-sans text-xs font-bold text-orange border border-orange rounded-full px-3 py-0.5">{level}</span>
      </div>
      <div className="flex gap-1.5 mt-3">
        {LEVELS.map((_, i) => (
          <span key={i} className="flex-1 h-1.5 rounded-full" style={{ background: i <= idx ? '#dd6a2b' : 'rgba(120,92,64,0.28)' }} />
        ))}
      </div>
      <p className={`text-xs mt-2.5 ${dim}`}>
        <b className={strong}>{level}</b> · based on benchmark assumptions. Replacing defaults with your actual customer, margin, and cost data moves this toward <b className={strong}>Moderate</b>, <b className={strong}>Strong</b>, and <b className={strong}>Measured</b>.
      </p>
    </div>
  )
}

// Reusable dark final CTA band
export function CtaBand({ eyebrow = 'Get started', title, highlight, sub, primary, secondary, tone = 'dark2' }) {
  const bg = tone === 'dark2' ? 'bg-ink2' : 'bg-ink'
  return (
    <section className={`py-[92px] ${bg}`}>
      <Container>
        <Reveal className="text-center max-w-[720px] mx-auto">
          <Eyebrow>{eyebrow}</Eyebrow>
          <Headline as="h2" text={title} highlight={highlight} className="text-[clamp(34px,5.4vw,60px)] font-medium mt-1" />
          {sub && <p className="text-ondarkmuted text-lg mt-5 mb-8 max-w-[52ch] mx-auto">{sub}</p>}
          <div className="flex gap-3 justify-center flex-wrap">
            {primary && <Btn to={primary.to} variant="primary">{primary.label} <Arrow /></Btn>}
            {secondary && <Btn to={secondary.to} variant="outline-dark">{secondary.label}</Btn>}
          </div>
        </Reveal>
      </Container>
    </section>
  )
}

// Breadcrumbs for inner pages
export function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="text-[13px] text-ondarkdim mb-6">
      {items.map((it, i) => (
        <span key={i}>
          {it.to ? <Link to={it.to} className="hover:text-orange">{it.label}</Link> : <span className="text-ondarkmuted">{it.label}</span>}
          {i < items.length - 1 && <span className="mx-2">/</span>}
        </span>
      ))}
    </nav>
  )
}
