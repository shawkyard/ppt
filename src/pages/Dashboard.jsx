import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import { Panel, Stat, Badge, ScoreRing, PageHeader, EmptyState } from '../components/ui.jsx'
import USMap from '../components/USMap.jsx'
import { Callout } from '../components/ui.jsx'
import { INDICATOR_ORDER, INDICATORS } from '../lib/reindicator.js'
import { usd, usdSigned } from '../lib/format.js'

export default function Dashboard() {
  const { screenedProperties, screenedMarkets } = useApp()

  if (!screenedProperties.length) {
    return <EmptyState title="No deals yet" cta={<Link to="/add" className="btn-gold">Add a property</Link>}>
      Add a property or reset the demo data to see the pipeline.
    </EmptyState>
  }

  const bands = {
    strong: screenedProperties.filter((p) => p.verdict.band === 'strong'),
    request: screenedProperties.filter((p) => p.verdict.band === 'request'),
    watchlist: screenedProperties.filter((p) => p.verdict.band === 'watchlist'),
    pass: screenedProperties.filter((p) => p.verdict.band.startsWith('pass')),
  }
  const actionable = [...bands.strong, ...bands.request]
  const approvedMarkets = screenedMarkets.filter((m) => m.gate.gate === 'hunt')
  const ranked = [...screenedProperties].sort((a, b) => b.score - a.score)
  const top5 = ranked.slice(0, 5)
  const valueCreated = actionable.reduce((s, p) => s + p.deal.valueCreated, 0)
  const missingDocs = screenedProperties.reduce((s, p) => s + (p.missingDocs?.length || 0), 0)

  return (
    <div>
      <PageHeader title="Command Dashboard"
        subtitle="Map-first value-add screening for Scott & Alma. We test whether a property can hit strong Year-3 stabilized metrics after a realistic 18–24 month plan — not whether Year-1 cash-on-cash is high.">
        <Link to="/map" className="btn-dark">Open map</Link>
        <Link to="/add" className="btn-gold">Add Property</Link>
      </PageHeader>

      <Callout tone="green" title="New here? Start with the map" className="mb-6">
        Green markets on the map are the best places to hunt. Click a deal pin to see its score and decision — no math required.{' '}
        <Link to="/settings" className="text-gold underline">See the 6-step guide →</Link>
      </Callout>

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-6">
        <Stat label="Deals screened" value={screenedProperties.length} />
        <Stat label="Strong leads" value={bands.strong.length} tone="green" />
        <Stat label="Request OM" value={bands.request.length} tone="green" />
        <Stat label="Watchlist" value={bands.watchlist.length} tone="yellow" />
        <Stat label="Passes" value={bands.pass.length} tone="red" />
        <Stat label="Approved markets" value={approvedMarkets.length} tone="gold" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Panel title="Market map" action={<Link to="/map" className="text-xs text-gold hover:underline no-print">Command center →</Link>} bodyClass="p-0">
            <div className="aspect-[5/3] bg-ink rounded-b-xl overflow-hidden">
              <USMap markets={screenedMarkets} properties={screenedProperties} selected={null}
                onSelectMarket={() => {}} onSelectProperty={() => {}} />
            </div>
          </Panel>

          <Panel title="Top 5 opportunities">
            <div className="space-y-1">
              {top5.map((p) => (
                <Link key={p.id} to={`/deal/${p.id}`} className="grid grid-cols-12 items-center gap-3 px-3 py-3 rounded-lg hover:bg-panel/70">
                  <div className="col-span-6">
                    <div className="text-sm font-medium text-stone">{p.name}</div>
                    <div className="text-xs text-mist">{p.city} · {p.units} units · {p.market?.marketName}</div>
                  </div>
                  <div className="col-span-3"><Badge tone={p.verdict.tone}>{p.verdict.short}</Badge></div>
                  <div className="col-span-2 text-sm tnum text-fog">{usd(p.deal.pricePerUnit)}<span className="text-mist text-xs">/u</span></div>
                  <div className="col-span-1 text-right text-lg font-bold tnum text-stone">{p.score}</div>
                </Link>
              ))}
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Top lead">
            {ranked[0] && (
              <div className="flex flex-col items-center text-center">
                <ScoreRing score={ranked[0].score} tone={ranked[0].verdict.tone} label="score" />
                <div className="mt-3 text-stone font-medium">{ranked[0].name}</div>
                <div className="text-xs text-mist">{ranked[0].city}</div>
                <div className="mt-3"><Badge tone={ranked[0].verdict.tone}>{ranked[0].verdict.short}</Badge></div>
                <Link to={`/deal/${ranked[0].id}`} className="btn-ghost mt-4 w-full text-xs">Open deal →</Link>
              </div>
            )}
          </Panel>

          <Stat label="Est. value creation" value={usdSigned(valueCreated)} sub="Across actionable leads" tone="gold" />
          <Stat label="Missing documents" value={missingDocs} sub="Outstanding across pipeline" tone="red" />

          <Panel title="Market gate">
            <div className="space-y-2">
              {INDICATOR_ORDER.map((k) => {
                const count = screenedMarkets.filter((m) => m.indicatorColor === k).length
                if (!count) return null
                const ind = INDICATORS[k]
                return (
                  <div key={k} className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm text-fog">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: ind.color }} />{ind.label}
                    </span>
                    <span className="tnum text-stone font-medium">{count}</span>
                  </div>
                )
              })}
            </div>
            <Link to="/markets" className="btn-ghost mt-4 w-full text-xs">Market gate →</Link>
          </Panel>

          <Panel title="Next actions">
            <ul className="space-y-2 text-sm">
              {actionable.slice(0, 4).map((p) => (
                <li key={p.id} className="text-fog"><Link to={`/deal/${p.id}`} className="text-gold hover:underline">{p.name}</Link>: {p.nextAction}</li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  )
}
