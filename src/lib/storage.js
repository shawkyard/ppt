// Thin localStorage wrapper. MVP persistence only — no backend.
const KEY = 'stonebrook-deal-scout:v1'

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* storage full or unavailable — non-fatal for an MVP */
  }
}

export function clearState() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* no-op */
  }
}
