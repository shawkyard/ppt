// Heuristic extraction. Turns pasted / uploaded deal text into labeled inputs.
// It never fabricates: it only fills a field when a pattern actually matches, and
// records the matched snippet as evidence. Everything it cannot find stays at the
// illustrative default and is flagged as an assumption.

import { setPath } from './schema.js'
import { detectState } from './screen.js'

const TEXT_EXT = ['txt', 'csv', 'tsv', 'md', 'json', 'log', 'text', 'yaml', 'yml']

export function isProbablyText(file) {
  const ext = (file.name.split('.').pop() || '').toLowerCase()
  if (TEXT_EXT.includes(ext)) return true
  return (file.type || '').startsWith('text/')
}

export function readFileToText(file) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = () => resolve({ name: file.name, ok: true, text: String(reader.result || '') })
    reader.onerror = () => resolve({ name: file.name, ok: false, text: '' })
    reader.readAsText(file)
  })
}

export async function readFiles(fileList) {
  const files = Array.from(fileList || [])
  const results = []
  for (const f of files) {
    if (isProbablyText(f)) {
      results.push(await readFileToText(f))
    } else {
      results.push({
        name: f.name, ok: false, text: '',
        note: 'Binary format — extract the text (copy from the PDF/spreadsheet) and paste it below.',
      })
    }
  }
  return results
}

// ---- number parsing ----
function parseMoneyToken(tok) {
  if (tok == null) return null
  let t = String(tok).toLowerCase().replace(/[$,\s]/g, '')
  const m = t.match(/^(-?[\d.]+)(mm|m|million|k|thousand|bn|b|billion)?$/)
  if (!m) {
    const n = parseFloat(t.replace(/[^\d.-]/g, ''))
    return Number.isNaN(n) ? null : n
  }
  let n = parseFloat(m[1])
  if (Number.isNaN(n)) return null
  const u = m[2]
  if (u === 'm' || u === 'mm' || u === 'million') n *= 1e6
  else if (u === 'k' || u === 'thousand') n *= 1e3
  else if (u === 'b' || u === 'bn' || u === 'billion') n *= 1e9
  return n
}

function parsePercentToken(tok) {
  if (tok == null) return null
  const n = parseFloat(String(tok).replace(/[^\d.-]/g, ''))
  if (Number.isNaN(n)) return null
  return n > 1 ? n / 100 : n
}

function parseIntToken(tok) {
  if (tok == null) return null
  const n = parseInt(String(tok).replace(/[^\d]/g, ''), 10)
  return Number.isNaN(n) ? null : n
}

// Run an ordered list of regexes; return first {value, snippet}.
function firstMatch(text, patterns, convert) {
  for (const re of patterns) {
    const m = text.match(re)
    if (m && m[1] != null) {
      const value = convert(m[1])
      if (value != null && !Number.isNaN(value)) {
        const idx = Math.max(0, m.index - 20)
        const snippet = text.slice(idx, m.index + m[0].length + 20).replace(/\s+/g, ' ').trim()
        return { value, snippet }
      }
    }
  }
  return null
}

const MONEY = '\\$?\\s*([\\d,]+(?:\\.\\d+)?\\s*(?:mm|m|million|k|thousand|bn|b|billion)?)'
const PCTV = '([\\d.]+)\\s*%?'
const INTV = '([\\d,]+)'

// ---- main text parser ----
export function parseText(rawText) {
  const text = String(rawText || '')
  if (!text.trim()) return { fields: [], info: [], notes: ['No text provided.'] }

  const fields = []
  const info = []
  const add = (path, label, res, provenance = 'reported') => {
    if (res == null) return
    fields.push({ path, label, value: res.value, snippet: res.snippet, provenance })
  }
  const addInfo = (key, label, res) => {
    if (res == null) return
    info.push({ key, label, value: res.value, snippet: res.snippet })
  }

  // Property name — explicit label, else first non-empty line if it looks like a name.
  const nameM = text.match(/(?:property\s*name|park\s*name|community|property)\s*[:\-]\s*(.+)/i)
  if (nameM) {
    fields.push({ path: 'propertyName', label: 'Property name', value: nameM[1].split(/[\n|]/)[0].trim().slice(0, 80), snippet: nameM[0].trim().slice(0, 80), provenance: 'reported' })
  } else {
    const firstLine = text.split(/\n/).map((l) => l.trim()).find((l) => l.length > 2)
    if (firstLine && firstLine.length < 80 && /rv|park|resort|campground|camp|ranch|lake|river/i.test(firstLine)) {
      fields.push({ path: 'propertyName', label: 'Property name (from heading)', value: firstLine, snippet: firstLine, provenance: 'seller' })
    }
  }

  // Location / address
  const locM = text.match(/(?:location|address|city\s*\/?\s*state|located\s+in)\s*[:\-]\s*(.+)/i)
  if (locM) fields.push({ path: 'location', label: 'Location', value: locM[1].split(/\n/)[0].trim().slice(0, 100), snippet: locM[0].trim().slice(0, 100), provenance: 'reported' })

  // Jurisdiction — detect a US state from the location line or full text.
  const st = detectState(locM ? locM[1] : '') || detectState(text.slice(0, 600))
  if (st) fields.push({ path: 'state', label: 'State (jurisdiction gate)', value: st, snippet: st, provenance: 'reported' })

  // Purchase / asking price
  add('purchasePrice', 'Purchase / asking price',
    firstMatch(text, [
      new RegExp(`(?:asking|purchase|list(?:ing)?|offer(?:ed)?|sale|acquisition)\\s*price\\s*[:\\-]?\\s*${MONEY}`, 'i'),
      new RegExp(`price\\s*[:\\-]\\s*${MONEY}`, 'i'),
      new RegExp(`offered\\s+at\\s*${MONEY}`, 'i'),
    ], parseMoneyToken), 'seller')

  // Existing sites / spaces / pads
  add('existingSites', 'Existing operating sites',
    firstMatch(text, [
      new RegExp(`${INTV}\\s*(?:total\\s+)?(?:rv\\s+)?(?:sites|spaces|pads|lots)\\b`, 'i'),
      new RegExp(`(?:sites|spaces|pads|lots)\\s*[:\\-]?\\s*${INTV}`, 'i'),
      new RegExp(`(?:number\\s+of\\s+sites|site\\s+count)\\s*[:\\-]?\\s*${INTV}`, 'i'),
    ], parseIntToken), 'reported')

  // Full-build / buildout / expandable capacity
  add('fullBuildSites', 'Full-build site count',
    firstMatch(text, [
      new RegExp(`(?:full[-\\s]?build|build[-\\s]?out|expandable\\s+to|potential\\s+of|up\\s+to)\\s*(?:of\\s*)?${INTV}\\s*(?:total\\s+)?(?:sites|spaces|pads)`, 'i'),
      new RegExp(`${INTV}\\s*(?:site|space|pad)\\s*(?:full[-\\s]?build|build[-\\s]?out|capacity)`, 'i'),
    ], parseIntToken), 'seller')

  // Acres
  add('expansionAcres', 'Acres',
    firstMatch(text, [
      new RegExp(`${INTV}(?:\\.\\d+)?\\s*(?:\\+/-\\s*)?acres`, 'i'),
      new RegExp(`acres\\s*[:\\-]?\\s*([\\d.]+)`, 'i'),
    ], (t) => { const n = parseFloat(String(t).replace(/,/g, '')); return Number.isNaN(n) ? null : n }), 'reported')

  // Cap rate (stated) -> exit cap starting point
  add('exitCap', 'Stated cap rate',
    firstMatch(text, [
      new RegExp(`cap\\s*rate\\s*[:\\-]?\\s*${PCTV}`, 'i'),
      new RegExp(`${PCTV}\\s*cap\\b`, 'i'),
    ], parsePercentToken), 'seller')

  // Occupancy (applied to the Current-reality scenario across years)
  const occ = firstMatch(text, [
    new RegExp(`(?:economic\\s+)?occupancy\\s*[:\\-]?\\s*${PCTV}`, 'i'),
    new RegExp(`${PCTV}\\s*occupancy`, 'i'),
    new RegExp(`(?:occupied)\\s*[:\\-]?\\s*${PCTV}`, 'i'),
  ], parsePercentToken)
  if (occ) {
    for (const yk of ['y1Occ', 'y2Occ', 'y3Occ', 'y4Occ']) {
      fields.push({ path: `op.${yk}.current`, label: `Occupancy (${yk})`, value: occ.value, snippet: occ.snippet, provenance: 'reported' })
    }
  }

  // Monthly rent -> current monthly rate and long-term rate
  const rent = firstMatch(text, [
    new RegExp(`(?:average\\s+)?(?:monthly\\s+)?(?:lot\\s+|site\\s+|space\\s+)?rent\\s*[:\\-]?\\s*${MONEY}\\s*(?:/\\s*mo|per\\s+month|monthly)?`, 'i'),
    new RegExp(`${MONEY}\\s*(?:/\\s*mo|per\\s+month)\\b`, 'i'),
    new RegExp(`monthly\\s+rate\\s*[:\\-]?\\s*${MONEY}`, 'i'),
  ], parseMoneyToken)
  if (rent) {
    fields.push({ path: 'op.y1Rate.current', label: 'Year-1 monthly rate', value: rent.value, snippet: rent.snippet, provenance: 'reported' })
    fields.push({ path: 'op.y2Rate.current', label: 'Year-2 monthly rate', value: rent.value, snippet: rent.snippet, provenance: 'reported' })
    fields.push({ path: 'rev.ltRate.current', label: 'Long-term monthly rate', value: rent.value, snippet: rent.snippet, provenance: 'reported' })
  }

  // ADR / nightly -> current standard transient ADR
  const adr = firstMatch(text, [
    new RegExp(`(?:adr|average\\s+daily\\s+rate|nightly\\s+rate)\\s*[:\\-]?\\s*${MONEY}`, 'i'),
    new RegExp(`${MONEY}\\s*(?:/\\s*night|per\\s+night|nightly)\\b`, 'i'),
  ], parseMoneyToken)
  if (adr) fields.push({ path: 'rev.stdADR.current', label: 'Transient ADR', value: adr.value, snippet: adr.snippet, provenance: 'reported' })

  // Operating expenses -> current Year-1 OpEx
  add('op.y1OpEx.current', 'Year-1 operating expenses',
    firstMatch(text, [
      new RegExp(`(?:total\\s+)?operating\\s+expenses?\\s*[:\\-]?\\s*${MONEY}`, 'i'),
      new RegExp(`(?:total\\s+)?opex\\s*[:\\-]?\\s*${MONEY}`, 'i'),
      new RegExp(`total\\s+expenses?\\s*[:\\-]?\\s*${MONEY}`, 'i'),
    ], parseMoneyToken), 'reported')

  // Ancillary / other income -> current Year-1 ancillary
  add('op.y1Anc.current', 'Ancillary / other income',
    firstMatch(text, [
      new RegExp(`(?:ancillary|other)\\s+income\\s*[:\\-]?\\s*${MONEY}`, 'i'),
      new RegExp(`(?:store|laundry|propane)\\s+(?:income|revenue)\\s*[:\\-]?\\s*${MONEY}`, 'i'),
    ], parseMoneyToken), 'reported')

  // ---- informational reconciliation signals (shown, not forced into the model) ----
  addInfo('grossRevenue', 'Reported gross revenue',
    firstMatch(text, [
      new RegExp(`(?:effective\\s+)?gross\\s+(?:income|revenue)\\s*[:\\-]?\\s*${MONEY}`, 'i'),
      new RegExp(`total\\s+(?:income|revenue)\\s*[:\\-]?\\s*${MONEY}`, 'i'),
      new RegExp(`gross\\s+scheduled\\s+income\\s*[:\\-]?\\s*${MONEY}`, 'i'),
    ], parseMoneyToken))
  addInfo('noi', 'Reported NOI',
    firstMatch(text, [
      new RegExp(`(?:net\\s+operating\\s+income|noi)\\s*[:\\-]?\\s*${MONEY}`, 'i'),
    ], parseMoneyToken))
  addInfo('taxes', 'Reported property taxes',
    firstMatch(text, [
      new RegExp(`(?:property\\s+)?taxes?\\s*[:\\-]?\\s*${MONEY}`, 'i'),
    ], parseMoneyToken))
  addInfo('insurance', 'Reported insurance',
    firstMatch(text, [
      new RegExp(`insurance\\s*[:\\-]?\\s*${MONEY}`, 'i'),
    ], parseMoneyToken))

  const notes = []
  if (fields.length === 0) notes.push('No recognizable financial fields were found — check the paste, or enter values by hand.')
  return { fields, info, notes }
}

// Apply extraction on top of a fresh default input tree. Returns {inputs, meta, info}.
export function applyExtraction(baseInputs, parsed) {
  const inputs = structuredClone(baseInputs)
  const meta = {}
  for (const f of parsed.fields) {
    setPath(inputs, f.path, f.value)
    meta[f.path] = { source: f.provenance, snippet: f.snippet, note: f.label }
  }
  return { inputs, meta, info: parsed.info || [] }
}
