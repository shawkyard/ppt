import { useParams, Link } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import DealHeader, { DealNotFound } from '../components/DealHeader.jsx'
import { Panel, KeyVal, Badge, Callout, Stat } from '../components/ui.jsx'
import { usd, pct, usdSigned } from '../lib/format.js'

function confidence(p) {
  const missing = (p.missingDocs || []).length
  const optimism = p.ratings.brokerOptimismRisk
  if (missing >= 4 || optimism >= 7) return { label: 'Low', tone: 'red' }
  if (missing >= 2 || optimism >= 4) return { label: 'Low–Medium', tone: 'yellow' }
  return { label: 'Medium', tone: 'gold' }
}

export default function OfferPrice() {
  const { id } = useParams()
  const { getProperty } = useApp()
  const p = getProperty(id)
  if (!p) return <DealNotFound />
  const d = p.deal
  const conf = confidence(p)
  const below = d.requiredPriceReduction > 0
  const base = Math.max(d.askingPrice, d.maxSupportablePrice) || 1
  const brokerOnly = p.ratings.brokerOptimismRisk >= 6

  return (
    <div>
      <DealHeader p={p} />

      <Callout tone="red" title="This is not a final offer">
        We do not recommend a final offer price from listing-only data. Below is a preliminary max supportable price, the required price
        reduction, the documents needed before an LOI, and our confidence level. A real number comes after the T-12, rent roll, and a site walk.
      </Callout>

      {brokerOnly && (
        <Callout tone="red" title="⚠ Broker pro forma dependency" className="mt-4">
          This deal leans heavily on the broker pro forma. If the deal only works using the Broker Story column, it does not work.
        </Callout>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Panel title="Preliminary max supportable price" className="lg:col-span-2">
          <div className="flex flex-wrap items-end gap-x-8 gap-y-3">
            <div>
              <div className="text-3xl font-bold tnum text-gold">{usd(d.maxSupportablePrice)}</div>
              <div className="text-xs text-mist mt-1">Stabilized NOI ÷ (exit cap + risk spread), net of capex &amp; reserves</div>
            </div>
            <div>
              <div className={`text-lg font-semibold tnum ${below ? 'text-red' : 'text-greenbright'}`}>
                {below ? '−' : '+'}{usd(Math.abs(d.requiredPriceReduction))} ({pct(Math.abs(d.requiredReductionPct), 0)})
              </div>
              <div className="text-xs text-mist mt-1">required price reduction vs. {usd(d.askingPrice)} ask</div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <Bar label="Asking price" value={usd(d.askingPrice)} w={(d.askingPrice / base) * 100} color="bg-mist/50" />
            <Bar label="Max supportable (prelim.)" value={usd(d.maxSupportablePrice)} w={(d.maxSupportablePrice / base) * 100} color="bg-gold" />
            <Bar label="Walk-away (placeholder)" value="Set after site walk" w={(d.maxSupportablePrice * 0.92 / base) * 100} color="bg-red/50" />
          </div>

          <div className="mt-6 border-t border-line pt-4 grid sm:grid-cols-2 gap-x-8">
            <div>
              <KeyVal k="Stabilized NOI (Yr 3)" v={usd(d.stabilizedNOI)} />
              <KeyVal k="Exit cap" v={pct(d.exitCapRate)} />
              <KeyVal k="Target cap (+ spread)" v={pct(d.exitCapRate + 0.0075)} />
            </div>
            <div>
              <KeyVal k="Capex" v={usd(d.capex)} />
              <KeyVal k="Reserves" v={usd(d.reserves)} />
              <KeyVal k="Why ask may be high" v={below ? `${pct(Math.abs(d.requiredReductionPct), 0)} over supportable` : 'Near supportable'} tone={below ? 'red' : 'green'} />
            </div>
          </div>
        </Panel>

        <div className="space-y-6">
          <Panel title="Confidence level">
            <div className="flex items-center gap-3"><Badge tone={conf.tone}>{conf.label}</Badge><span className="text-xs text-mist">{p.source.label}</span></div>
            <p className="mt-3 text-sm text-fog">Confidence is limited by missing documents and broker-pro-forma reliance. It rises as documents arrive and comps are verified independently.</p>
          </Panel>
          <Stat label="Value created at stabilization" value={usdSigned(d.valueCreated)} sub="Stabilized value − total project cost" tone={d.valueCreated > 0 ? 'green' : 'red'} />
        </div>

        <Panel title="Required before an LOI" className="lg:col-span-2">
          <ul className="grid sm:grid-cols-2 gap-2">
            {(p.missingDocs || []).map((doc, i) => <li key={i} className="flex items-center gap-2 text-sm text-fog"><span className="h-1.5 w-1.5 rounded-full bg-gold" />{doc}</li>)}
          </ul>
        </Panel>
        <Panel title="Then ask the broker">
          <p className="text-sm text-mist">Full question set is on the Broker Questions tab, including the pro-forma challenge questions.</p>
          <Link to={`/deal/${p.id}/questions`} className="btn-ghost mt-4 w-full text-xs">Broker questions →</Link>
        </Panel>
      </div>
    </div>
  )
}

function Bar({ label, value, w, color }) {
  return (
    <div>
      <div className="flex justify-between text-xs text-mist mb-1"><span>{label}</span><span className="tnum">{value}</span></div>
      <div className="h-3 rounded bg-panel overflow-hidden"><div className={`h-full ${color}`} style={{ width: `${Math.max(2, Math.min(100, w))}%` }} /></div>
    </div>
  )
}
