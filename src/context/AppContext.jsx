import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { demoMarkets } from '../data/markets.js'
import { demoProperties } from '../data/properties.js'
import { loadState, saveState } from '../lib/storage.js'
import { screenMarket, screenProperty } from '../lib/screen.js'

const AppContext = createContext(null)
const uid = (p) => `${p}-${Math.random().toString(36).slice(2, 8)}`

const DEFAULT_SETTINGS = {
  sourcingMode: 'Manual / Assisted',   // default; live scraping locked in V1
  liveScrapingEnabled: false,
  runBudgetUSD: 0,
  maxPropertiesPerRun: 5,
  returnTopN: 5,
  approvedMarketsOnly: true,
  investorName: 'Scott & Alma',
  fundName: 'Stonebrook Multifamily',
}

export function AppProvider({ children }) {
  const [markets, setMarkets] = useState([])
  const [properties, setProperties] = useState([])
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const saved = loadState()
    if (saved?.markets?.length) {
      setMarkets(saved.markets)
      setProperties(saved.properties || [])
      setSettings({ ...DEFAULT_SETTINGS, ...(saved.settings || {}) })
    } else {
      setMarkets(demoMarkets)
      setProperties(demoProperties)
    }
    setReady(true)
  }, [])

  useEffect(() => {
    if (ready) saveState({ markets, properties, settings })
  }, [markets, properties, settings, ready])

  const screenedMarkets = useMemo(() => markets.map(screenMarket), [markets])
  const screenedProperties = useMemo(() => properties.map((p) => {
    const m = screenedMarkets.find((x) => x.id === p.marketId)
    return screenProperty(p, m)
  }), [properties, screenedMarkets])

  const api = useMemo(() => ({
    ready, markets, properties, settings, screenedMarkets, screenedProperties,
    getMarket: (id) => screenedMarkets.find((m) => m.id === id),
    getProperty: (id) => screenedProperties.find((p) => p.id === id),

    addProperty: (data) => { const id = uid('prop'); setProperties((p) => [...p, { id, ...data }]); return id },
    updateProperty: (id, patch) => setProperties((p) => p.map((x) => (x.id === id ? { ...x, ...patch } : x))),
    removeProperty: (id) => setProperties((p) => p.filter((x) => x.id !== id)),

    addMarket: (data) => { const id = uid('mkt'); setMarkets((m) => [...m, { id, ...data }]); return id },
    updateMarket: (id, patch) => setMarkets((m) => m.map((x) => (x.id === id ? { ...x, ...patch } : x))),
    removeMarket: (id) => setMarkets((m) => m.filter((x) => x.id !== id)),

    updateSettings: (patch) => setSettings((s) => ({ ...s, ...patch })),

    resetDemo: () => { setMarkets(demoMarkets); setProperties(demoProperties); setSettings(DEFAULT_SETTINGS) },
  }), [ready, markets, properties, settings, screenedMarkets, screenedProperties])

  return <AppContext.Provider value={api}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
