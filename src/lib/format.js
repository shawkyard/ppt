// Presentation helpers.
export const usd = (num, opts = {}) => {
  if (num == null || Number.isNaN(num)) return '—'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0, ...opts }).format(num)
}
export const pct = (num, digits = 1) => (num == null || Number.isNaN(num) ? '—' : `${(num * 100).toFixed(digits)}%`)
export const mult = (num, digits = 2) => (num == null || Number.isNaN(num) ? '—' : `${num.toFixed(digits)}x`)
export const num = (n) => (n == null || Number.isNaN(n) ? '—' : new Intl.NumberFormat('en-US').format(n))
export const usdSigned = (n) => {
  if (n == null || Number.isNaN(n)) return '—'
  const s = usd(Math.abs(n))
  return n < 0 ? `(${s})` : s
}
export const usdShort = (n) => {
  if (n == null || Number.isNaN(n)) return '—'
  const a = Math.abs(n)
  if (a >= 1e6) return `${n < 0 ? '-' : ''}$${(a / 1e6).toFixed(1)}M`
  if (a >= 1e3) return `${n < 0 ? '-' : ''}$${(a / 1e3).toFixed(0)}K`
  return usd(n)
}
