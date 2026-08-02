import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { NAV } from '../content/site.js'

function Logo({ compact }) {
  return (
    <Link to="/" className="flex items-center gap-2.5 font-serif font-semibold text-ondark" aria-label="Alma Loyalty home">
      <span className="rounded-lg bg-orange text-[#241206] grid place-items-center font-sans font-bold"
            style={{ width: compact ? 26 : 30, height: compact ? 26 : 30 }}>A</span>
      <span className={compact ? 'text-lg' : 'text-xl'}>Alma Loyalty</span>
      {!compact && <span className="hidden xl:inline text-[10px] text-ondarkdim font-sans font-medium self-start mt-1 whitespace-nowrap">Powered by Alma AI OS™</span>}
    </Link>
  )
}

export default function Header() {
  const [open, setOpen] = useState(null) // desktop hovered mega-menu
  const [mobile, setMobile] = useState(false)
  const [acc, setAcc] = useState(null) // mobile accordion
  const loc = useLocation()

  useEffect(() => { setMobile(false); setOpen(null) }, [loc.pathname])

  return (
    <nav className="sticky top-0 z-[60] border-b border-[rgba(220,190,150,0.14)] backdrop-blur"
         style={{ background: 'rgba(27,20,16,0.82)' }}>
      <div className="wrap flex items-center justify-between h-[66px]">
        <Logo />

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1" onMouseLeave={() => setOpen(null)}>
          {NAV.map((item) => (
            <div key={item.label} className="relative" onMouseEnter={() => setOpen(item.label)}>
              <Link to={item.to}
                    className="px-3 py-2 text-sm font-medium text-ondarkmuted hover:text-ondark transition-colors flex items-center gap-1">
                {item.label}
                <span className="text-[9px] text-ondarkdim">▾</span>
              </Link>
              {open === item.label && item.groups && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2">
                  <div className="bg-ink2 border border-[rgba(220,190,150,0.16)] rounded-2xl shadow-warm p-5 flex gap-8"
                       style={{ minWidth: item.groups.length > 1 ? 460 : 260 }}>
                    {item.groups.map((g) => (
                      <div key={g.title} className="min-w-[200px]">
                        <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ondarkdim mb-3">{g.title}</div>
                        <div className="flex flex-col">
                          {g.links.map((l) => (
                            <Link key={l.to} to={l.to}
                                  className="text-sm text-ondarkmuted hover:text-orange py-1.5 transition-colors">
                              {l.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <Link to="/contact" className="hidden xl:inline text-sm font-semibold text-ondarkmuted hover:text-ondark whitespace-nowrap">Book a Strategy Call</Link>
          <Link to="/estimator" className="btn-primary">Estimate Loyalty ROI</Link>
        </div>

        {/* Mobile toggle */}
        <button className="lg:hidden text-ondark text-2xl p-2" aria-label="Toggle menu"
                aria-expanded={mobile} onClick={() => setMobile((v) => !v)}>
          {mobile ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu */}
      {mobile && (
        <div className="lg:hidden border-t border-[rgba(220,190,150,0.14)] bg-ink2 max-h-[80vh] overflow-y-auto">
          <div className="wrap py-4">
            {NAV.map((item) => (
              <div key={item.label} className="border-b border-[rgba(220,190,150,0.1)]">
                <button className="w-full flex items-center justify-between py-3 text-ondark font-medium"
                        aria-expanded={acc === item.label}
                        onClick={() => setAcc(acc === item.label ? null : item.label)}>
                  {item.label}
                  <span className="text-ondarkdim">{acc === item.label ? '−' : '+'}</span>
                </button>
                {acc === item.label && (
                  <div className="pb-3 pl-2">
                    {item.groups.flatMap((g) => g.links).map((l) => (
                      <Link key={l.to} to={l.to} className="block py-2 text-sm text-ondarkmuted hover:text-orange">
                        {l.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="flex flex-col gap-2 mt-4">
              <Link to="/estimator" className="btn-primary w-full">Estimate Loyalty ROI</Link>
              <Link to="/contact" className="btn-outline-dark w-full">Book a Strategy Call</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
