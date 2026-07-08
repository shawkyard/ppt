// Small reusable presentational components shared across pages.
import { Link } from 'react-router-dom'

const TONE = {
  approve: { text: 'text-approve', border: 'border-approve/40', bg: 'bg-approve/10', dot: 'bg-approve' },
  warn: { text: 'text-warn', border: 'border-warn/40', bg: 'bg-warn/10', dot: 'bg-warn' },
  danger: { text: 'text-danger', border: 'border-danger/40', bg: 'bg-danger/10', dot: 'bg-danger' },
  gold: { text: 'text-gold', border: 'border-gold/40', bg: 'bg-gold/10', dot: 'bg-gold' },
  mist: { text: 'text-mist', border: 'border-slateline', bg: 'bg-graphite', dot: 'bg-mist' },
}

export function Panel({ title, action, children, className = '' }) {
  return (
    <section className={`panel ${className}`}>
      {(title || action) && (
        <header className="panel-hd flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          {action}
        </header>
      )}
      <div className="p-5">{children}</div>
    </section>
  )
}

export function Badge({ tone = 'mist', children, className = '' }) {
  const t = TONE[tone] || TONE.mist
  return (
    <span className={`chip ${t.text} ${t.border} ${t.bg} ${className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${t.dot}`} />
      {children}
    </span>
  )
}

export function Stat({ label, value, sub, tone }) {
  const t = tone ? TONE[tone] : null
  return (
    <div className="panel p-4">
      <div className="label">{label}</div>
      <div className={`mt-1.5 text-xl font-semibold tnum ${t ? t.text : 'text-white'}`}>{value}</div>
      {sub && <div className="mt-0.5 text-xs text-mist">{sub}</div>}
    </div>
  )
}

// Circular score gauge, 0–100.
export function ScoreRing({ score = 0, tone = 'gold', size = 96, label }) {
  const t = TONE[tone] || TONE.gold
  const r = (size - 12) / 2
  const c = 2 * Math.PI * r
  const pctFill = Math.max(0, Math.min(100, score)) / 100
  const stroke = { approve: '#4f9d69', warn: '#c9a227', danger: '#b4544b', gold: '#c8a95a' }[tone] || '#c8a95a'
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#2e343c" strokeWidth="6" />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={stroke} strokeWidth="6"
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pctFill)}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`text-2xl font-bold tnum ${t.text}`}>{score}</span>
        {label && <span className="text-[10px] uppercase tracking-wider text-mist">{label}</span>}
      </div>
    </div>
  )
}

// Horizontal weighted bar for score breakdowns.
export function WeightBar({ label, points, weight, help }) {
  const pctFill = weight ? (points / weight) * 100 : 0
  const strong = pctFill >= 66
  const color = strong ? 'bg-approve' : pctFill >= 40 ? 'bg-gold' : 'bg-danger'
  return (
    <div className="py-2">
      <div className="flex items-baseline justify-between text-sm">
        <span className="text-fog" title={help}>{label}</span>
        <span className="tnum text-mist">
          <span className="text-white font-medium">{points.toFixed(1)}</span> / {weight}
        </span>
      </div>
      <div className="mt-1.5 h-1.5 w-full rounded-full bg-graphite overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pctFill}%` }} />
      </div>
    </div>
  )
}

export function Field({ label, children, help, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="label">{label}</span>
      <div className="mt-1.5">{children}</div>
      {help && <span className="mt-1 block text-[11px] text-mist/80">{help}</span>}
    </label>
  )
}

export function KeyVal({ k, v, tone }) {
  const t = tone ? TONE[tone] : null
  return (
    <div className="flex items-center justify-between gap-4 py-2 border-b border-slateline/40 last:border-0">
      <span className="text-sm text-mist">{k}</span>
      <span className={`text-sm font-medium tnum ${t ? t.text : 'text-white'}`}>{v}</span>
    </div>
  )
}

export function EmptyState({ title, children, cta }) {
  return (
    <div className="panel p-10 text-center">
      <h3 className="text-white text-lg">{title}</h3>
      <p className="mt-2 text-sm text-mist max-w-md mx-auto">{children}</p>
      {cta && <div className="mt-5">{cta}</div>}
    </div>
  )
}

export function PageHeader({ title, subtitle, children }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-mist max-w-2xl">{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  )
}

export function Callout({ tone = 'gold', title, children }) {
  const t = TONE[tone] || TONE.gold
  return (
    <div className={`rounded-lg border ${t.border} ${t.bg} p-4`}>
      {title && <div className={`text-xs font-semibold uppercase tracking-wider ${t.text}`}>{title}</div>}
      <div className="mt-1 text-sm text-fog">{children}</div>
    </div>
  )
}

export { TONE }
