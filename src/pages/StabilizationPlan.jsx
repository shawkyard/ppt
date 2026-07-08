import { useParams } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import DealHeader, { DealNotFound } from '../components/DealHeader.jsx'
import { Panel, Stat, Callout, KeyVal } from '../components/ui.jsx'
import { buildPlan, planTargets } from '../lib/plan.js'
import { usd, pct, usdSigned } from '../lib/format.js'

export default function StabilizationPlan() {
  const { id } = useParams()
  const { getProperty } = useApp()
  const p = getProperty(id)
  if (!p) return <DealNotFound />

  const plan = buildPlan(p)
  const t = planTargets(p)

  return (
    <div>
      <DealHeader p={p} />

      <Callout tone="gold" title="Thesis">
        We do not require 12% cash-on-cash in Year 1. The question is whether this property can BECOME a good deal after a realistic
        18–24 month value-add stabilization. The plan below is how the current pain converts into stabilized NOI.
      </Callout>

      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Current NOI" value={usd(t.currentNOI)} sub={`${pct(t.currentCap)} on price`} />
        <Stat label="Stabilized NOI" value={usd(t.stabilizedNOI)} sub={`${pct(t.stabilizedCap)} on price`} tone="approve" />
        <Stat label="NOI lift" value={usdSigned(t.noiLift)} sub="over the plan" tone="gold" />
        <Stat label="Value created" value={usdSigned(t.valueCreated)} sub="vs. total project cost" tone={t.valueCreated > 0 ? 'approve' : 'danger'} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {plan.map((ph, i) => (
            <Panel key={ph.phase}>
              <div className="flex items-center justify-between">
                <div>
                  <span className="chip border-gold/40 bg-gold/10 text-gold">{ph.phase}</span>
                  <h3 className="mt-2 text-white">{ph.title}</h3>
                </div>
                <span className="text-sm text-mist">{ph.window}</span>
              </div>
              <ol className="mt-4 space-y-2">
                {ph.actions.map((a, j) => (
                  <li key={j} className="flex gap-3 text-sm text-fog">
                    <span className="mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full bg-graphite text-[11px] text-gold">{j + 1}</span>
                    <span>{a}</span>
                  </li>
                ))}
              </ol>
              {i < plan.length - 1 && <div className="mt-4 ml-2.5 h-4 border-l border-slateline/60" />}
            </Panel>
          ))}
        </div>

        <div className="space-y-6">
          <Panel title="Stabilization targets">
            <KeyVal k="Units renovated" v={`~${Math.round(p.deal.units * 0.6)} of ${p.deal.units}`} />
            <KeyVal k="Rent: current → market" v={`${usd(p.deal.currentRent)} → ${usd(p.deal.marketRent)}`} />
            <KeyVal k="Capex / unit" v={usd(p.deal.units ? p.deal.estimatedCapex / p.deal.units : 0)} />
            <KeyVal k="Target occupancy" v="~95%" />
            <KeyVal k="Exit cap" v={pct(p.deal.exitCapRate)} />
            <KeyVal k="Stabilized value" v={usd(p.deal.stabilizedValue)} tone="approve" />
          </Panel>
          <Callout tone="mist" title="Timeline">
            Renovate on natural turnover to avoid forced vacancy. Stabilization completes inside 24 months; the refi/hold/sale decision is made once trailing stabilized NOI is proven.
          </Callout>
        </div>
      </div>
    </div>
  )
}
