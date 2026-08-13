// ============================================================================
// Alma Team Portal — data layer
// One interface, two backends:
//   • DEMO MODE  (default) — data lives in this browser via localStorage.
//                 Perfect for clicking through and sharing a preview link.
//   • SUPABASE   — set VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY and the same
//                 interface talks to real, shared, multi-tenant accounts.
// ============================================================================

const SB_URL = import.meta.env.VITE_SUPABASE_URL
const SB_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
export const MODE = SB_URL && SB_KEY ? 'supabase' : 'demo'

// ---------------------------------------------------------------------------
// Seed content — the collateral we already have, so a fresh portal isn't empty.
// ---------------------------------------------------------------------------
const SEED_COLLATERAL = [
  { title: 'The Alma Engine', kind: 'Explainer', status: 'live',
    url: 'https://claude.ai/code/artifact/a4822bfb-a9d9-4957-9b59-4f358cd00f1a',
    description: 'How the engine finds, scores, and delivers loyalty-software buyers.' },
  { title: '10-Month Operating Plan', kind: 'Plan', status: 'live',
    url: 'https://claude.ai/code/artifact/18ae69bf-2748-4776-8bf2-5093952695a7',
    description: 'Service → product → marketplace, sequenced to cash flow.' },
  { title: 'Vuori × Annex Cloud — Hot Report', kind: 'Report', status: 'pdf',
    url: '', description: 'The full 8-page premium report for a score-9 buyer.' },
  { title: 'Target Dossiers (×3)', kind: 'Dossiers', status: 'pdf',
    url: '', description: 'Vuori/Annex, Southwest/Comarch, Etsy/Talon.One.' },
  { title: 'Business Plan & PPM Pack', kind: 'Raise', status: 'progress',
    url: '', description: 'Business plan, GTM, marketing plan, financial model.' },
  { title: 'The 6-Layer Lock', kind: 'Methodology', status: 'draft',
    url: '', description: 'The scoring method codified.' },
]
const SEED_BROADCAST = {
  title: 'One home for everything. Read it, use it, sell from it.',
  body: 'Team — this is our command center. Every piece of collateral lives here, and this is where we stay aligned. Loyalty is where we win, and everybody wants in with us. Let’s go get it.',
  author_name: 'Scott',
}

// ===========================================================================
// DEMO BACKEND (localStorage)
// ===========================================================================
const LS = 'alma_portal_v1'
function db() {
  try { return JSON.parse(localStorage.getItem(LS)) || {} } catch { return {} }
}
function save(d) { localStorage.setItem(LS, JSON.stringify(d)) }
function uid() { return 'u_' + Math.random().toString(36).slice(2, 10) }
function id() { return Math.random().toString(36).slice(2, 12) }
function slugify(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') }

function bootstrap() {
  const d = db()
  if (!d.workspaces) {
    const wsId = 'ws_alma_hq'
    d.workspaces = { [wsId]: { id: wsId, name: 'Alma HQ', slug: 'alma-hq' } }
    d.memberships = {}         // key: userId -> [{workspace_id, role, display_name}]
    d.broadcasts = { [wsId]: { ...SEED_BROADCAST, updated_at: new Date().toISOString() } }
    d.collateral = { [wsId]: SEED_COLLATERAL.map((c, i) => ({ id: id(), sort_order: i, ...c })) }
    d.messages = { [wsId]: [
      { id: id(), author_name: 'Scott', body: 'Welcome to the portal. Post here — this is our team channel.', created_at: new Date(Date.now() - 6e5).toISOString() },
    ] }
    save(d)
  }
  return db()
}

const demo = {
  current() {
    const d = db()
    return d.session || null
  },
  async signIn(name) {
    const d = bootstrap()
    const userId = (d.userIndex && d.userIndex[name.toLowerCase()]) || uid()
    d.userIndex = d.userIndex || {}
    d.userIndex[name.toLowerCase()] = userId
    d.session = { userId, name }
    // Auto-join Alma HQ as admin if this is the first person, else member.
    d.memberships = d.memberships || {}
    if (!d.memberships[userId]) {
      const firstEver = Object.keys(d.memberships).length === 0
      d.memberships[userId] = [{ workspace_id: 'ws_alma_hq', role: firstEver ? 'admin' : 'member', display_name: name }]
    }
    save(d)
    return d.session
  },
  async signOut() { const d = db(); delete d.session; save(d) },
  async myWorkspaces() {
    const d = bootstrap(); const s = d.session; if (!s) return []
    return (d.memberships[s.userId] || []).map(m => ({ ...d.workspaces[m.workspace_id], role: m.role }))
  },
  async createWorkspace(name) {
    const d = bootstrap(); const s = d.session
    const wsId = 'ws_' + id(); const slug = slugify(name)
    d.workspaces[wsId] = { id: wsId, name, slug }
    d.memberships[s.userId] = d.memberships[s.userId] || []
    d.memberships[s.userId].push({ workspace_id: wsId, role: 'admin', display_name: s.name })
    d.collateral[wsId] = []; d.messages[wsId] = []
    d.broadcasts[wsId] = { title: 'Welcome', body: 'New workspace ready.', author_name: s.name, updated_at: new Date().toISOString() }
    save(d)
    return { ...d.workspaces[wsId], role: 'admin' }
  },
  async joinWorkspace(slug, name) {
    const d = bootstrap(); const s = d.session
    const ws = Object.values(d.workspaces).find(w => w.slug === slug)
    if (!ws) throw new Error('No workspace with that code.')
    const list = d.memberships[s.userId] = d.memberships[s.userId] || []
    if (!list.find(m => m.workspace_id === ws.id)) list.push({ workspace_id: ws.id, role: 'member', display_name: name })
    save(d)
    return { ...ws, role: 'member' }
  },
  async getBroadcast(wsId) { return bootstrap().broadcasts[wsId] || null },
  async setBroadcast(wsId, b) {
    const d = bootstrap(); d.broadcasts[wsId] = { ...b, updated_at: new Date().toISOString() }; save(d); return d.broadcasts[wsId]
  },
  async listCollateral(wsId) { return (bootstrap().collateral[wsId] || []).slice().sort((a, b) => a.sort_order - b.sort_order) },
  async addCollateral(wsId, item) {
    const d = bootstrap(); const arr = d.collateral[wsId] = d.collateral[wsId] || []
    arr.push({ id: id(), sort_order: arr.length, ...item }); save(d); return arr
  },
  async listMessages(wsId) { return (bootstrap().messages[wsId] || []).slice() },
  async postMessage(wsId, m) {
    const d = bootstrap(); const arr = d.messages[wsId] = d.messages[wsId] || []
    arr.push({ id: id(), created_at: new Date().toISOString(), ...m }); save(d); return arr
  },
  async listMembers(wsId) {
    const d = bootstrap(); const out = []
    for (const list of Object.values(d.memberships || {})) {
      const m = (list || []).find(x => x.workspace_id === wsId)
      if (m) out.push({ display_name: m.display_name, role: m.role })
    }
    return out
  },
}

// ===========================================================================
// SUPABASE BACKEND (fetch against GoTrue + PostgREST — no extra npm dependency)
// ===========================================================================
function sbHeaders(token) {
  return {
    apikey: SB_KEY,
    Authorization: `Bearer ${token || SB_KEY}`,
    'Content-Type': 'application/json',
  }
}
function sbSession() { try { return JSON.parse(localStorage.getItem('alma_sb_session')) } catch { return null } }
async function sbGet(path, token) {
  const r = await fetch(`${SB_URL}/rest/v1/${path}`, { headers: sbHeaders(token) })
  if (!r.ok) throw new Error(await r.text()); return r.json()
}
async function sbPost(path, body, token, prefer = 'return=representation') {
  const r = await fetch(`${SB_URL}/rest/v1/${path}`, { method: 'POST', headers: { ...sbHeaders(token), Prefer: prefer }, body: JSON.stringify(body) })
  if (!r.ok) throw new Error(await r.text()); return r.json()
}

const supa = {
  current() { const s = sbSession(); return s ? { userId: s.user.id, name: s.name, token: s.access_token } : null },
  async signUp(email, password, name) {
    const r = await fetch(`${SB_URL}/auth/v1/signup`, { method: 'POST', headers: sbHeaders(), body: JSON.stringify({ email, password, data: { name } }) })
    const j = await r.json(); if (!r.ok) throw new Error(j.msg || j.error_description || 'Sign-up failed')
    return this._persist(j, name)
  },
  async signIn(email, password) {
    const r = await fetch(`${SB_URL}/auth/v1/token?grant_type=password`, { method: 'POST', headers: sbHeaders(), body: JSON.stringify({ email, password }) })
    const j = await r.json(); if (!r.ok) throw new Error(j.msg || j.error_description || 'Sign-in failed')
    return this._persist(j, j.user?.user_metadata?.name || email)
  },
  _persist(j, name) {
    const s = { access_token: j.access_token, user: j.user, name }
    localStorage.setItem('alma_sb_session', JSON.stringify(s)); return { userId: j.user.id, name, token: j.access_token }
  },
  async signOut() { localStorage.removeItem('alma_sb_session') },
  async myWorkspaces() {
    const s = sbSession(); if (!s) return []
    const rows = await sbGet('memberships?select=role,workspaces(id,name,slug)', s.access_token)
    return rows.map(r => ({ ...r.workspaces, role: r.role }))
  },
  async createWorkspace(name) {
    const s = sbSession(); const slug = slugify(name)
    const [ws] = await sbPost('workspaces', { name, slug, created_by: s.user.id }, s.access_token)
    await sbPost('memberships', { workspace_id: ws.id, user_id: s.user.id, display_name: s.name, role: 'admin' }, s.access_token)
    return { ...ws, role: 'admin' }
  },
  async joinWorkspace(slug, name) {
    const s = sbSession()
    const ws = await sbPost('rpc/join_workspace', { p_slug: slug, p_display_name: name }, s.access_token)
    return { ...ws, role: 'member' }
  },
  async getBroadcast(wsId) { const s = sbSession(); const r = await sbGet(`broadcasts?workspace_id=eq.${wsId}&select=*&limit=1`, s.access_token); return r[0] || null },
  async setBroadcast(wsId, b) {
    const s = sbSession()
    return sbPost('broadcasts', { workspace_id: wsId, ...b, updated_at: new Date().toISOString() }, s.access_token, 'resolution=merge-duplicates,return=representation')
  },
  async listCollateral(wsId) { const s = sbSession(); return sbGet(`collateral?workspace_id=eq.${wsId}&select=*&order=sort_order`, s.access_token) },
  async addCollateral(wsId, item) { const s = sbSession(); return sbPost('collateral', { workspace_id: wsId, ...item }, s.access_token) },
  async listMessages(wsId) { const s = sbSession(); return sbGet(`messages?workspace_id=eq.${wsId}&select=*&order=created_at`, s.access_token) },
  async postMessage(wsId, m) { const s = sbSession(); return sbPost('messages', { workspace_id: wsId, user_id: s.user.id, ...m }, s.access_token) },
  async listMembers(wsId) { const s = sbSession(); return sbGet(`memberships?workspace_id=eq.${wsId}&select=display_name,role`, s.access_token) },
}

export const store = MODE === 'supabase' ? supa : demo
