import { useParams, Link } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import DealHeader, { DealNotFound } from '../components/DealHeader.jsx'
import { Panel, Badge, ScoreRing, WeightBar, KeyVal, Callout } from '../components/ui.jsx'
import { usd, pct, usdSigned } from '../lib/format.js'

// Derive plain-English "why" from the weighted breakdown.
function reasons(p) {
  const scored = p.breakdown.map((b) => ({ ...b, fill: b.weight ? b.points / b.weight : 0 }))
  const strengths = scored.filter((b) => b.fill >= 0.65).sort((a, b) => b.points - a.points)
  const drags = scored.filter((b) => b.fill < 0.5).sort((a, b) => a.fill - b.fill)
  return { strengths, drags }
}

export default function DealDetail() {
  const { id } = useParams()
  const { getProperty } = useApp()
  const p = getProperty(id)
  if (!p) return <DealNotFound />

  const d = p.deal
  const { strengths, drags } = reasons(p)
  const passed = p.verdict.band === 'strong' || p.verdict.band === 'request'

  return (
    <div>
      <DealHeader p={p} />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Decision */}
        <Panel title="Decision">
          <div className="flex flex-col items-center text-center">
            <ScoreRing score={p.score} tone={p.verdict.tone} size={120} label="/ 100" />
            <div className="mt-4"><Badge tone={p.verdict.tone}>{p.verdict.label}</Badge></div>
          </div>
          <div className="mt-5 space-y-1">
            <KeyVal k="Next action" v="" />
            <p className="text-sm text-fog">{p.nextAction}</p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Link to={`/deal/${p.id}/offer`} className="btn-ghost text-xs">Price analysis</Link>
            <Link to={`/deal/${p.id}/summary`} className="btn-ghost text-xs">Investor summary</Link>
          </div>
        </Panel>

        {/* Why */}
        <Panel title={passed ? 'Why it made the cut' : 'Why it failed'} className="lg:col-span-2">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <div className="label text-approve mb-2">Working for it</div>
              <ul className="space-y-1.5 text-sm text-fog">
                {strengths.length ? strengths.map((s) => (
                  <li key={s.key} className="flex gap-2"><span className="text-approve">▲</span>{s.label} <span className="text-mist tnum">({s.points.toFixed(1)}/{s.weight})</span></li>
                )) : <li className="text-mist">No standout strengths.</li>}
              </ul>
            </div>
            <div>
              <div className="label text-danger mb-2">Working against it</div>
              <ul className="space-y-1.5 text-sm text-fog">
                {drags.length ? drags.map((s) => (
                  <li key={s.key} className="flex gap-2"><span className="text-danger">▼</span>{s.label} <span className="text-mist tnum">({s.points.toFixed(1)}/{s.weight})</span></li>
                )) : <li className="text-mist">No material drags.</li>}
              </ul>
            </div>
          </div>
          <div className="mt-5 border-t border-slateline/60 pt-4">
            {p.breakdown.map((b) => <WeightBar key={b.key} label={b.label} points={b.points} weight={b.weight} help={b.help} />)}
          </div>
        </Panel>

        {/* Pain / Upside / Market */}
        <Panel title="Current pain"><p className="text-sm text-fog">{p.pain || '—'}</p></Panel>
        <Panel title="Fixable upside"><p className="text-sm text-fog">{p.fixableUpside || '—'}</p></Panel>
        <Panel title="Market reason"><p className="text-sm text-fog">{p.marketReason || '—'}</p></Panel>

        {/* Quick math */}
        <Panel title="Quick math" className="lg:col-span-2">
          <div className="grid gap-x-8 gap-y-0 sm:grid-cols-2">
            <div>
              <KeyVal k="Asking price" v={usd(d.askingPrice)} />
              <KeyVal k="Price / unit" v={usd(d.pricePerUnit)} />
              <KeyVal k="Current rent / unit" v={usd(d.currentRent)} />
              <KeyVal k="Market rent / unit" v={usd(d.marketRent)} />
              <KeyVal k="Rent gap" v={pct(d.rentGapPct, 0)} tone={d.rentGapPct > 0.1 ? 'approve' : 'warn'} />
              <KeyVal k="Monthly rent upside" v={usd(d.monthlyRentUpside)} />
              <KeyVal k="Annual rent upside" v={usd(d.annualRentUpside)} tone="gold" />
            </div>
            <div>
              <KeyVal k="Current NOI" v={usd(d.currentNOI)} />
              <KeyVal k="Stabilized NOI" v={usd(d.stabilizedNOI)} tone="approve" />
              <KeyVal k="Current cap rate" v={pct(d.currentCapRate)} />
              <KeyVal k="Stabilized cap rate" v={pct(d.stabilizedCapRate)} tone="approve" />
              <KeyVal k="Stabilized value" v={usd(d.stabilizedValue)} />
              <KeyVal k="Total project cost" v={usd(d.totalProjectCost)} />
              <KeyVal k="Value created" v={usdSigned(d.valueCreated)} tone={d.valueCreated > 0 ? 'approve' : 'danger'} />
            </div>
          </div>
          <Callout tone="mist" title="Note">
            These figures come from listing-level inputs. Confirm with the T-12 and rent roll before underwriting. See the price analysis tab for a preliminary max supportable price — not a final offer.
          </Callout>
        </Panel>

        {/* Missing docs */}
        <Panel title="Missing documents">
          <ul className="space-y-2">
            {(p.missingDocs || []).map((doc, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-fog">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />{doc}
              </li>
            ))}
          </ul>
          <Link to={`/deal/${p.id}/questions`} className="btn-ghost mt-4 w-full text-xs">Broker questions →</Link>
        </Panel>

        {/* Top risks */}
        <Panel title="Top risks" className="lg:col-span-2">
          <div className="space-y-3">
            {(p.risks || []).slice(0, 3).map((r, i) => (
              <div key={i} className="flex items-start gap-3">
                <Badge tone={r.severity === 'High' ? 'danger' : r.severity === 'Medium' ? 'warn' : 'mist'}>{r.severity}</Badge>
                <div>
                  <div className="text-sm text-white">{r.risk}</div>
                  <div className="text-xs text-mist">Mitigation: {r.mitigation}</div>
                </div>
              </div>
            ))}
            {!(p.risks || []).length && <p className="text-sm text-mist">No risks logged yet.</p>}
          </div>
          <Link to={`/deal/${p.id}/risk`} className="btn-ghost mt-4 text-xs">Full risk register →</Link>
        </Panel>
      </div>
    </div>
  )
}
