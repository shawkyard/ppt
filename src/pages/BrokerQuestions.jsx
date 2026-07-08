import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import DealHeader, { DealNotFound } from '../components/DealHeader.jsx'
import { Panel, Callout } from '../components/ui.jsx'
import { BROKER_QUESTION_SECTIONS } from '../data/brokerQuestions.js'

export default function BrokerQuestions() {
  const { id } = useParams()
  const { getProperty } = useApp()
  const p = getProperty(id)
  const [copied, setCopied] = useState(false)
  if (!p) return <DealNotFound />
  const docs = p.missingDocs || []
  const extra = p.brokerQuestions || []

  const copyEmail = () => {
    const body = [
      `Re: ${p.name} — ${p.city}`, '',
      'Thanks for sending this over. Before we can move forward, could you please provide:',
      ...docs.map((d) => `  • ${d}`), '',
      'A few questions on the property:',
      ...BROKER_QUESTION_SECTIONS.flatMap((s) => [`${s.section}:`, ...s.questions.map((q) => `  - ${q}`)]),
      ...extra.map((q) => `  - ${q}`), '', 'Appreciate it.',
    ].join('\n')
    navigator.clipboard?.writeText(body).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
  }

  return (
    <div>
      <DealHeader p={p} />
      <Callout tone="gold" title="Purpose">These questions separate a real value-add from a broker pro forma. Get them answered before spending hours underwriting.</Callout>

      <div className="mt-6 flex justify-between items-center no-print">
        <div className="text-sm text-mist">{BROKER_QUESTION_SECTIONS.length} sections · request the OM with these</div>
        <button className="btn-gold text-sm" onClick={copyEmail}>{copied ? 'Copied ✓' : 'Copy as email'}</button>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {BROKER_QUESTION_SECTIONS.map((s) => (
          <Panel key={s.section} title={s.section}>
            <ul className="space-y-2">
              {s.questions.map((q, i) => <li key={i} className="text-sm text-fog flex gap-2"><span className="text-gold">›</span>{q}</li>)}
            </ul>
          </Panel>
        ))}
      </div>

      <Panel title="Documents to request" className="mt-6">
        <ul className="grid sm:grid-cols-2 gap-2">
          {docs.map((d, i) => <li key={i} className="flex items-center gap-2 text-sm text-fog"><span className="h-1.5 w-1.5 rounded-full bg-gold" />{d}</li>)}
        </ul>
      </Panel>
    </div>
  )
}
