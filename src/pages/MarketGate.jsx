import { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { MARKET_FACTORS } from '../lib/marketScore.js'
import { Panel, Badge, ScoreRing, WeightBar, PageHeader, Field, Callout } from '../components/ui.jsx'

function FactorSlider({ factor, value, onChange }) {
  return (
    <div className="py-2.5 border-b border-slateline/40 last:border-0">
      <div className="flex items-center justify-between">
        <span className="text-sm text-fog" title={factor.help}>
          {factor.label}
          {factor.invert && <span className="ml-1.5 text-[10px] uppercase text-danger">risk</span>}
          <span className="ml-2 text-[11px] text-mist">·w{factor.weight}</span>
        </span>
        <span className="tnum text-sm text-white w-8 text-right">{value}</span>
      </div>
      <input
        type="range" min="0" max="10" step="1" value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-gold"
      />
      <p className="mt-1 text-[11px] text-mist/70">{factor.help}</p>
    </div>
  )
}

export default function MarketGate() {
  const { screenedMarkets, updateMarket, addMarket } = useApp()
  const [selectedId, setSelectedId] = useState(screenedMarkets[0]?.id)
  const market = screenedMarkets.find((m) => m.id === selectedId) || screenedMarkets[0]

  const setFactor = (key, val) => {
    if (!market) return
    updateMarket(market.id, { factors: { ...market.factors, [key]: val } })
  }

  const handleAdd = () => {
    const name = window.prompt('New market name (e.g. "Chattanooga, TN")')
    if (!name) return
    const id = addMarket({
      name,
      thesis: '',
      factors: Object.fromEntries(MARKET_FACTORS.map((f) => [f.key, 5])),
    })
    setSelectedId(id)
  }

  return (
    <div>
      <PageHeader
        title="Market Gate"
        subtitle="No deal clears without a market. Score 0–100. Approved ≥ 80 · Watchlist 60–79 · Reject < 60. We want strong or emerging markets — C property in a B area."
      >
        <button className="btn-ghost" onClick={handleAdd}>+ Add market</button>
      </PageHeader>

      <div className="flex flex-wrap gap-2 mb-6">
        {screenedMarkets.map((m) => (
          <button
            key={m.id}
            onClick={() => setSelectedId(m.id)}
            className={`chip ${m.id === market?.id ? 'border-gold text-white bg-gold/10' : 'border-slateline text-mist'}`}
          >
            {m.name}
            <span className="ml-1 tnum font-semibold">{m.score}</span>
          </button>
        ))}
      </div>

      {market && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6">
            <Panel title="Verdict">
              <div className="flex flex-col items-center text-center">
                <ScoreRing score={market.score} tone={market.verdict.tone} size={120} label="/ 100" />
                <div className="mt-4"><Badge tone={market.verdict.tone}>{market.verdict.label}</Badge></div>
                <h3 className="mt-4 text-white">{market.name}</h3>
                {market.thesis && <p className="mt-2 text-sm text-mist">{market.thesis}</p>}
              </div>
            </Panel>
            <Callout tone={market.verdict.tone} title="What this means">
              {market.verdict.band === 'approved' && 'Strong market. Properties here can clear the pipeline — focus scouting energy.'}
              {market.verdict.band === 'watchlist' && 'Borderline market. Deals here need a wider margin of safety and a price reset.'}
              {market.verdict.band === 'reject' && 'Weak market. Do not underwrite properties here regardless of the individual deal.'}
            </Callout>
          </div>

          <div className="lg:col-span-2 grid gap-6 md:grid-cols-2">
            <Panel title="Factor inputs (0–10)">
              <Field label="Market thesis" className="mb-4">
                <textarea
                  className="input h-20 resize-none"
                  value={market.thesis || ''}
                  onChange={(e) => updateMarket(market.id, { thesis: e.target.value })}
                  placeholder="One-line thesis for why this market matters."
                />
              </Field>
              {MARKET_FACTORS.map((f) => (
                <FactorSlider key={f.key} factor={f} value={market.factors[f.key] ?? 0} onChange={(v) => setFactor(f.key, v)} />
              ))}
            </Panel>

            <Panel title="Weighted contribution">
              {market.breakdown.map((b) => (
                <WeightBar key={b.key} label={b.label} points={b.points} weight={b.weight} help={b.help} />
              ))}
              <div className="mt-4 flex items-center justify-between border-t border-slateline/60 pt-3">
                <span className="text-sm text-mist">Total market score</span>
                <span className="text-lg font-bold tnum text-white">{market.score}<span className="text-mist text-sm"> / 100</span></span>
              </div>
            </Panel>
          </div>
        </div>
      )}
    </div>
  )
}
