import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import DealHeader, { DealNotFound } from '../components/DealHeader.jsx'
import { Panel, Callout } from '../components/ui.jsx'
import Icon from '../components/Icon.jsx'
import { BROKER_QUESTION_SECTIONS } from '../data/brokerQuestions.js'

export default function BrokerQuestions() {
  const { id } = useParams()
  const { getProperty } = useApp()
  const p = getProperty(id)
  const [open, setOpen] = useState(() => new Set(BROKER_QUESTION_SECTIONS.map((s) => s.section)))
  const [checked, setChecked] = useState(() => new Set())
  const [copied, setCopied] = useState(false)
  if (!p) return <DealNotFound />
  const docs = p.missingDocs || []

  const toggleSection = (s) => setOpen((prev) => { const n = new Set(prev); n.has(s) ? n.delete(s) : n.add(s); return n })
  const toggleCheck = (k) => setChecked((prev) => { const n = new Set(prev); n.has(k) ? n.delete(k) : n.add(k); return n })
  const total = BROKER_QUESTION_SECTIONS.reduce((s, x) => s + x.questions.length, 0)

  const copyEmail = () => {
    const body = [
      `Re: ${p.name} — ${p.city}`, '',
      'Thanks for sending this over. Before we can move forward, could you please provide:',
      ...docs.map((d) => `  • ${d}`), '',
      'A few questions on the property:',
      ...BROKER_QUESTION_SECTIONS.flatMap((s) => [`${s.section}:`, ...s.questions.map((q) => `  - ${q}`)]),
      '', 'Appreciate it.',
    ].join('\n')
    navigator.clipboard?.writeText(body).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
  }

  return (
    <div>
      <DealHeader p={p} />
      <Callout tone="gold" title="Prep checklist">Check off each question as you get answers. These separate a real value-add from a broker pro forma — ask them before you underwrite.</Callout>

      <div className="mt-4 flex items-center justify-between no-print">
        <div className="text-sm text-mist font-medium">{checked.size} / {total} answered</div>
        <button className="btn-gold" onClick={copyEmail}><Icon name="doc" className="w-4 h-4" />{copied ? 'Copied ✓' : 'Copy as email'}</button>
      </div>

      <div className="mt-4 space-y-3">
        {BROKER_QUESTION_SECTIONS.map((s) => {
          const isOpen = open.has(s.section)
          const done = s.questions.filter((_, i) => checked.has(`${s.section}-${i}`)).length
          return (
            <div key={s.section} className="panel overflow-hidden">
              <button className="w-full flex items-center justify-between px-5 py-4 hover:bg-offwhite" onClick={() => toggleSection(s.section)}>
                <span className="flex items-center gap-3">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-softorange text-gold"><Icon name="checklist" className="w-4 h-4" /></span>
                  <span className="font-bold text-stone">{s.section}</span>
                </span>
                <span className="flex items-center gap-3 text-sm text-mist">
                  <span className={done === s.questions.length ? 'text-green font-bold' : ''}>{done}/{s.questions.length}</span>
                  <span className={`transition-transform ${isOpen ? 'rotate-90' : ''}`}>›</span>
                </span>
              </button>
              {isOpen && (
                <div className="px-5 pb-4 space-y-2 border-t border-line pt-3">
                  {s.questions.map((q, i) => {
                    const key = `${s.section}-${i}`
                    const on = checked.has(key)
                    return (
                      <label key={i} className="flex items-start gap-3 cursor-pointer group">
                        <span className={`mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-md border-2 transition-colors ${on ? 'bg-gold border-gold text-white' : 'border-line group-hover:border-gold'}`}>
                          {on && <Icon name="shield" className="w-3 h-3" />}
                        </span>
                        <input type="checkbox" className="sr-only" checked={on} onChange={() => toggleCheck(key)} />
                        <span className={`text-sm ${on ? 'text-mist line-through' : 'text-fog'}`}>{q}</span>
                      </label>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <Panel title="Documents to request" className="mt-6">
        <ul className="grid sm:grid-cols-2 gap-2">
          {docs.map((d, i) => <li key={i} className="flex items-center gap-2 text-sm text-fog"><span className="h-1.5 w-1.5 rounded-full bg-gold" />{d}</li>)}
        </ul>
      </Panel>
    </div>
  )
}
