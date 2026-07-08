import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import { Panel, Field, PageHeader, Callout } from '../components/ui.jsx'
import { SOURCE_LEVELS } from '../lib/sources.js'

const RATINGS = [
  { key: 'submarketQuality', label: 'Submarket quality (C-in-B?)' },
  { key: 'conditionFit', label: 'Condition / value-add fit' },
  { key: 'capexFeasibility', label: 'Capex feasibility' },
  { key: 'brokerOptimismRisk', label: 'Broker optimism risk (high = bad)' },
  { key: 'debtStrikeFactor', label: 'Debt / strike-factor likelihood' },
]

const blank = () => ({
  name: '', address: '', city: '', marketId: '', propertyClass: 'C', areaClass: 'B', yearBuilt: 1990,
  units: 100, askingPrice: 10_000_000, exitCapRate: 0.06, estimatedCapexPerUnit: 12_000,
  closingCostsPct: 0.025, reserves: 250_000, ltv: 0.65, interestRate: 0.065, amortYears: 30, riskSpread: 0.0075,
  sourceLevel: 'listing', listingAgeDays: 30, dealStatus: 'New',
  scenarios: {
    current: { avgRent: 850, occupancy: 0.88, expenseRatio: 0.55, otherIncomeAnnual: 30_000 },
    broker: { avgRent: 1100, occupancy: 0.95, expenseRatio: 0.44, otherIncomeAnnual: 140_000 },
    strike: { avgRent: 1050, occupancy: 0.93, expenseRatio: 0.47, otherIncomeAnnual: 100_000 },
  },
  provenance: { current: 'EXT', broker: 'BR', strike: 'CALC' },
  submarketQuality: 7, conditionFit: 7, capexFeasibility: 7, brokerOptimismRisk: 4, debtStrikeFactor: 7,
  thesisFor: '', thesisAgainst: '', pain: '', fixableUpside: '', marketReason: '', nextAction: '',
  missingDocs: 'T-12\nRent roll\nCapex history',
})

function Num({ v, onChange, step = '1' }) {
  return <input type="number" step={step} className="input tnum" value={v} onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))} />
}

function ScenarioCol({ title, tone, s, onChange }) {
  return (
    <div className={`rounded-lg border border-line bg-ink p-3`}>
      <div className={`text-sm font-semibold ${tone}`}>{title}</div>
      <div className="mt-3 space-y-2">
        <Field label="Avg rent / unit"><Num v={s.avgRent} onChange={(x) => onChange({ ...s, avgRent: x })} /></Field>
        <Field label="Occupancy (0–1)"><Num v={s.occupancy} step="0.01" onChange={(x) => onChange({ ...s, occupancy: x })} /></Field>
        <Field label="Expense ratio (0–1)"><Num v={s.expenseRatio} step="0.01" onChange={(x) => onChange({ ...s, expenseRatio: x })} /></Field>
        <Field label="Other income / yr"><Num v={s.otherIncomeAnnual} onChange={(x) => onChange({ ...s, otherIncomeAnnual: x })} /></Field>
      </div>
    </div>
  )
}

export default function AddProperty() {
  const { screenedMarkets, addProperty } = useApp()
  const navigate = useNavigate()
  const [f, setF] = useState({ ...blank(), marketId: screenedMarkets[0]?.id || '' })
  const set = (patch) => setF((prev) => ({ ...prev, ...patch }))
  const setScenario = (key, s) => setF((prev) => ({ ...prev, scenarios: { ...prev.scenarios, [key]: s } }))

  const submit = (e) => {
    e.preventDefault()
    const id = addProperty({
      ...f,
      units: Number(f.units), askingPrice: Number(f.askingPrice),
      missingDocs: f.missingDocs.split('\n').map((s) => s.trim()).filter(Boolean),
      risks: [],
    })
    navigate(`/deal/${id}`)
  }

  return (
    <form onSubmit={submit}>
      <PageHeader title="Add Property"
        subtitle="Enter what you can see, and keep the three worlds separate: Current Reality (today), Broker Story (their claim), Our Strike Deal (our conservative read).">
        <button type="submit" className="btn-gold">Screen this deal →</button>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Step 1 · Property basics">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Property name" className="col-span-2"><input className="input" required value={f.name} onChange={(e) => set({ name: e.target.value })} placeholder="Oakleaf Village" /></Field>
            <Field label="Address"><input className="input" value={f.address} onChange={(e) => set({ address: e.target.value })} /></Field>
            <Field label="City / state"><input className="input" value={f.city} onChange={(e) => set({ city: e.target.value })} /></Field>
            <Field label="Market">
              <select className="input" value={f.marketId} onChange={(e) => set({ marketId: e.target.value })}>
                {screenedMarkets.map((m) => <option key={m.id} value={m.id}>{m.marketName} ({m.gate.priority})</option>)}
              </select>
            </Field>
            <Field label="Source level">
              <select className="input" value={f.sourceLevel} onChange={(e) => set({ sourceLevel: e.target.value })}>
                {SOURCE_LEVELS.map((s) => <option key={s.key} value={s.key}>{s.level}. {s.label}</option>)}
              </select>
            </Field>
            <Field label="Units"><Num v={f.units} onChange={(x) => set({ units: x })} /></Field>
            <Field label="Year built"><Num v={f.yearBuilt} onChange={(x) => set({ yearBuilt: x })} /></Field>
            <Field label="Property class">
              <select className="input" value={f.propertyClass} onChange={(e) => set({ propertyClass: e.target.value })}>{['A', 'A-', 'B+', 'B', 'B-', 'C', 'C-'].map((c) => <option key={c}>{c}</option>)}</select>
            </Field>
            <Field label="Area class">
              <select className="input" value={f.areaClass} onChange={(e) => set({ areaClass: e.target.value })}>{['A', 'B', 'C', 'D'].map((c) => <option key={c}>{c}</option>)}</select>
            </Field>
          </div>
        </Panel>

        <Panel title="Step 2 · Listing-level financials">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Asking price ($)"><Num v={f.askingPrice} onChange={(x) => set({ askingPrice: x })} /></Field>
            <Field label="Exit cap rate"><Num v={f.exitCapRate} step="0.001" onChange={(x) => set({ exitCapRate: x })} /></Field>
            <Field label="Capex / unit ($)"><Num v={f.estimatedCapexPerUnit} onChange={(x) => set({ estimatedCapexPerUnit: x })} /></Field>
            <Field label="Reserves ($)"><Num v={f.reserves} onChange={(x) => set({ reserves: x })} /></Field>
            <Field label="Closing costs (%)"><Num v={f.closingCostsPct} step="0.005" onChange={(x) => set({ closingCostsPct: x })} /></Field>
            <Field label="LTV"><Num v={f.ltv} step="0.05" onChange={(x) => set({ ltv: x })} /></Field>
            <Field label="Interest rate"><Num v={f.interestRate} step="0.0025" onChange={(x) => set({ interestRate: x })} /></Field>
            <Field label="Amort (years)"><Num v={f.amortYears} onChange={(x) => set({ amortYears: x })} /></Field>
          </div>
        </Panel>

        <Panel title="Step 3 · Three worlds (current · broker · strike)" className="lg:col-span-2">
          <div className="grid gap-4 md:grid-cols-3">
            <ScenarioCol title="Current Reality" tone="text-fog" s={f.scenarios.current} onChange={(s) => setScenario('current', s)} />
            <ScenarioCol title="Broker Story" tone="text-yellow" s={f.scenarios.broker} onChange={(s) => setScenario('broker', s)} />
            <ScenarioCol title="Our Strike Deal" tone="text-gold" s={f.scenarios.strike} onChange={(s) => setScenario('strike', s)} />
          </div>
        </Panel>

        <Panel title="Step 4 · Value-add assumptions">
          <Callout tone="gold" title="Auto-derived">Market strength, rent upside, and vacancy upside are computed from your data. Rate the rest.</Callout>
          <div className="mt-4 space-y-3">
            {RATINGS.map((r) => (
              <div key={r.key} className="flex items-center gap-4">
                <span className="flex-1 text-sm text-fog">{r.label}</span>
                <input type="range" min="0" max="10" value={f[r.key]} onChange={(e) => set({ [r.key]: Number(e.target.value) })} className="w-40 accent-gold" />
                <span className="tnum w-6 text-right text-stone">{f[r.key]}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Step 5 · Screening narrative & missing docs">
          <div className="space-y-4">
            <Field label="Current pain"><textarea className="input h-16 resize-none" value={f.pain} onChange={(e) => set({ pain: e.target.value })} /></Field>
            <Field label="Fixable upside"><textarea className="input h-16 resize-none" value={f.fixableUpside} onChange={(e) => set({ fixableUpside: e.target.value })} /></Field>
            <Field label="Market reason"><textarea className="input h-16 resize-none" value={f.marketReason} onChange={(e) => set({ marketReason: e.target.value })} /></Field>
            <Field label="Missing documents (one per line)"><textarea className="input h-20 resize-none" value={f.missingDocs} onChange={(e) => set({ missingDocs: e.target.value })} /></Field>
            <Field label="Next action"><input className="input" value={f.nextAction} onChange={(e) => set({ nextAction: e.target.value })} /></Field>
          </div>
        </Panel>
      </div>

      <div className="mt-6 flex justify-end"><button type="submit" className="btn-gold">Screen this deal →</button></div>
    </form>
  )
}
