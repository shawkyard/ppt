import { Routes, Route, NavLink, Link } from 'react-router-dom'
import Pipeline from './pages/Pipeline.jsx'
import Intake from './pages/Intake.jsx'
import Review from './pages/Review.jsx'

function Shell({ children }) {
  const link = ({ isActive }) =>
    `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
      isActive ? 'bg-graphite text-white' : 'text-mist hover:text-white'
    }`
  return (
    <div className="min-h-screen">
      <header className="border-b border-slateline/60 bg-charcoal/80 backdrop-blur sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-5 h-14 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="h-7 w-7 rounded-md bg-gold text-ink font-bold grid place-items-center text-sm">S</span>
            <div className="leading-tight">
              <div className="text-white font-semibold text-sm">Stonebrook RV Underwriter</div>
              <div className="text-[10px] text-mist uppercase tracking-[0.16em]">Destination Trifecta OS</div>
            </div>
          </Link>
          <nav className="flex items-center gap-1">
            <NavLink to="/" end className={link}>Pipeline</NavLink>
            <NavLink to="/new" className={link}>New Deal</NavLink>
          </nav>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-5 py-6">{children}</main>
      <footer className="max-w-7xl mx-auto px-5 py-8 text-[11px] text-mist/70 leading-relaxed border-t border-slateline/40 mt-8">
        Decision model only — not an appraisal, audit, tax, legal, engineering, environmental, lender, or securities opinion.
        Every figure must be re-verified against sourced diligence, CPA review, lender sizing, third-party reports, and securities counsel before any investment or investor use.
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <Shell>
      <Routes>
        <Route path="/" element={<Pipeline />} />
        <Route path="/new" element={<Intake />} />
        <Route path="/deal/:id" element={<Review />} />
      </Routes>
    </Shell>
  )
}
