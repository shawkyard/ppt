import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import { Panel, Badge, ScoreRing, WeightBar, PageHeader } from '../components/ui.jsx'
import { usd, pct } from '../lib/format.js'

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'strong', label: 'Strong leads' },
  { key: 'request', label: 'Request OM' },
  { key: 'watchlist', label: 'Watchlist' },
  { key: 'pass', label: 'Pass' },
]

function matches(p, key) {
  if (key === 'all') return true
  if (key === 'pass') return p.verdict.band.startsWith('pass')
  return p.verdict.band === key
}

function ScratchCard({ p }) {
  const d = p.deal
  return (
    <Panel>
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link to={`/deal/${p.id}`} className="text-base font-semibold text-white hover:text-gold">{p.name}</Link>
          <div className="text-xs text-mist">{p.city} · {p.units} units · {p.propertyClass} in {p.areaClass} area</div>
          <div className="mt-2"><Badge tone={p.verdict.tone}>{p.verdict.label}</Badge></div>
        </div>
        <ScoreRing score={p.score} tone={p.verdict.tone} size={84} label="score" />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
        <div className="rounded-md bg-ink border border-slateline/60 p-2">
          <div className="label">Price/unit</div>
          <div className="tnum text-sm text-white mt-0.5">{usd(d.pricePerUnit)}</div>
        </div>
        <div className="rounded-md bg-ink border border-slateline/60 p-2">
          <div className="label">Rent gap</div>
          <div className="tnum text-sm text-white mt-0.5">{pct(d.rentGapPct, 0)}</div>
        </div>
        <div className="rounded-md bg-ink border border-slateline/60 p-2">
          <div className="label">Stab. cap</div>
          <div className="tnum text-sm text-white mt-0.5">{pct(d.stabilizedCapRate)}</div>
        </div>
      </div>

      <div className="mt-4">
        {p.breakdown.map((b) => (
          <WeightBar key={b.key} label={b.label} points={b.points} weight={b.weight} help={b.help} />
        ))}
      </div>

      <Link to={`/deal/${p.id}`} className="btn-ghost mt-4 w-full text-xs">Open deal detail →</Link>
    </Panel>
  )
}

export default function ScratchScreen() {
  const { screenedProperties } = useApp()
  const [filter, setFilter] = useState('all')
  const list = screenedProperties.filter((p) => matches(p, filter)).sort((a, b) => b.score - a.score)

  return (
    <div>
      <PageHeader
        title="Scratch Screen"
        subtitle="A fast 0–100 read on every property from listing-level data. Strong lead ≥ 85 · Request OM 70–84 · Watchlist 55–69 · Pass unless price drops 40–54 · Pass < 40."
      >
        <Link to="/add" className="btn-gold">Add Property</Link>
      </PageHeader>

      <div className="flex flex-wrap gap-2 mb-6">
        {FILTERS.map((f) => {
          const count = screenedProperties.filter((p) => matches(p, f.key)).length
          return (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`chip ${filter === f.key ? 'border-gold text-white bg-gold/10' : 'border-slateline text-mist'}`}>
              {f.label}<span className="tnum">{count}</span>
            </button>
          )
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {list.map((p) => <ScratchCard key={p.id} p={p} />)}
      </div>
    </div>
  )
}
