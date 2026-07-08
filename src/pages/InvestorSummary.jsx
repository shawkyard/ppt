import { useParams } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import DealHeader, { DealNotFound } from '../components/DealHeader.jsx'
import { Panel, Badge, ScoreRing, KeyVal, Callout, Stat } from '../components/ui.jsx'
import { usd, pct, usdSigned } from '../lib/format.js'

export default function InvestorSummary() {
  const { id } = useParams()
  const { getProperty } = useApp()
  const p = getProperty(id)
  if (!p) return <DealNotFound />
  const d = p.deal

  return (
    <div>
      <DealHeader p={p} />

      <div className="flex justify-end mb-4">
        <button className="btn-ghost text-xs" onClick={() => window.print()}>Print / save PDF</button>
      </div>

      <Panel className="mb-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <ScoreRing score={p.score} tone={p.verdict.tone} size={120} label="/ 100" />
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <Badge tone={p.verdict.tone}>{p.verdict.label}</Badge>
              {p.market && <Badge tone={p.market.verdict.tone}>Market: {p.market.verdict.label} ({p.market.score})</Badge>}
            </div>
            <h2 className="mt-3 text-xl text-white">{p.name}</h2>
            <p className="text-sm text-mist">{p.city} · {p.units} units · {p.propertyClass} in {p.areaClass} area · Built {p.yearBuilt || '—'}</p>
            <p className="mt-3 text-sm text-fog"><span className="text-white font-medium">Recommendation:</span> {p.nextAction}</p>
          </div>
        </div>
      </Panel>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Stat label="Price / unit" value={usd(d.pricePerUnit)} />
        <Stat label="Rent gap" value={pct(d.rentGapPct, 0)} tone="gold" />
        <Stat label="Stabilized cap" value={pct(d.stabilizedCapRate)} tone="approve" />
        <Stat label="Value created" value={usdSigned(d.valueCreated)} tone={d.valueCreated > 0 ? 'approve' : 'danger'} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="The thesis">
          <div className="space-y-4 text-sm">
            <div><div className="label text-danger mb-1">Current pain</div><p className="text-fog">{p.pain || '—'}</p></div>
            <div><div className="label text-approve mb-1">Fixable upside</div><p className="text-fog">{p.fixableUpside || '—'}</p></div>
            <div><div className="label text-gold mb-1">Why this market</div><p className="text-fog">{p.marketReason || '—'}</p></div>
          </div>
        </Panel>

        <Panel title="Underwriting snapshot">
          <div className="grid sm:grid-cols-2 gap-x-8">
            <div>
              <KeyVal k="Asking price" v={usd(d.askingPrice)} />
              <KeyVal k="Total project cost" v={usd(d.totalProjectCost)} />
              <KeyVal k="Max supportable (prelim.)" v={usd(p.correction.max)} tone="gold" />
              <KeyVal k="Current NOI" v={usd(d.currentNOI)} />
            </div>
            <div>
              <KeyVal k="Stabilized NOI" v={usd(d.stabilizedNOI)} tone="approve" />
              <KeyVal k="Annual rent upside" v={usd(d.annualRentUpside)} />
              <KeyVal k="Stabilized value" v={usd(d.stabilizedValue)} />
              <KeyVal k="Value created" v={usdSigned(d.valueCreated)} tone={d.valueCreated > 0 ? 'approve' : 'danger'} />
            </div>
          </div>
        </Panel>

        <Panel title="Top risks">
          <div className="space-y-2">
            {(p.risks || []).slice(0, 3).map((r, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <Badge tone={r.severity === 'High' ? 'danger' : r.severity === 'Medium' ? 'warn' : 'mist'}>{r.severity}</Badge>
                <span className="text-fog">{r.risk}</span>
              </div>
            ))}
            {!(p.risks || []).length && <p className="text-sm text-mist">No risks logged.</p>}
          </div>
        </Panel>

        <Panel title="Before we underwrite">
          <div className="text-sm">
            <div className="label mb-2">Missing documents</div>
            <ul className="space-y-1.5">
              {(p.missingDocs || []).map((doc, i) => (
                <li key={i} className="flex items-center gap-2 text-fog"><span className="h-1.5 w-1.5 rounded-full bg-gold" />{doc}</li>
              ))}
            </ul>
          </div>
        </Panel>
      </div>

      <Callout tone="mist" title="Confidence & caveat" >
        This summary is built from listing-level inputs and a preliminary max supportable price — <span className="text-white">not a final offer</span>.
        Confirm with the T-12, rent roll, and a site walk before committing capital.
      </Callout>
    </div>
  )
}
