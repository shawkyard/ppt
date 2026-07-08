import { NavLink } from 'react-router-dom'

const TABS = [
  { seg: '', label: 'Deal Detail', end: true },
  { seg: 'plan', label: '24-Month Plan' },
  { seg: 'offer', label: 'Offer / Price' },
  { seg: 'risk', label: 'Risk Register' },
  { seg: 'questions', label: 'Broker Questions' },
  { seg: 'summary', label: 'Investor Summary' },
]

export default function DealTabs({ id }) {
  return (
    <div className="mb-6 -mx-1 flex gap-1 overflow-x-auto border-b border-slateline/60">
      {TABS.map((t) => (
        <NavLink
          key={t.seg}
          end={t.end}
          to={`/deal/${id}${t.seg ? `/${t.seg}` : ''}`}
          className={({ isActive }) =>
            `whitespace-nowrap px-3 py-2.5 text-sm border-b-2 -mb-px transition-colors ${
              isActive ? 'border-gold text-white' : 'border-transparent text-mist hover:text-white'
            }`
          }
        >
          {t.label}
        </NavLink>
      ))}
    </div>
  )
}
