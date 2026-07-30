import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import { runModel, assumptionCount } from '../lib/model.js'
import { runScreen } from '../lib/screen.js'
import { pct, mult, moneyC } from '../lib/fmt.js'
import { VerdictPill, GateStatus, Chip, EmptyState } from '../components/ui.jsx'

const VERDICT_ORDER = { 'PASS': 0, 'CONDITIONAL PASS': 1, 'REPRICE': 2, 'REJECT': 3 }

export default function Pipeline() {
  const { deals, removeDeal } = useApp()
  const [sort, setSort] = useState('recent')
  const [q, setQ] = useState('')

  const rows = useMemo(() => {
    return deals.map((d) => {
      const m = runModel(d.inputs)
      const audit = assumptionCount(d.meta)
      const screen = runScreen(d.inputs, m)
      const t3 = m.trifecta.target
      return {
        id: d.id,
        name: d.name,
        createdAt: d.createdAt,
        price: d.inputs.purchasePrice,
        sites: t3.sites,
        screen,
        verdict: m.decision,
        coc: t3.coc,
        dscr: t3.dscr,
        cap: t3.cap,
        strike: t3.strike,
        recMax: m.price.target.recMax,
        assume: audit.assume,
        backed: audit.backed,
      }
    })
  }, [deals])

  const filtered = useMemo(() => {
    let r = rows
    if (q.trim()) r = r.filter((x) => x.name.toLowerCase().includes(q.toLowerCase()))
    const sorted = [...r]
    if (sort === 'recent') sorted.sort((a, b) => b.createdAt - a.createdAt)
    else if (sort === 'verdict') sorted.sort((a, b) => (VERDICT_ORDER[a.verdict.verdict] - VERDICT_ORDER[b.verdict.verdict]) || (b.coc.value - a.coc.value))
    else if (sort === 'coc') sorted.sort((a, b) => b.coc.value - a.coc.value)
    return sorted
  }, [rows, q, sort])

  const counts = useMemo(() => {
    const c = { PASS: 0, 'CONDITIONAL PASS': 0, REPRICE: 0, REJECT: 0 }
    rows.forEach((r) => { c[r.verdict.verdict] = (c[r.verdict.verdict] || 0) + 1 })
    return c
  }, [rows])

  if (deals.length === 0) {
    return (
      <EmptyState title="No deals underwritten yet">
        Screen your first RV park in under a minute. <Link to="/new" className="text-gold underline">Start a new deal →</Link>
      </EmptyState>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-white">Deal pipeline</h1>
          <p className="text-sm text-mist mt-1">{rows.length} park{rows.length === 1 ? '' : 's'} screened. Click any row for the full investor-ready package.</p>
        </div>
        <Link to="/new" className="btn-gold">+ New deal</Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <SummaryCard label="Pass" value={counts.PASS} tone="pass" />
        <SummaryCard label="Conditional" value={counts['CONDITIONAL PASS']} tone="pass" />
        <SummaryCard label="Reprice" value={counts.REPRICE} tone="reprice" />
        <SummaryCard label="Reject" value={counts.REJECT} tone="reject" />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input className="input max-w-xs" placeholder="Search parks…" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="flex items-center gap-1 text-xs">
          <span className="text-mist mr-1">Sort:</span>
          {[['recent', 'Recent'], ['verdict', 'Decision'], ['coc', 'Yr-3 CoC']].map(([k, l]) => (
            <button key={k} onClick={() => setSort(k)}
              className={`px-2.5 py-1 rounded-md ${sort === k ? 'bg-graphite text-white' : 'text-mist hover:text-white'}`}>{l}</button>
          ))}
        </div>
      </div>

      <div className="panel overflow-x-auto">
        <table className="w-full text-sm min-w-[860px]">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wide text-mist border-b border-slateline/60">
              <th className="px-4 py-3 font-medium">Park</th>
              <th className="px-3 py-3 font-medium">Screen</th>
              <th className="px-3 py-3 font-medium">Decision</th>
              <th className="px-3 py-3 font-medium text-right">Price</th>
              <th className="px-3 py-3 font-medium text-right">Sites</th>
              <th className="px-3 py-3 font-medium text-right">Yr-3 CoC</th>
              <th className="px-3 py-3 font-medium text-right">DSCR</th>
              <th className="px-3 py-3 font-medium text-right">Cap</th>
              <th className="px-3 py-3 font-medium text-right">Max price</th>
              <th className="px-3 py-3 font-medium">Evidence</th>
              <th className="px-2 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-b border-slateline/40 hover:bg-graphite/40 transition-colors">
                <td className="px-4 py-3">
                  <Link to={`/deal/${r.id}`} className="text-white font-medium hover:text-gold">{r.name}</Link>
                </td>
                <td className="px-3 py-3">
                  <span title={`Screen score ${r.screen.score}/100 · ${r.screen.jurisdiction.state || 'no state'}`}>
                    <VerdictPill tone={r.screen.verdict === 'QUALIFIED' ? 'pass' : r.screen.verdict === 'REJECTED' ? 'reject' : 'reprice'}>
                      {r.screen.verdict === 'QUALIFIED' ? 'QUAL' : r.screen.verdict === 'CONDITIONAL' ? 'COND' : 'REJ'} {r.screen.score}
                    </VerdictPill>
                  </span>
                </td>
                <td className="px-3 py-3">
                  <VerdictPill tone={r.verdict.tone}>{r.strike ? 'STRIKE' : r.verdict.verdict}</VerdictPill>
                </td>
                <td className="px-3 py-3 text-right tnum text-fog">{moneyC(r.price)}</td>
                <td className="px-3 py-3 text-right tnum text-fog">{r.sites}</td>
                <td className="px-3 py-3 text-right tnum"><GateStatus status={r.coc.status} /> <span className="text-fog ml-1">{pct(r.coc.value)}</span></td>
                <td className="px-3 py-3 text-right tnum text-fog">{mult(r.dscr.value)}</td>
                <td className="px-3 py-3 text-right tnum text-fog">{pct(r.cap.value)}</td>
                <td className="px-3 py-3 text-right tnum text-fog">{moneyC(r.recMax)}</td>
                <td className="px-3 py-3">
                  <Chip tone={r.backed > 0 ? 'info' : 'assume'}>{r.backed} sourced · {r.assume} assumed</Chip>
                </td>
                <td className="px-2 py-3 text-right">
                  <button onClick={() => { if (confirm(`Delete ${r.name}?`)) removeDeal(r.id) }}
                    className="text-mist hover:text-danger text-xs">✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function SummaryCard({ label, value, tone }) {
  const c = tone === 'pass' ? 'text-approve' : tone === 'reprice' ? 'text-warn' : tone === 'reject' ? 'text-danger' : 'text-white'
  return (
    <div className="panel px-4 py-3">
      <div className="label">{label}</div>
      <div className={`text-2xl font-semibold tnum mt-1 ${c}`}>{value}</div>
    </div>
  )
}
