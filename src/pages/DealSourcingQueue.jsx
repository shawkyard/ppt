import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import { Panel, Badge, PageHeader, Callout, LockedTag, Field } from '../components/ui.jsx'
import Icon from '../components/Icon.jsx'
import { screenListings, parseCsv, SAMPLE_CSV } from '../lib/sourcingRules.js'
import { usd, pct } from '../lib/format.js'

const CONNECTORS = [
  { name: 'Public broker websites', note: 'Compliant scans of permitted sources' },
  { name: 'Uploaded CSV', note: 'Bulk listing import' },
  { name: 'Pasted listing URLs', note: 'Single-URL extraction' },
  { name: 'OM uploads', note: 'Offering-memorandum parsing' },
  { name: 'Scheduled weekly scans', note: 'Recurring in-market sweeps' },
  { name: 'Market-specific agents', note: 'Per-market hunt agents' },
]

const RULE_FIELDS = [
  { key: 'unitsMin', label: 'Min units', step: 1 },
  { key: 'unitsMax', label: 'Max units', step: 1 },
  { key: 'pricePerUnitMax', label: 'Max price / unit ($)', step: 5000 },
  { key: 'askingMin', label: 'Min asking ($)', step: 500000 },
  { key: 'askingMax', label: 'Max asking ($)', step: 1000000 },
  { key: 'minRentGapPct', label: 'Min rent upside (0–1)', step: 0.01 },
  { key: 'staleDaysBonus', label: 'Stale after (days)', step: 5 },
  { key: 'returnTopN', label: 'Return top N', step: 1 },
]

function listingToProperty(r, markets) {
  const l = r.listing
  const units = Number(l.units) || 0
  const cur = Number(l.currentRent) || 0
  const mkt = Number(l.marketRent) || cur
  return {
    name: l.name || 'Untitled listing', address: l.address || '', city: r.market?.marketName || l.market || '',
    marketId: r.market?.id || markets[0]?.id, propertyClass: (l.class || 'C').toUpperCase(), areaClass: 'B', yearBuilt: 1990,
    units, askingPrice: Number(l.price) || 0, exitCapRate: 0.06, estimatedCapexPerUnit: 12000, closingCostsPct: 0.025,
    reserves: 200000, ltv: 0.65, interestRate: 0.065, amortYears: 30, riskSpread: 0.0075,
    sourceLevel: 'listing', listingAgeDays: Number(l.dom) || 0, dealStatus: 'New',
    scenarios: {
      current: { avgRent: cur, occupancy: 0.9, expenseRatio: 0.5, otherIncomeAnnual: units * 300 },
      broker: { avgRent: Math.round(mkt * 1.03), occupancy: 0.95, expenseRatio: 0.44, otherIncomeAnnual: units * 900 },
      strike: { avgRent: mkt, occupancy: 0.93, expenseRatio: 0.47, otherIncomeAnnual: units * 650 },
    },
    provenance: { current: 'EXT', broker: 'BR', strike: 'CALC' },
    submarketQuality: 7, conditionFit: 7, capexFeasibility: 7, brokerOptimismRisk: 4, debtStrikeFactor: 7,
    pain: '', fixableUpside: '', marketReason: '', nextAction: 'Request OM + T-12.',
    missingDocs: ['T-12', 'Rent roll', 'Capex history'], risks: [],
  }
}

export default function DealSourcingQueue() {
  const { screenedMarkets, settings, updateSettings, addProperty } = useApp()
  const navigate = useNavigate()
  const rules = settings.sourcingRules
  const approved = screenedMarkets.filter((m) => m.gate.gate === 'hunt')
  const [csv, setCsv] = useState(SAMPLE_CSV)
  const [result, setResult] = useState(null)

  const setRule = (k, v) => updateSettings({ sourcingRules: { ...rules, [k]: Number(v) } })
  const run = () => setResult(screenListings(parseCsv(csv), rules, screenedMarkets))
  const addOne = (r) => { const id = addProperty(listingToProperty(r, screenedMarkets)); navigate(`/deal/${id}`) }
  const addAllTop = () => { result?.topN.forEach((r) => addProperty(listingToProperty(r, screenedMarkets))); navigate('/scratch') }

  return (
    <div>
      <PageHeader title="Deal Sourcing Queue"
        subtitle="Controlled, rule-based sourcing. Set your strict rules once, then screen any listings you paste or import — only deals that pass your criteria reach the pipeline. No live national crawling.">
        <Link to="/add" className="btn-ghost">Add manually</Link>
      </PageHeader>

      <div className="grid gap-3 md:grid-cols-3 mb-6">
        <Callout tone="red" title="Cost control">Only source inside approved markets.</Callout>
        <Callout tone="red" title="Cost control">Return only the top {rules.returnTopN}. Never crawl the whole country.</Callout>
        <Callout tone="red" title="Cost control">No paid searches without approval.</Callout>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Rulebook */}
          <Panel title="Sourcing rulebook" action={<Badge tone="gold">strict</Badge>}>
            <div className="flex flex-wrap gap-4 mb-4">
              <label className="flex items-center gap-2 text-sm text-fog">
                <input type="checkbox" className="accent-gold" checked={rules.approvedMarketsOnly}
                  onChange={(e) => updateSettings({ sourcingRules: { ...rules, approvedMarketsOnly: e.target.checked } })} />
                Approved (Green) markets only
              </label>
              <div className="text-sm text-fog flex items-center gap-2">Avoid classes:
                <span className="tnum font-semibold text-stone">{rules.avoidClasses.join(', ') || 'none'}</span></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {RULE_FIELDS.map((f) => (
                <Field key={f.key} label={f.label}>
                  <input type="number" step={f.step} className="input tnum" value={rules[f.key]} onChange={(e) => setRule(f.key, e.target.value)} />
                </Field>
              ))}
            </div>
          </Panel>

          {/* Screener */}
          <Panel title="Screen listings against the rules"
            action={<button className="text-xs text-gold font-bold hover:underline" onClick={() => setCsv(SAMPLE_CSV)}>Load sample</button>}>
            <p className="text-sm text-mist mb-2">Paste a CSV of candidate listings (compliant sources only). Columns: <code className="text-fog">name, market, units, price, currentRent, marketRent, class, dom</code></p>
            <textarea className="input h-36 font-mono text-xs" value={csv} onChange={(e) => setCsv(e.target.value)} />
            <div className="mt-3 flex gap-2">
              <button className="btn-gold" onClick={run}><Icon name="search" className="w-4 h-4" /> Run rules</button>
              <Link to="/upload" className="btn-ghost">Upload OM / CSV →</Link>
            </div>
          </Panel>

          {/* Results */}
          {result && (
            <Panel title={`Results — ${result.passed.length} pass, ${result.results.length - result.passed.length} rejected`}
              action={result.topN.length > 0 && <button className="btn-gold text-xs" onClick={addAllTop}>Add top {result.topN.length} to pipeline</button>}>
              <div className="space-y-3">
                {result.results.map((r, i) => (
                  <div key={i} className={`rounded-xl border p-4 ${r.pass ? 'border-green/40 bg-green/5' : 'border-line bg-offwhite'}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge tone={r.pass ? 'green' : 'red'}>{r.pass ? `PASS · fit ${r.fitScore}` : 'REJECT'}</Badge>
                          {r.stale && <Badge tone="gold">stale — negotiable</Badge>}
                        </div>
                        <div className="mt-1 font-bold text-stone">{r.listing.name}</div>
                        <div className="text-xs text-mist">{r.market ? `${r.market.marketName}, ${r.market.state}` : (r.listing.market || 'market not matched')}</div>
                      </div>
                      {r.pass && <button className="btn-ghost text-xs" onClick={() => addOne(r)}>Add →</button>}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {r.checks.map((c) => (
                        <span key={c.key} className={`chip ${c.ok ? 'border-green/40 bg-green/10 text-green' : 'border-red/40 bg-red/10 text-red'}`}>
                          {c.ok ? '✓' : '✕'} {c.label}<span className="text-mist font-normal">· {c.detail}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          )}
        </div>

        <div className="space-y-6">
          <Panel title={`Approved markets (${approved.length})`}>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {approved.map((m) => (
                <div key={m.id} className="flex items-center gap-2 text-sm">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#27B36B' }} />
                  <span className="text-fog flex-1">{m.marketName}</span><span className="text-xs text-mist">{m.state}</span>
                </div>
              ))}
            </div>
            <Link to="/markets" className="btn-ghost w-full text-xs mt-3">Market gate →</Link>
          </Panel>

          <Panel title="Live fetching — Version 2">
            <p className="text-sm text-mist mb-3">Actual fetching runs later via a compliant connector (official APIs / permitted feeds), obeying ToS, robots.txt, and your budget + top-{rules.returnTopN} caps. Locked in V1.</p>
            <div className="space-y-2">
              {CONNECTORS.map((c) => (
                <div key={c.name} className="flex items-center justify-between rounded-lg border border-line bg-offwhite px-3 py-2">
                  <span className="text-sm text-fog">{c.name}</span><LockedTag />
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  )
}
