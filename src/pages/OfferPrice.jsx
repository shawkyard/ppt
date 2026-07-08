import { useParams, Link } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import DealHeader, { DealNotFound } from '../components/DealHeader.jsx'
import { Panel, KeyVal, Badge, Callout, Stat } from '../components/ui.jsx'
import { usd, pct, usdSigned } from '../lib/format.js'

// Confidence is deliberately capped — we are working from listing-level data.
function confidence(p) {
  const missing = (p.missingDocs || []).length
  const optimism = p.ratings.brokerOptimismRisk
  if (missing >= 4 || optimism >= 7) return { label: 'Low', tone: 'danger' }
  if (missing >= 2 || optimism >= 4) return { label: 'Low–Medium', tone: 'warn' }
  return { label: 'Medium', tone: 'warn' }
}

export default function OfferPrice() {
  const { id } = useParams()
  const { getProperty } = useApp()
  const p = getProperty(id)
  if (!p) return <DealNotFound />

  const d = p.deal
  const c = p.correction
  const conf = confidence(p)
  const below = c.delta < 0
  // Bar widths relative to the larger of the two values.
  const base = Math.max(d.askingPrice, c.max) || 1
  const askW = (d.askingPrice / base) * 100
  const maxW = (c.max / base) * 100

  return (
    <div>
      <DealHeader p={p} />

      <Callout tone="danger" title="This is not a final offer">
        We do not recommend a final offer price from listing-only data. Below is a preliminary max supportable price, the documents required to
        firm it up, the questions to ask the broker, and our confidence level. A real number comes after the T-12, rent roll, and a site walk.
      </Callout>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Panel title="Preliminary max supportable price" className="lg:col-span-2">
          <div className="flex flex-wrap items-end gap-x-8 gap-y-3">
            <div>
              <div className="text-3xl font-bold tnum text-gold">{usd(c.max)}</div>
              <div className="text-xs text-mist mt-1">Stabilized NOI ÷ (exit cap + risk spread), net of capex &amp; reserves</div>
            </div>
            <div>
              <div className={`text-lg font-semibold tnum ${below ? 'text-danger' : 'text-approve'}`}>
                {below ? '' : '+'}{usdSigned(c.delta)} ({pct(c.deltaPct, 0)})
              </div>
              <div className="text-xs text-mist mt-1">vs. {usd(d.askingPrice)} asking</div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div>
              <div className="flex justify-between text-xs text-mist mb-1"><span>Asking price</span><span className="tnum">{usd(d.askingPrice)}</span></div>
              <div className="h-3 rounded bg-graphite overflow-hidden"><div className="h-full bg-mist/50" style={{ width: `${askW}%` }} /></div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-mist mb-1"><span>Max supportable (prelim.)</span><span className="tnum">{usd(c.max)}</span></div>
              <div className="h-3 rounded bg-graphite overflow-hidden"><div className="h-full bg-gold" style={{ width: `${maxW}%` }} /></div>
            </div>
          </div>

          <div className="mt-6 border-t border-slateline/60 pt-4 grid sm:grid-cols-2 gap-x-8">
            <div>
              <KeyVal k="Stabilized NOI" v={usd(d.stabilizedNOI)} />
              <KeyVal k="Exit cap" v={pct(d.exitCapRate)} />
              <KeyVal k="Target cap (+0.75% spread)" v={pct(d.exitCapRate + 0.0075)} />
            </div>
            <div>
              <KeyVal k="Estimated capex" v={usd(d.estimatedCapex)} />
              <KeyVal k="Reserves" v={usd(d.reserves)} />
              <KeyVal k="Implied price correction" v={below ? `${pct(Math.abs(c.deltaPct), 0)} below ask` : 'At/above ask'} tone={below ? 'danger' : 'approve'} />
            </div>
          </div>
        </Panel>

        <div className="space-y-6">
          <Panel title="Confidence level">
            <div className="flex items-center gap-3">
              <Badge tone={conf.tone}>{conf.label}</Badge>
              <span className="text-xs text-mist">listing-level data</span>
            </div>
            <p className="mt-3 text-sm text-fog">
              Confidence is limited by missing documents and broker-pro-forma reliance. It rises as documents come in and comps are verified independently.
            </p>
          </Panel>

          <Stat label="Value created at stabilization" value={usdSigned(d.valueCreated)} sub="Stabilized value − total project cost" tone={d.valueCreated > 0 ? 'approve' : 'danger'} />
        </div>

        <Panel title="Required before firming a price" className="lg:col-span-2">
          <ul className="grid sm:grid-cols-2 gap-2">
            {(p.missingDocs || []).map((doc, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-fog"><span className="h-1.5 w-1.5 rounded-full bg-gold" />{doc}</li>
            ))}
          </ul>
        </Panel>

        <Panel title="Then ask the broker">
          <ul className="space-y-2">
            {(p.brokerQuestions || []).slice(0, 4).map((q, i) => (
              <li key={i} className="text-sm text-fog">• {q}</li>
            ))}
          </ul>
          <Link to={`/deal/${p.id}/questions`} className="btn-ghost mt-4 w-full text-xs">All broker questions →</Link>
        </Panel>
      </div>
    </div>
  )
}
