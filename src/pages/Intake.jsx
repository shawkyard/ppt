import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import { parseText } from '../lib/parse.js'
import { readFiles } from '../lib/fileExtract.js'
import { buildEstimated, modesToMeta } from '../lib/estimate.js'
import { Chip } from '../components/ui.jsx'
import ConfirmInputs from '../components/ConfirmInputs.jsx'

export default function Intake() {
  const { addDeal } = useApp()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [fileNotes, setFileNotes] = useState([])
  const [dragOver, setDragOver] = useState(false)
  const [busy, setBusy] = useState(false)
  const [pending, setPending] = useState(null)
  const inputRef = useRef(null)

  async function ingestFiles(fileList) {
    setBusy(true)
    try {
      const results = await readFiles(fileList)
      const notes = []
      let combined = ''
      for (const r of results) {
        if (r.ok && r.text) {
          combined += `\n\n===== ${r.name} =====\n${r.text}`
          notes.push({ name: r.name, ok: true, chars: r.text.length })
        } else {
          notes.push({ name: r.name, ok: false, note: r.note })
        }
      }
      if (combined) setText((t) => (t ? t + combined : combined.trim()))
      setFileNotes((n) => [...n, ...notes])
    } catch (err) {
      setFileNotes((n) => [...n, { name: 'error', ok: false, note: String(err?.message || err) }])
    } finally {
      setBusy(false)
    }
  }

  function onDrop(e) {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer?.files?.length) ingestFiles(e.dataTransfer.files)
  }

  // Parse → estimate → open the confirmation step (don't compute yet).
  function review() {
    const parsed = parseText(text)
    const est = buildEstimated(parsed, parsed.info)
    if (name.trim()) { est.inputs.propertyName = name.trim(); est.modes.propertyName = 'manual' }
    setPending({ est, parsed })
  }

  // User confirmed the inputs → build the deal and go to the package.
  function confirmUnderwrite(vals, modes) {
    const meta = modesToMeta(modes)
    for (const f of pending.parsed.fields) {
      if (meta[f.path]) meta[f.path].snippet = f.snippet
    }
    const id = addDeal({
      name: name.trim() || vals.propertyName,
      inputs: vals, meta, info: pending.parsed.info, rawText: text,
    })
    navigate(`/deal/${id}`)
  }

  function startBlank() {
    const parsed = { fields: [], info: [], notes: [] }
    const est = buildEstimated(parsed, [])
    if (name.trim()) { est.inputs.propertyName = name.trim(); est.modes.propertyName = 'manual' }
    setPending({ est, parsed })
  }

  const preview = parseText(text)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Underwrite a new RV park</h1>
        <p className="text-sm text-mist mt-1">
          Drop the OM, T-12, rate sheet, occupancy report — or just paste everything. The system extracts what it can,
          fills the rest with clearly-labeled assumptions, and produces a Year-3 Trifecta decision you can review in under a minute.
        </p>
      </div>

      <div className="panel p-5 space-y-4">
        <div>
          <label className="label">Property name <span className="text-mist/60">(optional — auto-detected if blank)</span></label>
          <input className="input mt-1.5" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Cedar Lake RV Resort" />
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`rounded-lg border border-dashed px-4 py-6 text-center cursor-pointer transition-colors ${
            dragOver ? 'border-gold bg-gold/5' : 'border-slateline hover:border-gold/50'
          }`}
          onClick={() => inputRef.current?.click()}
        >
          <input ref={inputRef} type="file" multiple className="hidden"
            onChange={(e) => { ingestFiles(e.target.files); e.target.value = '' }} />
          {busy ? (
            <div className="text-sm text-gold">Reading files…</div>
          ) : (
            <div className="text-sm text-fog">Drop the OM & financials here or <span className="text-gold">browse</span></div>
          )}
          <div className="text-[11px] text-mist mt-1">
            PDF, Excel (.xlsx/.xls), CSV, text, Markdown & JSON parse directly in your browser.
            Scanned/image PDFs have no text layer — paste those.
          </div>
        </div>

        {fileNotes.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {fileNotes.map((f, i) => (
              <Chip key={i} tone={f.ok ? 'good' : 'warn'} className="max-w-full">
                {f.ok ? `✓ ${f.name} (${f.chars.toLocaleString()} chars)` : `⚠ ${f.name} — ${f.note || 'paste text'}`}
              </Chip>
            ))}
          </div>
        )}

        <div>
          <label className="label">Paste deal data — any format</label>
          <textarea
            className="input mt-1.5 font-mono text-xs h-56 resize-y"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={'Paste anything: offering memorandum, T-12, rate sheet, occupancy report, seller pro forma...\n\nExample:\nCedar Lake RV Resort — 118 sites on 24 acres\nAsking price: $6,400,000\nOccupancy: 71%\nAverage lot rent: $585/month\nADR: $48/night\nTotal operating expenses: $742,000\nCap rate: 7.2%'}
          />
        </div>

        {text.trim() && (
          <div className="rounded-lg border border-slateline/60 bg-graphite/30 p-3">
            <div className="text-[11px] uppercase tracking-wide text-mist mb-2">
              Live extraction preview — {preview.fields.length} field{preview.fields.length === 1 ? '' : 's'} found
            </div>
            {preview.fields.length === 0 ? (
              <div className="text-xs text-mist">Nothing recognized yet. You can still underwrite — every field will use a labeled default you can edit.</div>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {preview.fields.slice(0, 24).map((f, i) => (
                  <Chip key={i} tone="info" className="max-w-[220px] truncate" >{f.label}</Chip>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-3 pt-1">
          <button className="btn-gold" onClick={review}>Parse & Review inputs →</button>
          <button className="btn-ghost" onClick={startBlank}>Start blank / manual</button>
        </div>
        <p className="text-[11px] text-mist/70">
          Next you'll confirm every input — keep what we read, estimate from other factors, or set it manually — so the model
          is grounded in <span className="text-white">this</span> deal, not a template, before it computes.
        </p>
      </div>

      {pending && (
        <ConfirmInputs
          propertyName={name.trim() || pending.est.inputs.propertyName}
          initial={pending.est}
          onConfirm={confirmUnderwrite}
          onCancel={() => setPending(null)}
        />
      )}
    </div>
  )
}
