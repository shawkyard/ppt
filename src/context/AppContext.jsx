import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { demoMarkets } from '../data/markets.js'
import { demoProperties } from '../data/properties.js'
import { loadState, saveState } from '../lib/storage.js'
import { screenMarket, screenProperty } from '../lib/screen.js'
import { DEFAULT_RULES } from '../lib/sourcingRules.js'

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
  sourcingRules: { ...DEFAULT_RULES },
}

export function AppProvider({ children }) {
  const [markets, setMarkets] = useState([])
  const [properties, setProperties] = useState([])
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  // Manual map-layer values: { [layerId]: { [year]: { [marketId]: 'HIGH'|'MEDIUM'|'LOW'|'NA' } } }
  const [layerData, setLayerData] = useState({})
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const saved = loadState()
    if (saved?.markets?.length) {
      setMarkets(saved.markets)
      setProperties(saved.properties || [])
      setSettings({ ...DEFAULT_SETTINGS, ...(saved.settings || {}) })
      setLayerData(saved.layerData || {})
    } else {
      setMarkets(demoMarkets)
      setProperties(demoProperties)
    }
    setReady(true)
  }, [])

  useEffect(() => {
    if (ready) saveState({ markets, properties, settings, layerData })
  }, [markets, properties, settings, layerData, ready])

  const screenedMarkets = useMemo(() => markets.map(screenMarket), [markets])
  const screenedProperties = useMemo(() => properties.map((p) => {
    const m = screenedMarkets.find((x) => x.id === p.marketId)
    return screenProperty(p, m)
  }), [properties, screenedMarkets])

  const setLayerValue = (layerId, year, marketId, bucket) => setLayerData((prev) => {
    const next = { ...prev, [layerId]: { ...(prev[layerId] || {}) } }
    const yr = { ...(next[layerId][year] || {}) }
    if (bucket == null) delete yr[marketId]; else yr[marketId] = bucket
    next[layerId][year] = yr
    return next
  })

  const api = useMemo(() => ({
    ready, markets, properties, settings, layerData, setLayerValue, screenedMarkets, screenedProperties,
    getMarket: (id) => screenedMarkets.find((m) => m.id === id),
    getProperty: (id) => screenedProperties.find((p) => p.id === id),

    addProperty: (data) => { const id = uid('prop'); setProperties((p) => [...p, { id, ...data }]); return id },
    updateProperty: (id, patch) => setProperties((p) => p.map((x) => (x.id === id ? { ...x, ...patch } : x))),
    removeProperty: (id) => setProperties((p) => p.filter((x) => x.id !== id)),

    addMarket: (data) => { const id = uid('mkt'); setMarkets((m) => [...m, { id, ...data }]); return id },
    updateMarket: (id, patch) => setMarkets((m) => m.map((x) => (x.id === id ? { ...x, ...patch } : x))),
    removeMarket: (id) => setMarkets((m) => m.filter((x) => x.id !== id)),

    updateSettings: (patch) => setSettings((s) => ({ ...s, ...patch })),

    resetDemo: () => { setMarkets(demoMarkets); setProperties(demoProperties); setSettings(DEFAULT_SETTINGS); setLayerData({}) },
  }), [ready, markets, properties, settings, layerData, screenedMarkets, screenedProperties])

  return <AppContext.Provider value={api}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
