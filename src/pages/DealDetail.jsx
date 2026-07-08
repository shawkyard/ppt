import { useParams, Link } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import DealHeader, { DealNotFound } from '../components/DealHeader.jsx'
import TriCompare from '../components/TriCompare.jsx'
import { Panel, Badge, ScoreRing, WeightBar, KeyVal, Callout } from '../components/ui.jsx'
import { usd, pct, mult, usdSigned } from '../lib/format.js'

function reasons(p) {
  const scored = p.breakdown.map((b) => ({ ...b, fill: b.weight ? b.points / b.weight : 0 }))
  return {
    strengths: scored.filter((b) => b.fill >= 0.65).sort((a, b) => b.points - a.points),
    drags: scored.filter((b) => b.fill < 0.5).sort((a, b) => a.fill - b.fill),
  }
}

function StrikeFactor({ f }) {
  const val = f.fmt === 'pct' ? pct(f.value) : f.fmt === 'x' ? mult(f.value) : usd(f.value)
  const tone = f.strong ? 'green' : f.pass ? 'gold' : 'red'
  return (
    <div className="flex items-center justify-between rounded-lg border border-line bg-ink px-3 py-2">
      <div>
        <div className="text-sm text-stone">{f.label}</div>
        <div className="text-[11px] text-mist">{f.target}</div>
      </div>
      <div className="text-right">
        <div className="tnum text-sm text-stone">{val}</div>
        <Badge tone={tone}>{f.strong ? 'Strong' : f.pass ? 'Pass' : 'Miss'}</Badge>
      </div>
    </div>
  )
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
        <Panel title="Decision">
          <div className="flex flex-col items-center text-center">
            <ScoreRing score={p.score} tone={p.verdict.tone} size={120} label="/ 100" />
            <div className="mt-4"><Badge tone={p.verdict.tone}>{p.verdict.label}</Badge></div>
          </div>
          <div className="mt-5">
            <div className="label mb-1">Next action</div>
            <p className="text-sm text-fog">{p.nextAction}</p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Link to={`/deal/${p.id}/offer`} className="btn-ghost text-xs">Price analysis</Link>
            <Link to={`/deal/${p.id}/summary`} className="btn-ghost text-xs">Investor summary</Link>
          </div>
        </Panel>

        <Panel title={passed ? 'Why it made the cut' : 'Why it failed'} className="lg:col-span-2">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <div className="label text-greenbright mb-2">Working for it</div>
              <ul className="space-y-1.5 text-sm text-fog">
                {strengths.length ? strengths.map((s) => <li key={s.key} className="flex gap-2"><span className="text-greenbright">▲</span>{s.label}</li>) : <li className="text-mist">No standout strengths.</li>}
              </ul>
            </div>
            <div>
              <div className="label text-red mb-2">Working against it</div>
              <ul className="space-y-1.5 text-sm text-fog">
                {drags.length ? drags.map((s) => <li key={s.key} className="flex gap-2"><span className="text-red">▼</span>{s.label}</li>) : <li className="text-mist">No material drags.</li>}
              </ul>
            </div>
          </div>
          <div className="mt-5 border-t border-line pt-4">
            {p.breakdown.map((b) => <WeightBar key={b.key} label={b.label} points={b.points} weight={b.weight} help={b.help} />)}
          </div>
        </Panel>

        <Panel title="Current pain"><p className="text-sm text-fog">{p.pain || '—'}</p></Panel>
        <Panel title="Fixable upside"><p className="text-sm text-fog">{p.fixableUpside || '—'}</p></Panel>
        <Panel title="Market reason"><p className="text-sm text-fog">{p.marketReason || '—'}</p></Panel>

        <Panel title="Current Reality · Broker Story · Our Strike Deal" className="lg:col-span-3">
          <TriCompare p={p} />
          <Callout tone="mist" title="Discipline" className="mt-4">These three columns are never mixed. Our underwriting and the go/no-go run off the Strike Deal, not the Broker Story.</Callout>
        </Panel>

        <Panel title="Quick math" className="lg:col-span-2">
          <div className="grid gap-x-8 sm:grid-cols-2">
            <div>
              <KeyVal k="Asking price" v={usd(d.askingPrice)} />
              <KeyVal k="Price / unit" v={usd(d.pricePerUnit)} />
              <KeyVal k="Rent gap" v={pct(d.rentGapPct, 0)} tone={d.rentGapPct > 0.1 ? 'green' : 'yellow'} />
              <KeyVal k="Monthly rent upside" v={usd(d.monthlyRentUpside)} />
              <KeyVal k="Annual rent upside" v={usd(d.annualRentUpside)} tone="gold" />
              <KeyVal k="Total project cost" v={usd(d.totalProjectCost)} />
            </div>
            <div>
              <KeyVal k="Current NOI" v={usd(d.currentNOI)} tag="EXT" />
              <KeyVal k="Stabilized NOI (Yr 3)" v={usd(d.stabilizedNOI)} tone="green" tag="CALC" />
              <KeyVal k="Current cap rate" v={pct(d.currentCapRate)} />
              <KeyVal k="Stabilized cap rate" v={pct(d.stabilizedCapRate)} tone="green" />
              <KeyVal k="Stabilized value" v={usd(d.stabilizedValue)} />
              <KeyVal k="Value created" v={usdSigned(d.valueCreated)} tone={d.valueCreated > 0 ? 'green' : 'red'} />
            </div>
          </div>
        </Panel>

        <Panel title="Year-3 strike factors">
          <p className="text-xs text-mist mb-3">Weak Year-1 returns are expected. The real test is stabilized Year-3.</p>
          <div className="space-y-2">{p.factors.map((f) => <StrikeFactor key={f.key} f={f} />)}</div>
        </Panel>

        <Panel title="Missing documents">
          <ul className="space-y-2">
            {(p.missingDocs || []).map((doc, i) => <li key={i} className="flex items-center gap-2 text-sm text-fog"><span className="h-1.5 w-1.5 rounded-full bg-gold" />{doc}</li>)}
          </ul>
          <Link to={`/deal/${p.id}/questions`} className="btn-ghost mt-4 w-full text-xs">Broker questions →</Link>
        </Panel>

        <Panel title="Top risks" className="lg:col-span-2">
          <div className="space-y-3">
            {(p.risks || []).slice(0, 3).map((r, i) => (
              <div key={i} className="flex items-start gap-3">
                <Badge tone={r.severity === 'High' ? 'red' : r.severity === 'Medium' ? 'yellow' : 'mist'}>{r.severity}</Badge>
                <div><div className="text-sm text-stone">{r.category} — {r.notes}</div><div className="text-xs text-mist">Mitigation: {r.mitigation}</div></div>
              </div>
            ))}
          </div>
          <Link to={`/deal/${p.id}/risk`} className="btn-ghost mt-4 text-xs">Full risk register →</Link>
        </Panel>
      </div>
    </div>
  )
}
