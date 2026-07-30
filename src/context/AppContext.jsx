import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { loadDeals, saveDeals, newId } from '../lib/store.js'
import { defaultInputs } from '../lib/schema.js'
import { runModel, assumptionCount } from '../lib/model.js'
import { runScreen } from '../lib/screen.js'

const AppContext = createContext(null)

// A deal = { id, name, createdAt, inputs, meta, info, rawText }
export function AppProvider({ children }) {
  const [deals, setDeals] = useState(() => loadDeals())

  useEffect(() => { saveDeals(deals) }, [deals])

  const api = useMemo(() => ({
    deals,
    getDeal: (id) => deals.find((d) => d.id === id) || null,

    addDeal({ name, inputs, meta, info, rawText }) {
      const id = newId()
      const deal = {
        id,
        name: name || inputs.propertyName || 'Untitled RV Park',
        createdAt: Date.now(),
        inputs,
        meta: meta || {},
        info: info || [],
        rawText: rawText || '',
      }
      setDeals((ds) => [deal, ...ds])
      return id
    },

    // Edit an input; mark the field as reviewer-verified.
    updateInput(id, path, value) {
      setDeals((ds) => ds.map((d) => {
        if (d.id !== id) return d
        const inputs = structuredClone(d.inputs)
        const keys = path.split('.')
        const last = keys.pop()
        let cur = inputs
        for (const k of keys) { if (cur[k] == null) cur[k] = {}; cur = cur[k] }
        cur[last] = value
        const meta = { ...d.meta, [path]: { ...(d.meta[path] || {}), source: 'verified' } }
        const name = path === 'propertyName' ? String(value) : d.name
        return { ...d, inputs, meta, name }
      }))
    },

    removeDeal(id) {
      setDeals((ds) => ds.filter((d) => d.id !== id))
    },

    blankInputs: () => defaultInputs(),
  }), [deals])

  return <AppContext.Provider value={api}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}

// Compute the full model + assumptions audit for a deal.
export function useModel(deal) {
  return useMemo(() => {
    if (!deal) return null
    const model = runModel(deal.inputs)
    return { model, audit: assumptionCount(deal.meta), screen: runScreen(deal.inputs, model) }
  }, [deal])
}
