import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import { readFiles, parseText, applyExtraction } from '../lib/parse.js'
import { defaultInputs } from '../lib/schema.js'
import { Chip } from '../components/ui.jsx'

export default function Intake() {
  const { addDeal, blankInputs } = useApp()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [fileNotes, setFileNotes] = useState([])
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef(null)

  async function ingestFiles(fileList) {
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
  }

  function onDrop(e) {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer?.files?.length) ingestFiles(e.dataTransfer.files)
  }

  function underwrite() {
    const parsed = parseText(text)
    const { inputs, meta, info } = applyExtraction(defaultInputs(), parsed)
    if (name.trim()) inputs.propertyName = name.trim()
    const id = addDeal({ name: name.trim() || inputs.propertyName, inputs, meta, info, rawText: text })
    navigate(`/deal/${id}`)
  }

  function startBlank() {
    const inputs = blankInputs()
    if (name.trim()) inputs.propertyName = name.trim()
    const id = addDeal({ name: name.trim() || inputs.propertyName, inputs, meta: {}, info: [], rawText: '' })
    navigate(`/deal/${id}`)
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
          <div className="text-sm text-fog">Drop files here or <span className="text-gold">browse</span></div>
          <div className="text-[11px] text-mist mt-1">
            Text, CSV, TSV, Markdown, JSON parse directly. For PDF / Excel / images, paste the text below.
          </div>
        </div>

        {fileNotes.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {fileNotes.map((f, i) => (
              <Chip key={i} tone={f.ok ? 'good' : 'warn'}>
                {f.ok ? `✓ ${f.name} (${f.chars.toLocaleString()} chars)` : `⚠ ${f.name} — paste text`}
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
          <button className="btn-gold" onClick={underwrite}>Parse & Underwrite →</button>
          <button className="btn-ghost" onClick={startBlank}>Start blank / manual</button>
        </div>
        <p className="text-[11px] text-mist/70">
          The parser never invents figures. Anything it can't source stays at the illustrative model default and is flagged
          <span className="text-gold"> Assumption</span> so you know exactly what to verify.
        </p>
      </div>
    </div>
  )
}
