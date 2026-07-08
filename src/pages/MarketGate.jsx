import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import { Panel, Badge, PageHeader, Callout } from '../components/ui.jsx'
import { INDICATOR_ORDER, INDICATORS, GATE_TONE } from '../lib/reindicator.js'

const RULES = [
  { color: 'green', rule: 'High Priority Hunt' },
  { color: 'yellow', rule: 'Limited Hunt' },
  { color: 'turq', rule: 'Watchlist / Early Hunt' },
  { color: 'gray', rule: 'Ignore unless manually approved' },
  { color: 'white', rule: 'Manual Review' },
]
const COLOR_KEY = { gray: 'gray', green: 'green', yellow: 'yellow', turq: 'turq', white: 'white' }

export default function MarketGate() {
  const { screenedMarkets, updateMarket } = useApp()
  const byColor = (c) => screenedMarkets.filter((m) => m.indicatorColor === c)

  return (
    <div>
      <PageHeader title="Market Gate"
        subtitle="No deal clears without a market. The REIndicator status sets the hunt priority. Gray markets can be manually approved when you have a specific reason.">
        <Link to="/map" className="btn-dark">Map</Link>
        <Link to="/layers" className="btn-gold">Edit markets</Link>
      </PageHeader>

      <Callout tone="gold" title="Approximate — verify" className="mb-6">
        Version 1 market regions are approximate from REIndicator screenshot review and must be verified before investment decisions.
      </Callout>

      {/* Legend + rules */}
      <div className="grid gap-4 md:grid-cols-5 mb-6">
        {RULES.map((r) => {
          const ind = INDICATORS[COLOR_KEY[r.color] === 'gray' ? 'gray' : r.color]
          return (
            <div key={r.color} className="panel p-4">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm" style={{ background: ind.color }} />
                <span className="text-sm font-medium text-stone">{ind.label}</span>
              </div>
              <div className="mt-1 text-xs text-mist">{ind.sub || ' '}</div>
              <div className="mt-3 text-sm text-fog">{r.rule}</div>
              <div className="mt-2 text-xs text-mist">{byColor(r.color).length} markets</div>
            </div>
          )
        })}
      </div>

      {/* Market list grouped by color */}
      <div className="space-y-6">
        {INDICATOR_ORDER.map((c) => {
          const list = byColor(c)
          if (!list.length) return null
          return (
            <Panel key={c} title={`${INDICATORS[c].label} — ${list.length}`}>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {list.map((m) => (
                  <div key={m.id} className="rounded-lg border border-line bg-ink p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-sm font-medium text-stone">{m.marketName}</div>
                        <div className="text-xs text-mist">{m.state} · {m.region}</div>
                      </div>
                      <span className="h-2.5 w-2.5 rounded-sm mt-1" style={{ background: INDICATORS[m.indicatorColor].color }} />
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <Badge tone={GATE_TONE[m.gate.gate]}>{m.gate.priority}</Badge>
                      <Badge tone={m.confidence === 'Medium' ? 'gold' : 'red'}>{m.confidence}</Badge>
                    </div>
                    <p className="mt-2 text-xs text-mist line-clamp-2">{m.notes}</p>
                    {c === 'gray' && (
                      <button className="btn-dark w-full text-xs mt-3 no-print"
                        onClick={() => updateMarket(m.id, { manualOverride: m.manualOverride === 'approved' ? null : 'approved' })}>
                        {m.manualOverride === 'approved' ? 'Remove approval' : 'Manually approve →'}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </Panel>
          )
        })}
      </div>
    </div>
  )
}
