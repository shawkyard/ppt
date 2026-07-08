import { Link, NavLink } from 'react-router-dom'
import { Badge } from './ui.jsx'

const TABS = [
  { seg: '', label: 'Deal Detail', end: true },
  { seg: 'plan', label: '24-Month Plan' },
  { seg: 'offer', label: 'Offer / Price' },
  { seg: 'risk', label: 'Risk Register' },
  { seg: 'questions', label: 'Broker Questions' },
  { seg: 'signals', label: 'Signals & Outreach' },
  { seg: 'summary', label: 'Investor Summary' },
]

export function DealNotFound() {
  return (
    <div className="panel p-10 text-center">
      <h2 className="text-stone text-lg">Property not found</h2>
      <p className="mt-2 text-sm text-mist">It may have been removed. Return to the pipeline.</p>
      <Link to="/" className="btn-gold mt-4">Back to dashboard</Link>
    </div>
  )
}

export default function DealHeader({ p }) {
  const toneText = p.verdict.tone === 'green' ? 'text-greenbright' : p.verdict.tone === 'yellow' ? 'text-yellow' : 'text-red'
  return (
    <div className="mb-6">
      <Link to="/scratch" className="text-xs text-mist hover:text-stone no-print">← Pipeline</Link>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone">{p.name}</h1>
          <p className="mt-1 text-sm text-mist">
            {p.address ? `${p.address} · ` : ''}{p.city} · {p.units} units · {p.propertyClass} in {p.areaClass} area
            {p.market ? ` · ${p.market.marketName}, ${p.market.state}` : ''}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className={`text-3xl font-extrabold tnum leading-none ${toneText}`}>{p.score}</div>
            <div className="label mt-1">score</div>
          </div>
          <Badge tone={p.verdict.tone}>{p.verdict.short}</Badge>
          <Link to="/reports" className="btn-gold no-print hidden sm:inline-flex">Generate Report</Link>
        </div>
      </div>
      <div className="mt-6 -mx-1 flex gap-1 overflow-x-auto border-b border-line no-print">
        {TABS.map((t) => (
          <NavLink key={t.seg} end={t.end} to={`/deal/${p.id}${t.seg ? `/${t.seg}` : ''}`}
            className={({ isActive }) =>
              `whitespace-nowrap px-3 py-2.5 text-sm border-b-2 -mb-px transition-colors ${
                isActive ? 'border-gold text-stone' : 'border-transparent text-mist hover:text-stone'
              }`}>
            {t.label}
          </NavLink>
        ))}
      </div>
    </div>
  )
}
