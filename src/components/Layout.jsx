import { useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'

const NAV = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/markets', label: 'Market Gate' },
  { to: '/scratch', label: 'Scratch Screen' },
  { to: '/add', label: 'Add Property' },
]

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-3 px-5 py-5">
      <span className="grid h-9 w-9 place-items-center rounded-md bg-ink border border-gold/40">
        <svg viewBox="0 0 32 32" className="h-5 w-5">
          <path d="M6 22V13l10-6 10 6v9" fill="none" stroke="#c8a95a" strokeWidth="1.8" strokeLinejoin="round" />
          <rect x="12" y="17" width="3" height="5" fill="#c8a95a" />
          <rect x="17" y="17" width="3" height="5" fill="#4f9d69" />
        </svg>
      </span>
      <span className="leading-tight">
        <span className="block text-sm font-semibold text-white">Stonebrook</span>
        <span className="block text-[11px] tracking-[0.18em] text-gold uppercase">Deal Scout</span>
      </span>
    </Link>
  )
}

function NavItems({ onNavigate }) {
  return (
    <nav className="px-3 py-2 space-y-1">
      {NAV.map((n) => (
        <NavLink
          key={n.to}
          to={n.to}
          end={n.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            `block rounded-md px-3 py-2 text-sm transition-colors ${
              isActive ? 'bg-graphite text-white border-l-2 border-gold pl-[10px]' : 'text-mist hover:text-white hover:bg-charcoal'
            }`
          }
        >
          {n.label}
        </NavLink>
      ))}
    </nav>
  )
}

export default function Layout({ children }) {
  const [open, setOpen] = useState(false)
  const { resetDemo, screenedProperties } = useApp()
  const location = useLocation()

  return (
    <div className="min-h-screen bg-ink">
      {/* Sidebar (desktop) */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col border-r border-slateline/60 bg-charcoal">
        <Brand />
        <NavItems />
        <div className="mt-auto p-4 border-t border-slateline/60">
          <div className="text-[11px] text-mist mb-2">{screenedProperties.length} properties · demo mode</div>
          <button className="btn-ghost w-full text-xs" onClick={resetDemo}>Reset demo data</button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between border-b border-slateline/60 bg-charcoal px-4 py-3">
        <Brand />
        <button className="btn-ghost text-xs" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">Menu</button>
      </div>
      {open && (
        <div className="lg:hidden border-b border-slateline/60 bg-charcoal">
          <NavItems onNavigate={() => setOpen(false)} />
          <div className="p-4"><button className="btn-ghost w-full text-xs" onClick={() => { resetDemo(); setOpen(false) }}>Reset demo data</button></div>
        </div>
      )}

      {/* Content */}
      <main className="lg:pl-64">
        <div key={location.pathname} className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
