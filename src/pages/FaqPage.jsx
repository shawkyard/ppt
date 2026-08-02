import Seo from '../components/Seo.jsx'
import { Container, Band, Eyebrow, Headline, Reveal } from '../components/ui.jsx'
import { Breadcrumbs, Faq, CtaBand } from '../components/Shared.jsx'
import { FAQ_CATEGORIES } from '../content/faqs.js'

export default function FaqPage() {
  return (
    <>
      <Seo title="Frequently Asked Questions"
           description="Answers on Alma Loyalty's accuracy, methodology, data and privacy, vendor and brand use, pricing, and integrations."
           path="/faq" />
      <Band tone="dark">
        <Container>
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'FAQ' }]} />
          <Reveal className="max-w-[820px]">
            <Eyebrow>Frequently asked questions</Eyebrow>
            <Headline as="h1" text="Everything finance, marketing, and sales want to know." highlight="want to know"
                      className="text-[clamp(30px,4.6vw,52px)] font-semibold mt-2" />
          </Reveal>
        </Container>
      </Band>

      {FAQ_CATEGORIES.map((cat, i) => (
        <Band key={cat.title} tone={i % 2 === 0 ? 'light' : 'cream'}>
          <Container>
            <Reveal className="mb-8 max-w-[820px] mx-auto">
              <Eyebrow>{cat.title}</Eyebrow>
            </Reveal>
            <Faq items={cat.items} />
          </Container>
        </Band>
      ))}

      <CtaBand title="Still have a question?" highlight="a question"
               sub="Talk with the team, or just run the estimator and see the answer on your own numbers."
               primary={{ label: 'Book a Strategy Call', to: '/contact' }}
               secondary={{ label: 'Estimate Loyalty ROI', to: '/estimator' }} />
    </>
  )
}
