// Simple, friendly stroke icons. One component, many names. currentColor-driven.
const P = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' }

const PATHS = {
  home: <><path {...P} d="M4 11 12 4l8 7" /><path {...P} d="M6 10v9h12v-9" /><path {...P} d="M10 19v-4h4v4" /></>,
  map: <><path {...P} d="M9 4 4 6v14l5-2 6 2 5-2V4l-5 2-6-2z" /><path {...P} d="M9 4v14M15 6v14" /></>,
  gate: <><circle {...P} cx="12" cy="7" r="3" /><path {...P} d="M5 20a7 7 0 0 1 14 0" /></>,
  queue: <><rect {...P} x="4" y="5" width="16" height="4" rx="1" /><rect {...P} x="4" y="11" width="16" height="4" rx="1" /><path {...P} d="M8 19h8" /></>,
  bolt: <path {...P} d="M13 3 5 13h5l-1 8 8-11h-5z" />,
  plus: <><path {...P} d="M12 5v14M5 12h14" /></>,
  upload: <><path {...P} d="M12 15V4" /><path {...P} d="M8 8l4-4 4 4" /><path {...P} d="M5 15v4h14v-4" /></>,
  doc: <><path {...P} d="M7 3h7l4 4v14H7z" /><path {...P} d="M14 3v4h4" /><path {...P} d="M9 12h6M9 16h6" /></>,
  gear: <><circle {...P} cx="12" cy="12" r="3" /><path {...P} d="M12 3v3M12 18v3M3 12h3M18 12h3M6 6l2 2M16 16l2 2M18 6l-2 2M8 16l-2 2" /></>,
  layers: <><path {...P} d="M12 4 3 9l9 5 9-5-9-5z" /><path {...P} d="M3 14l9 5 9-5" /></>,
  building: <><rect {...P} x="6" y="4" width="12" height="16" rx="1" /><path {...P} d="M9 8h1M14 8h1M9 12h1M14 12h1M9 16h6" /></>,
  pin: <><path {...P} d="M12 21s7-6.5 7-11a7 7 0 0 0-14 0c0 4.5 7 11 7 11z" /><circle {...P} cx="12" cy="10" r="2.5" /></>,
  search: <><circle {...P} cx="11" cy="11" r="6" /><path {...P} d="m20 20-3.5-3.5" /></>,
  calc: <><rect {...P} x="5" y="3" width="14" height="18" rx="2" /><path {...P} d="M8 7h8M8 11h2M12 11h2M16 11h.01M8 15h2M12 15h2M16 15h.01" /></>,
  shield: <><path {...P} d="M12 3 5 6v6c0 4 3 6.5 7 9 4-2.5 7-5 7-9V6z" /><path {...P} d="m9 12 2 2 4-4" /></>,
  calendar: <><rect {...P} x="4" y="5" width="16" height="16" rx="2" /><path {...P} d="M4 9h16M8 3v4M16 3v4" /></>,
  chart: <><path {...P} d="M4 20V4M4 20h16" /><path {...P} d="m7 15 3-4 3 2 5-6" /></>,
  checklist: <><path {...P} d="M9 6h11M9 12h11M9 18h11" /><path {...P} d="m4 6 1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2" /></>,
  warning: <><path {...P} d="M12 4 2 20h20L12 4z" /><path {...P} d="M12 10v4M12 17h.01" /></>,
  eye: <><path {...P} d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" /><circle {...P} cx="12" cy="12" r="2.5" /></>,
  dollar: <><circle {...P} cx="12" cy="12" r="9" /><path {...P} d="M12 7v10M9.5 9.5A2 2 0 0 1 12 9c1.5 0 2.5.8 2.5 1.8s-1 1.7-2.5 1.7-2.5.7-2.5 1.7S10.5 17 12 17a2 2 0 0 0 2.5-.5" /></>,
  target: <><circle {...P} cx="12" cy="12" r="8" /><circle {...P} cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="1.4" fill="currentColor" /></>,
  rocket: <><path {...P} d="M5 15c-1 1-1 4-1 4s3 0 4-1M14 4c3 1 6 4 6 7 0 2-4 6-8 8l-3-3c2-4 6-8 8-8-1-3-3-4-3-4z" /><circle {...P} cx="14.5" cy="9.5" r="1.5" /></>,
}

export default function Icon({ name, className = 'w-5 h-5', ...rest }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...rest}>
      {PATHS[name] || null}
    </svg>
  )
}
