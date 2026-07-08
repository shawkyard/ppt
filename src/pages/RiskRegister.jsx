import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import DealHeader, { DealNotFound } from '../components/DealHeader.jsx'
import { Panel, Badge, Field } from '../components/ui.jsx'

const SEVERITIES = ['High', 'Medium', 'Low']
const toneFor = (s) => (s === 'High' ? 'danger' : s === 'Medium' ? 'warn' : 'mist')

export default function RiskRegister() {
  const { id } = useParams()
  const { getProperty, updateProperty } = useApp()
  const p = getProperty(id)
  const [draft, setDraft] = useState({ risk: '', severity: 'Medium', mitigation: '' })
  if (!p) return <DealNotFound />

  const risks = p.risks || []
  const counts = SEVERITIES.map((s) => ({ s, n: risks.filter((r) => r.severity === s).length }))

  const addRisk = (e) => {
    e.preventDefault()
    if (!draft.risk.trim()) return
    updateProperty(p.id, { risks: [...risks, draft] })
    setDraft({ risk: '', severity: 'Medium', mitigation: '' })
  }
  const removeRisk = (i) => updateProperty(p.id, { risks: risks.filter((_, j) => j !== i) })

  return (
    <div>
      <DealHeader p={p} />

      <div className="grid grid-cols-3 gap-4 mb-6">
        {counts.map(({ s, n }) => (
          <div key={s} className="panel p-4 flex items-center justify-between">
            <Badge tone={toneFor(s)}>{s}</Badge>
            <span className="tnum text-2xl font-bold text-white">{n}</span>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title="Risk register" className="lg:col-span-2">
          <div className="space-y-3">
            {risks.length === 0 && <p className="text-sm text-mist">No risks logged yet. Add the first one.</p>}
            {risks.map((r, i) => (
              <div key={i} className="rounded-md border border-slateline/60 bg-ink p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Badge tone={toneFor(r.severity)}>{r.severity}</Badge>
                    <span className="text-sm font-medium text-white">{r.risk}</span>
                  </div>
                  <button onClick={() => removeRisk(i)} className="text-mist hover:text-danger text-xs">Remove</button>
                </div>
                {r.mitigation && <p className="mt-2 text-sm text-mist"><span className="text-fog">Mitigation:</span> {r.mitigation}</p>}
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Add a risk">
          <form onSubmit={addRisk} className="space-y-4">
            <Field label="Risk"><input className="input" value={draft.risk} onChange={(e) => setDraft({ ...draft, risk: e.target.value })} placeholder="e.g. Roofs at end of life" /></Field>
            <Field label="Severity">
              <select className="input" value={draft.severity} onChange={(e) => setDraft({ ...draft, severity: e.target.value })}>
                {SEVERITIES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Mitigation"><textarea className="input h-20 resize-none" value={draft.mitigation} onChange={(e) => setDraft({ ...draft, mitigation: e.target.value })} placeholder="How we de-risk it" /></Field>
            <button type="submit" className="btn-gold w-full">Add risk</button>
          </form>
        </Panel>
      </div>
    </div>
  )
}
