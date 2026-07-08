// Illustrated apartment thumbnail tile. Deterministic tint by name — no external
// images (keeps the app offline / CSP-safe) while matching the concept-board look.
const TINTS = [
  { bg: '#FFF3E8', roof: '#F97316' },
  { bg: '#FEF3C7', roof: '#EA580C' },
  { bg: '#ECFDF5', roof: '#16A34A' },
  { bg: '#EFF6FF', roof: '#2563EB' },
  { bg: '#F5F3FF', roof: '#7C3AED' },
]

export default function Thumb({ name = '', className = 'h-14 w-14' }) {
  const i = [...String(name)].reduce((a, c) => a + c.charCodeAt(0), 0) % TINTS.length
  const t = TINTS[i]
  return (
    <div className={`relative shrink-0 overflow-hidden rounded-xl border border-line ${className}`} style={{ background: t.bg }}>
      <svg viewBox="0 0 64 64" className="absolute inset-0 h-full w-full">
        {/* left building */}
        <rect x="8" y="26" width="20" height="34" rx="2" fill="#FFFFFF" stroke="#E5E7EB" />
        <rect x="8" y="24" width="20" height="4" rx="1" fill={t.roof} />
        {[30, 38, 46, 54].map((y) => [12, 18, 24].map((x) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="3.2" height="3.2" rx="0.6" fill="#CBD5E1" />
        )))}
        {/* right building (taller) */}
        <rect x="30" y="16" width="26" height="44" rx="2" fill="#FFFFFF" stroke="#E5E7EB" />
        <rect x="30" y="14" width="26" height="4" rx="1" fill={t.roof} />
        {[20, 28, 36, 44, 52].map((y) => [34, 41, 48].map((x) => (
          <rect key={`r-${x}-${y}`} x={x} y={y} width="3.6" height="3.6" rx="0.6" fill="#CBD5E1" />
        )))}
        {/* door */}
        <rect x="39" y="52" width="6" height="8" rx="1" fill={t.roof} opacity="0.85" />
      </svg>
    </div>
  )
}
