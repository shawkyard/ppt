import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import { Panel, Badge, PageHeader, Callout, LockedTag, Field } from '../components/ui.jsx'

const CONNECTORS = [
  { name: 'Public broker websites', note: 'Approved-market broker scans' },
  { name: 'Uploaded CSV', note: 'Bulk listing import' },
  { name: 'Pasted listing URLs', note: 'Single-URL extraction' },
  { name: 'OM uploads', note: 'Offering-memorandum parsing' },
  { name: 'Scheduled weekly scans', note: 'Recurring in-market sweeps' },
  { name: 'Market-specific sourcing agents', note: 'Per-market hunt agents' },
]

export default function DealSourcingQueue() {
  const { screenedMarkets, settings, updateSettings } = useApp()
  const approved = screenedMarkets.filter((m) => m.gate.gate === 'hunt')
  const [url, setUrl] = useState('')
  const [urls, setUrls] = useState([])
  const [notes, setNotes] = useState('')

  return (
    <div>
      <PageHeader title="Deal Sourcing Queue"
        subtitle="Controlled, cost-safe sourcing. Version 1 runs in Manual / Assisted mode — no live national crawling, no paid APIs. Future connectors are shown as locked modules.">
        <Link to="/add" className="btn-gold">Add Property manually</Link>
      </PageHeader>

      <div className="grid gap-3 md:grid-cols-3 mb-6">
        <Callout tone="red" title="Cost control">Only run sourcing inside approved markets.</Callout>
        <Callout tone="red" title="Cost control">Return only the top 5 properties. Never crawl the whole country.</Callout>
        <Callout tone="red" title="Cost control">Do not run paid searches without approval.</Callout>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Panel title="Sourcing controls">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Sourcing mode">
                <select className="input" value={settings.sourcingMode} onChange={(e) => updateSettings({ sourcingMode: e.target.value })}>
                  <option>Manual / Assisted</option>
                  <option disabled>Automated (locked · V2)</option>
                </select>
              </Field>
              <Field label="Live scraping">
                <div className="flex items-center gap-2 h-[38px]"><LockedTag /><span className="text-xs text-mist">disabled in V1</span></div>
              </Field>
              <Field label="Run budget (USD)" help="Kept at $0 in V1 — no paid searches.">
                <input type="number" className="input tnum" value={settings.runBudgetUSD} onChange={(e) => updateSettings({ runBudgetUSD: Number(e.target.value) })} />
              </Field>
              <Field label="Max properties per run">
                <input type="number" className="input tnum" value={settings.maxPropertiesPerRun} onChange={(e) => updateSettings({ maxPropertiesPerRun: Number(e.target.value) })} />
              </Field>
              <Field label="Return top N">
                <input type="number" className="input tnum" value={settings.returnTopN} onChange={(e) => updateSettings({ returnTopN: Number(e.target.value) })} />
              </Field>
              <Field label="Approved markets only">
                <label className="flex items-center gap-2 h-[38px] text-sm text-fog">
                  <input type="checkbox" checked={settings.approvedMarketsOnly} onChange={(e) => updateSettings({ approvedMarketsOnly: e.target.checked })} className="accent-gold" /> Enforce
                </label>
              </Field>
            </div>
          </Panel>

          <Panel title="Public listing URL queue">
            <div className="flex gap-2">
              <input className="input" placeholder="Paste a listing URL…" value={url} onChange={(e) => setUrl(e.target.value)} />
              <button className="btn-dark flex-none" onClick={() => { if (url.trim()) { setUrls((u) => [...u, url.trim()]); setUrl('') } }}>Queue</button>
            </div>
            <ul className="mt-3 space-y-1.5">
              {urls.map((u, i) => (
                <li key={i} className="flex items-center justify-between rounded-lg border border-line bg-ink px-3 py-2 text-sm">
                  <span className="text-fog truncate">{u}</span>
                  <span className="flex items-center gap-2"><Badge tone="mist">queued</Badge><button className="text-mist hover:text-red text-xs" onClick={() => setUrls((x) => x.filter((_, j) => j !== i))}>✕</button></span>
                </li>
              ))}
              {!urls.length && <li className="text-sm text-mist">No URLs queued. Extraction is a V1 placeholder — paste, then Add Property manually.</li>}
            </ul>
          </Panel>

          <Panel title="Manual listing / broker notes paste">
            <textarea className="input h-28 resize-none" placeholder="Paste raw listing text or broker notes here to keep them with your queue…" value={notes} onChange={(e) => setNotes(e.target.value)} />
            <div className="mt-3 flex gap-2">
              <Link to="/add" className="btn-gold text-sm">Turn into a property →</Link>
              <Link to="/upload" className="btn-ghost text-sm">Upload documents →</Link>
            </div>
          </Panel>

          <Panel title="Future connectors — locked in Version 1">
            <div className="grid sm:grid-cols-2 gap-3">
              {CONNECTORS.map((c) => (
                <div key={c.name} className="rounded-lg border border-line bg-ink p-3 opacity-90">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-stone">{c.name}</span><LockedTag />
                  </div>
                  <div className="text-xs text-mist mt-1">{c.note}</div>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title={`Approved markets (${approved.length})`}>
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {approved.map((m) => (
                <div key={m.id} className="flex items-center gap-2 text-sm">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#27B36B' }} />
                  <span className="text-fog flex-1">{m.marketName}</span>
                  <span className="text-xs text-mist">{m.state}</span>
                </div>
              ))}
            </div>
            <Link to="/markets" className="btn-ghost w-full text-xs mt-3">Market gate →</Link>
          </Panel>

          <Panel title="Broker source tracker">
            <div className="space-y-2 text-sm">
              {['Marcus & Millichap', 'CBRE Multifamily', 'Berkadia', 'Local/regional brokers'].map((b) => (
                <div key={b} className="flex items-center justify-between rounded-lg border border-line bg-ink px-3 py-2">
                  <span className="text-fog">{b}</span><Badge tone="mist">manual</Badge>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="OM request queue">
            <p className="text-sm text-mist">OM requests are tracked per deal on the Broker Questions tab. Strong leads and Request-OM deals should have their OM requested first.</p>
          </Panel>
        </div>
      </div>
    </div>
  )
}
