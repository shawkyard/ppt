import { Link } from 'react-router-dom'
import Seo from '../components/Seo.jsx'
import { Container, Band, Eyebrow, Headline, Reveal } from '../components/ui.jsx'
import { Breadcrumbs } from '../components/Shared.jsx'

const GROUPS = [
  { title: 'Understand', links: [
    ['Home', '/'], ['Platform Overview', '/platform'], ['Why Loyalty ROI', '/why-loyalty-roi'],
    ['How We Calculate ROI', '/methodology'], ['Data, Benchmarks & Confidence', '/data-confidence'],
  ]},
  { title: 'For Vendors', links: [
    ['Vendor Overview', '/for-vendors'], ['Pre-Scope Intelligence', '/for-vendors/pre-scope'],
    ['Account Prioritization', '/for-vendors/account-prioritization'], ['Vendor Sales Toolkit', '/for-vendors/sales-toolkit'],
    ['White-Label Calculators', '/for-vendors/white-label'], ['ROI Reports & Proposals', '/for-vendors/roi-reports'],
    ['Portfolio Intelligence', '/for-vendors/portfolio'], ['CRM & Proposal Integrations', '/for-vendors/integrations'],
  ]},
  { title: 'For Brands', links: [
    ['Brand Overview', '/for-brands'], ['Build the Business Case', '/for-brands/business-case'],
    ['Increase Active Membership', '/for-brands/active-membership'], ['Increase Purchase Frequency', '/for-brands/purchase-frequency'],
    ['Increase Average Order Value', '/for-brands/average-order-value'], ['Improve Retention & CLV', '/for-brands/retention'],
    ['Audience Strategy', '/for-brands/audience-strategy'], ['Program Matcher', '/program-matcher'],
  ]},
  { title: 'Solutions', links: [
    ['Calculator Library', '/calculators'], ['Loyalty Opportunity Estimator', '/estimator'], ['ROI Audit', '/solutions/roi-audit'],
    ['Loyalty Games', '/solutions/loyalty-games'], ['Consulting', '/solutions/consulting'],
  ]},
  { title: 'By channel', links: [
    ['E-commerce', '/channels/ecommerce'], ['Retail & Store', '/channels/retail'], ['Omnichannel', '/channels/omnichannel'],
    ['Restaurant & Hospitality', '/channels/restaurant'], ['Subscription & Paid', '/channels/subscription'], ['B2B, Partner & Channel', '/channels/b2b'],
  ]},
  { title: 'Resources & company', links: [
    ['Resources', '/resources'], ['Glossary', '/glossary'], ['FAQ', '/faq'], ['About', '/about'],
    ['Contact', '/contact'], ['Security & Data Use', '/security'],
  ]},
  { title: 'Legal', links: [
    ['Privacy Policy', '/privacy'], ['Terms of Use', '/terms'], ['Accessibility', '/accessibility'],
  ]},
]

export default function Sitemap() {
  return (
    <>
      <Seo title="Sitemap" description="Every page on the Alma Loyalty website." path="/sitemap" />
      <Band tone="dark">
        <Container>
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Sitemap' }]} />
          <Reveal className="max-w-[720px]">
            <Eyebrow>Sitemap</Eyebrow>
            <Headline as="h1" text="Everything, in one place." className="text-[clamp(30px,4.6vw,50px)] font-semibold mt-2" />
          </Reveal>
        </Container>
      </Band>
      <Band tone="light">
        <Container>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {GROUPS.map((g) => (
              <div key={g.title}>
                <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-orange mb-4">{g.title}</h2>
                <ul className="space-y-2">
                  {g.links.map(([label, to]) => (
                    <li key={to}><Link to={to} className="text-onlightmuted hover:text-orange text-[15px]">{label}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </Band>
    </>
  )
}
