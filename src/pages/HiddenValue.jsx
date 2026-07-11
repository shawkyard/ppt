import { useState, useMemo } from 'react'
import {
  scoreHiddenValue, hiddenValueVerdict, CONTROL_METHODS, ADU_MIN_LOT_SQFT, SEVENTY_RULE,
} from '../lib/hiddenValue.js'
import { usd, usdSigned, pct, num } from '../lib/format.js'
import {
  PageHeader, Panel, Field, ScoreRing, Badge, WeightBar, KeyVal, Callout,
} from '../components/ui.jsx'

// A realistic Ogden starter so the page reads live on first load.
const EXAMPLE = {
  address: '25xx Jefferson Ave, Ogden',
  purchase: 210000,
  arv: 400000,
  rehab: 55000,
  holdingCosts: 9000,
  buyClosingPct: 0.02,
  sellClosingPct: 0.07,
  lotSqft: 11000,
  zoneMinLotSqft: 5000,
  unfinishedBasementSqft: 800,
  finishCostPerSqft: 55,
  aduMonthlyRent: 1200,
  currentRent: 1400,
  marketRent: 1800,
  extraLotValue: 90000,
  controlMethod: 'direct',
  capitalIn: 108000,
}

function NumberField({ label, k, value, onChange, help, prefix, step = 1 }) {
  return (
    <Field label={label} help={help}>
      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mist text-sm">{prefix}</span>
        )}
        <input
          type="number"
          className={`input tnum ${prefix ? 'pl-7' : ''}`}
          value={value ?? ''}
          step={step}
          onChange={(e) => onChange(k, e.target.value === '' ? '' : Number(e.target.value))}
        />
      </div>
    </Field>
  )
}

function LeverCard({ title, eligible, statute, value, children }) {
  return (
    <div className={`rounded-lg border p-4 ${eligible ? 'border-approve/40 bg-approve/5' : 'border-slateline bg-graphite/40'}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-white">{title}</div>
          <div className="text-[11px] text-mist">{statute}</div>
        </div>
        <Badge tone={eligible ? 'approve' : 'mist'}>{eligible ? 'Eligible' : 'No'}</Badge>
      </div>
      <div className="mt-3 text-sm text-fog space-y-1">{children}</div>
      {eligible && value > 0 && (
        <div className="mt-3 border-t border-slateline/60 pt-2 flex items-center justify-between">
          <span className="text-xs text-mist">Est. value created</span>
          <span className="tnum text-approve font-semibold">{usd(value)}</span>
        </div>
      )}
    </div>
  )
}

export default function HiddenValue() {
  const [i, setI] = useState(EXAMPLE)
  const set = (k, v) => setI((prev) => ({ ...prev, [k]: v }))

  const r = useMemo(() => scoreHiddenValue(i), [i])
  const verdict = hiddenValueVerdict(r.score)
  const control = CONTROL_METHODS.find((c) => c.key === i.controlMethod) || CONTROL_METHODS[0]
  const { flip, adu, lot, rent } = r

  return (
    <div>
      <PageHeader
        title="Hidden Value Finder"
        subtitle="Screen a single-family or small-multifamily lead for buried upside before you underwrite. Flip margin + Utah's by-right value levers (basement ADU, lot split, below-market rent). Screening estimates only — not an appraisal or legal advice."
      >
        <button className="btn-ghost" onClick={() => setI(EXAMPLE)}>Reset example</button>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Inputs */}
        <div className="lg:col-span-2 space-y-6">
          <Panel title="The deal">
            <Field label="Address / label" className="mb-4">
              <input className="input" value={i.address || ''} onChange={(e) => set('address', e.target.value)} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <NumberField label="Purchase price" k="purchase" prefix="$" value={i.purchase} onChange={set} step={1000} />
              <NumberField label="ARV (after-repair value)" k="arv" prefix="$" value={i.arv} onChange={set} step={1000} />
              <NumberField label="Rehab budget" k="rehab" prefix="$" value={i.rehab} onChange={set} step={1000} />
              <NumberField label="Holding costs" k="holdingCosts" prefix="$" value={i.holdingCosts} onChange={set} step={500}
                help="Taxes, insurance, utilities, loan interest during the hold." />
              <NumberField label="Buy closing %" k="buyClosingPct" value={i.buyClosingPct} onChange={set} step={0.005} />
              <NumberField label="Sell closing %" k="sellClosingPct" value={i.sellClosingPct} onChange={set} step={0.005}
                help="Commissions + seller closing costs on resale." />
            </div>
          </Panel>

          <Panel title="Value levers">
            <div className="grid grid-cols-2 gap-4">
              <NumberField label="Lot size (sqft)" k="lotSqft" value={i.lotSqft} onChange={set} step={500}
                help={`Internal ADU can be barred at/below ${num(ADU_MIN_LOT_SQFT)} sf.`} />
              <NumberField label="Zone min lot (sqft)" k="zoneMinLotSqft" value={i.zoneMinLotSqft} onChange={set} step={500}
                help="From the city's zoning. Split needs ~2x this." />
              <NumberField label="Unfinished basement (sqft)" k="unfinishedBasementSqft" value={i.unfinishedBasementSqft} onChange={set} step={50} />
              <NumberField label="Finish cost $/sqft" k="finishCostPerSqft" prefix="$" value={i.finishCostPerSqft} onChange={set} />
              <NumberField label="ADU rent (mo)" k="aduMonthlyRent" prefix="$" value={i.aduMonthlyRent} onChange={set} step={50} />
              <NumberField label="Est. extra lot value" k="extraLotValue" prefix="$" value={i.extraLotValue} onChange={set} step={1000}
                help="Resale value of the created buildable lot." />
              <NumberField label="In-place rent (mo)" k="currentRent" prefix="$" value={i.currentRent} onChange={set} step={25}
                help="Rental / BRRRR / multifamily. Leave 0 for a pure flip." />
              <NumberField label="Market rent (mo)" k="marketRent" prefix="$" value={i.marketRent} onChange={set} step={25} />
            </div>
          </Panel>

          <Panel title="Control method">
            <Field label="How are you controlling it?" help={control.mechanic}>
              <select className="input" value={i.controlMethod} onChange={(e) => set('controlMethod', e.target.value)}>
                {CONTROL_METHODS.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
              </select>
            </Field>
            <div className="mt-4">
              <NumberField label="Capital in" k="capitalIn" prefix="$" value={i.capitalIn} onChange={set} step={1000}
                help="Cash you actually put up (down + rehab, option fee, note discount…)." />
            </div>
          </Panel>
        </div>

        {/* Results */}
        <div className="lg:col-span-3 space-y-6">
          <Panel title="Hidden value read">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <ScoreRing score={r.score} tone={verdict.tone} size={128} label="/ 100" />
              <div className="flex-1 text-center sm:text-left">
                <Badge tone={verdict.tone}>{verdict.label}</Badge>
                {i.address && <h3 className="mt-3 text-white">{i.address}</h3>}
                <p className="mt-2 text-sm text-mist">
                  Flip profit <span className={`tnum font-semibold ${flip.profit >= 0 ? 'text-approve' : 'text-danger'}`}>{usdSigned(flip.profit)}</span>
                  {' · '}margin <span className="tnum text-white">{pct(flip.marginPct)}</span>
                  {r.holdValueCreated > 0 && <> · hold-path adds <span className="tnum text-approve">{usd(r.holdValueCreated)}</span></>}
                </p>
              </div>
            </div>
            <div className="mt-5">
              <Callout tone={flip.passesRule ? 'approve' : 'danger'} title={`70% rule · max offer ${usd(flip.mao)}`}>
                {flip.passesRule
                  ? `Purchase is ${usd(flip.maoGap)} under the ${pct(SEVENTY_RULE, 0)}-of-ARV-less-rehab line. The buy has margin.`
                  : `Purchase is ${usd(Math.abs(flip.maoGap))} OVER the max allowable offer. On a flip, the deal is made on the buy — renegotiate or pass.`}
              </Callout>
            </div>
          </Panel>

          <div className="grid gap-4 sm:grid-cols-3">
            <LeverCard title="Basement ADU" statute="By right — HB 82" eligible={adu.eligible} value={adu.addedValue}>
              {adu.eligible ? (
                <>
                  <div>{num(adu.unfinished)} sf to finish · ~{usd(adu.finishCost)}</div>
                  <div>Adds {usd(adu.annualRent)}/yr rent</div>
                </>
              ) : (
                <div>{!adu.lotOk ? `Lot ≤ ${num(ADU_MIN_LOT_SQFT)} sf — city may bar it.` : 'No unfinished basement entered.'}</div>
              )}
            </LeverCard>

            <LeverCard title="Lot split" statute="Ministerial — SB 174" eligible={lot.eligible} value={lot.extraLotValue}>
              {lot.eligible ? (
                <>
                  <div>Fits ~{lot.potentialLots} lots at zone min</div>
                  <div>{num(lot.surplus)} sf surplus land</div>
                </>
              ) : (
                <div>Lot under ~2x the zone minimum — no split.</div>
              )}
            </LeverCard>

            <LeverCard title="Rent upside" statute="Below-market / BRRRR" eligible={rent.gapPct > 0} value={0}>
              {rent.gapPct > 0 ? (
                <>
                  <div className="tnum text-approve font-semibold">{pct(rent.gapPct)} under market</div>
                  <div>{usd(rent.gapPerUnit)}/mo per unit gap</div>
                </>
              ) : (
                <div>At or above market — no rent lever.</div>
              )}
            </LeverCard>
          </div>

          <Panel title="Score breakdown">
            {r.breakdown.map((b) => (
              <WeightBar key={b.key} label={b.label} points={b.points} weight={b.weight} help={b.help} />
            ))}
          </Panel>

          <Panel title="Numbers">
            <KeyVal k="ARV" v={usd(flip.arv)} />
            <KeyVal k="All-in cost" v={usd(flip.allIn)} />
            <KeyVal k="Flip profit" v={usdSigned(flip.profit)} tone={flip.profit >= 0 ? 'approve' : 'danger'} />
            <KeyVal k="Margin on ARV" v={pct(flip.marginPct)} />
            <KeyVal k="Return on cash in" v={pct(flip.roiPct)} />
            <KeyVal k="Max allowable offer (70%)" v={usd(flip.mao)} />
            <KeyVal k={`Control · ${control.label}`} v={usd(i.capitalIn)} />
          </Panel>
        </div>
      </div>
    </div>
  )
}
