// localStorage persistence — MVP only, no backend.
const KEY = 'stonebrook-deal-scout:v2'

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}
export function saveState(state) {
  try { localStorage.setItem(KEY, JSON.stringify(state)) } catch { /* non-fatal */ }
}
export function clearState() {
  try { localStorage.removeItem(KEY) } catch { /* no-op */ }
}
