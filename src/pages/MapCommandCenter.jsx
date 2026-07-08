import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import USMap from '../components/USMap.jsx'
import { Badge, Callout } from '../components/ui.jsx'
import { INDICATOR_ORDER, INDICATORS, GATE_TONE } from '../lib/reindicator.js'
import { MAP_LAYERS, LOCKED_LAYERS, getLayer } from '../lib/mapLayers.js'
import { usd } from '../lib/format.js'

function Legend({ layer }) {
  return (
    <div className="absolute bottom-3 left-3 rounded-xl border border-line bg-white/95 backdrop-blur px-3 py-2.5 text-xs shadow-soft">
      <div className="label mb-1.5">{layer.name}</div>
      {layer.legend.map((e) => (
        <div key={e.key} className="flex items-center gap-2 py-0.5">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ background: e.color }} />
          <span className="text-fog">{e.label}</span>
          {e.sub && <span className="text-mist">{e.sub}</span>}
        </div>
      ))}
    </div>
  )
}

function MarketDrawer({ m, onOverride }) {
  const g = m.gate
  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm" style={{ background: INDICATORS[m.indicatorColor].color }} />
          <h3 className="text-lg text-stone">{m.marketName}</h3>
        </div>
        <p className="text-xs text-mist mt-1">{m.state} · {m.region}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge tone={GATE_TONE[g.gate]}>{INDICATORS[m.indicatorColor].label}</Badge>
        <Badge tone={g.gate === 'hunt' ? 'green' : 'mist'}>{g.priority}</Badge>
        <Badge tone={m.confidence === 'Medium' ? 'gold' : 'red'}>{m.confidence}</Badge>
      </div>
      <p className="text-sm text-fog">{m.notes}</p>
      <div className="text-xs text-mist">Source year: {m.sourceYear} · Override: {m.manualOverride || 'none'}</div>
      <div className="grid grid-cols-2 gap-2 no-print">
        <button className="btn-dark text-xs" onClick={() => onOverride('approved')}>Hunt (approve)</button>
        <button className="btn-dark text-xs" onClick={() => onOverride('watch')}>Watch</button>
        <button className="btn-dark text-xs" onClick={() => onOverride('ignore')}>Ignore</button>
        <button className="btn-dark text-xs" onClick={() => onOverride(null)}>Clear override</button>
      </div>
      <Link to="/layers" className="btn-ghost w-full text-xs">Edit in Market Layer Manager →</Link>
    </div>
  )
}

function PropertyDrawer({ p }) {
  const d = p.deal
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg text-stone">{p.name}</h3>
        <p className="text-xs text-mist mt-1">{p.city} · {p.market?.marketName}</p>
      </div>
      <div className="flex items-center gap-3">
        <Badge tone={p.verdict.tone}>{p.verdict.short}</Badge>
        <span className="text-2xl font-bold tnum text-stone">{p.score}</span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <Info k="Units" v={p.units} />
        <Info k="Asking" v={usd(d.askingPrice)} />
        <Info k="Price / unit" v={usd(d.pricePerUnit)} />
        <Info k="Source" v={p.source.label} />
      </div>
      <div>
        <div className="label mb-1">Top risks</div>
        <ul className="text-sm text-fog space-y-0.5">
          {(p.risks || []).slice(0, 2).map((r, i) => <li key={i}>• {r.category}: {r.notes}</li>)}
        </ul>
      </div>
      <div>
        <div className="label mb-1">Missing documents</div>
        <div className="text-sm text-fog">{(p.missingDocs || []).slice(0, 3).join(', ')}</div>
      </div>
      <div>
        <div className="label mb-1">Next action</div>
        <p className="text-sm text-fog">{p.nextAction}</p>
      </div>
      <Link to={`/deal/${p.id}`} className="btn-gold w-full text-sm">Open Deal Detail →</Link>
    </div>
  )
}

const Info = ({ k, v }) => (
  <div className="rounded-lg border border-line bg-ink p-2">
    <div className="label">{k}</div>
    <div className="text-stone tnum text-sm mt-0.5">{v}</div>
  </div>
)

export default function MapCommandCenter() {
  const { screenedMarkets, screenedProperties, updateMarket, getMarket, getProperty } = useApp()
  const [colors, setColors] = useState(new Set(INDICATOR_ORDER))
  const [stateFilter, setStateFilter] = useState('all')
  const [confidence, setConfidence] = useState('all')
  const [showPins, setShowPins] = useState(true)
  const [selected, setSelected] = useState(null)
  const [layerId, setLayerId] = useState('status')
  const layer = getLayer(layerId)

  const states = useMemo(() => ['all', ...Array.from(new Set(screenedMarkets.map((m) => m.state))).sort()], [screenedMarkets])

  const visibleMarkets = screenedMarkets.filter((m) =>
    colors.has(m.indicatorColor) &&
    (stateFilter === 'all' || m.state === stateFilter) &&
    (confidence === 'all' || m.confidence === confidence))
  const visibleMarketIds = new Set(visibleMarkets.map((m) => m.id))
  const visibleProperties = showPins ? screenedProperties.filter((p) => visibleMarketIds.has(p.marketId)) : []

  const toggleColor = (k) => setColors((prev) => {
    const next = new Set(prev)
    next.has(k) ? next.delete(k) : next.add(k)
    return next
  })

  const selectedMarket = selected?.type === 'market' ? getMarket(selected.id) : null
  const selectedProperty = selected?.type === 'property' ? getProperty(selected.id) : null

  const applyOverride = (val) => {
    if (selectedMarket) updateMarket(selectedMarket.id, { manualOverride: val })
  }

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-stone">Map Command Center</h1>
        <p className="text-sm text-mist mt-1">Click a colored market to inspect it. Click a pin to preview a deal.</p>
      </div>

      <Callout tone="gold" title="Version 1 — approximate regions" className="mb-4">
        Version 1 market regions are approximate from REIndicator screenshot review and must be verified before investment decisions.
      </Callout>

      <div className="grid gap-4 lg:grid-cols-[220px_1fr_300px]">
        {/* Filters */}
        <aside className="panel p-4 h-max no-print">
          <div className="label mb-2">REIndicator</div>
          <div className="space-y-1.5 mb-4">
            {INDICATOR_ORDER.map((k) => (
              <label key={k} className="flex items-center gap-2 text-sm text-fog cursor-pointer">
                <input type="checkbox" checked={colors.has(k)} onChange={() => toggleColor(k)} className="accent-gold" />
                <span className="h-2.5 w-2.5 rounded-sm" style={{ background: INDICATORS[k].color }} />
                {INDICATORS[k].label}
              </label>
            ))}
          </div>
          <div className="label mb-1">State</div>
          <select className="input mb-3" value={stateFilter} onChange={(e) => setStateFilter(e.target.value)}>
            {states.map((s) => <option key={s} value={s}>{s === 'all' ? 'All states' : s}</option>)}
          </select>
          <div className="label mb-1">Confidence</div>
          <select className="input mb-3" value={confidence} onChange={(e) => setConfidence(e.target.value)}>
            <option value="all">All</option>
            <option>Medium</option>
            <option>Needs verification</option>
          </select>
          <label className="flex items-center gap-2 text-sm text-fog cursor-pointer">
            <input type="checkbox" checked={showPins} onChange={(e) => setShowPins(e.target.checked)} className="accent-gold" />
            Show deal pins
          </label>
          <div className="mt-4 text-[11px] text-mist">{visibleMarkets.length} markets · {visibleProperties.length} deals shown</div>
        </aside>

        {/* Map */}
        <div className="panel relative overflow-hidden">
          <div className="absolute top-3 left-3 z-10 rounded-xl border border-line bg-white/95 backdrop-blur px-3 py-2 shadow-soft">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wide text-gold">Display Data</span>
            </div>
            <select value={layerId} onChange={(e) => setLayerId(e.target.value)}
              className="mt-1 bg-transparent text-sm font-bold text-stone focus:outline-none cursor-pointer">
              {MAP_LAYERS.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
              <optgroup label="Live data — V2 (locked)">
                {LOCKED_LAYERS.map((l) => <option key={l} disabled>🔒 {l}</option>)}
              </optgroup>
            </select>
            <div className="text-[11px] text-mist">Approximate · verify before investing</div>
          </div>
          <div className="aspect-[5/3]">
            <USMap markets={visibleMarkets} properties={visibleProperties} selected={selected} colorFor={layer.colorFor}
              onSelectMarket={(id) => setSelected({ type: 'market', id })}
              onSelectProperty={(id) => setSelected({ type: 'property', id })} />
          </div>
          <Legend layer={layer} />
        </div>

        {/* Drawer */}
        <aside className="panel p-4 h-max">
          {!selected && <div className="text-sm text-mist">Select a market or deal on the map to see details here.</div>}
          {selectedMarket && <MarketDrawer m={selectedMarket} onOverride={applyOverride} />}
          {selectedProperty && <PropertyDrawer p={selectedProperty} />}
        </aside>
      </div>
    </div>
  )
}
