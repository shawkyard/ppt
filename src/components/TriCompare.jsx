// The discipline of the app: Current Reality vs Broker Story vs Our Strike Deal,
// never mixed. Renders the three scenarios side by side with provenance tags.
import { usd, pct } from '../lib/format.js'
import { SourceTag } from './ui.jsx'

const COLS = [
  { key: 'current', label: 'Current Reality', tone: 'text-mist', head: 'bg-offwhite', desc: 'What appears true today' },
  { key: 'broker', label: 'Broker Story', tone: 'text-yellow', head: 'bg-yellow/10', desc: 'What the seller wants us to believe' },
  { key: 'strike', label: 'Our Strike Deal', tone: 'text-green', head: 'bg-green/10', desc: 'Our conservative plan' },
]

export default function TriCompare({ p }) {
  const d = p.deal
  const prov = p.provenance || {}
  const rows = [
    { label: 'Avg rent / unit', get: (s) => usd(s.avgRent) },
    { label: 'Occupancy', get: (s) => pct(s.occupancy, 0) },
    { label: 'Other income', get: (s) => usd(s.otherIncome) },
    { label: 'Expense ratio', get: (s) => pct(s.expenseRatio, 0) },
    { label: 'Gross income', get: (s) => usd(s.grossIncome) },
    { label: 'NOI', get: (s) => usd(s.noi), strong: true },
    { label: 'Cap on ask', get: (s) => pct(s.capRateOnAsk) },
    { label: 'Implied value', get: (s) => usd(s.value) },
  ]
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm min-w-[520px]">
        <thead>
          <tr className="border-b border-line">
            <th className="text-left py-2 font-normal text-mist w-40"></th>
            {COLS.map((c) => (
              <th key={c.key} className={`text-right py-2.5 px-3 rounded-t-xl ${c.head}`}>
                <div className={`font-bold ${c.tone} flex items-center justify-end gap-2`}>
                  {c.label}<SourceTag code={prov[c.key]} />
                </div>
                <div className="text-[11px] text-mist font-normal">{c.desc}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className="border-b border-line/40">
              <td className="py-2 text-mist">{r.label}</td>
              {COLS.map((c) => (
                <td key={c.key} className={`py-2 px-3 text-right tnum ${r.strong ? 'font-semibold text-stone' : 'text-fog'}`}>
                  {r.get(d[c.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
