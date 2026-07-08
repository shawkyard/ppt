import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import USMap from '../components/USMap.jsx'
import { Badge, Callout } from '../components/ui.jsx'
import { INDICATOR_ORDER, INDICATORS, GATE_TONE } from '../lib/reindicator.js'
import { CATEGORIES, layersInCategory, getLayer, YEAR_MIN, YEAR_MAX } from '../lib/mapLayers.js'
import { usd } from '../lib/format.js'

function Legend({ layer, year }) {
  return (
    <div className="absolute bottom-3 left-3 rounded-xl border border-line bg-white/95 backdrop-blur px-3 py-2.5 text-xs shadow-soft max-w-[260px]">
      <div className="label mb-1.5">{layer.name}{layer.yearAware ? ` · ${year}` : ''}</div>
      {layer.legend.map((e) => (
        <div key={e.key} className="flex items-center gap-2 py-0.5">
          <span className="h-2.5 w-2.5 rounded-sm flex-none" style={{ background: e.color }} />
          <span className="text-fog">{e.label}</span>
          {e.sub && <span className="text-mist">{e.sub}</span>}
        </div>
      ))}
    </div>
  )
}

function EntryButtons({ layer, current, onSet }) {
  return (
    <div>
      <div className="label mb-1.5">Set value for {layer.name}</div>
      <div className="grid grid-cols-2 gap-1.5">
        {layer.legend.map((e) => (
          <button key={e.key} onClick={() => onSet(current === e.key ? null : e.key)}
            className={`flex items-center gap-2 rounded-lg border px-2 py-1.5 text-xs font-semibold transition-all ${current === e.key ? 'border-stone bg-offwhite' : 'border-line hover:border-gold'}`}>
            <span className="h-3 w-3 rounded-sm flex-none" style={{ background: e.color }} />
            <span className="text-fog truncate">{e.label}</span>
          </button>
        ))}
      </div>
      <div className="mt-1.5 text-[11px] text-mist">{current ? 'Saved. Tap again to clear.' : 'Tap a value — saved to your data.'}</div>
    </div>
  )
}

function MarketDrawer({ m, layer, year, currentVal, onSet, onOverride }) {
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
      {layer.enterable && (
        <div className="rounded-xl border border-line bg-white p-3">
          <EntryButtons layer={layer} current={currentVal} onSet={onSet} />
          {layer.yearAware && <div className="mt-2 text-[11px] text-gold font-bold">Year: {year}</div>}
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        <Badge tone={GATE_TONE[g.gate]}>{INDICATORS[m.indicatorColor].label}</Badge>
        <Badge tone={g.gate === 'hunt' ? 'green' : 'mist'}>{g.priority}</Badge>
        <Badge tone={m.confidence === 'Medium' ? 'gold' : 'red'}>{m.confidence}</Badge>
      </div>
      <p className="text-sm text-fog">{m.notes}</p>
      <div className="grid grid-cols-2 gap-2 no-print">
        <button className="btn-dark text-xs" onClick={() => onOverride('approved')}>Hunt</button>
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
      <div><h3 className="text-lg text-stone">{p.name}</h3><p className="text-xs text-mist mt-1">{p.city} · {p.market?.marketName}</p></div>
      <div className="flex items-center gap-3"><Badge tone={p.verdict.tone}>{p.verdict.short}</Badge><span className="text-2xl font-bold tnum text-stone">{p.score}</span></div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <Info k="Units" v={p.units} /><Info k="Asking" v={usd(d.askingPrice)} />
        <Info k="Price / unit" v={usd(d.pricePerUnit)} /><Info k="Source" v={p.source.label} />
      </div>
      <div><div className="label mb-1">Next action</div><p className="text-sm text-fog">{p.nextAction}</p></div>
      <Link to={`/deal/${p.id}`} className="btn-gold w-full text-sm">Open Deal Detail →</Link>
    </div>
  )
}
const Info = ({ k, v }) => (<div className="rounded-lg border border-line bg-offwhite p-2"><div className="label">{k}</div><div className="text-stone tnum text-sm mt-0.5">{v}</div></div>)

export default function MapCommandCenter() {
  const { screenedMarkets, screenedProperties, updateMarket, getMarket, getProperty, layerData, setLayerValue } = useApp()
  const [colors, setColors] = useState(new Set(INDICATOR_ORDER))
  const [stateFilter, setStateFilter] = useState('all')
  const [confidence, setConfidence] = useState('all')
  const [showPins, setShowPins] = useState(true)
  const [selected, setSelected] = useState(null)
  const [category, setCategory] = useState('Emerging Status History')
  const [layerId, setLayerId] = useState('status-history')
  const [year, setYear] = useState(YEAR_MAX)
  const [playing, setPlaying] = useState(false)
  const layer = getLayer(layerId)
  const layerChoices = layersInCategory(category)
  const yrKey = layer.yearAware ? year : 'all'

  const pickCategory = (c) => { setCategory(c); setLayerId(layersInCategory(c)[0]?.id); setPlaying(false) }

  // Year animation (the selling feature)
  const timer = useRef(null)
  useEffect(() => {
    if (!playing || !layer.yearAware) return
    timer.current = setInterval(() => {
      setYear((y) => (y >= YEAR_MAX ? YEAR_MIN : y + 1))
    }, 650)
    return () => clearInterval(timer.current)
  }, [playing, layer.yearAware])
  useEffect(() => { if (!layer.yearAware) setPlaying(false) }, [layer.yearAware])

  const states = useMemo(() => ['all', ...Array.from(new Set(screenedMarkets.map((m) => m.state))).sort()], [screenedMarkets])

  const visibleMarkets = screenedMarkets.filter((m) =>
    colors.has(m.indicatorColor) &&
    (stateFilter === 'all' || m.state === stateFilter) &&
    (confidence === 'all' || m.confidence === confidence))
  const visibleMarketIds = new Set(visibleMarkets.map((m) => m.id))
  const visibleProperties = showPins ? screenedProperties.filter((p) => visibleMarketIds.has(p.marketId)) : []

  const toggleColor = (k) => setColors((prev) => { const n = new Set(prev); n.has(k) ? n.delete(k) : n.add(k); return n })

  const selectedMarket = selected?.type === 'market' ? getMarket(selected.id) : null
  const selectedProperty = selected?.type === 'property' ? getProperty(selected.id) : null

  const cellFor = (m) => layerData?.[layer.id]?.[yrKey]?.[m.id]
  const colorForOverride = (m) => {
    const ov = cellFor(m)
    return ov && layer.colorMap ? layer.colorMap[ov] : layer.colorFor(m, year)
  }
  const setCurrent = (marketId, bucket) => setLayerValue(layer.id, yrKey, marketId, bucket)
  const enteredCount = Object.keys(layerData?.[layer.id]?.[yrKey] || {}).length

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-3xl font-extrabold text-stone">Map Command Center</h1>
        <p className="text-sm text-mist mt-1">Start with the right market — then screen the right deals. Pick a data layer, scrub the year, or press ▶ Play to watch markets emerge.</p>
      </div>

      <Callout tone="gold" title="Version 1 — approximate regions" className="mb-4">
        Version 1 market regions are approximate from REIndicator review and must be verified before investment decisions. Employment / trend layers show demo coloring until you enter your values.
      </Callout>

      <div className="grid gap-4 lg:grid-cols-[220px_1fr_300px]">
        {/* Filters */}
        <aside className="panel p-4 h-max no-print">
          <div className="label mb-2">Show markets</div>
          <div className="space-y-1.5 mb-4">
            {INDICATOR_ORDER.map((k) => (
              <label key={k} className="flex items-center gap-2 text-sm text-fog cursor-pointer">
                <input type="checkbox" checked={colors.has(k)} onChange={() => toggleColor(k)} className="accent-gold" />
                <span className="h-2.5 w-2.5 rounded-sm" style={{ background: INDICATORS[k].color }} />{INDICATORS[k].label}
              </label>
            ))}
          </div>
          <div className="label mb-1">State</div>
          <select className="input mb-3" value={stateFilter} onChange={(e) => setStateFilter(e.target.value)}>
            {states.map((s) => <option key={s} value={s}>{s === 'all' ? 'All states' : s}</option>)}
          </select>
          <div className="label mb-1">Confidence</div>
          <select className="input mb-3" value={confidence} onChange={(e) => setConfidence(e.target.value)}>
            <option value="all">All</option><option>Medium</option><option>Needs verification</option>
          </select>
          <label className="flex items-center gap-2 text-sm text-fog cursor-pointer">
            <input type="checkbox" checked={showPins} onChange={(e) => setShowPins(e.target.checked)} className="accent-gold" /> Show deal pins
          </label>
          <div className="mt-4 text-[11px] text-mist">{visibleMarkets.length} markets · {visibleProperties.length} deals</div>
        </aside>

        {/* Map */}
        <div className="panel relative overflow-hidden">
          <div className="absolute top-3 left-3 z-10 w-64 rounded-xl border border-line bg-white/95 backdrop-blur px-3 py-2.5 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wide text-gold">Display Data</span>
              {layer.demo && enteredCount === 0
                ? <span className="tag bg-yellow/15 text-yellow border border-yellow/40">DEMO</span>
                : enteredCount > 0 && <span className="tag bg-green/12 text-green border border-green/40">{enteredCount} set</span>}
            </div>
            <select value={category} onChange={(e) => pickCategory(e.target.value)}
              className="mt-1.5 w-full bg-offwhite border border-line rounded-lg px-2 py-1.5 text-xs font-semibold text-fog focus:outline-none cursor-pointer">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={layerId} onChange={(e) => setLayerId(e.target.value)}
              className="mt-1.5 w-full bg-transparent text-sm font-bold text-stone focus:outline-none cursor-pointer">
              {layerChoices.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
            {layer.yearAware && (
              <div className="mt-2">
                <div className="flex items-center justify-between text-[11px] text-mist">
                  <button onClick={() => setPlaying((p) => !p)} className="inline-flex items-center gap-1 font-bold text-gold hover:text-goldsoft">
                    {playing ? '❚❚ Pause' : '▶ Play'}
                  </button>
                  <span className="tnum font-bold text-stone">{year}</span>
                </div>
                <input type="range" min={YEAR_MIN} max={YEAR_MAX} step="1" value={year}
                  onChange={(e) => { setYear(Number(e.target.value)); setPlaying(false) }} className="w-full accent-gold" />
              </div>
            )}
            <div className="mt-1 text-[10px] text-mist">{layer.enterable ? 'Click a market to set its value' : 'Approximate · verify before investing'}</div>
          </div>
          <div className="aspect-[5/3]">
            <USMap markets={visibleMarkets} properties={visibleProperties} selected={selected} colorFor={colorForOverride}
              onSelectMarket={(id) => setSelected({ type: 'market', id })}
              onSelectProperty={(id) => setSelected({ type: 'property', id })} />
          </div>
          <Legend layer={layer} year={year} />
        </div>

        {/* Drawer */}
        <aside className="panel p-4 h-max">
          {!selected && (
            <div className="text-sm text-mist">
              {layer.enterable
                ? `Click a market to record its ${layer.name}${layer.yearAware ? ` for ${year}` : ''}. Do a few at a time.`
                : 'Select a market or deal on the map to see details here.'}
            </div>
          )}
          {selectedMarket && <MarketDrawer m={selectedMarket} layer={layer} year={year} currentVal={cellFor(selectedMarket)}
            onSet={(b) => setCurrent(selectedMarket.id, b)} onOverride={(v) => updateMarket(selectedMarket.id, { manualOverride: v })} />}
          {selectedProperty && <PropertyDrawer p={selectedProperty} />}
        </aside>
      </div>
    </div>
  )
}
