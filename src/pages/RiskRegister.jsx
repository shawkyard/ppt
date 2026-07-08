import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import DealHeader, { DealNotFound } from '../components/DealHeader.jsx'
import { Panel, Badge, Field } from '../components/ui.jsx'

const CATEGORIES = ['Market risk', 'Submarket risk', 'Rent risk', 'Vacancy risk', 'Capex risk', 'Insurance risk', 'Tax reassessment risk', 'Debt risk', 'Exit cap risk', 'Broker optimism risk', 'Missing data risk']
const LEVELS = ['High', 'Medium', 'Low']
const tone = (s) => (s === 'High' ? 'red' : s === 'Medium' ? 'yellow' : 'mist')

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
        <Panel title="Risk register" className="lg:col-span-2">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[560px]">
              <thead><tr className="border-b border-line text-left label">
                <th className="py-2">Category</th><th className="py-2">Sev</th><th className="py-2">Likely</th><th className="py-2">Notes / mitigation</th><th className="py-2">Status</th><th></th>
              </tr></thead>
              <tbody>
                {risks.map((r, i) => (
                  <tr key={i} className="border-b border-line/40 align-top">
                    <td className="py-2 pr-2 text-stone">{r.category}</td>
                    <td className="py-2 pr-2"><Badge tone={tone(r.severity)}>{r.severity}</Badge></td>
                    <td className="py-2 pr-2 text-mist">{r.likelihood}</td>
                    <td className="py-2 pr-2 text-fog">{r.notes}<div className="text-xs text-mist mt-0.5">→ {r.mitigation}</div></td>
                    <td className="py-2 pr-2"><Badge tone={r.status === 'Closed' ? 'green' : 'gold'}>{r.status}</Badge></td>
                    <td className="py-2 no-print"><button className="text-mist hover:text-red text-xs" onClick={() => remove(i)}>✕</button></td>
                  </tr>
                ))}
                {!risks.length && <tr><td colSpan="6" className="py-4 text-mist">No risks logged yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </Panel>

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
