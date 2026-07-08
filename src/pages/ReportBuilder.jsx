import { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import TriCompare from '../components/TriCompare.jsx'
import USMap from '../components/USMap.jsx'
import { Panel, Badge, ScoreRing, KeyVal, PageHeader, Callout, EmptyState } from '../components/ui.jsx'
import { buildPlan } from '../lib/plan.js'
import { INDICATORS } from '../lib/reindicator.js'
import { usd, pct, usdSigned, mult } from '../lib/format.js'

export default function ReportBuilder() {
  const { screenedProperties, screenedMarkets, settings } = useApp()
  const [id, setId] = useState(screenedProperties[0]?.id)
  const p = screenedProperties.find((x) => x.id === id) || screenedProperties[0]

  if (!p) return <EmptyState title="No deals to report on">Add a property first.</EmptyState>
  const d = p.deal
  const plan = buildPlan(p)
  const mapMarkets = p.market ? [p.market] : []

  return (
    <div>
      <PageHeader title="Report Builder"
        subtitle="Generate a premium, investor-ready one-pager for any deal. Use Print to save as PDF.">
        <select className="input w-56" value={id} onChange={(e) => setId(e.target.value)}>
          {screenedProperties.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
        </select>
        <button className="btn-gold" onClick={() => window.print()}>Print / PDF</button>
      </PageHeader>

      <div className="space-y-6">
        {/* Cover */}
        <Panel>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <ScoreRing score={p.score} tone={p.verdict.tone} size={120} label="/ 100" />
            <div className="flex-1">
              <div className="label text-gold">{settings.fundName} · Deal Scout Report</div>
              <h2 className="text-2xl text-stone mt-1">{p.name}</h2>
              <p className="text-sm text-mist">{p.address ? `${p.address} · ` : ''}{p.city} · {p.units} units · {p.propertyClass} in {p.areaClass} area</p>
              <div className="mt-3 flex flex-wrap gap-2"><Badge tone={p.verdict.tone}>{p.verdict.label}</Badge><Badge tone="mist">Prepared for {settings.investorName}</Badge></div>
            </div>
          </div>
        </Panel>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Map snapshot */}
          <Panel title="Market map" bodyClass="p-0" className="lg:col-span-2">
            <div className="aspect-[5/3] bg-ink rounded-b-xl overflow-hidden">
              <USMap markets={mapMarkets.length ? mapMarkets : screenedMarkets} properties={[p]} selected={{ type: 'property', id: p.id }} onSelectMarket={() => {}} onSelectProperty={() => {}} />
            </div>
          </Panel>
          {/* REIndicator card */}
          <Panel title="REIndicator status">
            {p.market ? (
              <div>
                <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm" style={{ background: INDICATORS[p.market.indicatorColor].color }} /><span className="text-stone">{p.market.marketName}</span></div>
                <div className="mt-2"><Badge tone={p.market.gate.gate === 'hunt' ? 'green' : 'mist'}>{INDICATORS[p.market.indicatorColor].label}</Badge></div>
                <KeyVal k="Priority" v={p.market.gate.priority} />
                <KeyVal k="Confidence" v={p.market.confidence} />
                <KeyVal k="State / region" v={`${p.market.state} · ${p.market.region}`} />
                <p className="mt-2 text-xs text-mist">{p.market.notes}</p>
              </div>
            ) : <p className="text-sm text-mist">No market linked.</p>}
          </Panel>
        </div>

        {/* Scorecard */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KeyStat k="Price / unit" v={usd(d.pricePerUnit)} />
          <KeyStat k="Stabilized NOI" v={usd(d.stabilizedNOI)} />
          <KeyStat k="Stabilized DSCR" v={mult(d.stabilizedDSCR)} />
          <KeyStat k="Value created" v={usdSigned(d.valueCreated)} />
        </div>

        <Panel title="Current Reality · Broker Story · Our Strike Deal"><TriCompare p={p} /></Panel>

        <div className="grid gap-6 lg:grid-cols-2">
          <Panel title="24-month stabilization timeline">
            <ol className="space-y-3">
              {plan.map((ph, i) => (
                <li key={ph.phase} className="flex gap-3">
                  <span className="grid h-6 w-6 flex-none place-items-center rounded-full bg-panel text-xs text-gold">{i + 1}</span>
                  <div><div className="text-sm text-stone">{ph.phase} — {ph.title}</div></div>
                </li>
              ))}
            </ol>
          </Panel>
          <Panel title="Sources & uses of capital">
            <div className="grid grid-cols-2 gap-x-8">
              <div>
                <KeyVal k="Purchase" v={usd(d.askingPrice)} />
                <KeyVal k="Capex" v={usd(d.capex)} />
                <KeyVal k="Closing" v={usd(d.closingCosts)} />
                <KeyVal k="Reserves" v={usd(d.reserves)} />
              </div>
              <div>
                <KeyVal k="Total cost" v={usd(d.totalProjectCost)} tone="gold" />
                <KeyVal k="Loan" v={usd(d.loanAmount)} />
                <KeyVal k="Equity" v={usd(d.equity)} />
                <KeyVal k="Max supportable" v={usd(d.maxSupportablePrice)} />
              </div>
            </div>
          </Panel>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Panel title="Risk register">
            <div className="space-y-2">
              {(p.risks || []).map((r, i) => (
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

        <Callout tone="mist" title="Disclaimer">
          Version 1 market regions are approximate from REIndicator screenshot review and must be verified before investment decisions.
          This report uses {p.source.label.toLowerCase()} inputs and a preliminary max supportable price — not a final offer.
        </Callout>
      </div>
    </div>
  )
}

const KeyStat = ({ k, v }) => (
  <div className="panel p-4"><div className="label">{k}</div><div className="mt-1 text-lg font-semibold tnum text-stone">{v}</div></div>
)
