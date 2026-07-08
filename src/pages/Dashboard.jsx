import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import { Panel, Badge, ScoreRing, EmptyState } from '../components/ui.jsx'
import Icon from '../components/Icon.jsx'
import USMap from '../components/USMap.jsx'
import { INDICATOR_ORDER, INDICATORS } from '../lib/reindicator.js'
import { usd, usdShort } from '../lib/format.js'

const STEPS = [
  { n: 1, icon: 'map', t: 'Find Markets', d: 'Start where the data says growth is real.' },
  { n: 2, icon: 'building', t: 'Add a Deal', d: 'Drop in a listing — no spreadsheet needed.' },
  { n: 3, icon: 'search', t: 'Run Screen', d: 'Kill weak deals fast with a 0–100 score.' },
  { n: 4, icon: 'calendar', t: 'Underwrite Plan', d: 'Model the 18–24 month value-add.' },
  { n: 5, icon: 'target', t: 'Decide', d: 'Generate an investor-ready report.' },
]
const WHY = [
  { icon: 'search', t: 'Not just a listing tool', d: 'It screens for real upside, not more listings.' },
  { icon: 'calc', t: 'Not just a spreadsheet', d: 'The timing of execution is built in.' },
  { icon: 'building', t: 'Built for value-add', d: 'Made for underperforming C-in-B deals.' },
  { icon: 'calendar', t: 'Focuses on Year 3', d: 'Judges stabilized performance, not Year 1.' },
  { icon: 'doc', t: 'End to end', d: 'Sourcing, screening, risks, and reports in one.' },
]

function KPI({ label, value, tone, icon }) {
  const map = { green: 'text-green bg-green/10', gold: 'text-gold bg-softorange', yellow: 'text-yellow bg-yellow/10', red: 'text-red bg-red/10', mist: 'text-mist bg-offwhite' }
  return (
    <div className="panel p-5">
      <div className={`mb-3 grid h-10 w-10 place-items-center rounded-xl ${map[tone] || map.mist}`}><Icon name={icon} className="w-5 h-5" /></div>
      <div className={`text-3xl font-extrabold tnum ${(map[tone] || map.mist).split(' ')[0]}`}>{value}</div>
      <div className="mt-0.5 text-sm text-mist font-medium">{label}</div>
    </div>
  )
}

function DealCard({ p }) {
  return (
    <div className="panel p-5 flex flex-col">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Link to={`/deal/${p.id}`} className="text-lg font-bold text-stone hover:text-gold">{p.name}</Link>
          <div className="text-sm text-mist mt-0.5 flex items-center gap-1.5"><Icon name="pin" className="w-4 h-4 text-gold" />{p.market?.marketName}, {p.market?.state}</div>
        </div>
        <ScoreRing score={p.score} tone={p.verdict.tone} size={72} label="score" />
      </div>
      <div className="mt-3"><Badge tone={p.verdict.tone}>{p.verdict.short}</Badge></div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <Metric k="Price / unit" v={usdShort(p.deal.pricePerUnit)} />
        <Metric k="Rent gap" v={`${Math.round(p.deal.rentGapPct * 100)}%`} />
        <Metric k="Stab. cap" v={`${(p.deal.stabilizedCapRate * 100).toFixed(1)}%`} />
      </div>
      <Link to={`/deal/${p.id}`} className="btn-ghost mt-4 w-full">Open deal →</Link>
    </div>
  )
}
const Metric = ({ k, v }) => (
  <div className="rounded-xl bg-offwhite p-2.5">
    <div className="text-base font-extrabold tnum text-stone">{v}</div>
    <div className="text-[11px] text-mist mt-0.5">{k}</div>
  </div>
)

export default function Dashboard() {
  const { screenedProperties, screenedMarkets } = useApp()

  if (!screenedProperties.length) {
    return <EmptyState title="No deals yet" cta={<Link to="/add" className="btn-gold">Add a property</Link>}>Add a property or reset the demo data to see the pipeline.</EmptyState>
  }

  const bands = {
    strong: screenedProperties.filter((p) => p.verdict.band === 'strong'),
    request: screenedProperties.filter((p) => p.verdict.band === 'request'),
    watchlist: screenedProperties.filter((p) => p.verdict.band === 'watchlist'),
    pass: screenedProperties.filter((p) => p.verdict.band.startsWith('pass')),
  }
  const actionable = [...bands.strong, ...bands.request]
  const ranked = [...screenedProperties].sort((a, b) => b.score - a.score)
  const valueCreated = actionable.reduce((s, p) => s + p.deal.valueCreated, 0)

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="panel overflow-hidden">
        <div className="grid lg:grid-cols-[1.5fr_1fr]">
          <div className="p-8 lg:p-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-softorange px-3 py-1 text-xs font-bold text-gold"><Icon name="rocket" className="w-4 h-4" /> Stonebrook Deal Scout</div>
            <h1 className="mt-4 text-3xl lg:text-4xl font-extrabold text-stone leading-tight">Find better apartment deals before wasting hours underwriting the wrong ones.</h1>
            <p className="mt-3 text-[15px] text-fog max-w-xl">Map emerging markets, screen listings fast, model the 18–24 month value-add plan, and generate investor-ready reports.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/map" className="btn-gold"><Icon name="map" className="w-4 h-4" /> Open Map Command Center</Link>
              <Link to="/add" className="btn-ghost"><Icon name="plus" className="w-4 h-4" /> Add a Deal</Link>
              <Link to="/scratch" className="btn-dark"><Icon name="bolt" className="w-4 h-4" /> Run Scratch Screen</Link>
            </div>
          </div>
          <div className="relative bg-softorange p-8 hidden lg:flex items-center justify-center">
            <div className="text-gold/90"><Icon name="building" className="w-40 h-40" /></div>
            <div className="absolute top-8 right-10 text-green animate-floaty"><Icon name="chart" className="w-14 h-14" /></div>
            <div className="absolute bottom-10 left-8 text-gold"><Icon name="pin" className="w-12 h-12" /></div>
          </div>
        </div>
      </section>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <KPI label="Strong Leads" value={bands.strong.length} tone="green" icon="target" />
        <KPI label="Request OM" value={bands.request.length} tone="green" icon="doc" />
        <KPI label="Watchlist" value={bands.watchlist.length} tone="yellow" icon="eye" />
        <KPI label="Passed" value={bands.pass.length} tone="red" icon="warning" />
        <KPI label="Est. Value Created" value={usdShort(valueCreated)} tone="gold" icon="chart" />
      </div>

      {/* How it works */}
      <section>
        <h2 className="text-xl font-extrabold text-stone mb-1">How it works</h2>
        <p className="text-sm text-mist mb-4">Five simple steps — from market to decision.</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {STEPS.map((s) => (
            <div key={s.n} className="panel p-5 text-center">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-softorange text-gold"><Icon name={s.icon} className="w-6 h-6" /></div>
              <div className="mt-3 text-xs font-bold text-gold">STEP {s.n}</div>
              <div className="text-sm font-bold text-stone">{s.t}</div>
              <div className="mt-1 text-xs text-mist">{s.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Map + gate */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title="Market map" className="lg:col-span-2" bodyClass="p-0"
          action={<Link to="/map" className="text-xs font-bold text-gold hover:underline no-print">Command center →</Link>}>
          <div className="aspect-[5/3] bg-white rounded-b-2xl overflow-hidden">
            <USMap markets={screenedMarkets} properties={screenedProperties} selected={null} onSelectMarket={() => {}} onSelectProperty={() => {}} />
          </div>
        </Panel>
        <Panel title="Market gate">
          <div className="space-y-2.5">
            {INDICATOR_ORDER.map((k) => {
              const count = screenedMarkets.filter((m) => m.indicatorColor === k).length
              if (!count) return null
              return (
                <div key={k} className="flex items-center justify-between">
                  <span className="flex items-center gap-2.5 text-sm text-fog font-medium"><span className="h-3 w-3 rounded-full" style={{ background: INDICATORS[k].color }} />{INDICATORS[k].label}</span>
                  <span className="tnum text-stone font-bold text-lg">{count}</span>
                </div>
              )
            })}
          </div>
          <Link to="/markets" className="btn-ghost w-full mt-4">Open Market Gate →</Link>
        </Panel>
      </div>

      {/* Top opportunities */}
      <section>
        <h2 className="text-xl font-extrabold text-stone mb-1">Top opportunities</h2>
        <p className="text-sm text-mist mb-4">Your highest-scoring deals right now.</p>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {ranked.slice(0, 3).map((p) => <DealCard key={p.id} p={p} />)}
        </div>
      </section>

      {/* Next actions */}
      <Panel title="Next actions">
        <ul className="space-y-3">
          {actionable.slice(0, 5).map((p) => (
            <li key={p.id} className="flex items-start gap-3">
              <span className="mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-md border-2 border-gold text-gold"><Icon name="checklist" className="w-3 h-3" /></span>
              <span className="text-sm text-fog"><Link to={`/deal/${p.id}`} className="font-bold text-stone hover:text-gold">{p.name}</Link> — {p.nextAction}</span>
            </li>
          ))}
        </ul>
      </Panel>

      {/* Why different */}
      <section>
        <h2 className="text-xl font-extrabold text-stone mb-1">Why Stonebrook is different</h2>
        <p className="text-sm text-mist mb-4">The goal isn't more listings. It's better decisions.</p>
        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
          {WHY.map((w) => (
            <div key={w.t} className="panel p-5">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-softorange text-gold"><Icon name={w.icon} className="w-5 h-5" /></div>
              <div className="mt-3 text-sm font-bold text-stone">{w.t}</div>
              <div className="mt-1 text-xs text-mist">{w.d}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
