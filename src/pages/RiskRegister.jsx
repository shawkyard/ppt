import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import DealHeader, { DealNotFound } from '../components/DealHeader.jsx'
import { Panel, Badge, Field } from '../components/ui.jsx'
import Icon from '../components/Icon.jsx'

const CATEGORIES = ['Market risk', 'Submarket risk', 'Rent risk', 'Vacancy risk', 'Capex risk', 'Insurance risk', 'Tax reassessment risk', 'Debt risk', 'Exit cap risk', 'Broker optimism risk', 'Missing data risk']
const LEVELS = ['High', 'Medium', 'Low']
const tone = (s) => (s === 'High' ? 'red' : s === 'Medium' ? 'yellow' : 'mist')
const ICON = {
  'Market risk': 'map', 'Submarket risk': 'pin', 'Rent risk': 'dollar', 'Vacancy risk': 'building',
  'Capex risk': 'warning', 'Insurance risk': 'shield', 'Tax reassessment risk': 'dollar', 'Debt risk': 'dollar',
  'Exit cap risk': 'chart', 'Broker optimism risk': 'eye', 'Missing data risk': 'doc',
}

export default function RiskRegister() {
  const { id } = useParams()
  const { getProperty, updateProperty } = useApp()
  const p = getProperty(id)
  const [draft, setDraft] = useState({ category: 'Market risk', severity: 'Medium', likelihood: 'Medium', notes: '', mitigation: '', status: 'Open' })
  if (!p) return <DealNotFound />
  const risks = p.risks || []

  const add = (e) => {
    e.preventDefault()
    if (!draft.notes.trim()) return
    updateProperty(p.id, { risks: [...risks, draft] })
    setDraft({ category: 'Market risk', severity: 'Medium', likelihood: 'Medium', notes: '', mitigation: '', status: 'Open' })
  }
  const remove = (i) => updateProperty(p.id, { risks: risks.filter((_, j) => j !== i) })

  return (
    <div>
      <DealHeader p={p} />
      <div className="grid grid-cols-3 gap-4 mb-6">
        {LEVELS.map((s) => (
          <div key={s} className="panel p-4 flex items-center justify-between">
            <Badge tone={tone(s)}>{s}</Badge>
            <span className="tnum text-2xl font-bold text-stone">{risks.filter((r) => r.severity === s).length}</span>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-3">
          {!risks.length && <Panel><p className="text-sm text-mist">No risks logged yet. Add the first one →</p></Panel>}
          {risks.map((r, i) => {
            const t = tone(r.severity)
            return (
              <div key={i} className="panel p-4 flex items-start gap-4">
                <div className={`grid h-11 w-11 flex-none place-items-center rounded-xl bg-${t === 'mist' ? 'offwhite' : t + '/10'} text-${t === 'mist' ? 'mist' : t}`}>
                  <Icon name={ICON[r.category] || 'warning'} className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-bold text-stone">{r.category}</div>
                    <button className="text-mist hover:text-red text-xs no-print" onClick={() => remove(i)}>Remove</button>
                  </div>
                  <p className="mt-0.5 text-sm text-fog">{r.notes}</p>
                  {r.mitigation && <p className="mt-1 text-xs text-mist"><span className="font-semibold text-fog">Mitigation:</span> {r.mitigation}</p>}
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge tone={t}>{r.severity} severity</Badge>
                    <Badge tone="mist">{r.likelihood} likelihood</Badge>
                    <Badge tone={r.status === 'Closed' ? 'green' : 'gold'}>{r.status}</Badge>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <Panel title="Add a risk" className="no-print">
          <form onSubmit={add} className="space-y-3">
            <Field label="Category"><select className="input" value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Severity"><select className="input" value={draft.severity} onChange={(e) => setDraft({ ...draft, severity: e.target.value })}>{LEVELS.map((s) => <option key={s}>{s}</option>)}</select></Field>
              <Field label="Likelihood"><select className="input" value={draft.likelihood} onChange={(e) => setDraft({ ...draft, likelihood: e.target.value })}>{LEVELS.map((s) => <option key={s}>{s}</option>)}</select></Field>
            </div>
            <Field label="Notes"><input className="input" value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} /></Field>
            <Field label="Mitigation"><input className="input" value={draft.mitigation} onChange={(e) => setDraft({ ...draft, mitigation: e.target.value })} /></Field>
            <Field label="Status"><select className="input" value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value })}><option>Open</option><option>Monitoring</option><option>Closed</option></select></Field>
            <button type="submit" className="btn-gold w-full">Add risk</button>
          </form>
        </Panel>
      </div>
    </div>
  )
}
