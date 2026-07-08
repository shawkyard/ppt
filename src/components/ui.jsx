// Shared presentational primitives for the Stonebrook command center.
import { SOURCE_LABELS } from '../lib/sources.js'

export const TONE = {
  green:    { text: 'text-greenbright', border: 'border-green/50', bg: 'bg-green/12', dot: 'bg-green', hex: '#2E7D5B' },
  yellow:   { text: 'text-yellow',      border: 'border-yellow/50', bg: 'bg-yellow/10', dot: 'bg-yellow', hex: '#DFFF00' },
  turq:     { text: 'text-turq',        border: 'border-turq/50', bg: 'bg-turq/10', dot: 'bg-turq', hex: '#4DD6D0' },
  gold:     { text: 'text-gold',        border: 'border-gold/50', bg: 'bg-gold/10', dot: 'bg-gold', hex: '#C9A45C' },
  red:      { text: 'text-red',         border: 'border-red/50', bg: 'bg-red/10', dot: 'bg-red', hex: '#C94848' },
  mist:     { text: 'text-mist',        border: 'border-line', bg: 'bg-panel', dot: 'bg-mist', hex: '#94A3B8' },
  softgray: { text: 'text-softgray',    border: 'border-softgray/40', bg: 'bg-softgray/5', dot: 'bg-softgray', hex: '#E5E7EB' },
}

export function Panel({ title, action, children, className = '', bodyClass = 'p-5' }) {
  return (
    <section className={`panel ${className}`}>
      {(title || action) && (
        <header className="panel-hd">
          <h3 className="text-sm font-semibold text-stone">{title}</h3>
          {action}
        </header>
      )}
      <div className={bodyClass}>{children}</div>
    </section>
  )
}

export function Badge({ tone = 'mist', children, className = '' }) {
  const t = TONE[tone] || TONE.mist
  return (
    <span className={`chip ${t.text} ${t.border} ${t.bg} ${className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${t.dot}`} />{children}
    </span>
  )
}

export function Stat({ label, value, sub, tone }) {
  const t = tone ? TONE[tone] : null
  return (
    <div className="panel p-4">
      <div className="label">{label}</div>
      <div className={`mt-1.5 text-xl font-semibold tnum ${t ? t.text : 'text-stone'}`}>{value}</div>
      {sub && <div className="mt-0.5 text-xs text-mist">{sub}</div>}
    </div>
  )
}

export function ScoreRing({ score = 0, tone = 'gold', size = 96, label }) {
  const t = TONE[tone] || TONE.gold
  const r = (size - 12) / 2
  const c = 2 * Math.PI * r
  const fill = Math.max(0, Math.min(100, score)) / 100
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1e293b" strokeWidth="6" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={t.hex} strokeWidth="6"
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - fill)} />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`text-2xl font-bold tnum ${t.text}`}>{score}</span>
        {label && <span className="text-[10px] uppercase tracking-wider text-mist">{label}</span>}
      </div>
    </div>
  )
}

export function WeightBar({ label, points, weight, help }) {
  const fill = weight ? (points / weight) * 100 : 0
  const color = fill >= 66 ? 'bg-green' : fill >= 40 ? 'bg-gold' : 'bg-red'
  return (
    <div className="py-2">
      <div className="flex items-baseline justify-between text-sm">
        <span className="text-fog" title={help}>{label}</span>
        <span className="tnum text-mist"><span className="text-stone font-medium">{points.toFixed(1)}</span> / {weight}</span>
      </div>
      <div className="mt-1.5 h-1.5 w-full rounded-full bg-panel overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${fill}%` }} />
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

export function KeyVal({ k, v, tone, tag }) {
  const t = tone ? TONE[tone] : null
  return (
    <div className="flex items-center justify-between gap-4 py-2 border-b border-line/50 last:border-0">
      <span className="text-sm text-mist flex items-center gap-2">{k}{tag && <SourceTag code={tag} />}</span>
      <span className={`text-sm font-medium tnum ${t ? t.text : 'text-stone'}`}>{v}</span>
    </div>
  )
}

export function SourceTag({ code }) {
  const s = SOURCE_LABELS[code]
  if (!s) return null
  const t = TONE[s.tone] || TONE.mist
  return <span className={`tag ${t.text} ${t.bg} border ${t.border}`} title={s.name}>{s.code}</span>
}

export function EmptyState({ title, children, cta }) {
  return (
    <div className="panel p-10 text-center">
      <h3 className="text-stone text-lg">{title}</h3>
      <p className="mt-2 text-sm text-mist max-w-md mx-auto">{children}</p>
      {cta && <div className="mt-5">{cta}</div>}
    </div>
  )
}

export function PageHeader({ title, subtitle, children }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-6">
      <div>
        <h1 className="text-2xl font-semibold text-stone">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-mist max-w-3xl">{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-2 no-print">{children}</div>}
    </div>
  )
}

export function Callout({ tone = 'gold', title, children, className = '' }) {
  const t = TONE[tone] || TONE.gold
  return (
    <div className={`rounded-xl border ${t.border} ${t.bg} p-4 ${className}`}>
      {title && <div className={`text-xs font-semibold uppercase tracking-wider ${t.text}`}>{title}</div>}
      <div className="mt-1 text-sm text-fog">{children}</div>
    </div>
  )
}

export function LockedTag() {
  return <span className="tag text-mist bg-panel border border-line">🔒 LOCKED · V2</span>
}
