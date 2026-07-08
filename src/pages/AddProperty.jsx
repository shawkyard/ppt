import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import { Panel, Field, Callout, Badge, ScoreRing } from '../components/ui.jsx'
import Thumb from '../components/Thumb.jsx'
import { SOURCE_LEVELS } from '../lib/sources.js'
import { screenProperty } from '../lib/screen.js'
import { usd, pct, usdSigned } from '../lib/format.js'

const RATINGS = [
  { key: 'submarketQuality', label: 'Submarket quality (C-in-B?)' },
  { key: 'conditionFit', label: 'Condition / value-add fit' },
  { key: 'capexFeasibility', label: 'Capex feasibility' },
  { key: 'brokerOptimismRisk', label: 'Broker optimism risk (high = bad)' },
  { key: 'debtStrikeFactor', label: 'Debt / strike-factor likelihood' },
]
const STEPS = [
  { n: 1, label: 'Basics' }, { n: 2, label: 'Financials' }, { n: 3, label: 'Value-Add' },
  { n: 4, label: 'Narrative' }, { n: 5, label: 'Review' },
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
  pain: '', fixableUpside: '', marketReason: '', nextAction: '',
  missingDocs: 'T-12\nRent roll\nCapex history',
})

const Num = ({ v, onChange, step = '1' }) =>
  <input type="number" step={step} className="input tnum" value={v} onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))} />

function ScenarioCol({ title, tone, s, onChange }) {
  return (
    <div className="rounded-xl border border-line bg-offwhite p-3">
      <div className={`text-sm font-bold ${tone}`}>{title}</div>
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
  const [step, setStep] = useState(1)
  const set = (patch) => setF((prev) => ({ ...prev, ...patch }))
  const setScenario = (key, s) => setF((prev) => ({ ...prev, scenarios: { ...prev.scenarios, [key]: s } }))

  // Live preview — recompute score + quick math as fields change.
  const market = screenedMarkets.find((m) => m.id === f.marketId)
  const preview = screenProperty(f, market)
  const d = preview.deal

  const submit = () => {
    const id = addProperty({
      ...f, units: Number(f.units), askingPrice: Number(f.askingPrice),
      missingDocs: f.missingDocs.split('\n').map((s) => s.trim()).filter(Boolean), risks: [],
    })
    navigate(`/deal/${id}`)
  }
  const next = () => (step < 5 ? setStep(step + 1) : submit())

  return (
    <div>
      {/* Stepper header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-stone">Add Property</h1>
          <p className="mt-1.5 text-sm text-mist">Fill out the details below to evaluate this opportunity.</p>
        </div>
        <button onClick={submit} className="btn-gold no-print">Screen this deal →</button>
      </div>

      <div className="mb-6 flex items-center gap-1 overflow-x-auto">
        {STEPS.map((s, i) => (
          <button key={s.n} onClick={() => setStep(s.n)} className="flex items-center gap-2 flex-none">
            <span className={`grid h-8 w-8 place-items-center rounded-full text-sm font-bold transition-colors ${
              step === s.n ? 'bg-gold text-white' : step > s.n ? 'bg-green text-white' : 'bg-offwhite text-mist border border-line'}`}>
              {step > s.n ? '✓' : s.n}
            </span>
            <span className={`text-sm font-semibold ${step === s.n ? 'text-stone' : 'text-mist'}`}>{s.label}</span>
            {i < STEPS.length - 1 && <span className="mx-2 h-px w-6 bg-line hidden sm:block" />}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Step body */}
        <div>
          {step === 1 && (
            <Panel title="Property basics">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Property name" className="col-span-2"><input className="input" value={f.name} onChange={(e) => set({ name: e.target.value })} placeholder="Oakleaf Village" /></Field>
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
                <Field label="# of Units"><Num v={f.units} onChange={(x) => set({ units: x })} /></Field>
                <Field label="Year built"><Num v={f.yearBuilt} onChange={(x) => set({ yearBuilt: x })} /></Field>
                <Field label="Days on market"><Num v={f.listingAgeDays} onChange={(x) => set({ listingAgeDays: x })} /></Field>
                <Field label="Property class">
                  <select className="input" value={f.propertyClass} onChange={(e) => set({ propertyClass: e.target.value })}>{['A', 'A-', 'B+', 'B', 'B-', 'C', 'C-'].map((c) => <option key={c}>{c}</option>)}</select>
                </Field>
                <Field label="Area class">
                  <select className="input" value={f.areaClass} onChange={(e) => set({ areaClass: e.target.value })}>{['A', 'B', 'C', 'D'].map((c) => <option key={c}>{c}</option>)}</select>
                </Field>
              </div>
            </Panel>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <Panel title="Financial snapshot (listing level)">
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
              <Panel title="Three worlds — current · broker · strike">
                <div className="grid gap-4 md:grid-cols-3">
                  <ScenarioCol title="Current Reality" tone="text-mist" s={f.scenarios.current} onChange={(s) => setScenario('current', s)} />
                  <ScenarioCol title="Broker Story" tone="text-yellow" s={f.scenarios.broker} onChange={(s) => setScenario('broker', s)} />
                  <ScenarioCol title="Our Strike Deal" tone="text-green" s={f.scenarios.strike} onChange={(s) => setScenario('strike', s)} />
                </div>
              </Panel>
            </div>
          )}

          {step === 3 && (
            <Panel title="Value-add assumptions">
              <Callout tone="gold" title="Auto-derived">Market strength, rent upside, and vacancy upside come from your data. Rate the rest 0–10.</Callout>
              <div className="mt-4 space-y-4">
                {RATINGS.map((r) => (
                  <div key={r.key} className="flex items-center gap-4">
                    <span className="flex-1 text-sm text-fog">{r.label}</span>
                    <input type="range" min="0" max="10" value={f[r.key]} onChange={(e) => set({ [r.key]: Number(e.target.value) })} className="w-40 accent-gold" />
                    <span className="tnum w-6 text-right text-stone font-bold">{f[r.key]}</span>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          {step === 4 && (
            <Panel title="Screening narrative">
              <div className="space-y-4">
                <Field label="Current pain"><textarea className="input h-16 resize-none" value={f.pain} onChange={(e) => set({ pain: e.target.value })} /></Field>
                <Field label="Fixable upside"><textarea className="input h-16 resize-none" value={f.fixableUpside} onChange={(e) => set({ fixableUpside: e.target.value })} /></Field>
                <Field label="Market reason"><textarea className="input h-16 resize-none" value={f.marketReason} onChange={(e) => set({ marketReason: e.target.value })} /></Field>
                <Field label="Missing documents (one per line)"><textarea className="input h-20 resize-none" value={f.missingDocs} onChange={(e) => set({ missingDocs: e.target.value })} /></Field>
                <Field label="Next action"><input className="input" value={f.nextAction} onChange={(e) => set({ nextAction: e.target.value })} /></Field>
              </div>
            </Panel>
          )}

          {step === 5 && (
            <Panel title="Review & screen">
              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-1">
                <Row k="Property" v={f.name || '—'} /><Row k="Market" v={market?.marketName || '—'} />
                <Row k="Units" v={f.units} /><Row k="Asking" v={usd(Number(f.askingPrice))} />
                <Row k="Price / unit" v={usd(d.pricePerUnit)} /><Row k="Rent gap" v={pct(d.rentGapPct, 0)} />
                <Row k="Stabilized cap" v={pct(d.stabilizedCapRate)} /><Row k="Value created" v={usdSigned(d.valueCreated)} />
              </div>
              <button onClick={submit} className="btn-gold w-full mt-5">Screen this deal →</button>
            </Panel>
          )}

          {/* Wizard nav */}
          <div className="mt-6 flex items-center justify-between no-print">
            <button onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1} className="btn-ghost">← Back</button>
            <button onClick={next} className="btn-gold">{step < 5 ? `Next: ${STEPS[step].label} →` : 'Screen this deal →'}</button>
          </div>
        </div>

        {/* Live Quick Summary */}
        <aside className="lg:sticky lg:top-6 h-max">
          <Panel title="Quick summary">
            <div className="flex items-center gap-3">
              <Thumb name={f.name || 'New'} className="h-16 w-16" />
              <div className="min-w-0">
                <div className="font-bold text-stone truncate">{f.name || 'New property'}</div>
                <div className="text-xs text-mist truncate">{f.city || '—'} · {f.units} units · {f.propertyClass} in {f.areaClass}</div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <ScoreRing score={preview.score} tone={preview.verdict.tone} size={84} label="score" />
              <div className="text-right"><Badge tone={preview.verdict.tone}>{preview.verdict.short}</Badge></div>
            </div>
            <div className="mt-4 space-y-1">
              <Row k="Price / unit" v={usd(d.pricePerUnit)} />
              <Row k="Rent gap" v={pct(d.rentGapPct, 0)} />
              <Row k="Stabilized cap" v={pct(d.stabilizedCapRate)} />
              <Row k="Value created" v={usdSigned(d.valueCreated)} tone={d.valueCreated > 0 ? 'green' : 'red'} />
            </div>
            <p className="mt-3 text-[11px] text-mist">Updates live as you enter numbers.</p>
          </Panel>
        </aside>
      </div>
    </div>
  )
}

const Row = ({ k, v, tone }) => (
  <div className="flex items-center justify-between gap-4 py-2 border-b border-line/70 last:border-0">
    <span className="text-sm text-mist">{k}</span>
    <span className={`text-sm font-bold tnum ${tone === 'green' ? 'text-green' : tone === 'red' ? 'text-red' : 'text-stone'}`}>{v}</span>
  </div>
)
