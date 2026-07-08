// Approximate lat/lng → SVG projection for the map command center.
// Linear projection tuned to the simplified US outline in USMap.jsx.
// NOT geographically exact — Version 1 uses approximate placement only.

export const MAP_W = 1000
export const MAP_H = 600

// Continental-US bounding box mapped into the outline's drawing box.
const LNG_MIN = -125, LNG_MAX = -66
const LAT_MIN = 25, LAT_MAX = 49
const X_MIN = 150, X_MAX = 760
const Y_MIN = 120, Y_MAX = 470

export function project([lat, lng]) {
  const x = X_MIN + ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * (X_MAX - X_MIN)
  const y = Y_MIN + ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * (Y_MAX - Y_MIN)
  return { x, y }
}
