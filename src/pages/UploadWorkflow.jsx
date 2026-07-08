import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Panel, PageHeader, Badge, Callout, LockedTag, SourceTag } from '../components/ui.jsx'
import { SOURCE_LEVELS } from '../lib/sources.js'

const DOC_TYPES = [
  { key: 'om', label: 'Offering Memorandum', tag: 'OM' },
  { key: 'rr', label: 'Rent Roll', tag: 'RR' },
  { key: 't12', label: 'T12 Financials', tag: 'T12' },
  { key: 'notes', label: 'Broker Notes', tag: 'BR' },
  { key: 'csv', label: 'CSV Property List', tag: 'EXT' },
]

// Demo "parsed" preview — Version 1 does not actually parse files.
const DEMO_PREVIEW = {
  om: [['Property', 'Oakleaf Village', 'OM'], ['Units', '120', 'OM'], ['Ask', '$12,600,000', 'OM'], ['Year built', '1986', 'OM']],
  rr: [['Occupied units', '103 / 120', 'RR'], ['Avg in-place rent', '$820', 'RR'], ['Down units', '4', 'RR'], ['Avg lease term left', '7 mo', 'RR']],
  t12: [['Effective gross income', '$1,141,000', 'T12'], ['Operating expenses', '$639,000', 'T12'], ['NOI', '$502,000', 'T12'], ['Expense ratio', '56%', 'CALC']],
  notes: [['Seller motivation', 'Estate / tired owner', 'BR'], ['Price flexibility', '“Bring offers”', 'BR'], ['Reno history', 'None since 2015', 'BR']],
  csv: [['Rows detected', '5 properties', 'EXT'], ['Markets matched', '2 approved', 'CALC'], ['Ready to import', 'Preview only (V1)', 'ASM']],
}

export default function UploadWorkflow() {
  const [active, setActive] = useState('om')
  const [text, setText] = useState('')
  const doc = DOC_TYPES.find((d) => d.key === active)

  return (
    <div>
      <PageHeader title="Upload OM / Rent Roll / T12"
        subtitle="Bring documents into a deal. Version 1 shows a parsed-data preview using demo data — real parsing arrives in Version 2. Every field is source-tagged so you always know where a number came from.">
        <Link to="/add" className="btn-gold">Add Property manually</Link>
      </PageHeader>

      <Callout tone="gold" title="Source levels" className="mb-6">
        <div className="flex flex-wrap gap-3 mt-1">
          {SOURCE_LEVELS.map((s) => (
            <span key={s.key} className="text-xs text-fog"><span className="text-stone font-semibold">{s.level}.</span> {s.label}</span>
          ))}
        </div>
      </Callout>

      <div className="flex flex-wrap gap-2 mb-6">
        {DOC_TYPES.map((d) => (
          <button key={d.key} onClick={() => setActive(d.key)}
            className={`chip ${active === d.key ? 'border-gold text-stone bg-gold/10' : 'border-line text-mist'}`}>
            <SourceTag code={d.tag} />{d.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Panel title={`Upload ${doc.label}`}>
            <label className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-line bg-ink px-6 py-12 text-center cursor-not-allowed">
              <div className="grid h-12 w-12 place-items-center rounded-full border border-line text-gold text-xl">↑</div>
              <div className="mt-3 text-sm text-stone">Drop a {doc.label} here</div>
              <div className="mt-1 text-xs text-mist">PDF, XLSX, or CSV — upload UI shown; file handling is a V1 placeholder</div>
              <span className="mt-3"><LockedTag /></span>
            </label>
          </Panel>

          <Panel title="Or paste text">
            <textarea className="input h-32 resize-none" placeholder={`Paste ${doc.label.toLowerCase()} text here…`} value={text} onChange={(e) => setText(e.target.value)} />
            <div className="mt-3 flex gap-2">
              <button className="btn-gold text-sm" onClick={() => setActive(active)}>Preview extraction</button>
              <button className="btn-ghost text-sm" onClick={() => setText('')}>Clear</button>
            </div>
          </Panel>
        </div>

        <Panel title="Extracted data preview" action={<Badge tone="gold">demo</Badge>}>
          <table className="w-full text-sm">
            <tbody>
              {DEMO_PREVIEW[active].map(([k, v, src], i) => (
                <tr key={i} className="border-b border-line/40">
                  <td className="py-2 text-mist">{k}</td>
                  <td className="py-2 text-right text-stone tnum">{v}</td>
                  <td className="py-2 pl-3 text-right"><SourceTag code={src} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          <Callout tone="mist" title="Note" className="mt-4">
            This preview uses demo data to show the workflow. Real OM / rent roll / T12 parsing is a Version 2 module. For now, transfer the numbers into Add Property.
          </Callout>
          <Link to="/add" className="btn-ghost w-full text-sm mt-4">Send to Add Property →</Link>
        </Panel>
      </div>
    </div>
  )
}
