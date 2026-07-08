import { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { Panel, Field, PageHeader, Badge, Callout } from '../components/ui.jsx'
import { INDICATOR_ORDER, INDICATORS } from '../lib/reindicator.js'

export default function MarketLayerManager() {
  const { screenedMarkets, updateMarket, addMarket, removeMarket } = useApp()
  const [selectedId, setSelectedId] = useState(screenedMarkets[0]?.id)
  const m = screenedMarkets.find((x) => x.id === selectedId) || screenedMarkets[0]
  const set = (patch) => m && updateMarket(m.id, patch)

  const handleAdd = () => {
    const id = addMarket({
      marketName: 'New Market', state: '', region: '', indicatorColor: 'white',
      confidence: 'Needs verification', notes: '', sourceYear: 2025, manualOverride: null,
      coordinates: [39, -98], radius: 22,
    })
    setSelectedId(id)
  }

  return (
    <div>
      <PageHeader title="Market Layer Manager"
        subtitle="View and edit the market layer. You can change any market's REIndicator status, confidence, notes, and manual override — including promoting a gray market to approved.">
        <button className="btn-gold" onClick={handleAdd}>+ Add market</button>
      </PageHeader>

      <Callout tone="gold" title="Approximate — verify" className="mb-6">
        Version 1 statuses are approximate from REIndicator screenshot review. Edits are saved locally in your browser.
      </Callout>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <Panel title={`Markets (${screenedMarkets.length})`} bodyClass="p-2">
          <div className="max-h-[540px] overflow-y-auto">
            {screenedMarkets.map((mk) => (
              <button key={mk.id} onClick={() => setSelectedId(mk.id)}
                className={`w-full flex items-center gap-2 rounded-lg px-3 py-2 text-left ${mk.id === m?.id ? 'bg-panel' : 'hover:bg-panel/60'}`}>
                <span className="h-2.5 w-2.5 rounded-sm flex-none" style={{ background: INDICATORS[mk.indicatorColor].color }} />
                <span className="flex-1 min-w-0">
                  <span className="block text-sm text-stone truncate">{mk.marketName}</span>
                  <span className="block text-xs text-mist">{mk.state} · {mk.gate.priority}</span>
                </span>
                {mk.manualOverride && <Badge tone="gold">override</Badge>}
              </button>
            ))}
          </div>
        </Panel>

        {m && (
          <Panel title="Edit market" action={<button className="text-xs text-red hover:underline no-print" onClick={() => { removeMarket(m.id); setSelectedId(screenedMarkets[0]?.id) }}>Delete</button>}>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Market name" className="col-span-2"><input className="input" value={m.marketName} onChange={(e) => set({ marketName: e.target.value })} /></Field>
              <Field label="State"><input className="input" value={m.state} onChange={(e) => set({ state: e.target.value })} /></Field>
              <Field label="Region"><input className="input" value={m.region} onChange={(e) => set({ region: e.target.value })} /></Field>
              <Field label="REIndicator status">
                <select className="input" value={m.indicatorColor} onChange={(e) => set({ indicatorColor: e.target.value })}>
                  {INDICATOR_ORDER.map((k) => <option key={k} value={k}>{INDICATORS[k].label}</option>)}
                </select>
              </Field>
              <Field label="Confidence">
                <select className="input" value={m.confidence} onChange={(e) => set({ confidence: e.target.value })}>
                  <option>Medium</option><option>Needs verification</option><option>High</option>
                </select>
              </Field>
              <Field label="Manual override">
                <select className="input" value={m.manualOverride || ''} onChange={(e) => set({ manualOverride: e.target.value || null })}>
                  <option value="">None</option>
                  <option value="approved">Approved (hunt)</option>
                  <option value="ignore">Ignore</option>
                </select>
              </Field>
              <Field label="Source year"><input type="number" className="input tnum" value={m.sourceYear} onChange={(e) => set({ sourceYear: Number(e.target.value) })} /></Field>
              <Field label="Approx. latitude"><input type="number" step="0.1" className="input tnum" value={m.coordinates[0]} onChange={(e) => set({ coordinates: [Number(e.target.value), m.coordinates[1]] })} /></Field>
              <Field label="Approx. longitude"><input type="number" step="0.1" className="input tnum" value={m.coordinates[1]} onChange={(e) => set({ coordinates: [m.coordinates[0], Number(e.target.value)] })} /></Field>
              <Field label="Notes" className="col-span-2"><textarea className="input h-20 resize-none" value={m.notes} onChange={(e) => set({ notes: e.target.value })} /></Field>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Badge tone={m.gate.gate === 'hunt' ? 'green' : 'mist'}>Effective: {m.gate.priority}</Badge>
            </div>
          </Panel>
        )}
      </div>
    </div>
  )
}
