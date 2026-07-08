import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import { Panel, Field, PageHeader, Callout } from '../components/ui.jsx'

const RATINGS = [
  { key: 'submarketQuality', label: 'Submarket quality (C-in-B?)' },
  { key: 'conditionFit', label: 'Condition / value-add fit' },
  { key: 'capexFeasibility', label: 'Capex feasibility' },
  { key: 'brokerOptimismRisk', label: 'Broker optimism risk (high = bad)' },
  { key: 'debtStrikeFactor', label: 'Debt / strike-factor likelihood' },
]

const blank = {
  name: '', address: '', city: '', marketId: '',
  propertyClass: 'C', areaClass: 'B', yearBuilt: '',
  units: 100, askingPrice: 8000000,
  currentRentPerUnit: 850, marketRentPerUnit: 1050,
  vacancyRate: 0.12, expenseRatio: 0.55, stabilizedExpenseRatio: 0.47, exitCapRate: 0.06,
  currentOtherIncomeAnnual: 30000, stabilizedOtherIncomeAnnual: 90000,
  estimatedCapex: 1000000, reserves: 200000, closingCostsPct: 0.03,
  listingAgeDays: 30,
  submarketQuality: 7, conditionFit: 7, capexFeasibility: 7, brokerOptimismRisk: 4, debtStrikeFactor: 7,
  pain: '', fixableUpside: '', marketReason: '', nextAction: '', notes: '',
  missingDocs: 'T-12\nRent roll\nCapex history',
  brokerQuestions: 'Why is the seller selling?\nWhat is trailing-3 economic occupancy?',
}

function Num({ form, set, name, label, step = '1', help }) {
  return (
    <Field label={label} help={help}>
      <input type="number" step={step} className="input tnum" value={form[name]}
        onChange={(e) => set(name, e.target.value === '' ? '' : Number(e.target.value))} />
    </Field>
  )
}

export default function AddProperty() {
  const { screenedMarkets, addProperty } = useApp()
  const navigate = useNavigate()
  const [form, setForm] = useState({ ...blank, marketId: screenedMarkets[0]?.id || '' })
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const submit = (e) => {
    e.preventDefault()
    const payload = {
      ...form,
      units: Number(form.units), askingPrice: Number(form.askingPrice),
      missingDocs: form.missingDocs.split('\n').map((s) => s.trim()).filter(Boolean),
      brokerQuestions: form.brokerQuestions.split('\n').map((s) => s.trim()).filter(Boolean),
      risks: [],
    }
    const id = addProperty(payload)
    navigate(`/deal/${id}`)
  }

  return (
    <form onSubmit={submit}>
      <PageHeader
        title="Add Property"
        subtitle="Enter what you can see from the listing. Missing data is expected — the scratch screen tells you what to request next."
      >
        <button type="submit" className="btn-gold">Screen this deal →</button>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Basics">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Property name" className="col-span-2">
              <input className="input" required value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Oakbridge Commons" />
            </Field>
            <Field label="Address"><input className="input" value={form.address} onChange={(e) => set('address', e.target.value)} /></Field>
            <Field label="City / state"><input className="input" value={form.city} onChange={(e) => set('city', e.target.value)} placeholder="Greenville, SC" /></Field>
            <Field label="Market">
              <select className="input" value={form.marketId} onChange={(e) => set('marketId', e.target.value)}>
                {screenedMarkets.map((m) => <option key={m.id} value={m.id}>{m.name} ({m.score})</option>)}
              </select>
            </Field>
            <Num form={form} set={set} name="yearBuilt" label="Year built" />
            <Field label="Property class">
              <select className="input" value={form.propertyClass} onChange={(e) => set('propertyClass', e.target.value)}>
                {['A', 'A-', 'B+', 'B', 'B-', 'C', 'C-', 'D'].map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Area class">
              <select className="input" value={form.areaClass} onChange={(e) => set('areaClass', e.target.value)}>
                {['A', 'B', 'C', 'D'].map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Num form={form} set={set} name="listingAgeDays" label="Days on market" />
          </div>
        </Panel>

        <Panel title="Financials (listing-level)">
          <div className="grid grid-cols-2 gap-4">
            <Num form={form} set={set} name="units" label="Units" />
            <Num form={form} set={set} name="askingPrice" label="Asking price ($)" />
            <Num form={form} set={set} name="currentRentPerUnit" label="Current rent / unit ($/mo)" />
            <Num form={form} set={set} name="marketRentPerUnit" label="Market rent / unit ($/mo)" />
            <Num form={form} set={set} name="vacancyRate" label="Vacancy rate" step="0.01" help="Decimal, e.g. 0.12 = 12%" />
            <Num form={form} set={set} name="exitCapRate" label="Exit cap rate" step="0.001" help="e.g. 0.06 = 6%" />
            <Num form={form} set={set} name="expenseRatio" label="Current expense ratio" step="0.01" />
            <Num form={form} set={set} name="stabilizedExpenseRatio" label="Stabilized expense ratio" step="0.01" />
            <Num form={form} set={set} name="currentOtherIncomeAnnual" label="Current other income ($/yr)" />
            <Num form={form} set={set} name="stabilizedOtherIncomeAnnual" label="Stabilized other income ($/yr)" />
            <Num form={form} set={set} name="estimatedCapex" label="Estimated capex ($)" />
            <Num form={form} set={set} name="reserves" label="Reserves ($)" />
            <Num form={form} set={set} name="closingCostsPct" label="Closing costs (% of price)" step="0.005" help="e.g. 0.03 = 3%" />
          </div>
        </Panel>

        <Panel title="Value-add ratings (0–10)">
          <Callout tone="gold" title="How to rate">Market strength, rent upside, and vacancy upside are auto-derived from your data. Rate the rest by hand.</Callout>
          <div className="mt-4 space-y-3">
            {RATINGS.map((r) => (
              <div key={r.key} className="flex items-center gap-4">
                <span className="flex-1 text-sm text-fog">{r.label}</span>
                <input type="range" min="0" max="10" value={form[r.key]} onChange={(e) => set(r.key, Number(e.target.value))} className="w-40 accent-gold" />
                <span className="tnum w-6 text-right text-white">{form[r.key]}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Screening narrative">
          <div className="space-y-4">
            <Field label="Current pain"><textarea className="input h-16 resize-none" value={form.pain} onChange={(e) => set('pain', e.target.value)} /></Field>
            <Field label="Fixable upside"><textarea className="input h-16 resize-none" value={form.fixableUpside} onChange={(e) => set('fixableUpside', e.target.value)} /></Field>
            <Field label="Market reason"><textarea className="input h-16 resize-none" value={form.marketReason} onChange={(e) => set('marketReason', e.target.value)} /></Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Missing documents (one per line)"><textarea className="input h-24 resize-none" value={form.missingDocs} onChange={(e) => set('missingDocs', e.target.value)} /></Field>
              <Field label="Broker questions (one per line)"><textarea className="input h-24 resize-none" value={form.brokerQuestions} onChange={(e) => set('brokerQuestions', e.target.value)} /></Field>
            </div>
            <Field label="Next action"><input className="input" value={form.nextAction} onChange={(e) => set('nextAction', e.target.value)} /></Field>
          </div>
        </Panel>
      </div>

      <div className="mt-6 flex justify-end">
        <button type="submit" className="btn-gold">Screen this deal →</button>
      </div>
    </form>
  )
}
