// Presentation helpers — keep all number/label formatting in one place.

export const usd = (n, opts = {}) => {
  if (n == null || Number.isNaN(n)) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
    ...opts,
  }).format(n)
}

export const usd2 = (n) => usd(n, { maximumFractionDigits: 0 })

export const pct = (n, digits = 1) => {
  if (n == null || Number.isNaN(n)) return '—'
  return `${(n * 100).toFixed(digits)}%`
}

export const num = (n) => {
  if (n == null || Number.isNaN(n)) return '—'
  return new Intl.NumberFormat('en-US').format(n)
}

// Signed currency, useful for "value created" figures.
export const usdSigned = (n) => {
  if (n == null || Number.isNaN(n)) return '—'
  const s = usd(Math.abs(n))
  return n < 0 ? `(${s})` : s
}
