import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import { Panel, Badge, ScoreRing, WeightBar, PageHeader, SourceTag } from '../components/ui.jsx'
import Thumb from '../components/Thumb.jsx'
import { usd, pct, usdSigned } from '../lib/format.js'

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'strong', label: 'Strong leads' },
  { key: 'request', label: 'Request OM' },
  { key: 'watchlist', label: 'Watchlist' },
  { key: 'pass', label: 'Pass' },
]
const matches = (p, key) => key === 'all' ? true : key === 'pass' ? p.verdict.band.startsWith('pass') : p.verdict.band === key

function Card({ p }) {
  const d = p.deal
  return (
    <Panel>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <Thumb name={p.name} className="h-12 w-12" />
          <div className="min-w-0">
            <Link to={`/deal/${p.id}`} className="text-base font-semibold text-stone hover:text-gold">{p.name}</Link>
            <div className="text-xs text-mist">{p.city} · {p.units} units · {p.propertyClass} in {p.areaClass}</div>
            <div className="mt-2 flex items-center gap-2"><Badge tone={p.verdict.tone}>{p.verdict.label}</Badge></div>
            <div className="mt-1.5 text-[11px] text-mist flex items-center gap-1.5">Source: <SourceTag code={p.provenance?.current} /> {p.source.label}</div>
          </div>
        </div>
        <ScoreRing score={p.score} tone={p.verdict.tone} size={84} label="score" />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <Mini k="Price/unit" v={usd(d.pricePerUnit)} />
        <Mini k="Rent gap" v={pct(d.rentGapPct, 0)} />
        <Mini k="Stab. cap" v={pct(d.stabilizedCapRate)} />
        <Mini k="Current NOI" v={usd(d.currentNOI)} />
        <Mini k="Stab. NOI" v={usd(d.stabilizedNOI)} />
        <Mini k="Value created" v={usdSigned(d.valueCreated)} />
      </div>

      <div className="mt-4">
        {p.breakdown.map((b) => <WeightBar key={b.key} label={b.label} points={b.points} weight={b.weight} help={b.help} />)}
      </div>

      <div className="mt-3 text-xs text-mist"><span className="text-fog">Next:</span> {p.nextAction}</div>
      <Link to={`/deal/${p.id}`} className="btn-ghost mt-3 w-full text-xs">Open deal detail →</Link>
    </Panel>
  )
}
const Mini = ({ k, v }) => (
  <div className="rounded-lg bg-ink border border-line p-2">
    <div className="label">{k}</div>
    <div className="tnum text-sm text-stone mt-0.5">{v}</div>
  </div>
)

export default function ScratchScreen() {
  const { screenedProperties } = useApp()
  const [filter, setFilter] = useState('all')
  const list = screenedProperties.filter((p) => matches(p, filter)).sort((a, b) => b.score - a.score)

  return (
    <div>
      <PageHeader title="Scratch Screen"
        subtitle="Fast 0–100 read on every property. Strong lead ≥ 85 · Request OM 70–84 · Watchlist 55–69 · Pass unless price drops 40–54 · Pass < 40.">
        <Link to="/add" className="btn-gold">Add Property</Link>
      </PageHeader>

      <div className="flex flex-wrap gap-2 mb-6">
        {FILTERS.map((f) => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`chip ${filter === f.key ? 'border-gold text-stone bg-gold/10' : 'border-line text-mist'}`}>
            {f.label}<span className="tnum">{screenedProperties.filter((p) => matches(p, f.key)).length}</span>
          </button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {list.map((p) => <Card key={p.id} p={p} />)}
      </div>
    </div>
  )
}
