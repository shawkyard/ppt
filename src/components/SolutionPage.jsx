import { SOLUTIONS } from '../content/solutions.js'
import Seo from './Seo.jsx'
import { Container, Band, Eyebrow, Headline, Reveal, Card, DarkCard, Btn, Arrow, IllustrativeNote } from './ui.jsx'
import { Breadcrumbs, Faq, CtaBand } from './Shared.jsx'
import NotFound from '../pages/NotFound.jsx'

export default function SolutionPage({ slug }) {
  const d = SOLUTIONS[slug]
  if (!d) return <NotFound />

  const path = d.breadcrumb ? '/' + slug : undefined

  return (
    <>
      <Seo title={d.seo.title} description={d.seo.description} path={path} />

      {/* Hero */}
      <Band tone="dark">
        <Container>
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, ...d.breadcrumb]} />
          <Reveal className="max-w-[820px]">
            <Eyebrow>{d.audience}</Eyebrow>
            <Headline as="h1" text={d.h1} highlight={d.highlight}
                      className="text-[clamp(34px,5.4vw,58px)] font-semibold mt-2" />
            <p className="text-ondarkmuted text-[clamp(16px,2vw,19px)] mt-6 max-w-[58ch]">{d.sub}</p>
            <div className="flex gap-3 mt-8 flex-wrap">
              <Btn to={d.cta.primary.to} variant="primary">{d.cta.primary.label} <Arrow /></Btn>
              {d.cta.secondary && <Btn to={d.cta.secondary.to} variant="outline-dark">{d.cta.secondary.label}</Btn>}
            </div>
          </Reveal>
        </Container>
      </Band>

      {/* Intro + cards on light */}
      <Band tone="light">
        <Container>
          <Reveal className="max-w-[760px]">
            {d.intro.map((p, i) => (
              <p key={i} className={`text-onlightmuted ${i === 0 ? 'text-[19px] text-onlight font-serif' : 'text-[16px] mt-5'}`}>{p}</p>
            ))}
          </Reveal>
          {d.cards && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-[18px] mt-12">
              {d.cards.map((c) => (
                <Reveal key={c.h}><Card icon={c.icon} title={c.h}>{c.p}</Card></Reveal>
              ))}
            </div>
          )}
          {d.illustrative && <IllustrativeNote tone="light">{d.illustrative}</IllustrativeNote>}
        </Container>
      </Band>

      {/* How it works (steps) on dark */}
      {d.steps && (
        <Band tone="dark">
          <Container>
            <Reveal className="mb-12">
              <Eyebrow>How it works</Eyebrow>
              <h2 className="text-[clamp(28px,4vw,42px)] font-semibold mt-2">A clear, explainable workflow.</h2>
            </Reveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {d.steps.map((s, i) => (
                <Reveal key={s.h}>
                  <DarkCard>
                    <div className="font-serif font-semibold text-lg w-9 h-9 rounded-[10px] bg-orange text-[#241206] grid place-items-center mb-3">{i + 1}</div>
                    <h3 className="text-lg font-semibold text-ondark mb-1.5">{s.h}</h3>
                    <p className="text-ondarkmuted text-[14.5px]">{s.p}</p>
                  </DarkCard>
                </Reveal>
              ))}
            </div>
          </Container>
        </Band>
      )}

      {/* Bullets / outputs on cream */}
      {d.bullets && (
        <Band tone="cream">
          <Container>
            <div className="max-w-[820px] mx-auto bg-cream border border-brownline/25 rounded-2xl p-8 md:p-10">
              <h2 className="text-2xl font-semibold mb-6">{d.bullets.title}</h2>
              <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
                {d.bullets.items.map((it, i) => (
                  <li key={i} className="flex gap-3 text-onlightmuted text-[15px]">
                    <span className="text-orange flex-none">✓</span><span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </Band>
      )}

      {/* FAQ on light */}
      {d.faqs && (
        <Band tone="light">
          <Container>
            <Reveal className="text-center mb-12 max-w-[560px] mx-auto">
              <Eyebrow>Questions</Eyebrow>
              <h2 className="text-[clamp(28px,4vw,40px)] font-semibold mt-2">Good to know.</h2>
            </Reveal>
            <Faq items={d.faqs} />
          </Container>
        </Band>
      )}

      <CtaBand title={d.cta.title} highlight={d.cta.highlight} sub={d.cta.sub}
               primary={d.cta.primary} secondary={d.cta.secondary} />
    </>
  )
}
