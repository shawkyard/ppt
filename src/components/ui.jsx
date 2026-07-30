import { PROVENANCE } from '../lib/schema.js'

const TONE = {
  good: 'border-approve/40 text-approve bg-approve/10',
  info: 'border-sky-400/30 text-sky-300 bg-sky-400/10',
  warn: 'border-warn/40 text-warn bg-warn/10',
  assume: 'border-gold/40 text-gold bg-gold/10',
  muted: 'border-slateline text-mist bg-graphite/60',
  bad: 'border-danger/50 text-danger bg-danger/10',
}

export function Chip({ tone = 'muted', children, className = '' }) {
  return <span className={`chip ${TONE[tone] || TONE.muted} ${className}`}>{children}</span>
}

export function ProvenanceChip({ source }) {
  const key = source || 'assumption'
  const meta = PROVENANCE[key] || PROVENANCE.assumption
  return <Chip tone={meta.tone}>{meta.label}</Chip>
}

// Verdict / status pill with strong color.
const VERDICT = {
  strike: 'bg-gold text-ink',
  pass: 'bg-approve text-white',
  reprice: 'bg-warn text-ink',
  reject: 'bg-danger text-white',
}
export function VerdictPill({ tone = 'muted', children, big = false }) {
  return (
    <span className={`inline-flex items-center rounded-md font-semibold tracking-tight ${VERDICT[tone] || 'bg-graphite text-fog'} ${big ? 'px-4 py-2 text-lg' : 'px-2.5 py-1 text-sm'}`}>
      {children}
    </span>
  )
}

// MEETS / EXCEEDS / FAIL / STRIKE small status text.
export function GateStatus({ status }) {
  const map = {
    EXCEEDS: 'text-approve', MEETS: 'text-approve/80', FAIL: 'text-danger',
    'DESTINATION STRIKE': 'text-gold', 'NOT YET': 'text-mist',
    PASS: 'text-approve', READY: 'text-approve', PENDING: 'text-warn',
  }
  return <span className={`font-semibold ${map[status] || 'text-fog'}`}>{status}</span>
}

export function Section({ title, subtitle, right, children, defaultOpen = true }) {
  return (
    <details open={defaultOpen} className="panel group">
      <summary className="panel-hd flex items-center justify-between cursor-pointer list-none">
        <div>
          <h3 className="text-base font-semibold flex items-center gap-2">
            <span className="text-mist group-open:rotate-90 transition-transform inline-block">›</span>
            {title}
          </h3>
          {subtitle && <p className="text-xs text-mist mt-0.5 ml-4">{subtitle}</p>}
        </div>
        {right}
      </summary>
      <div className="p-5">{children}</div>
    </details>
  )
}

export function Stat({ label, value, sub, tone }) {
  const toneCls = tone === 'good' ? 'text-approve' : tone === 'bad' ? 'text-danger' : tone === 'warn' ? 'text-warn' : 'text-white'
  return (
    <div className="rounded-lg border border-slateline/70 bg-graphite/40 px-4 py-3">
      <div className="label">{label}</div>
      <div className={`text-xl font-semibold tnum mt-1 ${toneCls}`}>{value}</div>
      {sub && <div className="text-[11px] text-mist mt-0.5">{sub}</div>}
    </div>
  )
}

// A thin bar showing value vs minimum / preferred thresholds.
export function GateBar({ value, min, pref, fmt }) {
  const scaleMax = Math.max(pref * 1.4, value * 1.1, min * 1.4, 0.0001)
  const pctOf = (v) => `${Math.min(100, Math.max(0, (v / scaleMax) * 100))}%`
  const pass = value >= min
  return (
    <div className="mt-2">
      <div className="relative h-2 rounded-full bg-ink border border-slateline/60">
        <div className={`absolute inset-y-0 left-0 rounded-full ${pass ? 'bg-approve' : 'bg-danger'}`} style={{ width: pctOf(value) }} />
        <div className="absolute inset-y-[-3px] w-px bg-fog/70" style={{ left: pctOf(min) }} title="minimum" />
        <div className="absolute inset-y-[-3px] w-px bg-gold/80" style={{ left: pctOf(pref) }} title="preferred" />
      </div>
      <div className="flex justify-between text-[10px] text-mist mt-1">
        <span>min {fmt(min)}</span>
        <span className="text-gold">pref {fmt(pref)}</span>
      </div>
    </div>
  )
}

export function EmptyState({ title, children }) {
  return (
    <div className="text-center py-16">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <div className="text-sm text-mist mt-2 max-w-md mx-auto">{children}</div>
    </div>
  )
}
