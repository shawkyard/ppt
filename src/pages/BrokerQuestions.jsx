import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import DealHeader, { DealNotFound } from '../components/DealHeader.jsx'
import { Panel, Field, Callout } from '../components/ui.jsx'

export default function BrokerQuestions() {
  const { id } = useParams()
  const { getProperty, updateProperty } = useApp()
  const p = getProperty(id)
  const [q, setQ] = useState('')
  const [copied, setCopied] = useState(false)
  if (!p) return <DealNotFound />

  const questions = p.brokerQuestions || []
  const docs = p.missingDocs || []

  const add = (e) => {
    e.preventDefault()
    if (!q.trim()) return
    updateProperty(p.id, { brokerQuestions: [...questions, q.trim()] })
    setQ('')
  }
  const remove = (i) => updateProperty(p.id, { brokerQuestions: questions.filter((_, j) => j !== i) })

  const copyEmail = () => {
    const body = [
      `Re: ${p.name} — ${p.city}`,
      '',
      'Thanks for sending this over. Before we can move forward, could you please provide:',
      ...docs.map((d) => `  • ${d}`),
      '',
      'A few questions on the property:',
      ...questions.map((x, i) => `  ${i + 1}. ${x}`),
      '',
      'Appreciate it.',
    ].join('\n')
    navigator.clipboard?.writeText(body).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div>
      <DealHeader p={p} />

      <Callout tone="gold" title="Purpose">
        These are the questions that separate a real value-add from a broker pro forma. Get them answered before spending hours underwriting.
      </Callout>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Panel title="Questions for the broker" className="lg:col-span-2"
          action={<button className="btn-ghost text-xs" onClick={copyEmail}>{copied ? 'Copied ✓' : 'Copy as email'}</button>}>
          <ol className="space-y-2">
            {questions.map((x, i) => (
              <li key={i} className="flex items-start justify-between gap-3 rounded-md border border-slateline/60 bg-ink px-4 py-3">
                <span className="text-sm text-fog"><span className="tnum text-mist mr-2">{i + 1}.</span>{x}</span>
                <button onClick={() => remove(i)} className="text-mist hover:text-danger text-xs flex-none">Remove</button>
              </li>
            ))}
            {!questions.length && <p className="text-sm text-mist">No questions yet.</p>}
          </ol>
          <form onSubmit={add} className="mt-4 flex gap-2">
            <input className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Add a question…" />
            <button type="submit" className="btn-gold flex-none">Add</button>
          </form>
        </Panel>

        <Panel title="Documents to request">
          <ul className="space-y-2">
            {docs.map((d, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-fog"><span className="h-1.5 w-1.5 rounded-full bg-gold" />{d}</li>
            ))}
            {!docs.length && <p className="text-sm text-mist">Nothing outstanding.</p>}
          </ul>
        </Panel>
      </div>
    </div>
  )
}
