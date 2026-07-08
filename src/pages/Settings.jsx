import { useApp } from '../context/AppContext.jsx'
import { Panel, Field, PageHeader, Callout, Badge } from '../components/ui.jsx'

const STEPS = [
  { t: 'Open the Map', d: 'Go to “Map Command Center” in the left menu. Green areas are the best markets to hunt in. Gray means skip it.' },
  { t: 'Pick a green market', d: 'Click a green market on the map. Read the notes in the panel on the right.' },
  { t: 'Look at the deals', d: 'Click a pin, or open “Scratch Screen”. Each deal has a score from 0–100 and a plain-English decision.' },
  { t: 'Trust the color', d: 'Green = worth a look. Yellow = watch it. Red = pass. You do not need to do any math — the app does it.' },
  { t: 'Open a deal', d: 'Click “Open Deal Detail”. The first box tells you the decision and the next action to take.' },
  { t: 'Make a report', d: 'Go to “Report Builder”, pick the deal, and press “Print / PDF” to save a clean one-page summary.' },
]

export default function Settings() {
  const { settings, updateSettings, resetDemo, screenedProperties, screenedMarkets } = useApp()

  return (
    <div>
      <PageHeader title="Settings" subtitle="App preferences, sourcing defaults, and a simple start-here guide." />

      <Callout tone="green" title="Start here — how to use this app" className="mb-6">
        Six simple steps. No spreadsheets, no math required.
      </Callout>

      <Panel title="How to use this app (start here)" className="mb-6">
        <ol className="grid gap-4 md:grid-cols-2">
          {STEPS.map((s, i) => (
            <li key={i} className="flex gap-3">
              <span className="grid h-7 w-7 flex-none place-items-center rounded-full bg-gold text-ink text-sm font-bold">{i + 1}</span>
              <div><div className="text-sm font-medium text-stone">{s.t}</div><div className="text-sm text-mist">{s.d}</div></div>
            </li>
          ))}
        </ol>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Report branding">
          <div className="space-y-4">
            <Field label="Prepared for (investor name)"><input className="input" value={settings.investorName} onChange={(e) => updateSettings({ investorName: e.target.value })} /></Field>
            <Field label="Fund / company name"><input className="input" value={settings.fundName} onChange={(e) => updateSettings({ fundName: e.target.value })} /></Field>
          </div>
        </Panel>

        <Panel title="Sourcing defaults">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Sourcing mode">
              <select className="input" value={settings.sourcingMode} onChange={(e) => updateSettings({ sourcingMode: e.target.value })}>
                <option>Manual / Assisted</option><option disabled>Automated (locked · V2)</option>
              </select>
            </Field>
            <Field label="Return top N"><input type="number" className="input tnum" value={settings.returnTopN} onChange={(e) => updateSettings({ returnTopN: Number(e.target.value) })} /></Field>
            <Field label="Max per run"><input type="number" className="input tnum" value={settings.maxPropertiesPerRun} onChange={(e) => updateSettings({ maxPropertiesPerRun: Number(e.target.value) })} /></Field>
            <Field label="Run budget (USD)"><input type="number" className="input tnum" value={settings.runBudgetUSD} onChange={(e) => updateSettings({ runBudgetUSD: Number(e.target.value) })} /></Field>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-mist"><Badge tone="mist">🔒 Live scraping off</Badge> No paid APIs · no national crawling in V1.</div>
        </Panel>

        <Panel title="Data">
          <p className="text-sm text-mist">Everything is stored locally in your browser — no account, no server, no cost. Currently {screenedProperties.length} deals across {screenedMarkets.length} markets.</p>
          <button className="btn-ghost mt-4 text-sm" onClick={resetDemo}>Reset to demo data</button>
        </Panel>

        <Panel title="About">
          <p className="text-sm text-fog">Stonebrook Multifamily Deal Scout — Version 1 (MVP).</p>
          <Callout tone="mist" title="Disclaimer" className="mt-3">
            Version 1 market regions are approximate from REIndicator screenshot review and must be verified before investment decisions.
            The app shows a preliminary max supportable price, not a final offer.
          </Callout>
        </Panel>
      </div>
    </div>
  )
}
