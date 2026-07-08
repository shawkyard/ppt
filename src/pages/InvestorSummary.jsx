import { useParams } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import DealHeader, { DealNotFound } from '../components/DealHeader.jsx'
import TriCompare from '../components/TriCompare.jsx'
import { Panel, Badge, ScoreRing, KeyVal, Callout, Stat } from '../components/ui.jsx'
import { buildPlan } from '../lib/plan.js'
import { INDICATORS } from '../lib/reindicator.js'
import { usd, pct, usdSigned, mult } from '../lib/format.js'

export default function InvestorSummary() {
  const { id } = useParams()
  const { getProperty } = useApp()
  const p = getProperty(id)
  if (!p) return <DealNotFound />
  const d = p.deal
  const plan = buildPlan(p)

  return (
    <div>
      <DealHeader p={p} />
      <div className="flex justify-end mb-4 no-print"><button className="btn-ghost text-xs" onClick={() => window.print()}>Print / save PDF</button></div>

      <Panel className="mb-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <ScoreRing score={p.score} tone={p.verdict.tone} size={120} label="/ 100" />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={p.verdict.tone}>{p.verdict.label}</Badge>
              {p.market && <Badge tone={p.market.gate.gate === 'hunt' ? 'green' : 'mist'}>
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: INDICATORS[p.market.indicatorColor].color }} />
                {p.market.marketName} · {INDICATORS[p.market.indicatorColor].label}</Badge>}
            </div>
            <h2 className="mt-3 text-xl text-stone">{p.name}</h2>
            <p className="text-sm text-mist">{p.city} · {p.units} units · {p.propertyClass} in {p.areaClass} · Built {p.yearBuilt}</p>
            <p className="mt-3 text-sm text-fog"><span className="text-stone font-medium">Recommendation:</span> {p.nextAction}</p>
          </div>
        </div>
      </Panel>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Stat label="Price / unit" value={usd(d.pricePerUnit)} />
        <Stat label="Stabilized cap (Yr 3)" value={pct(d.stabilizedCapRate)} tone="green" />
        <Stat label="Stabilized DSCR" value={mult(d.stabilizedDSCR)} tone={d.stabilizedDSCR >= 1.4 ? 'green' : 'red'} />
        <Stat label="Value created" value={usdSigned(d.valueCreated)} tone={d.valueCreated > 0 ? 'green' : 'red'} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Executive thesis">
          <p className="text-sm text-fog">{p.thesisFor}</p>
          <div className="mt-4 grid gap-3">
            <div><div className="label text-greenbright mb-1">Why it may work</div><p className="text-sm text-fog">{p.fixableUpside}</p></div>
            <div><div className="label text-red mb-1">Why it may fail</div><p className="text-sm text-fog">{p.thesisAgainst}</p></div>
            <div><div className="label text-gold mb-1">Market status</div><p className="text-sm text-fog">{p.marketReason}</p></div>
          </div>
        </Panel>

        <Panel title="Value creation & sources / uses">
          <div className="grid sm:grid-cols-2 gap-x-8">
            <div>
              <KeyVal k="Purchase price" v={usd(d.askingPrice)} />
              <KeyVal k="Capex" v={usd(d.capex)} />
              <KeyVal k="Closing" v={usd(d.closingCosts)} />
              <KeyVal k="Reserves" v={usd(d.reserves)} />
              <KeyVal k="Total project cost" v={usd(d.totalProjectCost)} tone="gold" />
            </div>
            <div>
              <KeyVal k="Loan" v={usd(d.loanAmount)} />
              <KeyVal k="Equity" v={usd(d.equity)} />
              <KeyVal k="Stabilized NOI" v={usd(d.stabilizedNOI)} tone="green" />
              <KeyVal k="Stabilized value" v={usd(d.stabilizedValue)} />
              <KeyVal k="Value created" v={usdSigned(d.valueCreated)} tone={d.valueCreated > 0 ? 'green' : 'red'} />
            </div>
          </div>
        </Panel>

        <Panel title="Current Reality · Broker Story · Our Strike Deal" className="lg:col-span-2">
          <TriCompare p={p} />
        </Panel>

        <Panel title="24-month stabilization plan" className="lg:col-span-2">
          <div className="grid gap-3 md:grid-cols-4">
            {plan.map((ph) => (
              <div key={ph.phase} className="rounded-lg border border-line bg-ink p-3">
                <div className="text-xs font-semibold text-gold">{ph.phase}</div>
                <div className="text-sm text-stone mt-1">{ph.title}</div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Major risks">
          <div className="space-y-2">
            {(p.risks || []).slice(0, 4).map((r, i) => (
              <div key={i} className="flex items-start gap-2 text-sm"><Badge tone={r.severity === 'High' ? 'red' : r.severity === 'Medium' ? 'yellow' : 'mist'}>{r.severity}</Badge><span className="text-fog">{r.category}: {r.notes}</span></div>
            ))}
          </div>
        </Panel>

        <Panel title="Missing documents & next action">
          <ul className="space-y-1.5 mb-3">
            {(p.missingDocs || []).map((doc, i) => <li key={i} className="flex items-center gap-2 text-sm text-fog"><span className="h-1.5 w-1.5 rounded-full bg-gold" />{doc}</li>)}
          </ul>
          <Callout tone="gold" title="Next action">{p.nextAction}</Callout>
        </Panel>
      </div>

      <Callout tone="mist" title="Confidence & caveat" className="mt-6">
        Built from {p.source.label.toLowerCase()} inputs and a preliminary max supportable price — <span className="text-stone">not a final offer</span>.
        Market regions are approximate from REIndicator review. Confirm with the T-12, rent roll, and a site walk before committing capital.
      </Callout>
    </div>
  )
}
