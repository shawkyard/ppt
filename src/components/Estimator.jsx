import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Confidence } from './Shared.jsx'
import { Arrow } from './ui.jsx'

const money = (n) => (n < 0 ? '−' : '') + '$' + Math.round(Math.abs(n)).toLocaleString()
const moneyK = (n) => {
  const a = Math.abs(n), s = n < 0 ? '−' : ''
  if (a >= 1e6) return s + '$' + (a / 1e6).toFixed(a >= 1e7 ? 0 : 1) + 'M'
  if (a >= 1e3) return s + '$' + (a / 1e3).toFixed(a >= 1e4 ? 0 : 1) + 'k'
  return s + '$' + Math.round(a)
}

const SCEN = { con: 0.6, exp: 1.0, up: 1.45 }

function scenarioNet(v, mult) {
  const activeMembers = v.customers * v.enroll * v.active
  const memberVisits = activeMembers * v.freq
  const extraVisits = memberVisits * (v.freqLift * mult)
  const liftedAOV = v.aov * (1 + v.aovLift * mult)
  const incrRevenue = extraVisits * liftedAOV + memberVisits * v.aov * (v.aovLift * mult)
  const incrGP = incrRevenue * v.margin
  const memberRev = (memberVisits + extraVisits) * liftedAOV
  const rewardCost = memberRev * v.reward
  const net = incrGP - rewardCost - v.opex
  return { activeMembers, incrRevenue, incrGP, rewardCost, net }
}

function Slider({ id, label, hint, min, max, step, value, onChange, display }) {
  const p = ((value - min) / (max - min)) * 100
  return (
    <div className="mb-5">
      <div className="flex justify-between items-baseline gap-3 mb-2.5">
        <label htmlFor={id} className="text-sm font-semibold text-onlight">{label}</label>
        <span className="font-serif font-semibold text-base text-orange whitespace-nowrap">{display}</span>
      </div>
      <input id={id} type="range" className="rng" min={min} max={max} step={step} value={value}
             style={{ '--p': `${p}%` }} onChange={(e) => onChange(parseFloat(e.target.value))}
             aria-describedby={`${id}-hint`} />
      <div id={`${id}-hint`} className="text-xs text-onlightmuted mt-2">{hint}</div>
    </div>
  )
}

export default function Estimator() {
  const [customers, setCustomers] = useState(12000)
  const [aov, setAov] = useState(48)
  const [freq, setFreq] = useState(1.4)
  const [margin, setMargin] = useState(45)
  const [enroll, setEnroll] = useState(35)
  const [active, setActive] = useState(55)
  const [freqlift, setFreqlift] = useState(18)
  const [aovlift, setAovlift] = useState(9)
  const [reward, setReward] = useState(6)
  const [opex, setOpex] = useState(4500)
  const [adv, setAdv] = useState(false)

  const r = useMemo(() => {
    const v = {
      customers, aov, freq, margin: margin / 100, enroll: enroll / 100, active: active / 100,
      freqLift: freqlift / 100, aovLift: aovlift / 100, reward: reward / 100, opex,
    }
    const con = scenarioNet(v, SCEN.con)
    const exp = scenarioNet(v, SCEN.exp)
    const up = scenarioNet(v, SCEN.up)
    const totalCost = exp.rewardCost + opex
    const roi = totalCost > 0 ? (exp.net / totalCost) * 100 : 0
    const roiCon = (con.rewardCost + opex) > 0 ? (con.net / (con.rewardCost + opex)) * 100 : 0
    const roiUp = (up.rewardCost + opex) > 0 ? (up.net / (up.rewardCost + opex)) * 100 : 0
    let payback = '—'
    if (exp.net > 0) {
      const m = totalCost / exp.net
      payback = m < 1 ? `${Math.max(1, Math.round(m * 30))} days` : `${m.toFixed(1)} mo`
    }
    let breakeven = '—'
    const contribPerActive = exp.activeMembers > 0 ? (exp.incrGP - exp.rewardCost) / exp.activeMembers : 0
    if (contribPerActive > 0) {
      const be = opex / contribPerActive
      breakeven = be >= 1000 ? `${(be / 1000).toFixed(1)}k` : Math.round(be).toLocaleString()
    }
    return { con, exp, up, totalCost, roi, roiCon, roiUp, payback, breakeven }
  }, [customers, aov, freq, margin, enroll, active, freqlift, aovlift, reward, opex])

  return (
    <div className="grid lg:grid-cols-[1fr_1.02fr] gap-6 items-start">
      {/* Inputs */}
      <div className="bg-cream border border-brownline/25 rounded-2xl p-8">
        <div className="font-serif text-xl font-semibold flex items-center gap-2.5">Your business</div>
        <p className="text-[13.5px] text-onlightmuted mb-6">Monthly figures. Move a slider or use your real numbers.</p>

        <div className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-orange mb-3.5">The business today</div>
        <Slider id="customers" label="Active customers / month" hint="Unique paying customers you serve in a typical month."
                min={500} max={100000} step={500} value={customers} onChange={setCustomers} display={customers.toLocaleString()} />
        <Slider id="aov" label="Average order value" hint="Average amount a customer spends per transaction."
                min={5} max={500} step={1} value={aov} onChange={setAov} display={`$${aov}`} />
        <Slider id="freq" label="Purchases / customer / month" hint="How often the average customer buys each month."
                min={0.5} max={12} step={0.1} value={freq} onChange={setFreq} display={freq.toFixed(1)} />
        <Slider id="margin" label="Gross margin" hint="Profit left after cost of goods. Loyalty ROI is judged on profit, not revenue."
                min={10} max={90} step={1} value={margin} onChange={setMargin} display={`${margin}%`} />

        <div className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-orange mb-3.5 mt-6 pt-4 border-t border-dashed border-brownline/40">The program</div>
        <Slider id="enroll" label="Enrollment rate" hint="Share of customers who join the program."
                min={5} max={90} step={1} value={enroll} onChange={setEnroll} display={`${enroll}%`} />
        <Slider id="active" label="Active-member rate" hint="Of those enrolled, the share who actually participate. Only active members drive the lift."
                min={10} max={95} step={1} value={active} onChange={setActive} display={`${active}%`} />
        <Slider id="freqlift" label="Frequency lift (active members)" hint="Incremental increase in how often active members buy."
                min={0} max={60} step={1} value={freqlift} onChange={setFreqlift} display={`${freqlift}%`} />
        <Slider id="aovlift" label="AOV lift (active members)" hint="Incremental increase in basket size per active-member visit."
                min={0} max={40} step={1} value={aovlift} onChange={setAovlift} display={`${aovlift}%`} />

        <button className="mt-1.5 bg-transparent border border-dashed border-brownline/40 text-onlightmuted font-sans font-semibold text-[13px] px-4 py-3 rounded-[9px] cursor-pointer w-full transition-colors hover:border-orange hover:text-orange"
                aria-expanded={adv} onClick={() => setAdv((v) => !v)}>
          {adv ? '− Hide program costs' : '＋ Advanced: program costs'}
        </button>
        {adv && (
          <div className="mt-5">
            <Slider id="reward" label="Reward & redemption cost" hint="Cost of points, discounts, and perks as a % of member sales."
                    min={0} max={20} step={0.5} value={reward} onChange={setReward} display={`${reward}%`} />
            <Slider id="opex" label="Technology & operating cost / month" hint="Platform, implementation (amortized), staffing, and service."
                    min={0} max={50000} step={500} value={opex} onChange={setOpex} display={`$${opex.toLocaleString()}`} />
          </div>
        )}
      </div>

      {/* Results */}
      <div className="bg-ink border border-brownline/40 rounded-2xl p-8 shadow-warm lg:sticky lg:top-[84px]">
        <div className="text-center pb-5 border-b border-[rgba(220,190,150,0.14)] mb-5">
          <div className="font-sans text-[11.5px] font-bold uppercase tracking-[0.16em] text-ondarkdim">Estimated ROI — expected scenario</div>
          <div className="font-serif font-semibold text-[clamp(40px,7vw,58px)] leading-none text-orange my-2">
            {r.roi >= 0 ? '+' : ''}{Math.round(r.roi)}%
          </div>
          <div className="text-sm text-ondarkmuted">range {Math.round(r.roiCon)}% to {Math.round(r.roiUp)}% (conservative → upside)</div>
        </div>

        <div className="grid grid-cols-3 gap-2.5 mb-5">
          {[
            { lbl: 'Conservative', v: r.con.net, exp: false },
            { lbl: 'Expected', v: r.exp.net, exp: true },
            { lbl: 'Upside', v: r.up.net, exp: false },
          ].map((s) => (
            <div key={s.lbl} className={`rounded-[10px] p-3.5 text-center border ${s.exp ? 'border-orange' : 'border-[rgba(220,190,150,0.14)] bg-ink3'}`}
                 style={s.exp ? { background: 'rgba(221,106,43,0.12)' } : undefined}>
              <div className={`font-sans text-[10.5px] font-bold uppercase tracking-[0.1em] ${s.exp ? 'text-orange' : 'text-ondarkdim'}`}>{s.lbl}</div>
              <div className="font-serif font-semibold text-[19px] mt-1.5 text-ondark">{moneyK(s.v)}</div>
              <div className="text-[11px] text-ondarkdim mt-0.5">net / mo</div>
            </div>
          ))}
        </div>

        {[
          { k: 'Incremental revenue / mo', v: money(r.exp.incrRevenue), cls: 'text-ondark' },
          { k: 'Incremental gross profit / mo', v: '+' + money(r.exp.incrGP), cls: 'text-orange' },
          { k: '− Reward & redemption cost', v: '−' + money(r.exp.rewardCost), cls: 'text-ondark' },
          { k: '− Technology & operating cost', v: '−' + money(opex), cls: 'text-ondark' },
        ].map((row) => (
          <div key={row.k} className="flex justify-between items-center py-2.5 border-b border-dashed border-[rgba(220,190,150,0.14)] text-[14.5px]">
            <span className="text-ondarkmuted">{row.k}</span>
            <span className={`font-serif font-semibold text-base ${row.cls}`}>{row.v}</span>
          </div>
        ))}

        <div className="mt-4 rounded-[10px] p-4 flex justify-between items-center border border-orange/40" style={{ background: 'rgba(221,106,43,0.12)' }}>
          <span className="font-semibold text-ondark">Estimated net contribution / mo</span>
          <span className="font-serif font-semibold text-[23px]" style={{ color: r.exp.net >= 0 ? '#dd6a2b' : '#e57a55' }}>{money(r.exp.net)}</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 mt-4">
          <div className="bg-ink3 border border-[rgba(220,190,150,0.14)] rounded-[10px] p-3.5">
            <div className="text-[11.5px] text-ondarkdim uppercase tracking-[0.08em]">Payback</div>
            <div className="font-serif font-semibold text-xl text-ondark mt-1">{r.payback}</div>
          </div>
          <div className="bg-ink3 border border-[rgba(220,190,150,0.14)] rounded-[10px] p-3.5">
            <div className="text-[11.5px] text-ondarkdim uppercase tracking-[0.08em]">Break-even active members</div>
            <div className="font-serif font-semibold text-xl text-ondark mt-1">{r.breakeven}</div>
          </div>
        </div>

        <div className="mt-5"><Confidence level="Directional" tone="dark" /></div>

        <p className="text-[11.5px] text-ondarkdim mt-4 leading-relaxed">
          Illustrative estimate for planning, not a guarantee of results. Alma credits loyalty only for incremental behavior change, evaluated after full program cost. Actual outcomes depend on execution and data quality.
        </p>

        <Link to="/contact" className="btn-primary w-full mt-5">Get a detailed scenario report <Arrow /></Link>
      </div>
    </div>
  )
}
