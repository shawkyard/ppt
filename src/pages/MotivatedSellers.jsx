import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import { Panel, Badge, PageHeader, EmptyState } from '../components/ui.jsx'
import Icon from '../components/Icon.jsx'
import { motivationScore, topSignals, MOTIVATION_TONE, MOTIVATION_LABEL } from '../lib/signals.js'
import { usd } from '../lib/format.js'

export default function MotivatedSellers() {
  const { screenedProperties } = useApp()
  if (!screenedProperties.length) return <EmptyState title="No deals yet">Add a property to see motivated sellers.</EmptyState>

  const ranked = screenedProperties
    .map((p) => ({ p, m: motivationScore(p), top: topSignals(p) }))
    .sort((a, b) => b.m.score - a.m.score || b.m.weight - a.m.weight)

  return (
    <div>
      <PageHeader title="Motivated Sellers"
        subtitle="Every deal ranked 1–5 by seller-motivation signals — the fastest path to a conversation. Open a deal to capture decision-makers and generate outreach.">
        <Link to="/scratch" className="btn-ghost">All deals</Link>
      </PageHeader>

      <div className="grid gap-4">
        {ranked.map(({ p, m, top }) => (
          <Panel key={p.id}>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className={`grid h-16 w-16 flex-none place-items-center rounded-2xl border-4 ${m.score >= 4 ? 'border-red' : m.score === 3 ? 'border-yellow' : 'border-line'}`}>
                <span className={`text-2xl font-extrabold tnum ${m.score >= 4 ? 'text-red' : m.score === 3 ? 'text-yellow' : 'text-mist'}`}>{m.score}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Link to={`/deal/${p.id}/signals`} className="text-lg font-bold text-stone hover:text-gold">{p.name}</Link>
                  <Badge tone={MOTIVATION_TONE[m.score]}>{MOTIVATION_LABEL[m.score]} motivation</Badge>
                  <Badge tone={p.verdict.tone}>{p.verdict.short}</Badge>
                </div>
                <div className="text-sm text-mist mt-0.5 flex items-center gap-1.5"><Icon name="pin" className="w-4 h-4 text-gold" />{p.city} · {p.market?.marketName} · {usd(p.deal.pricePerUnit)}/unit</div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {top.length ? top.slice(0, 4).map((s) => <span key={s.key} className="chip border-gold/40 bg-softorange text-gold">{s.label}</span>)
                    : <span className="text-xs text-mist">No motivation signals yet.</span>}
                </div>
              </div>
              <Link to={`/deal/${p.id}/signals`} className="btn-gold text-sm flex-none">Outreach →</Link>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  )
}
