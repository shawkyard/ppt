// Approximate US map for the command center. NOT geographically exact — Version 1
// places markets by approximate lat/lng over a simplified continental outline.
import { useState } from 'react'
import { project, MAP_W, MAP_H } from '../lib/map.js'
import { INDICATORS } from '../lib/reindicator.js'

// Simplified continental-US silhouette (approximate) tuned to lib/map projection.
const US_PATH =
  'M173 127 L235 120 L308 120 L370 120 L442 120 L463 115 L515 142 L536 164 L567 164 ' +
  'L588 193 L593 215 L633 203 L658 193 L689 178 L710 174 L725 164 L745 145 L749 150 ' +
  'L708 215 L677 241 L661 273 L656 295 L656 317 L620 353 L606 375 L602 397 L614 455 ' +
  'L606 467 L596 448 L589 426 L581 400 L565 393 L534 393 L519 397 L514 412 L467 401 ' +
  'L452 419 L437 455 L416 432 L380 404 L344 371 L328 371 L297 375 L261 358 L235 358 ' +
  'L222 339 L199 331 L178 283 L163 244 L163 193 L163 149 Z'

export default function USMap({ markets, properties, selected, onSelectMarket, onSelectProperty }) {
  const [hover, setHover] = useState(null)

  return (
    <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="w-full h-full block" role="img" aria-label="Approximate US emerging-markets map">
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke="#0e1626" strokeWidth="1" />
        </pattern>
        <radialGradient id="sea" cx="50%" cy="40%" r="75%">
          <stop offset="0%" stopColor="#0a1220" />
          <stop offset="100%" stopColor="#05070A" />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width={MAP_W} height={MAP_H} fill="url(#sea)" />
      <rect x="0" y="0" width={MAP_W} height={MAP_H} fill="url(#grid)" opacity="0.5" />

      {/* Landmass */}
      <path d={US_PATH} fill="#0f1a2b" stroke="#243449" strokeWidth="1.5" />
      <path d={US_PATH} fill="none" stroke="#C9A45C" strokeWidth="0.6" opacity="0.25" />

      {/* Market regions (approximate blobs) */}
      {markets.map((m) => {
        const { x, y } = project(m.coordinates)
        const ind = INDICATORS[m.indicatorColor] || INDICATORS.white
        const isSel = selected?.type === 'market' && selected.id === m.id
        const isHover = hover === m.id
        const r = m.radius || 24
        return (
          <g key={m.id} className="cursor-pointer" onClick={() => onSelectMarket(m.id)}
             onMouseEnter={() => setHover(m.id)} onMouseLeave={() => setHover(null)}>
            <circle cx={x} cy={y} r={r} fill={ind.color} fillOpacity={isSel || isHover ? 0.42 : 0.24}
              stroke={ind.color} strokeWidth={isSel ? 2.5 : 1.5} strokeOpacity="0.9" />
            {(isSel || isHover) && (
              <g>
                <rect x={x + r + 4} y={y - 12} width={m.marketName.length * 6.4 + 16} height="22" rx="4"
                  fill="#05070A" stroke="#243449" />
                <text x={x + r + 12} y={y + 3} fill="#F5F1E8" fontSize="12" fontWeight="600">{m.marketName}</text>
              </g>
            )}
          </g>
        )
      })}

      {/* Property pins */}
      {properties.map((p) => {
        if (!p.market) return null
        const base = project(p.market.coordinates)
        // slight offset so pins don't sit exactly on the market center
        const x = base.x + 10, y = base.y - 8
        const isSel = selected?.type === 'property' && selected.id === p.id
        const tone = p.verdict.tone
        const color = tone === 'green' ? '#3fa876' : tone === 'yellow' ? '#DFFF00' : '#C94848'
        return (
          <g key={p.id} className="cursor-pointer" onClick={(e) => { e.stopPropagation(); onSelectProperty(p.id) }}>
            <path d={`M${x} ${y} c-7 -9 -11 -13 -11 -20 a11 11 0 0 1 22 0 c0 7 -4 11 -11 20 z`}
              fill="#05070A" stroke={color} strokeWidth={isSel ? 2.5 : 1.5} transform={`translate(0,${-4})`} />
            <circle cx={x} cy={y - 24} r="4.5" fill={color} />
          </g>
        )
      })}
    </svg>
  )
}
