// LocalStorage-backed pipeline of underwritten deals.

const KEY = 'stonebrook.rv.deals.v1'

export function loadDeals() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const arr = JSON.parse(raw)
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

export function saveDeals(deals) {
  try {
    localStorage.setItem(KEY, JSON.stringify(deals))
  } catch {
    /* quota — ignore */
  }
}

export function newId() {
  return 'd_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}
