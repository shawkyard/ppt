import Seo from '../components/Seo.jsx'
import { Container, Band, Eyebrow, Headline, Reveal } from '../components/ui.jsx'
import { Breadcrumbs } from '../components/Shared.jsx'

const CONTENT = {
  privacy: {
    title: 'Privacy Policy',
    path: '/privacy',
    intro: 'This summary explains, in plain language, how Alma Loyalty collects and uses information on this website and in its products. It is a placeholder for a full policy that must be reviewed by qualified counsel before publication.',
    sections: [
      { h: 'Information we collect', p: 'Contact details you submit, information you provide in calculators and uploads, and standard technical data such as device and usage information collected with your consent where required.' },
      { h: 'How we use it', p: 'To deliver results and reports, respond to inquiries, improve the service, and—only with appropriate consent—for analytics. We do not send confidential financial inputs or personal data to third-party analytics tools.' },
      { h: 'Sharing', p: 'We do not sell personal data. We share information only with service providers bound by confidentiality and security obligations, or where required by law.' },
      { h: 'Your choices', p: 'You may request access, correction, export, or deletion of your data, and manage cookie preferences where applicable.' },
      { h: 'Contact', p: 'Reach us through the contact page for any privacy request.' },
    ],
  },
  terms: {
    title: 'Terms of Use',
    path: '/terms',
    intro: 'These plain-language terms govern use of the Alma Loyalty website. They are a placeholder for full terms that must be reviewed by qualified counsel before publication.',
    sections: [
      { h: 'Estimates, not guarantees', p: 'All ROI figures, ranges, and scenarios are illustrative estimates for planning. They are not guarantees of financial performance, and actual results depend on data quality and execution.' },
      { h: 'Acceptable use', p: 'Use the site and tools for their intended business purpose. Do not attempt to disrupt the service, misuse others’ data, or reverse-engineer proprietary methodology.' },
      { h: 'Intellectual property', p: 'The site, content, and methodology are owned by Alma Loyalty or its licensors. Alma AI OS™ is a trademark used with permission.' },
      { h: 'Limitation of liability', p: 'To the extent permitted by law, Alma Loyalty is not liable for decisions made in reliance on estimates. Final terms will define liability precisely.' },
      { h: 'Changes', p: 'We may update these terms; material changes will be posted here.' },
    ],
  },
  accessibility: {
    title: 'Accessibility Statement',
    path: '/accessibility',
    intro: 'Alma Loyalty is committed to making this site usable by everyone, and we aim to meet WCAG 2.2 AA expectations.',
    sections: [
      { h: 'What we do', p: 'We support keyboard navigation, visible focus states, semantic landmarks, sufficient color contrast, reduced-motion preferences, and labels on forms and controls.' },
      { h: 'Charts and visuals', p: 'Data visuals include text summaries and non-color distinctions so information does not depend on color alone.' },
      { h: 'Ongoing work', p: 'Accessibility is continuous. If you encounter a barrier, please tell us and we will prioritize a fix.' },
      { h: 'Contact', p: 'Report accessibility issues through the contact page and we will respond promptly.' },
    ],
  },
}

export default function Legal({ kind }) {
  const d = CONTENT[kind]
  return (
    <>
      <Seo title={d.title} description={d.intro} path={d.path} />
      <Band tone="dark">
        <Container>
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: d.title }]} />
          <Reveal className="max-w-[760px]">
            <Eyebrow>Legal</Eyebrow>
            <Headline as="h1" text={d.title} className="text-[clamp(30px,4.6vw,50px)] font-semibold mt-2" />
            <p className="text-ondarkmuted text-[17px] mt-6">{d.intro}</p>
          </Reveal>
        </Container>
      </Band>
      <Band tone="light">
        <Container>
          <div className="max-w-[760px] mx-auto space-y-8">
            {d.sections.map((s) => (
              <div key={s.h}>
                <h2 className="text-xl font-semibold mb-2">{s.h}</h2>
                <p className="text-onlightmuted text-[15.5px]">{s.p}</p>
              </div>
            ))}
            <p className="text-onlightmuted text-[13px] border-l-2 border-brownline/40 pl-4">
              This is placeholder content for planning and must be reviewed and finalized by qualified legal counsel before it is treated as a binding policy.
            </p>
          </div>
        </Container>
      </Band>
    </>
  )
}
