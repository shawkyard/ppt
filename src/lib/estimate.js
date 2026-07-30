// Estimation engine. Grounds the whole model in the actual uploaded deal instead
// of the illustrative template: derives full-build capacity, site mix, escrows,
// revenue drivers and the three scenarios from the park's real size and economics.
//
// Modes: 'read' (from docs) · 'unsure' (read, low confidence) · 'estimated'
// (derived from other factors) · 'manual' (user set) · 'default' (untouched).

import { defaultInputs, getPath, setPath } from './schema.js'

const r0 = (n) => Math.round(n)

// Build a context bag of reported reconciliation signals.
function ctxFromInfo(info) {
  const m = {}
  for (const i of info || []) m[i.key] = i.value
  return m
}

// Rough current effective gross income for downstream estimates.
function currentEGI(inp) {
  const occ = inp.op.y1Occ.current || 0.65
  const rate = inp.op.y1Rate.current || 650
  const anc = inp.op.y1Anc.current || 0
  return inp.existingSites * rate * 12 * occ + anc
}

// The single source of truth for deriving one field from the others.
// `inp` must already have the fields this one depends on.
export function deriveValue(path, inp, ctx = {}) {
  const existing = inp.existingSites || 0
  const full = inp.fullBuildSites || existing
  const added = Math.max(0, full - existing)
  const occCur = inp.op.y1Occ.current || 0.65

  switch (path) {
    // ---- scalars ----
    case 'fullBuildSites':
      return existing > 0 ? r0(existing * 1.5) : 200
    case 'expansionAcres':
      return added > 0 ? Math.max(5, r0(added / 8)) : 0
    case 'repairEscrow':
      return r0(existing * 1200)
    case 'expansionEscrow':
      return r0(added * 30000)
    case 'amenityCapex':
      return r0(added * 15000 + inp.purchasePrice * 0.03)
    case 'operatingReserve':
      return r0(0.5 * (inp.op.y1OpEx.target || 0))
    case 'taxReserve':
      return ctx.taxes ? r0(ctx.taxes * 0.5) : 75000
    case 'insuranceReserve':
      return ctx.insurance ? r0(ctx.insurance * 0.5) : 100000
    case 'exitCap':
      return 0.08

    // ---- current scenario (reality) ----
    case 'op.y3Occ.current':
    case 'op.y4Occ.current':
      return occCur
    case 'op.y2Occ.current':
      return occCur
    case 'op.y1Anc.current':
      return r0(0.08 * existing * (inp.op.y1Rate.current || 650) * 12 * occCur)
    case 'op.y1OpEx.current':
      if (ctx.grossRevenue && ctx.noi) return r0(ctx.grossRevenue - ctx.noi)
      return r0(0.55 * currentEGI(inp))

    // ---- target scenario (our plan) ----
    case 'op.y1Occ.target':
      return Math.max(0.4, r0(occCur * 0.92 * 100) / 100)
    case 'op.y2Occ.target':
      return Math.min(0.9, r0((occCur + 0.08) * 100) / 100)
    case 'op.y3Occ.target':
      return Math.min(0.9, r0((occCur + 0.15) * 100) / 100)
    case 'op.y4Occ.target':
      return Math.min(0.92, r0((occCur + 0.17) * 100) / 100)
    case 'op.y1Rate.target':
      return r0((inp.op.y1Rate.current || 650) * 1.05)
    case 'op.y2Rate.target':
      return r0((inp.op.y1Rate.current || 650) * 1.12)
    case 'op.y1Anc.target':
      return r0((inp.op.y1Anc.current || 0) * 1.4)
    case 'op.y2Anc.target':
      return r0((inp.op.y1Anc.current || 0) * 1.9)
    case 'op.y1OpEx.target':
      return r0((inp.op.y1OpEx.current || 0) * 1.2)
    case 'op.y1Draw.target':
      return inp.expansionEscrow
    case 'op.y2Draw.target':
      return inp.amenityCapex
    case 'op.y3Draw.target':
      return 0

    // ---- seller pro forma (between current and target) ----
    case 'op.y3Occ.proforma':
      return Math.min(0.88, r0((occCur + 0.09) * 100) / 100)
    case 'op.y1Occ.proforma':
      return occCur
    case 'op.y1Rate.proforma':
      return r0((inp.op.y1Rate.current || 650) * 1.08)
    case 'op.y1Anc.proforma':
      return r0((inp.op.y1Anc.current || 0) * 1.2)
    case 'op.y1OpEx.proforma':
      return r0((inp.op.y1OpEx.current || 0) * 1.1)

    // ---- site mix ----
    case 'mix.longTermPads.current': return r0(existing * 0.45)
    case 'mix.stdTransient.current': return Math.max(0, existing - r0(existing * 0.45))
    case 'mix.premium.current': return 0
    case 'mix.tentGlamp.current': return 0
    case 'mix.cabins.current': return r0(existing / 30)
    case 'mix.parkModel.current': return 0
    case 'mix.groupHomes.current': return 0
    case 'mix.storage.current': return r0(existing * 0.3)

    case 'mix.longTermPads.target': return r0(full * 0.33)
    case 'mix.stdTransient.target': return r0(full * 0.45)
    case 'mix.premium.target': return r0(full * 0.11)
    case 'mix.tentGlamp.target':
      return Math.max(0, full - r0(full * 0.33) - r0(full * 0.45) - r0(full * 0.11))
    case 'mix.cabins.target': return r0(full / 25)
    case 'mix.parkModel.target': return r0(full / 40)
    case 'mix.groupHomes.target': return r0(full / 60)
    case 'mix.storage.target': return r0(full * 0.4)

    case 'mix.longTermPads.proforma': return r0(((existing + full) / 2) * 0.4)
    case 'mix.stdTransient.proforma': return r0(((existing + full) / 2) * 0.5)
    case 'mix.premium.proforma': return r0(((existing + full) / 2) * 0.05)
    case 'mix.tentGlamp.proforma': return r0(((existing + full) / 2) * 0.05)
    case 'mix.cabins.proforma': return r0(((existing + full) / 2) / 28)
    case 'mix.parkModel.proforma': return r0(((existing + full) / 2) / 50)
    case 'mix.groupHomes.proforma': return 0
    case 'mix.storage.proforma': return r0(((existing + full) / 2) * 0.35)

    // ---- revenue drivers ----
    case 'rev.ltRate.current': return inp.op.y1Rate.current || 600
    case 'rev.ltRate.target': return r0((inp.op.y1Rate.current || 600) * 1.15)
    case 'rev.ltRate.proforma': return r0((inp.op.y1Rate.current || 600) * 1.08)
    case 'rev.stdADR.target': return r0((inp.rev.stdADR.current || 45) * 1.2)
    case 'rev.stdADR.proforma': return r0((inp.rev.stdADR.current || 45) * 1.1)
    case 'rev.store.target': return r0(60000 + full * 900)
    case 'rev.store.current': return r0(existing * 400)
    case 'rev.store.proforma': return r0(existing * 700)

    default:
      return getPath(inp, path) // no estimator — keep current
  }
}

// Ordered derivations. Dependencies come before dependents.
const DERIVE_ORDER = [
  'fullBuildSites', 'expansionAcres',
  // current scenario first
  'op.y2Occ.current', 'op.y3Occ.current', 'op.y4Occ.current',
  'op.y1Anc.current', 'op.y1OpEx.current',
  'rev.ltRate.current', 'rev.store.current',
  'mix.longTermPads.current', 'mix.stdTransient.current', 'mix.premium.current',
  'mix.tentGlamp.current', 'mix.cabins.current', 'mix.parkModel.current',
  'mix.groupHomes.current', 'mix.storage.current',
  // target scenario
  'op.y1Occ.target', 'op.y2Occ.target', 'op.y3Occ.target', 'op.y4Occ.target',
  'op.y1Rate.target', 'op.y2Rate.target', 'op.y1Anc.target', 'op.y2Anc.target',
  'op.y1OpEx.target',
  'rev.ltRate.target', 'rev.stdADR.target', 'rev.store.target',
  'mix.longTermPads.target', 'mix.stdTransient.target', 'mix.premium.target',
  'mix.tentGlamp.target', 'mix.cabins.target', 'mix.parkModel.target',
  'mix.groupHomes.target', 'mix.storage.target',
  // pro forma
  'op.y1Occ.proforma', 'op.y3Occ.proforma', 'op.y1Rate.proforma',
  'op.y1Anc.proforma', 'op.y1OpEx.proforma',
  'rev.ltRate.proforma', 'rev.stdADR.proforma', 'rev.store.proforma',
  'mix.longTermPads.proforma', 'mix.stdTransient.proforma', 'mix.premium.proforma',
  'mix.tentGlamp.proforma', 'mix.cabins.proforma', 'mix.parkModel.proforma',
  'mix.groupHomes.proforma', 'mix.storage.proforma',
  // escrows depend on full/opex; draws depend on escrows
  'repairEscrow', 'expansionEscrow', 'amenityCapex', 'operatingReserve',
  'taxReserve', 'insuranceReserve',
  'op.y1Draw.target', 'op.y2Draw.target', 'op.y3Draw.target',
]

// Build a fully-grounded input set from parsed fields, tagging every field's mode.
// parsed.fields: [{ path, value, provenance }]  (provenance 'reported' | 'seller')
export function buildEstimated(parsed, info) {
  const inp = defaultInputs()
  const modes = {}
  const readMap = {}

  // 1) apply reads
  for (const f of parsed.fields || []) {
    setPath(inp, f.path, f.value)
    const mode = f.provenance === 'seller' ? 'unsure' : 'read'
    modes[f.path] = mode
    readMap[f.path] = { value: f.value, mode }
  }

  // 2) derive everything else, in dependency order, skipping anything already read
  const ctx = ctxFromInfo(info)
  for (const path of DERIVE_ORDER) {
    if (readMap[path]) continue
    setPath(inp, path, deriveValue(path, inp, ctx))
    modes[path] = 'estimated'
  }

  return { inputs: inp, modes, readMap, ctx }
}

// Convert modes → the meta.source map the app stores per field.
export function modesToMeta(modes) {
  const meta = {}
  const map = { read: 'reported', unsure: 'seller', estimated: 'estimated', manual: 'verified', default: 'assumption' }
  for (const [path, mode] of Object.entries(modes || {})) {
    meta[path] = { source: map[mode] || 'assumption' }
  }
  return meta
}
