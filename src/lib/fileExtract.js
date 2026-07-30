// File → text extraction. Handles digital PDFs (OMs, rate sheets) and Excel/CSV
// (T-12s, rent rolls) entirely in the browser — no upload, no backend.
// The heavy PDF/spreadsheet libraries are lazy-loaded on first use so the app
// stays fast for rapid pipeline review.

let _pdfjs
async function getPdfjs() {
  if (!_pdfjs) {
    const lib = await import('pdfjs-dist')
    const workerUrl = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default
    lib.GlobalWorkerOptions.workerSrc = workerUrl
    _pdfjs = lib
  }
  return _pdfjs
}

async function getXLSX() {
  return (await import('xlsx')).default ?? (await import('xlsx'))
}

const TEXT_EXT = ['txt', 'csv', 'tsv', 'md', 'json', 'log', 'text', 'yaml', 'yml']
const SHEET_EXT = ['xlsx', 'xls', 'xlsm', 'xlsb', 'ods']
const IMAGE_EXT = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'tif', 'tiff', 'heic', 'bmp']

const ext = (name) => (name.split('.').pop() || '').toLowerCase()

function readText(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(String(r.result || ''))
    r.onerror = () => reject(new Error('read failed'))
    r.readAsText(file)
  })
}

async function extractPdf(file) {
  const pdfjsLib = await getPdfjs()
  const data = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data }).promise
  const pages = []
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    let last = null
    let line = ''
    const lines = []
    // Reconstruct rough line breaks from text-item vertical positions.
    for (const it of content.items) {
      const y = it.transform ? it.transform[5] : null
      if (last != null && y != null && Math.abs(y - last) > 3) {
        lines.push(line.trim())
        line = ''
      }
      line += it.str + (it.hasEOL ? '\n' : ' ')
      last = y
    }
    if (line.trim()) lines.push(line.trim())
    pages.push(lines.join('\n'))
  }
  return pages.join('\n')
}

async function extractSheet(file) {
  const XLSX = await getXLSX()
  const data = await file.arrayBuffer()
  const wb = XLSX.read(data, { type: 'array' })
  const out = []
  for (const name of wb.SheetNames) {
    out.push(`===== ${name} =====`)
    out.push(XLSX.utils.sheet_to_csv(wb.Sheets[name], { blankrows: false }))
  }
  return out.join('\n')
}

// Read one file → { name, ok, text, note }.
export async function readOneFile(file) {
  const e = ext(file.name)
  try {
    if (e === 'pdf') {
      const text = await extractPdf(file)
      if (text.replace(/\s/g, '').length < 20) {
        return { name: file.name, ok: false, text: '', note: 'PDF has no text layer (scanned image) — paste the text or run OCR first.' }
      }
      return { name: file.name, ok: true, text, kind: 'pdf' }
    }
    if (SHEET_EXT.includes(e)) {
      return { name: file.name, ok: true, text: await extractSheet(file), kind: 'sheet' }
    }
    if (TEXT_EXT.includes(e) || (file.type || '').startsWith('text/')) {
      return { name: file.name, ok: true, text: await readText(file), kind: 'text' }
    }
    if (IMAGE_EXT.includes(e)) {
      return { name: file.name, ok: false, text: '', note: 'Image — no in-browser OCR. Paste the text from it.' }
    }
    // Unknown — try text as a last resort.
    const text = await readText(file)
    if (/[\x00-\x08\x0e-\x1f]/.test(text.slice(0, 500))) {
      return { name: file.name, ok: false, text: '', note: 'Unsupported binary format — paste the text.' }
    }
    return { name: file.name, ok: true, text, kind: 'text' }
  } catch (err) {
    return { name: file.name, ok: false, text: '', note: `Could not read (${err.message || 'error'}) — paste the text.` }
  }
}

export async function readFiles(fileList) {
  const files = Array.from(fileList || [])
  const results = []
  for (const f of files) results.push(await readOneFile(f))
  return results
}
