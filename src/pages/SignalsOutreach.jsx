import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import DealHeader, { DealNotFound } from '../components/DealHeader.jsx'
import { Panel, Badge, Field, Callout } from '../components/ui.jsx'
import Icon from '../components/Icon.jsx'
import { SIGNALS, AUTO_KEYS, deriveAuto, motivationScore, MOTIVATION_TONE, MOTIVATION_LABEL, CONTACT_ROLES, buildOutreach } from '../lib/signals.js'

export default function SignalsOutreach() {
  const { id } = useParams()
  const { getProperty, updateProperty, settings } = useApp()
  const p = getProperty(id)
  const [copied, setCopied] = useState(false)
  const [draft, setDraft] = useState(null)
  if (!p) return <DealNotFound />

  const auto = deriveAuto(p)
  const manual = new Set(p.signals || [])
  const { score, weight } = motivationScore(p)
  const contacts = p.contacts || {}
  const message = draft ?? buildOutreach(p, settings)

  const toggle = (key) => {
    const next = new Set(manual)
    next.has(key) ? next.delete(key) : next.add(key)
    updateProperty(p.id, { signals: [...next] })
    setDraft(null)
  }
  const setContact = (k, v) => { updateProperty(p.id, { contacts: { ...contacts, [k]: v } }); setDraft(null) }
  const copy = () => navigator.clipboard?.writeText(message).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })

  return (
    <div>
      <DealHeader p={p} />

      <Callout tone="gold" title="Seller signals & outreach">
        The apartment version of a demand-signal search: detect motivation, capture decision-makers, and generate the outreach. Live signal feeds (permits, tax, loan maturities, DOM) are a Version 2 connector.
      </Callout>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Motivation score */}
        <Panel title="Seller motivation (1–5)">
          <div className="flex flex-col items-center text-center">
            <div className={`grid h-24 w-24 place-items-center rounded-full border-4 ${score >= 4 ? 'border-red' : score === 3 ? 'border-yellow' : 'border-line'}`}>
              <span className={`text-4xl font-extrabold tnum ${score >= 4 ? 'text-red' : score === 3 ? 'text-yellow' : 'text-mist'}`}>{score}</span>
            </div>
            <div className="mt-3"><Badge tone={MOTIVATION_TONE[score]}>{MOTIVATION_LABEL[score]} motivation</Badge></div>
            <div className="mt-1 text-xs text-mist">signal weight {weight}</div>
          </div>
        </Panel>

        {/* Signals */}
        <Panel title="Signals detected" className="lg:col-span-2">
          <p className="text-xs text-mist mb-3">Auto signals come from the deal data. Toggle the rest as you learn them.</p>
          <div className="grid sm:grid-cols-2 gap-2">
            {SIGNALS.map((s) => {
              const isAuto = AUTO_KEYS.includes(s.key)
              const on = isAuto ? auto.has(s.key) : manual.has(s.key)
              return (
                <button key={s.key} disabled={isAuto} onClick={() => !isAuto && toggle(s.key)}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-all ${on ? 'border-gold bg-softorange' : 'border-line hover:border-gold/60'} ${isAuto ? 'cursor-default' : ''}`}>
                  <span className={`grid h-5 w-5 flex-none place-items-center rounded-md border-2 ${on ? 'bg-gold border-gold text-white' : 'border-line'}`}>{on && '✓'}</span>
                  <span className={on ? 'text-stone font-medium' : 'text-fog'}>{s.label}</span>
                  {isAuto && <span className="ml-auto tag bg-offwhite border border-line text-mist">AUTO</span>}
                </button>
              )
            })}
          </div>
        </Panel>

        {/* Decision-makers */}
        <Panel title="Decision-makers & contacts">
          <div className="space-y-3">
            {CONTACT_ROLES.map((r) => (
              <Field key={r.key} label={r.label}>
                <input className="input" value={contacts[r.key] || ''} onChange={(e) => setContact(r.key, e.target.value)} placeholder="Name" />
              </Field>
            ))}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Phone"><input className="input" value={contacts.phone || ''} onChange={(e) => setContact('phone', e.target.value)} /></Field>
              <Field label="Email"><input className="input" value={contacts.email || ''} onChange={(e) => setContact('email', e.target.value)} /></Field>
            </div>
          </div>
        </Panel>

        {/* Outreach message */}
        <Panel title="Executive outreach message" className="lg:col-span-2"
          action={<div className="flex gap-2 no-print">
            <button className="btn-dark text-xs" onClick={() => setDraft(null)}>Regenerate</button>
            <button className="btn-gold text-xs" onClick={copy}><Icon name="doc" className="w-4 h-4" />{copied ? 'Copied ✓' : 'Copy'}</button>
          </div>}>
          <textarea className="input h-72 font-mono text-[13px] leading-relaxed" value={message} onChange={(e) => setDraft(e.target.value)} />
          <p className="mt-2 text-[11px] text-mist">Positioned on Stonebrook's edge: fast, certain close · underwrites the plan, not the pro forma · C-in-B value-add specialist.</p>
        </Panel>
      </div>
    </div>
  )
}
