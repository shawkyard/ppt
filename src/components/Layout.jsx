import { useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import Icon from './Icon.jsx'

const NAV_GROUPS = [
  { title: 'Command', items: [
    { to: '/', label: 'Dashboard', end: true, icon: 'home' },
    { to: '/map', label: 'Map Command Center', icon: 'map' },
    { to: '/markets', label: 'Market Gate', icon: 'gate' },
    { to: '/layers', label: 'Market Layer Manager', icon: 'layers' },
  ]},
  { title: 'Sourcing', items: [
    { to: '/sourcing', label: 'Deal Sourcing Queue', icon: 'queue' },
    { to: '/add', label: 'Add Property', icon: 'plus' },
    { to: '/upload', label: 'Upload OM / RR / T12', icon: 'upload' },
    { to: '/scratch', label: 'Scratch Screen', icon: 'bolt' },
    { to: '/motivated', label: 'Motivated Sellers', icon: 'target' },
  ]},
  { title: 'Deal Room', items: [
    { to: '/reports', label: 'Report Builder', icon: 'doc' },
    { to: '/settings', label: 'Settings', icon: 'gear' },
  ]},
]

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-3 px-5 py-5">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold shadow-pop">
        <svg viewBox="0 0 32 32" className="h-5 w-5">
          <path d="M6 22V13l10-6 10 6v9" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinejoin="round" />
          <rect x="12" y="16" width="3.5" height="6" fill="#FFFFFF" />
          <rect x="17" y="16" width="3.5" height="6" fill="#FFFFFF" opacity="0.7" />
        </svg>
      </span>
      <span className="leading-tight">
        <span className="block text-[15px] font-extrabold text-stone">Stonebrook</span>
        <span className="block text-[10px] tracking-[0.2em] text-gold font-bold uppercase">Deal Scout</span>
      </span>
    </Link>
  )
}

function NavItems({ onNavigate }) {
  return (
    <nav className="px-3 py-2 space-y-4">
      {NAV_GROUPS.map((g) => (
        <div key={g.title}>
          <div className="px-3 pb-1 text-[10px] uppercase tracking-[0.16em] text-mist/70">{g.title}</div>
          <div className="space-y-0.5">
            {g.items.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.end} onClick={onNavigate}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-semibold transition-all ${
                    isActive ? 'bg-softorange text-gold' : 'text-fog hover:text-stone hover:bg-offwhite'
                  }`}>
                <Icon name={n.icon} className="w-[18px] h-[18px]" />{n.label}
              </NavLink>
            ))}
          </div>
        </div>
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
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col border-r border-line bg-charcoal overflow-y-auto no-print">
        <Brand />
        <NavItems />
        <div className="mt-auto p-4 border-t border-line">
          <div className="text-[11px] text-mist mb-2">{screenedProperties.length} deals · demo mode</div>
          <button className="btn-ghost w-full text-xs" onClick={resetDemo}>Reset demo data</button>
        </div>
      </aside>

      <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between border-b border-line bg-charcoal px-4 py-2 no-print">
        <Brand />
        <button className="btn-ghost text-xs" onClick={() => setOpen((v) => !v)}>Menu</button>
      </div>
      {open && (
        <div className="lg:hidden border-b border-line bg-charcoal no-print">
          <NavItems onNavigate={() => setOpen(false)} />
        </div>
      )}

      <main className="lg:pl-64">
        <div key={location.pathname} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
