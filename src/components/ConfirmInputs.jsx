import { useState } from 'react'
import { KEY_FIELDS, SCENARIOS, SCENARIO_LABEL, getPath, setPath } from '../lib/schema.js'
import { fmtByType, editValue, parseByType } from '../lib/fmt.js'
import { deriveValue } from '../lib/estimate.js'

const MODE_META = {
  read: { label: 'Read', tip: 'Read from your documents', bar: 'border-l-sky-400', dot: 'bg-sky-400' },
  unsure: { label: 'Read?', tip: 'Read but low confidence — verify', bar: 'border-l-amber-400', dot: 'bg-amber-400' },
  estimated: { label: 'Est', tip: 'Estimated from other factors', bar: 'border-l-violet-400', dot: 'bg-violet-400' },
  manual: { label: 'Manual', tip: 'You set this value', bar: 'border-l-approve', dot: 'bg-approve' },
  default: { label: 'Default', tip: 'Illustrative default — unverified', bar: 'border-l-slateline', dot: 'bg-mist' },
}

// One editable field with a Read / Estimate / Manual selector.
function FieldControl({ path, type, vals, modes, readMap, ctx, set }) {
  const value = getPath(vals, path)
  const mode = modes[path] || 'default'
  const readable = readMap[path]
  const meta = MODE_META[mode] || MODE_META.default
  const [draft, setDraft] = useState(null)

  const commitManual = (raw) => {
    set(path, parseByType(type, raw), 'manual')
    setDraft(null)
  }

  const btn = (m, onClick, show = true) =>
    show && (
      <button
        title={MODE_META[m].tip}
        onClick={onClick}
        className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${
          mode === m ? 'border-fog/60 text-white bg-graphite' : 'border-slateline/60 text-mist hover:text-white'
        }`}
      >{MODE_META[m].label}</button>
    )

  return (
    <div className={`rounded-md border border-slateline/60 border-l-2 ${meta.bar} bg-ink/40 px-2 py-1.5`}>
      <input
        className="w-full bg-transparent text-sm text-white tnum focus:outline-none"
        value={draft ?? editValue(type, value)}
        onChange={(e) => setDraft(e.target.value)}
        onFocus={(e) => setDraft(editValue(type, value))}
        onBlur={(e) => commitManual(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur() }}
      />
      <div className="flex items-center gap-1 mt-1">
        {btn('read', () => set(path, readMap[path].value, readMap[path].mode), !!readable)}
        {btn('unsure', () => set(path, readMap[path].value, 'unsure'), false)}
        {btn('estimated', () => set(path, deriveValue(path, vals, ctx), 'estimated'))}
        {btn('manual', () => setDraft(editValue(type, value)))}
        <span className="ml-auto text-[10px] text-mist">{fmtByType(type, value)}</span>
      </div>
    </div>
  )
}

export default function ConfirmInputs({ propertyName, initial, onConfirm, onCancel }) {
  const [vals, setVals] = useState(() => structuredClone(initial.inputs))
  const [modes, setModes] = useState(() => ({ ...initial.modes }))
  const { readMap, ctx } = initial

  const set = (path, value, mode) => {
    setVals((v) => { const c = structuredClone(v); setPath(c, path, value); return c })
    setModes((m) => ({ ...m, [path]: mode }))
  }

  // Bulk actions
  const estimateAll = () => {
    setVals((v) => {
      const c = structuredClone(v)
      const nextModes = { ...modes }
      for (const grp of KEY_FIELDS) for (const f of grp.fields) {
        const paths = grp.scenario ? SCENARIOS.map((s) => `${f.path}.${s}`) : [f.path]
        for (const p of paths) {
          if ((nextModes[p] || 'default') !== 'read' && (nextModes[p] || 'default') !== 'manual') {
            setPath(c, p, deriveValue(p, c, ctx)); nextModes[p] = 'estimated'
          }
        }
      }
      setModes(nextModes)
      return c
    })
  }

  const counts = () => {
    const c = { read: 0, unsure: 0, estimated: 0, manual: 0, default: 0 }
    for (const grp of KEY_FIELDS) for (const f of grp.fields) {
      const paths = grp.scenario ? SCENARIOS.map((s) => `${f.path}.${s}`) : [f.path]
      for (const p of paths) c[modes[p] || 'default']++
    }
    return c
  }
  const c = counts()

  return (
    <div className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-sm flex items-start justify-center overflow-y-auto p-4">
      <div className="panel w-full max-w-5xl my-6">
        <div className="panel-hd flex flex-wrap items-center justify-between gap-3 sticky top-0 bg-charcoal z-10">
          <div>
            <h2 className="text-lg font-semibold">Confirm the inputs — {propertyName}</h2>
            <p className="text-xs text-mist mt-0.5">
              For each field choose <span className="text-sky-300">Read</span> (from your docs),
              {' '}<span className="text-violet-300">Est</span> (derived from other factors), or
              {' '}<span className="text-approve">Manual</span>. This grounds the model in this deal before it computes.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-ghost text-xs" onClick={estimateAll}>Estimate all unread</button>
            <button className="btn-ghost text-xs" onClick={onCancel}>Cancel</button>
            <button className="btn-gold text-sm" onClick={() => onConfirm(vals, modes)}>Underwrite →</button>
          </div>
        </div>

        <div className="px-3 py-2 border-b border-slateline/50 flex flex-wrap gap-3 text-[11px] text-mist">
          <Legend dot="bg-sky-400" label={`Read ${c.read}`} />
          <Legend dot="bg-amber-400" label={`Read? ${c.unsure}`} />
          <Legend dot="bg-violet-400" label={`Estimated ${c.estimated}`} />
          <Legend dot="bg-approve" label={`Manual ${c.manual}`} />
          <Legend dot="bg-mist" label={`Default ${c.default}`} />
        </div>

        <div className="p-4 space-y-5">
          {KEY_FIELDS.map((grp) => (
            <div key={grp.group}>
              <div className="label mb-2">{grp.group}</div>
              {grp.scenario ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px]">
                    <thead>
                      <tr className="text-[11px] uppercase tracking-wide text-mist text-left">
                        <th className="pb-1 pr-3 font-medium w-1/4">Field</th>
                        {SCENARIOS.map((s) => <th key={s} className="pb-1 px-1 font-medium">{SCENARIO_LABEL[s]}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {grp.fields.map((f) => (
                        <tr key={f.path}>
                          <td className="py-1 pr-3 text-sm text-fog align-middle">{f.label}</td>
                          {SCENARIOS.map((s) => (
                            <td key={s} className="py-1 px-1 align-top">
                              <FieldControl path={`${f.path}.${s}`} type={f.type} vals={vals} modes={modes} readMap={readMap} ctx={ctx} set={set} />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {grp.fields.map((f) => (
                    <div key={f.path}>
                      <div className="text-xs text-fog mb-1">{f.label}</div>
                      <FieldControl path={f.path} type={f.type} vals={vals} modes={modes} readMap={readMap} ctx={ctx} set={set} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="panel-hd border-t border-b-0 flex justify-end gap-2 sticky bottom-0 bg-charcoal">
          <button className="btn-ghost text-sm" onClick={onCancel}>Cancel</button>
          <button className="btn-gold text-sm" onClick={() => onConfirm(vals, modes)}>Underwrite →</button>
        </div>
      </div>
    </div>
  )
}

function Legend({ dot, label }) {
  return <span className="inline-flex items-center gap-1.5"><span className={`h-2 w-2 rounded-full ${dot}`} />{label}</span>
}
