import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import { Panel, Stat, Badge, ScoreRing, PageHeader, EmptyState } from '../components/ui.jsx'
import { usd, usdSigned } from '../lib/format.js'

function DealRow({ p }) {
  return (
    <Link
      to={`/deal/${p.id}`}
      className="grid grid-cols-12 items-center gap-3 px-4 py-3 rounded-md hover:bg-graphite/60 transition-colors"
    >
      <div className="col-span-12 sm:col-span-5">
        <div className="text-sm font-medium text-white">{p.name}</div>
        <div className="text-xs text-mist">{p.city} · {p.units} units · {p.propertyClass} in {p.areaClass}</div>
      </div>
      <div className="col-span-4 sm:col-span-2 text-sm tnum text-fog">{usd(p.deal.pricePerUnit)}<span className="text-mist text-xs">/unit</span></div>
      <div className="col-span-4 sm:col-span-3">
        <Badge tone={p.verdict.tone}>{p.verdict.short}</Badge>
      </div>
      <div className="col-span-4 sm:col-span-2 text-right">
        <span className={`text-lg font-bold tnum ${p.verdict.tone === 'approve' ? 'text-approve' : p.verdict.tone === 'warn' ? 'text-warn' : 'text-danger'}`}>{p.score}</span>
      </div>
    </Link>
  )
}

export default function Dashboard() {
  const { screenedProperties, screenedMarkets } = useApp()

  if (!screenedProperties.length) {
    return (
      <EmptyState title="No properties yet" cta={<Link to="/add" className="btn-gold">Add a property</Link>}>
        Add a property or reset the demo data to see the pipeline.
      </EmptyState>
    )
  }

  const bands = {
    strong: screenedProperties.filter((p) => p.verdict.band === 'strong'),
    request: screenedProperties.filter((p) => p.verdict.band === 'request'),
    watchlist: screenedProperties.filter((p) => p.verdict.band === 'watchlist'),
    pass: screenedProperties.filter((p) => p.verdict.band.startsWith('pass')),
  }
  const actionable = [...bands.strong, ...bands.request]
  const totalValueCreated = actionable.reduce((s, p) => s + p.deal.valueCreated, 0)
  const approvedMarkets = screenedMarkets.filter((m) => m.verdict.band === 'approved').length

  const ranked = [...screenedProperties].sort((a, b) => b.score - a.score)

  return (
    <div>
      <PageHeader
        title="Deal Pipeline"
        subtitle="Screen value-add multifamily before spending hours underwriting. We judge whether a property can BECOME a good deal after an 18–24 month stabilization — not whether it hits 12% cash-on-cash in Year 1."
      >
        <Link to="/add" className="btn-gold">Add Property</Link>
      </PageHeader>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Stat label="Actionable leads" value={actionable.length} sub="Strong + request OM" tone="approve" />
        <Stat label="Watchlist" value={bands.watchlist.length} sub="Needs price reset" tone="warn" />
        <Stat label="Passed" value={bands.pass.length} sub="Off-strategy or overpriced" tone="danger" />
        <Stat label="Est. value created" value={usdSigned(totalValueCreated)} sub="Across actionable leads" tone="gold" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Panel title="All deals — ranked by scratch score">
            <div className="hidden sm:grid grid-cols-12 gap-3 px-4 pb-2 label">
              <div className="col-span-5">Property</div>
              <div className="col-span-2">Price / unit</div>
              <div className="col-span-3">Decision</div>
              <div className="col-span-2 text-right">Score</div>
            </div>
            <div className="space-y-1">
              {ranked.map((p) => <DealRow key={p.id} p={p} />)}
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Top lead">
            {ranked[0] && (
              <div className="flex flex-col items-center text-center">
                <ScoreRing score={ranked[0].score} tone={ranked[0].verdict.tone} label="score" />
                <div className="mt-3 text-white font-medium">{ranked[0].name}</div>
                <div className="text-xs text-mist">{ranked[0].city}</div>
                <div className="mt-3"><Badge tone={ranked[0].verdict.tone}>{ranked[0].verdict.short}</Badge></div>
                <Link to={`/deal/${ranked[0].id}`} className="btn-ghost mt-4 w-full text-xs">Open deal →</Link>
              </div>
            )}
          </Panel>

          <Panel title="Markets">
            <div className="space-y-3">
              {screenedMarkets.map((m) => (
                <Link key={m.id} to="/markets" className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-graphite/60">
                  <div>
                    <div className="text-sm text-white">{m.name}</div>
                    <div className="text-xs text-mist">{m.verdict.label}</div>
                  </div>
                  <span className={`text-base font-bold tnum ${m.verdict.tone === 'approve' ? 'text-approve' : m.verdict.tone === 'warn' ? 'text-warn' : 'text-danger'}`}>{m.score}</span>
                </Link>
              ))}
            </div>
            <div className="mt-3 text-[11px] text-mist">{approvedMarkets} of {screenedMarkets.length} markets approved.</div>
          </Panel>
        </div>
      </div>
    </div>
  )
}
