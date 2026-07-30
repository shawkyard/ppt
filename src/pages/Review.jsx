import { useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useApp, useModel } from '../context/AppContext.jsx'
import {
  KEY_FIELDS, SCENARIOS, SCENARIO_LABEL, READY_LABELS, getPath,
} from '../lib/schema.js'
import { money, moneyC, pct, mult, num, fmtByType, parseByType } from '../lib/fmt.js'
import {
  Chip, ProvenanceChip, VerdictPill, GateStatus, Section, Stat, GateBar, EmptyState,
} from '../components/ui.jsx'
import { RISK_REGISTER, TIMELINE } from '../lib/refdata.js'

export default function Review() {
  const { id } = useParams()
  const { getDeal, updateInput } = useApp()
  const deal = getDeal(id)
  const computed = useModel(deal)
  const [scenario, setScenario] = useState('target')

  if (!deal) return <EmptyState title="Deal not found">It may have been deleted. <Link to="/" className="text-gold underline">Back to pipeline</Link></EmptyState>

  const { model, audit, screen } = computed
  const inp = deal.inputs
  const su = model.su
  const t = model.trifecta[scenario]
  const dec = model.decision

  return (
    <div className="space-y-5">
      {/* ---------- header / decision ---------- */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link to="/" className="text-xs text-mist hover:text-white">← Pipeline</Link>
          <h1 className="text-2xl font-semibold text-white mt-1">{inp.propertyName}</h1>
          <p className="text-sm text-mist">{inp.location} · {inp.archetype}</p>
        </div>
        <div className="text-right">
          <VerdictPill tone={dec.tone} big>{dec.verdict}</VerdictPill>
          <div className="text-xs text-mist mt-1.5">{dec.flavor}</div>
        </div>
      </div>

      {/* ---------- headline stats ---------- */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <Stat label="Asking price" value={moneyC(inp.purchasePrice)} sub={`${inp.existingSites} → ${model.scenarios.target.buildout.operatingSites} sites`} />
        <Stat label="Yr-3 Cash-on-Cash" value={pct(model.trifecta.target.coc.value)} tone={model.trifecta.target.coc.status === 'FAIL' ? 'bad' : 'good'} sub={`gate ${pct(inp.gates.minCoC)}`} />
        <Stat label="Yr-3 DSCR" value={mult(model.trifecta.target.dscr.value)} tone={model.trifecta.target.dscr.status === 'FAIL' ? 'bad' : 'good'} sub={`gate ${mult(inp.gates.minDSCR)}`} />
        <Stat label="Yr-3 Cap rate" value={pct(model.trifecta.target.cap.value)} tone={model.trifecta.target.cap.status === 'FAIL' ? 'bad' : 'good'} sub={`gate ${pct(inp.gates.minCap)}`} />
        <Stat label="Max supportable" value={moneyC(model.price.target.recMax)} tone={model.price.target.requiredReduction > 0 ? 'warn' : 'good'} sub={model.price.target.requiredReduction > 0 ? `cut ${pct(model.price.target.discount)}` : 'at/above asking'} />
        <Stat label="Investor IRR (10y)" value={model.returns.investorIRR == null ? '—' : pct(model.returns.investorIRR)} sub={`${mult(model.returns.investorEM)} equity mult`} />
      </div>

      {/* ---------- data quality banner ---------- */}
      <div className="panel px-5 py-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
        <span className="font-medium text-white">Data confidence</span>
        <span className="text-mist"><span className="text-sky-300 font-semibold">{audit.backed}</span> fields sourced from your docs</span>
        <span className="text-mist"><span className="text-gold font-semibold">{audit.assume}</span> using labeled assumptions</span>
        <span className="text-mist">Model checks: <GateStatus status={model.checks.release ? 'PASS' : `${model.checks.fails} OPEN`} /></span>
        {audit.backed === 0 && <Chip tone="warn">No documents parsed — all illustrative defaults</Chip>}
      </div>

      {/* ---------- Destination hard screen ---------- */}
      <ScreenBlock screen={screen} />

      {/* ---------- Trifecta scorecard ---------- */}
      <Section title="Year-3 Trifecta & Destination Strike scorecard" subtitle="Year 3 is the first full stabilized year (Months 25–36). Years 1–2 are the funded buildout period.">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wide text-mist border-b border-slateline/60">
                <th className="py-2 pr-3 font-medium">Metric</th>
                <th className="py-2 px-3 font-medium text-right">Min</th>
                <th className="py-2 px-3 font-medium text-right">Preferred</th>
                <th className="py-2 px-3 font-medium text-right">Current</th>
                <th className="py-2 px-3 font-medium text-right">Seller PF</th>
                <th className="py-2 px-3 font-medium text-right">Target</th>
                <th className="py-2 pl-3 font-medium">Target vs gates</th>
              </tr>
            </thead>
            <tbody>
              <TriRow label="Cash-on-Cash" fmt={pct} min={inp.gates.minCoC} pref={inp.gates.prefCoC}
                cur={model.trifecta.current.coc} pf={model.trifecta.proforma.coc} tg={model.trifecta.target.coc} />
              <TriRow label="DSCR" fmt={mult} min={inp.gates.minDSCR} pref={inp.gates.prefDSCR}
                cur={model.trifecta.current.dscr} pf={model.trifecta.proforma.dscr} tg={model.trifecta.target.dscr} />
              <TriRow label="Stabilized cap rate" fmt={pct} min={inp.gates.minCap} pref={inp.gates.prefCap}
                cur={model.trifecta.current.cap} pf={model.trifecta.proforma.cap} tg={model.trifecta.target.cap} />
            </tbody>
          </table>
        </div>
        <div className="grid sm:grid-cols-3 gap-3 mt-4">
          {SCENARIOS.map((s) => {
            const tr = model.trifecta[s]
            return (
              <div key={s} className="rounded-lg border border-slateline/70 bg-graphite/30 p-3">
                <div className="text-xs text-mist">{SCENARIO_LABEL[s]}</div>
                <div className="mt-1"><VerdictPill tone={tr.strike ? 'strike' : tr.overall === 'FAIL' ? 'reject' : 'pass'}>{tr.overall}</VerdictPill></div>
                <div className="text-[11px] text-mist mt-2">
                  {tr.sites} sites · readiness <GateStatus status={tr.readiness} /> ({tr.readyCount}/9)
                </div>
              </div>
            )
          })}
        </div>
        <p className="text-[11px] text-mist/70 mt-3">
          Destination Strike requires Year-3 CoC ≥ {pct(inp.gates.strikeCoC)}, DSCR ≥ {mult(inp.gates.strikeDSCR)}, cap ≥ {pct(inp.gates.strikeCap)},
          {' '}{inp.gates.strikeSites}+ full-build sites, and all nine destination-readiness tests verified.
        </p>
      </Section>

      {/* ---------- Editable key inputs & assumptions ---------- */}
      <Section title="Key inputs & assumptions" subtitle="Every value shows its source. Edit any field to override — the whole model recomputes instantly and the field is marked verified.">
        <div className="space-y-6">
          {KEY_FIELDS.map((grp) => (
            <div key={grp.group}>
              <div className="label mb-2">{grp.group}</div>
              {grp.scenario ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm min-w-[640px]">
                    <thead>
                      <tr className="text-left text-[11px] uppercase tracking-wide text-mist">
                        <th className="py-1.5 pr-3 font-medium w-1/3">Field</th>
                        {SCENARIOS.map((s) => <th key={s} className="py-1.5 px-2 font-medium">{SCENARIO_LABEL[s]}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {grp.fields.map((f) => (
                        <tr key={f.path} className="border-t border-slateline/40">
                          <td className="py-2 pr-3 text-fog">{f.label}</td>
                          {SCENARIOS.map((s) => {
                            const path = `${f.path}.${s}`
                            return (
                              <td key={s} className="py-2 px-2">
                                <EditField deal={deal} path={path} type={f.type} onCommit={updateInput} />
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
                  {grp.fields.map((f) => (
                    <div key={f.path} className="flex items-center justify-between gap-3 border-b border-slateline/30 py-1.5">
                      <span className="text-fog text-sm">{f.label}</span>
                      <EditField deal={deal} path={f.path} type={f.type} onCommit={updateInput} compact />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* ---------- Assumptions log ---------- */}
      <AssumptionsLog deal={deal} />

      {/* ---------- reported reconciliation ---------- */}
      {deal.info?.length > 0 && (
        <Section title="Reported figures from documents" subtitle="Captured for reconciliation — shown, not force-fed into the model." defaultOpen={false}>
          <div className="grid sm:grid-cols-2 gap-2">
            {deal.info.map((i, idx) => (
              <div key={idx} className="flex items-center justify-between border-b border-slateline/30 py-1.5 text-sm">
                <span className="text-fog">{i.label}</span>
                <span className="tnum text-white">{money(i.value)}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ---------- Buildout & readiness ---------- */}
      <Section title="Destination buildout, site mix & readiness" defaultOpen={false}>
        <BuildoutBlock model={model} inp={inp} />
      </Section>

      {/* ---------- 10-year P&L ---------- */}
      <Section title="10-year property P&L" subtitle="Year 3 highlighted — the first stabilized year. Expansion draws are funded from escrow and shown below NOI (not double-counted in cash flow).">
        <div className="flex gap-1 mb-3">
          {SCENARIOS.map((s) => (
            <button key={s} onClick={() => setScenario(s)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium ${scenario === s ? 'bg-graphite text-white' : 'text-mist hover:text-white'}`}>
              {SCENARIO_LABEL[s]}
            </button>
          ))}
        </div>
        <PnLTable rows={model.scenarios[scenario].pnl} />
      </Section>

      {/* ---------- Sources & Uses ---------- */}
      <Section title="Sources & uses / capital stack" defaultOpen={false}>
        <SourcesUses inp={inp} su={su} />
      </Section>

      {/* ---------- Price correction ---------- */}
      <Section title="Price-correction / Make-It-Work engine" subtitle="Lowest of asking, CoC ceiling, DSCR ceiling, cap-rate ceiling. If the supported Target plan can't pass, reprice — never manipulate assumptions.">
        <PriceBlock model={model} inp={inp} />
      </Section>

      {/* ---------- Debt schedule ---------- */}
      <Section title="10-year debt schedule" defaultOpen={false}>
        <DebtTable rows={model.debt} />
      </Section>

      {/* ---------- Investor returns ---------- */}
      <Section title="Investor syndication returns (illustrative pro-rata)" subtitle="Simplified pro-rata split only — replace with the governing preferred return, catch-up, promote and waterfall from the PPM.">
        <ReturnsBlock r={model.returns} inp={inp} />
      </Section>

      {/* ---------- Sensitivity ---------- */}
      <Section title="Sensitivity & break-even" defaultOpen={false}>
        <SensBlock model={model} />
      </Section>

      {/* ---------- Timeline & risk ---------- */}
      <Section title="36-month execution timeline & risk register" defaultOpen={false}>
        <TimelineRisk />
      </Section>

      {/* ---------- Checks ---------- */}
      <Section title="Model checks & release gate" defaultOpen={false}>
        <ChecksTable checks={model.checks} />
      </Section>
    </div>
  )
}

/* ============================ sub-components ============================ */

const SCREEN_TONE = { QUALIFIED: 'pass', CONDITIONAL: 'reprice', REJECTED: 'reject' }

function ScreenBlock({ screen }) {
  return (
    <div className="panel">
      <div className="panel-hd flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold">Destination hard screen</h3>
          <p className="text-xs text-mist mt-0.5">Fast go/no-go before deep underwriting — jurisdiction gate, scale, expansion, amenities, destination readiness and return potential.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="label">Screen score</div>
            <div className="text-2xl font-semibold tnum text-white leading-none mt-0.5">{screen.score}<span className="text-mist text-sm">/100</span></div>
          </div>
          <VerdictPill tone={SCREEN_TONE[screen.verdict]} big>{screen.verdict}</VerdictPill>
        </div>
      </div>
      <div className="p-5 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Chip tone={screen.jurisdiction.tone === 'good' ? 'good' : screen.jurisdiction.tone === 'bad' ? 'bad' : 'warn'}>
            Jurisdiction: {screen.jurisdiction.state || '—'} · {screen.jurisdiction.status}
          </Chip>
          <span className="text-xs text-mist">{screen.jurisdiction.note}</span>
        </div>
        {screen.rejections.length > 0 && (
          <div className="rounded-lg border border-danger/40 bg-danger/10 px-3 py-2">
            {screen.rejections.map((r, i) => <div key={i} className="text-sm text-danger">✕ {r}</div>)}
          </div>
        )}
        <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1">
          {screen.checks.map((c) => (
            <div key={c.key} className="flex items-center justify-between border-b border-slateline/30 py-1.5 text-sm">
              <span className="flex items-center gap-2">
                <span className={c.ok ? 'text-approve' : c.partial ? 'text-warn' : 'text-danger'}>{c.ok ? '✓' : c.partial ? '~' : '✕'}</span>
                <span className="text-fog">{c.label}</span>
              </span>
              <span className="text-xs text-mist tnum">{c.detail}</span>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-mist/70">
          Jurisdiction statuses are editable defaults requiring documented legal review, effective dates and admin approval before a state is truly Approved — not legal advice.
        </p>
      </div>
    </div>
  )
}

function TriRow({ label, fmt, min, pref, cur, pf, tg }) {
  return (
    <tr className="border-b border-slateline/40">
      <td className="py-2 pr-3 text-fog">{label}</td>
      <td className="py-2 px-3 text-right tnum text-mist">{fmt(min)}</td>
      <td className="py-2 px-3 text-right tnum text-gold">{fmt(pref)}</td>
      <td className="py-2 px-3 text-right tnum"><GateStatus status={cur.status} /> {fmt(cur.value)}</td>
      <td className="py-2 px-3 text-right tnum"><GateStatus status={pf.status} /> {fmt(pf.value)}</td>
      <td className="py-2 px-3 text-right tnum text-white font-medium">{fmt(tg.value)}</td>
      <td className="py-2 pl-3 w-40"><GateBar value={tg.value} min={min} pref={pref} fmt={fmt} /></td>
    </tr>
  )
}

function editValue(type, v) {
  if (v == null) return ''
  if (type === 'pct' || type === 'pct0') return String(+(v * 100).toFixed(3))
  if (type === 'money' || type === 'moneyC' || type === 'int') return String(Math.round(v))
  return String(v)
}

function EditField({ deal, path, type, onCommit, compact }) {
  const value = getPath(deal.inputs, path)
  const source = deal.meta[path]?.source || 'assumption'
  const snippet = deal.meta[path]?.snippet
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')

  function start() { setDraft(editValue(type, value)); setEditing(true) }
  function commit() {
    setEditing(false)
    const parsed = parseByType(type, draft)
    if (parsed !== value) onCommit(deal.id, path, parsed)
  }

  if (editing) {
    return (
      <input autoFocus className="input py-1 text-sm w-28"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); if (e.key === 'Escape') setEditing(false) }} />
    )
  }
  return (
    <button onClick={start} title={snippet ? `From docs: “${snippet}”` : 'Click to edit'}
      className={`group inline-flex items-center gap-2 rounded-md px-2 py-1 hover:bg-graphite/60 ${compact ? '' : 'w-full justify-between'}`}>
      <span className="tnum text-white text-sm">{fmtByType(type, value)}</span>
      <ProvenanceChip source={source} />
    </button>
  )
}

function AssumptionsLog({ deal }) {
  // list every field currently on an illustrative default (assumption)
  const items = useMemo(() => {
    const out = []
    for (const grp of KEY_FIELDS) {
      for (const f of grp.fields) {
        const paths = grp.scenario ? SCENARIOS.map((s) => `${f.path}.${s}`) : [f.path]
        for (const p of paths) {
          const src = deal.meta[p]?.source || 'assumption'
          if (src === 'assumption') {
            const scenarioTag = grp.scenario ? ` · ${SCENARIO_LABEL[p.split('.').pop()]}` : ''
            out.push({ path: p, label: f.label + scenarioTag, value: getPath(deal.inputs, p), type: f.type })
          }
        }
      }
    }
    return out
  }, [deal])

  return (
    <Section title={`Assumptions to verify (${items.length})`} subtitle="These key fields have no document backing — they use the illustrative model default. Verify before investor use." defaultOpen={items.length > 0 && items.length <= 12}>
      {items.length === 0 ? (
        <div className="text-sm text-approve">All key fields are sourced or reviewer-verified.</div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {items.map((i) => (
            <Chip key={i.path} tone="assume">
              {i.label}: <span className="text-white ml-1">{fmtByType(i.type, i.value)}</span>
            </Chip>
          ))}
        </div>
      )}
    </Section>
  )
}

function BuildoutBlock({ model, inp }) {
  const mixKeys = [
    ['longTermPads', 'Long-term RV pads'], ['stdTransient', 'Standard transient pads'],
    ['premium', 'Premium / waterfront'], ['tentGlamp', 'Tent / glamping'],
    ['cabins', 'Cabins'], ['parkModel', 'Park-model / tiny homes'],
    ['groupHomes', 'Group / family homes'], ['storage', 'Storage spaces'],
  ]
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[520px]">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wide text-mist border-b border-slateline/60">
              <th className="py-2 pr-3 font-medium">Accommodation</th>
              {SCENARIOS.map((s) => <th key={s} className="py-2 px-3 font-medium text-right">{SCENARIO_LABEL[s]}</th>)}
            </tr>
          </thead>
          <tbody>
            {mixKeys.map(([k, label]) => (
              <tr key={k} className="border-b border-slateline/40">
                <td className="py-1.5 pr-3 text-fog">{label}</td>
                {SCENARIOS.map((s) => <td key={s} className="py-1.5 px-3 text-right tnum text-white">{inp.mix[k][s]}</td>)}
              </tr>
            ))}
            <tr className="border-b border-slateline/60 font-medium">
              <td className="py-1.5 pr-3 text-white">Operating RV / tent sites</td>
              {SCENARIOS.map((s) => <td key={s} className="py-1.5 px-3 text-right tnum text-gold">{model.scenarios[s].buildout.operatingSites}</td>)}
            </tr>
            <tr>
              <td className="py-1.5 pr-3 text-fog">Year-3 net site revenue</td>
              {SCENARIOS.map((s) => <td key={s} className="py-1.5 px-3 text-right tnum text-white">{moneyC(model.scenarios[s].buildout.netSiteRev)}</td>)}
            </tr>
            <tr>
              <td className="py-1.5 pr-3 text-fog">Year-3 lodging & ancillary</td>
              {SCENARIOS.map((s) => <td key={s} className="py-1.5 px-3 text-right tnum text-white">{moneyC(model.scenarios[s].buildout.lodgingAnc)}</td>)}
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <div className="label mb-2">Destination readiness (evidence required)</div>
        <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1">
          {Object.entries(READY_LABELS).map(([k, label]) => (
            <div key={k} className="flex items-center justify-between text-sm border-b border-slateline/30 py-1">
              <span className="text-fog">{label}</span>
              <div className="flex gap-2">
                {SCENARIOS.map((s) => {
                  const v = inp.ready[k][s]
                  const tone = v === 'Yes' ? 'good' : v === 'Partial' ? 'warn' : 'bad'
                  return <Chip key={s} tone={tone} className="w-16 justify-center">{v}</Chip>
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const PNL_ROWS = [
  ['sites', 'Operating sites', 'int'],
  ['occ', 'Economic occupancy', 'pct'],
  ['rate', 'Monthly rev / site', 'money'],
  ['gpr', 'Gross potential site rev', 'moneyC'],
  ['econLoss', 'Economic loss', 'moneyC'],
  ['netSiteRev', 'Net site revenue', 'moneyC'],
  ['anc', 'Lodging & ancillary', 'moneyC'],
  ['egi', 'Effective gross income', 'moneyC'],
  ['totalOpEx', 'Total operating expenses', 'moneyC'],
  ['expenseRatio', 'Expense ratio', 'pct'],
  ['noi', 'NOI', 'moneyC'],
  ['ds', 'Annual debt service', 'moneyC'],
  ['repl', 'Replacement reserve', 'moneyC'],
  ['draw', 'Expansion draw (escrow)', 'moneyC'],
  ['cfbt', 'Cash flow before tax', 'moneyC'],
  ['dscr', 'DSCR', 'mult'],
  ['coc', 'Cash-on-cash', 'pct'],
  ['capRate', 'Cap rate on price', 'pct'],
  ['yoc', 'Yield on cost', 'pct'],
]

function PnLTable({ rows }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs min-w-[900px]">
        <thead>
          <tr className="text-mist border-b border-slateline/60">
            <th className="py-2 pr-3 text-left font-medium sticky left-0 bg-charcoal">Line item</th>
            {rows.map((r) => (
              <th key={r.year} className={`py-2 px-2 text-right font-medium ${r.year === 3 ? 'text-gold' : ''}`}>Y{r.year}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PNL_ROWS.map(([key, label, type], i) => {
            const emphasize = ['egi', 'noi', 'cfbt'].includes(key)
            return (
              <tr key={key} className={`border-b border-slateline/30 ${emphasize ? 'bg-graphite/30' : ''}`}>
                <td className={`py-1.5 pr-3 sticky left-0 bg-charcoal ${emphasize ? 'text-white font-medium' : 'text-fog'}`}>{label}</td>
                {rows.map((r) => (
                  <td key={r.year} className={`py-1.5 px-2 text-right tnum ${r.year === 3 ? 'text-white bg-gold/5' : emphasize ? 'text-white' : 'text-fog'}`}>
                    {fmtByType(type, r[key])}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function SourcesUses({ inp, su }) {
  const uses = [
    ['Purchase price', su.price], ['Closing costs', su.closing], ['Acquisition fee', su.acqFee],
    ['Financing costs', su.financing], ['Immediate repair escrow', inp.repairEscrow],
    ['Site / expansion escrow', inp.expansionEscrow], ['Destination amenity CapEx', inp.amenityCapex],
    ['Operating reserve', inp.operatingReserve], ['Tax reserve', inp.taxReserve], ['Insurance reserve', inp.insuranceReserve],
  ]
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <div className="label mb-2">Uses</div>
        {uses.map(([l, v]) => (
          <Row key={l} l={l} v={money(v)} />
        ))}
        <Row l="Total uses" v={money(su.uses)} strong />
      </div>
      <div>
        <div className="label mb-2">Sources</div>
        <Row l={`Senior debt (${pct(inp.ltv, 0)} LTV)`} v={money(su.seniorDebt)} />
        <Row l="Total investor cash" v={money(su.totalInvestorCash)} strong />
        <div className="mt-4 space-y-1">
          <Row l="Down payment" v={money(su.downPayment)} />
          <Row l="Annual debt service" v={money(su.annualDebtService)} />
          <Row l="Mortgage constant" v={pct(su.mortgageConstant, 2)} />
          <Row l="Replacement reserve / yr" v={money(su.annualReplacementReserve)} />
          <Row l="Equity per full-build site" v={money(su.equityPerSite)} />
        </div>
      </div>
    </div>
  )
}

function PriceBlock({ model, inp }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm min-w-[560px]">
        <thead>
          <tr className="text-left text-[11px] uppercase tracking-wide text-mist border-b border-slateline/60">
            <th className="py-2 pr-3 font-medium">Price test</th>
            {SCENARIOS.map((s) => <th key={s} className="py-2 px-3 font-medium text-right">{SCENARIO_LABEL[s]}</th>)}
          </tr>
        </thead>
        <tbody>
          {[
            ['Year-3 NOI', 'noi3', money], ['CoC price ceiling', 'cocCeiling', money],
            ['DSCR price ceiling', 'dscrCeiling', money], ['Cap-rate price ceiling', 'capCeiling', money],
            ['Recommended max price', 'recMax', money], ['Required price reduction', 'requiredReduction', money],
            ['Discount to asking', 'discount', (v) => pct(v)],
          ].map(([label, key, fmt], i) => {
            const strong = key === 'recMax'
            return (
              <tr key={key} className={`border-b border-slateline/40 ${strong ? 'bg-graphite/30' : ''}`}>
                <td className={`py-1.5 pr-3 ${strong ? 'text-white font-medium' : 'text-fog'}`}>{label}</td>
                {SCENARIOS.map((s) => (
                  <td key={s} className={`py-1.5 px-3 text-right tnum ${strong ? 'text-gold font-medium' : 'text-white'}`}>{fmt(model.price[s][key])}</td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
      <p className="text-[11px] text-mist/70 mt-3">Asking price {money(inp.purchasePrice)}. Ceilings solve for the minimum {pct(inp.gates.minCoC)} CoC / {mult(inp.gates.minDSCR)} DSCR / {pct(inp.gates.minCap)} cap gates.</p>
    </div>
  )
}

function DebtTable({ rows }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs min-w-[760px]">
        <thead>
          <tr className="text-mist border-b border-slateline/60">
            <th className="py-2 pr-3 text-left font-medium">Line</th>
            {rows.map((r) => <th key={r.year} className="py-2 px-2 text-right font-medium">Y{r.year}</th>)}
          </tr>
        </thead>
        <tbody>
          {[['begin', 'Beginning balance'], ['interest', 'Interest'], ['principal', 'Principal'], ['end', 'Ending balance']].map(([k, l]) => (
            <tr key={k} className="border-b border-slateline/30">
              <td className="py-1.5 pr-3 text-fog">{l}</td>
              {rows.map((r) => <td key={r.year} className="py-1.5 px-2 text-right tnum text-fog">{moneyC(r[k])}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ReturnsBlock({ r, inp }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Investor IRR (10y)" value={r.investorIRR == null ? '—' : pct(r.investorIRR)} />
        <Stat label="Investor equity mult" value={mult(r.investorEM)} />
        <Stat label="Avg annual cash yield" value={pct(r.avgYield)} />
        <Stat label="Project levered IRR" value={r.projectIRR == null ? '—' : pct(r.projectIRR)} />
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="label mb-2">Year-10 exit</div>
          <Row l="Gross sale price" v={money(r.grossSale)} />
          <Row l="Selling costs" v={money(-r.sellCosts)} />
          <Row l="Remaining debt" v={money(-r.remLoan)} />
          <Row l="Net sale proceeds" v={money(r.netSale)} strong />
        </div>
        <div>
          <div className="label mb-2">Year-5 exit snapshot</div>
          <Row l="Year-5 NOI" v={money(r.exit5.noi)} />
          <Row l="Gross sale price" v={money(r.exit5.grossSale)} />
          <Row l="Net sale proceeds" v={money(r.exit5.netSale)} />
          <Row l="Investor 5-yr IRR" v={r.exit5.irr == null ? '—' : pct(r.exit5.irr)} strong />
        </div>
      </div>
      <p className="text-[11px] text-mist/70">Outside investors fund {pct(inp.outsideEquityPct, 0)} of equity and receive {pct(inp.outsideDistPct, 0)} of distributions in this simplified illustration. No preferred return, promote, or waterfall is modeled.</p>
    </div>
  )
}

function SensBlock({ model }) {
  const be = model.breakEven
  return (
    <div className="space-y-5">
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wide text-mist border-b border-slateline/60">
              <th className="py-2 pr-3 font-medium">Case</th>
              <th className="py-2 px-3 font-medium text-right">Price</th>
              <th className="py-2 px-3 font-medium text-right">Yr-3 NOI</th>
              <th className="py-2 px-3 font-medium text-right">CoC</th>
              <th className="py-2 px-3 font-medium text-right">DSCR</th>
              <th className="py-2 px-3 font-medium text-right">Cap</th>
              <th className="py-2 px-3 font-medium text-right">Net sale (Y10)</th>
              <th className="py-2 pl-3 font-medium">Gate</th>
            </tr>
          </thead>
          <tbody>
            {model.sensitivity.map((c) => (
              <tr key={c.name} className={`border-b border-slateline/40 ${c.name === 'Base' ? 'bg-graphite/30' : ''}`}>
                <td className={`py-1.5 pr-3 ${c.name === 'Base' ? 'text-white font-medium' : 'text-fog'}`}>{c.name}</td>
                <td className="py-1.5 px-3 text-right tnum text-fog">{moneyC(c.price)}</td>
                <td className="py-1.5 px-3 text-right tnum text-fog">{moneyC(c.noi)}</td>
                <td className="py-1.5 px-3 text-right tnum text-white">{pct(c.coc)}</td>
                <td className="py-1.5 px-3 text-right tnum text-fog">{mult(c.dscr)}</td>
                <td className="py-1.5 px-3 text-right tnum text-fog">{pct(c.cap)}</td>
                <td className="py-1.5 px-3 text-right tnum text-fog">{moneyC(c.netSale10)}</td>
                <td className="py-1.5 pl-3"><GateStatus status={c.passMin ? 'PASS' : 'FAIL'} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <div className="label mb-2">Base-case break-even (Target plan)</div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1">
          <Row l="Controlling required NOI" v={money(be.controllingNOI)} />
          <Row l="NOI surplus / (gap)" v={money(be.noiGap)} />
          <Row l="Break-even occupancy" v={pct(be.beOcc)} />
          <Row l="Break-even monthly rate" v={money(be.beRate)} />
          <Row l="Max Year-3 operating expenses" v={money(be.maxOpEx)} />
          <Row l="Max destination capital budget" v={money(be.maxCapexBudget)} />
        </div>
      </div>
    </div>
  )
}

function TimelineRisk() {
  return (
    <div className="space-y-5">
      <div>
        <div className="label mb-2">Execution timeline</div>
        <div className="space-y-2">
          {TIMELINE.map((p, i) => (
            <div key={i} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-slateline/30 py-2 text-sm">
              <span className="text-gold font-medium w-28">{p.period}</span>
              <span className="text-white font-medium">{p.phase}</span>
              <span className="text-mist text-xs flex-1 min-w-[240px]">{p.work}</span>
              <span className="tnum text-fog text-xs">{p.budget ? moneyC(p.budget) : '—'}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="label mb-2">Risk register</div>
        <div className="grid md:grid-cols-2 gap-x-6 gap-y-2">
          {RISK_REGISTER.map((r, i) => (
            <div key={i} className="border-b border-slateline/30 py-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-white">{r.risk}</span>
                <Chip tone={r.prob === 'High' ? 'bad' : 'warn'}>{r.prob}</Chip>
              </div>
              <div className="text-xs text-mist mt-0.5">{r.treatment}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ChecksTable({ checks }) {
  return (
    <div className="space-y-1">
      {checks.list.map((c, i) => (
        <div key={i} className="flex items-center justify-between border-b border-slateline/30 py-1.5 text-sm">
          <span className="text-fog">{c.name}</span>
          {c.ok ? <Chip tone="good">OK</Chip> : <span className="flex items-center gap-2"><Chip tone="bad">FAIL</Chip><span className="text-xs text-mist">{c.hint}</span></span>}
        </div>
      ))}
      <div className="pt-2">
        {checks.release
          ? <Chip tone="good">Model calculations passed — {checks.list.length}/{checks.list.length} checks OK</Chip>
          : <Chip tone="warn">{checks.fails} open check{checks.fails === 1 ? '' : 's'} — resolve or disclose before release</Chip>}
      </div>
    </div>
  )
}

function Row({ l, v, strong }) {
  return (
    <div className={`flex items-center justify-between py-1 ${strong ? 'border-t border-slateline/60 mt-1 pt-1.5' : ''}`}>
      <span className={`text-sm ${strong ? 'text-white font-medium' : 'text-fog'}`}>{l}</span>
      <span className={`tnum text-sm ${strong ? 'text-white font-semibold' : 'text-fog'}`}>{v}</span>
    </div>
  )
}
