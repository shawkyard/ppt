import { Link } from 'react-router-dom'
import { Badge } from './ui.jsx'
import DealTabs from './DealTabs.jsx'

export function DealNotFound() {
  return (
    <div className="panel p-10 text-center">
      <h2 className="text-white text-lg">Property not found</h2>
      <p className="mt-2 text-sm text-mist">It may have been removed. Return to the pipeline.</p>
      <Link to="/" className="btn-gold mt-4">Back to dashboard</Link>
    </div>
  )
}

export default function DealHeader({ p }) {
  const toneText = p.verdict.tone === 'approve' ? 'text-approve' : p.verdict.tone === 'warn' ? 'text-warn' : 'text-danger'
  return (
    <div>
      <Link to="/scratch" className="text-xs text-mist hover:text-white">← Scratch screen</Link>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">{p.name}</h1>
          <p className="mt-1 text-sm text-mist">
            {p.address ? `${p.address} · ` : ''}{p.city} · {p.units} units · {p.propertyClass} in {p.areaClass} area
            {p.market ? ` · ${p.market.name}` : ''}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge tone={p.verdict.tone}>{p.verdict.short}</Badge>
          <div className="text-right">
            <div className={`text-3xl font-bold tnum leading-none ${toneText}`}>{p.score}</div>
            <div className="label mt-1">scratch score</div>
          </div>
        </div>
      </div>
      <div className="mt-6"><DealTabs id={p.id} /></div>
    </div>
  )
}
