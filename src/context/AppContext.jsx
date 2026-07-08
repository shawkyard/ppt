import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { demoMarkets, demoProperties } from '../data/demoData.js'
import { loadState, saveState } from '../lib/storage.js'
import { screenMarket, screenProperty } from '../lib/screen.js'

const AppContext = createContext(null)

const uid = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 8)}`

export function AppProvider({ children }) {
  const [markets, setMarkets] = useState([])
  const [properties, setProperties] = useState([])

  // Hydrate from localStorage, or seed demo data on first run.
  useEffect(() => {
    const saved = loadState()
    if (saved?.markets?.length) {
      setMarkets(saved.markets)
      setProperties(saved.properties || [])
    } else {
      setMarkets(demoMarkets)
      setProperties(demoProperties)
    }
  }, [])

  // Persist on change (skip the initial empty render).
  useEffect(() => {
    if (markets.length || properties.length) {
      saveState({ markets, properties })
    }
  }, [markets, properties])

  // Derived, screened views — recomputed whenever underlying data changes.
  const screenedMarkets = useMemo(() => markets.map(screenMarket), [markets])
  const screenedProperties = useMemo(() => {
    return properties.map((p) => {
      const mkt = screenedMarkets.find((m) => m.id === p.marketId)
      return screenProperty(p, mkt)
    })
  }, [properties, screenedMarkets])

  const api = useMemo(() => ({
    markets,
    properties,
    screenedMarkets,
    screenedProperties,

    getMarket: (id) => screenedMarkets.find((m) => m.id === id),
    getProperty: (id) => screenedProperties.find((p) => p.id === id),

    addProperty: (data) => {
      const id = uid('prop')
      setProperties((prev) => [...prev, { id, ...data }])
      return id
    },
    updateProperty: (id, patch) => {
      setProperties((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)))
    },
    removeProperty: (id) => {
      setProperties((prev) => prev.filter((p) => p.id !== id))
    },

    addMarket: (data) => {
      const id = uid('mkt')
      setMarkets((prev) => [...prev, { id, ...data }])
      return id
    },
    updateMarket: (id, patch) => {
      setMarkets((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)))
    },
    removeMarket: (id) => {
      setMarkets((prev) => prev.filter((m) => m.id !== id))
    },

    resetDemo: () => {
      setMarkets(demoMarkets)
      setProperties(demoProperties)
    },
  }), [markets, properties, screenedMarkets, screenedProperties])

  return <AppContext.Provider value={api}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
