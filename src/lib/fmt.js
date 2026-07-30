// Formatting helpers for financial figures.

export function money(n, { decimals = 0, blankZero = false } = {}) {
  if (n == null || Number.isNaN(n)) return '—'
  if (blankZero && n === 0) return '—'
  const neg = n < 0
  const v = Math.abs(n)
  const s = v.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
  return neg ? `($${s})` : `$${s}`
}

// Compact money for tight tables: $7.0M, $850K
export function moneyC(n) {
  if (n == null || Number.isNaN(n)) return '—'
  const neg = n < 0
  const v = Math.abs(n)
  let s
  if (v >= 1_000_000) s = `$${(v / 1_000_000).toFixed(v >= 10_000_000 ? 1 : 2)}M`
  else if (v >= 1_000) s = `$${(v / 1_000).toFixed(0)}K`
  else s = `$${v.toFixed(0)}`
  return neg ? `(${s})` : s
}

export function pct(n, decimals = 1) {
  if (n == null || Number.isNaN(n)) return '—'
  return `${(n * 100).toFixed(decimals)}%`
}

export function mult(n, decimals = 2) {
  if (n == null || Number.isNaN(n)) return '—'
  return `${n.toFixed(decimals)}x`
}

export function num(n, decimals = 0) {
  if (n == null || Number.isNaN(n)) return '—'
  return n.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

// Format a value given a schema format type.
export function fmtByType(type, v) {
  switch (type) {
    case 'money':
      return money(v)
    case 'moneyC':
      return moneyC(v)
    case 'pct':
      return pct(v)
    case 'pct0':
      return pct(v, 0)
    case 'mult':
      return mult(v)
    case 'int':
      return num(v, 0)
    case 'num2':
      return num(v, 2)
    default:
      return String(v ?? '—')
  }
}

// Seed an editable text field from a numeric value given the format type.
export function editValue(type, v) {
  if (v == null) return ''
  if (type === 'pct' || type === 'pct0') return String(+(v * 100).toFixed(3))
  if (type === 'money' || type === 'moneyC' || type === 'int') return String(Math.round(v))
  return String(v)
}

// Parse a user-typed value back into a number given the format type.
export function parseByType(type, raw) {
  if (raw === '' || raw == null) return 0
  const cleaned = String(raw).replace(/[$,%\sx]/gi, '').replace(/[()]/g, '')
  let n = parseFloat(cleaned)
  if (Number.isNaN(n)) return 0
  if (/[()]/.test(String(raw))) n = -n
  if (type === 'pct' || type === 'pct0') n = n / 100
  return n
}
