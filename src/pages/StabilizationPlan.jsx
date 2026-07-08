import { useParams } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import DealHeader, { DealNotFound } from '../components/DealHeader.jsx'
import { Panel, Stat, Callout, KeyVal, Badge } from '../components/ui.jsx'
import { buildPlan } from '../lib/plan.js'
import { usd, pct, usdSigned, mult } from '../lib/format.js'

const YEAR_TESTS = [
  { yr: 'Year 1', label: 'Survival', desc: 'Fund the plan, hold reserves, no debt breach — low cash-on-cash is fine.' },
  { yr: 'Year 2', label: 'Execution', desc: 'Renovations, turns, lease-up, expense cleanup underway.' },
  { yr: 'Year 3', label: 'Stabilized', desc: 'First stabilized operating year — the real test of the deal.' },
]

export default function StabilizationPlan() {
  const { id } = useParams()
  const { getProperty } = useApp()
  const p = getProperty(id)
  if (!p) return <DealNotFound />
  const d = p.deal
  const plan = buildPlan(p)
  const noiLift = d.stabilizedNOI - d.currentNOI

  return (
    <div>
      <DealHeader p={p} />

      <Callout tone="gold" title="Thesis — timing, not greed">
        We do not require 12% cash-on-cash in Year 1. Year 1–2 fund renovation, turnover, lease-up, vacancy reduction, and management cleanup.
        The test is whether the property hits strong stabilized metrics in <span className="text-stone">Year 3</span> after this 18–24 month plan.
      </Callout>

      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Current NOI" value={usd(d.currentNOI)} sub={`${pct(d.currentCapRate)} on price`} />
        <Stat label="Stabilized NOI" value={usd(d.stabilizedNOI)} sub={`${pct(d.stabilizedCapRate)} on price`} tone="green" />
        <Stat label="NOI lift" value={usdSigned(noiLift)} sub="over the plan" tone="gold" />
        <Stat label="Value created" value={usdSigned(d.valueCreated)} sub="vs. total project cost" tone={d.valueCreated > 0 ? 'green' : 'red'} />
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {YEAR_TESTS.map((y) => (
          <div key={y.yr} className="panel p-4">
            <div className="flex items-center gap-2"><Badge tone={y.yr === 'Year 3' ? 'green' : 'gold'}>{y.yr}</Badge><span className="text-sm font-medium text-stone">{y.label}</span></div>
            <p className="mt-2 text-xs text-mist">{y.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {plan.map((ph, i) => (
            <Panel key={ph.phase}>
              <div className="flex items-center justify-between">
                <div>
                  <span className={`chip border-gold/40 bg-gold/10 text-gold`}>{ph.phase}</span>
                  <h3 className="mt-2 text-stone">{ph.title}</h3>
                </div>
                <span className="grid h-7 w-7 place-items-center rounded-full bg-panel text-xs text-gold">{i + 1}</span>
              </div>
              <ol className="mt-4 space-y-2">
                {ph.actions.map((a, j) => (
                  <li key={j} className="flex gap-3 text-sm text-fog"><span className="text-gold">›</span><span>{a}</span></li>
                ))}
              </ol>
            </Panel>
          ))}
        </div>

        <div className="space-y-6">
          <Panel title="Stabilization targets">
            <KeyVal k="Units renovated" v={`~${Math.round(d.units * 0.6)} of ${d.units}`} />
            <KeyVal k="Rent: current → strike" v={`${usd(d.current.avgRent)} → ${usd(d.strike.avgRent)}`} />
            <KeyVal k="Capex / unit" v={usd(d.capexPerUnit)} />
            <KeyVal k="Target occupancy" v="~93–95%" />
            <KeyVal k="Stabilized DSCR" v={mult(d.stabilizedDSCR)} tone={d.stabilizedDSCR >= 1.4 ? 'green' : 'red'} />
            <KeyVal k="Stabilized CoC" v={pct(d.stabilizedCoC)} tone={d.stabilizedCoC >= 0.12 ? 'green' : 'yellow'} />
          </Panel>
          <Panel title="Sources & uses">
            <KeyVal k="Purchase price" v={usd(d.askingPrice)} />
            <KeyVal k="Capex" v={usd(d.capex)} />
            <KeyVal k="Closing costs" v={usd(d.closingCosts)} />
            <KeyVal k="Reserves" v={usd(d.reserves)} />
            <KeyVal k="Total project cost" v={usd(d.totalProjectCost)} tone="gold" />
            <KeyVal k="Loan (LTV)" v={`${usd(d.loanAmount)} (${pct(d.ltv, 0)})`} />
            <KeyVal k="Equity required" v={usd(d.equity)} />
          </Panel>
        </div>
      </div>
    </div>
  )
}
