import React, { useEffect, useState, useCallback } from 'react'
import { store, MODE } from './store.js'

const initials = (s = '') => s.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase() || '?'
const fmtTime = (iso) => {
  const d = new Date(iso), now = new Date()
  const same = d.toDateString() === now.toDateString()
  return same ? d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
              : d.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

function Mark({ sm }) {
  return (
    <div className={'mark' + (sm ? ' sm' : '')}>
      <svg width={sm ? 17 : 20} height={sm ? 20 : 24} viewBox="0 0 60 78" aria-hidden="true">
        <polygon points="30,20 12,64 48,64" fill="#EAF1FA" />
        <polygon points="30,20 48,64 55,70 37,26" fill="#B9D2EE" />
        <circle cx="30" cy="20" r="6" fill="#25D69A" />
      </svg>
      <span className="pulse" />
    </div>
  )
}

// ---------------------------------------------------------------------------
// LOGIN
// ---------------------------------------------------------------------------
function Login({ onDone }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [mkNew, setMkNew] = useState(false)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault(); setErr(''); setBusy(true)
    try {
      if (MODE === 'demo') {
        if (!name.trim()) throw new Error('Enter your name to continue.')
        await store.signIn(name.trim())
      } else if (mkNew) {
        await store.signUp(email.trim(), pw, name.trim())
      } else {
        await store.signIn(email.trim(), pw)
      }
      onDone()
    } catch (e) { setErr(e.message || String(e)) } finally { setBusy(false) }
  }

  return (
    <div className="login-wrap">
      <form className="login-card" onSubmit={submit}>
        <div className="brandline"><Mark /><div className="nm">Alma <span>Loyalty</span></div></div>
        <span className={'modechip ' + (MODE === 'demo' ? 'demo' : 'live')}>
          {MODE === 'demo' ? 'Demo mode' : 'Live · shared accounts'}
        </span>
        <h1>{MODE === 'demo' ? 'Enter the team portal' : (mkNew ? 'Create your account' : 'Sign in')}</h1>
        <p className="dek">
          {MODE === 'demo'
            ? 'Type your name to step into the portal. In demo mode your data lives in this browser.'
            : 'Real team accounts — everyone shares the same workspaces, collateral, and messages.'}
        </p>
        {err && <div className="err">{err}</div>}

        {(MODE === 'demo' || mkNew) && (
          <label className="fld"><span className="lab">Your name</span>
            <input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Scott Hawkyard" autoFocus />
          </label>
        )}
        {MODE !== 'demo' && (
          <>
            <label className="fld"><span className="lab">Email</span>
              <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@alma.co" />
            </label>
            <label className="fld"><span className="lab">Password</span>
              <input className="input" type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="••••••••" />
            </label>
          </>
        )}

        <button className="btn primary" style={{ width: '100%', justifyContent: 'center' }} disabled={busy}>
          {busy ? 'One moment…' : MODE === 'demo' ? 'Enter portal →' : mkNew ? 'Create account →' : 'Sign in →'}
        </button>

        {MODE !== 'demo' && (
          <p className="hint">
            {mkNew ? 'Already have an account? ' : 'New to the team? '}
            <a href="#" onClick={e => { e.preventDefault(); setMkNew(!mkNew); setErr('') }}>
              {mkNew ? 'Sign in' : 'Create one'}
            </a>
          </p>
        )}
        {MODE === 'demo' && (
          <p className="hint">This is a working preview. To switch the whole team onto real shared logins, add your Supabase keys — the same portal goes live for everyone.</p>
        )}
      </form>
    </div>
  )
}

// ---------------------------------------------------------------------------
// BROADCAST
// ---------------------------------------------------------------------------
function Broadcast({ wsId, isAdmin, name }) {
  const [b, setB] = useState(null)
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const load = useCallback(async () => { const r = await store.getBroadcast(wsId); setB(r) }, [wsId])
  useEffect(() => { load() }, [load])

  async function save() {
    await store.setBroadcast(wsId, { title, body, author_name: name })
    setEditing(false); load()
  }
  if (editing) {
    return (
      <div className="broadcast">
        <div className="head"><span className="k">Edit broadcast</span></div>
        <label className="fld"><span className="lab">Headline</span>
          <input className="input" value={title} onChange={e => setTitle(e.target.value)} /></label>
        <label className="fld"><span className="lab">Message</span>
          <textarea className="input" rows={4} value={body} onChange={e => setBody(e.target.value)} /></label>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button className="btn sm ghost" onClick={() => setEditing(false)}>Cancel</button>
          <button className="btn sm primary" onClick={save}>Post to team</button>
        </div>
      </div>
    )
  }
  return (
    <div className="broadcast">
      <div className="head">
        <span className="k">📌 Pinned — from {b?.author_name || 'the team'}</span>
        <span className="when">{b?.updated_at ? 'Updated ' + fmtTime(b.updated_at) : ''}</span>
      </div>
      <h2>{b?.title || 'Welcome to the portal'}</h2>
      <p>{b?.body || 'Your team’s command center.'}</p>
      {isAdmin && (
        <div className="from">
          <button className="btn sm" onClick={() => { setTitle(b?.title || ''); setBody(b?.body || ''); setEditing(true) }}>
            Edit broadcast
          </button>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// COLLATERAL
// ---------------------------------------------------------------------------
function Collateral({ wsId, isAdmin }) {
  const [items, setItems] = useState([])
  const [adding, setAdding] = useState(false)
  const [f, setF] = useState({ title: '', kind: 'Report', description: '', url: '', status: 'live' })
  const load = useCallback(async () => setItems(await store.listCollateral(wsId)), [wsId])
  useEffect(() => { load() }, [load])

  async function add() {
    if (!f.title.trim()) return
    await store.addCollateral(wsId, { ...f, status: f.url ? 'live' : f.status })
    setAdding(false); setF({ title: '', kind: 'Report', description: '', url: '', status: 'live' }); load()
  }
  return (
    <div className="sec">
      <div className="sh">
        <h3>Collateral library</h3>
        {isAdmin && <button className="btn sm" onClick={() => setAdding(true)}>+ Add</button>}
      </div>
      <div className="body">
        {items.length === 0 && <div className="empty">No collateral yet.</div>}
        {items.map(it => {
          const clickable = !!it.url
          const Wrapper = clickable ? 'a' : 'div'
          const props = clickable ? { href: it.url, target: '_blank', rel: 'noopener', className: 'item' } : { className: 'item' }
          return (
            <Wrapper key={it.id} {...props}>
              <div className="it-ic">{initials(it.kind)}</div>
              <div className="it-main">
                <div className="it-title">{it.title}</div>
                {it.description && <div className="it-desc">{it.description}</div>}
                <div className="it-meta">
                  <span className="kind">{it.kind}</span>
                  <span className={'chip ' + it.status}>{it.status}</span>
                </div>
              </div>
              <span className={'it-open' + (clickable ? '' : ' off')}>{clickable ? 'Open →' : 'Soon'}</span>
            </Wrapper>
          )
        })}
      </div>
      {adding && (
        <div className="modal-bg" onClick={e => e.target === e.currentTarget && setAdding(false)}>
          <div className="modal">
            <h3>Add collateral</h3>
            <p className="dek">Link a page, report, or doc for the team.</p>
            <label className="fld"><span className="lab">Title</span>
              <input className="input" value={f.title} onChange={e => setF({ ...f, title: e.target.value })} autoFocus /></label>
            <label className="fld"><span className="lab">Kind</span>
              <input className="input" value={f.kind} onChange={e => setF({ ...f, kind: e.target.value })} placeholder="Report, Plan, Explainer…" /></label>
            <label className="fld"><span className="lab">Description</span>
              <input className="input" value={f.description} onChange={e => setF({ ...f, description: e.target.value })} /></label>
            <label className="fld"><span className="lab">Link (optional)</span>
              <input className="input" value={f.url} onChange={e => setF({ ...f, url: e.target.value })} placeholder="https://…" /></label>
            <div className="actions">
              <button className="btn sm ghost" onClick={() => setAdding(false)}>Cancel</button>
              <button className="btn sm primary" onClick={add}>Add to library</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// MESSAGES
// ---------------------------------------------------------------------------
function Messages({ wsId, name }) {
  const [list, setList] = useState([])
  const [text, setText] = useState('')
  const load = useCallback(async () => setList(await store.listMessages(wsId)), [wsId])
  useEffect(() => { load(); const t = setInterval(load, 5000); return () => clearInterval(t) }, [load])

  async function send() {
    if (!text.trim()) return
    await store.postMessage(wsId, { author_name: name, body: text.trim() })
    setText(''); load()
  }
  return (
    <div className="sec">
      <div className="sh"><h3>Team channel</h3></div>
      <div className="body">
        <div className="msgs">
          {list.length === 0 && <div className="empty">No messages yet. Say hello 👋</div>}
          {list.map(m => (
            <div className="msg" key={m.id}>
              <div className="av">{initials(m.author_name)}</div>
              <div className="mb">
                <div className="mh"><span className="who">{m.author_name}</span><span className="tm">{fmtTime(m.created_at)}</span></div>
                <div className="tx">{m.body}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="composer">
          <textarea value={text} onChange={e => setText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) send() }}
            placeholder="Message the team…  (⌘/Ctrl + Enter to send)" />
          <button className="btn primary" onClick={send}>Send</button>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// TEAM
// ---------------------------------------------------------------------------
function Team({ wsId }) {
  const [members, setMembers] = useState([])
  useEffect(() => { store.listMembers(wsId).then(setMembers) }, [wsId])
  return (
    <div className="sec">
      <div className="sh"><h3>Team</h3></div>
      <div className="body">
        {members.length === 0 && <div className="empty">Just you so far.</div>}
        {members.map((m, i) => (
          <div className="member" key={i}>
            <div className="av">{initials(m.display_name)}</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{m.display_name}</div>
            <span className="role">{m.role}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// PORTAL
// ---------------------------------------------------------------------------
function Portal({ session, onSignOut }) {
  const [workspaces, setWorkspaces] = useState([])
  const [active, setActive] = useState(null)
  const [wsModal, setWsModal] = useState(false)
  const name = session.name

  const loadWs = useCallback(async () => {
    const ws = await store.myWorkspaces()
    setWorkspaces(ws)
    setActive(prev => ws.find(w => w.id === prev?.id) || ws[0] || null)
  }, [])
  useEffect(() => { loadWs() }, [loadWs])

  const isAdmin = active?.role === 'admin'

  return (
    <div className="wrap">
      <div className="topbar">
        <div className="brand">
          <Mark sm />
          <div><div className="nm">Alma <span>Loyalty</span></div><div className="sub">Team Portal</div></div>
        </div>
        <div className="topright">
          {active && (
            <div className="wsswitch">
              <select className="select" value={active.id}
                onChange={e => setActive(workspaces.find(w => w.id === e.target.value))}>
                {workspaces.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
              </select>
              <button className="btn sm" onClick={() => setWsModal(true)}>+ Workspace</button>
            </div>
          )}
          <div className="userchip"><div className="avatar">{initials(name)}</div>{name}</div>
          <button className="btn sm ghost" onClick={onSignOut}>Sign out</button>
        </div>
      </div>

      {MODE === 'demo' && (
        <div className="demo-banner">
          <span>⚠️</span>
          <div><b>Demo mode.</b> Data lives in this browser, so messages don’t reach other people yet. Add Supabase keys to switch the whole team onto real shared accounts — same portal, live for everyone.</div>
        </div>
      )}

      {active && (
        <div className="grid">
          <div className="col">
            <Broadcast wsId={active.id} isAdmin={isAdmin} name={name} />
            <Collateral wsId={active.id} isAdmin={isAdmin} />
          </div>
          <div className="col">
            <Messages wsId={active.id} name={name} />
            <Team wsId={active.id} />
          </div>
        </div>
      )}

      {wsModal && <WorkspaceModal name={name} onClose={() => setWsModal(false)} onChanged={() => { setWsModal(false); loadWs() }} />}
    </div>
  )
}

function WorkspaceModal({ name, onClose, onChanged }) {
  const [tab, setTab] = useState('create')
  const [val, setVal] = useState('')
  const [err, setErr] = useState('')
  async function go() {
    setErr('')
    try {
      if (tab === 'create') await store.createWorkspace(val.trim())
      else await store.joinWorkspace(val.trim(), name)
      onChanged()
    } catch (e) { setErr(e.message || String(e)) }
  }
  return (
    <div className="modal-bg" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h3>{tab === 'create' ? 'New workspace' : 'Join a workspace'}</h3>
        <p className="dek">
          {tab === 'create' ? 'Spin up a separate space — e.g. a client, a vertical, or investors.' : 'Enter the workspace code (its slug) to join.'}
        </p>
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          <button className={'btn sm' + (tab === 'create' ? ' primary' : '')} onClick={() => setTab('create')}>Create</button>
          <button className={'btn sm' + (tab === 'join' ? ' primary' : '')} onClick={() => setTab('join')}>Join</button>
        </div>
        {err && <div className="err">{err}</div>}
        <label className="fld"><span className="lab">{tab === 'create' ? 'Workspace name' : 'Workspace code'}</span>
          <input className="input" value={val} onChange={e => setVal(e.target.value)} autoFocus
            placeholder={tab === 'create' ? 'e.g. Investors' : 'e.g. alma-hq'} /></label>
        <div className="actions">
          <button className="btn sm ghost" onClick={onClose}>Cancel</button>
          <button className="btn sm primary" onClick={go}>{tab === 'create' ? 'Create' : 'Join'}</button>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// ROOT
// ---------------------------------------------------------------------------
export default function App() {
  const [session, setSession] = useState(() => store.current())
  const refresh = () => setSession(store.current())
  async function signOut() { await store.signOut(); setSession(null) }
  return session
    ? <Portal session={session} onSignOut={signOut} />
    : <Login onDone={refresh} />
}
