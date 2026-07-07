interface IconProps {
  name: string;
  size?: number;
  className?: string;
}

// A small hand-rolled icon set (stroke-based, inherits currentColor) so the app
// ships with zero icon dependencies and works fully offline.
const PATHS: Record<string, JSX.Element> = {
  home: (
    <>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
      <path d="M9.5 21v-6h5v6" />
    </>
  ),
  inbox: (
    <>
      <path d="M3 13h4l2 3h6l2-3h4" />
      <path d="M3 13 5 5h14l2 8v6H3z" />
    </>
  ),
  create: (
    <>
      <path d="M12 3v18M3 12h18" />
      <path d="M18 5l1.5 1.5M5 18l1.5 1.5" opacity="0.4" />
    </>
  ),
  folder: (
    <>
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </>
  ),
  history: (
    <>
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 4v4h4" />
      <path d="M12 8v4l3 2" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" />
    </>
  ),
  brain: (
    <>
      <path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-1 5.8V16a3 3 0 0 0 4 2.8" />
      <path d="M15 4a3 3 0 0 1 3 3 3 3 0 0 1 1 5.8V16a3 3 0 0 1-4 2.8" />
      <path d="M9 4a3 3 0 0 1 3 3v12M15 4a3 3 0 0 0-3 3" />
    </>
  ),
  hammer: (
    <>
      <path d="M14 3l7 7-3 3-7-7z" />
      <path d="M12 7 4 15a2 2 0 0 0 0 3l0 0a2 2 0 0 0 3 0l8-8" />
    </>
  ),
  wand: (
    <>
      <path d="M15 4V2M15 10V8M11 6H9M21 6h-2M18 3l-1.5 1.5M18 9l-1.5-1.5" opacity="0.6" />
      <path d="M13 8 4 17a1.5 1.5 0 0 0 0 2l1 1a1.5 1.5 0 0 0 2 0l9-9z" />
    </>
  ),
  bug: (
    <>
      <rect x="8" y="8" width="8" height="10" rx="4" />
      <path d="M12 8V5M9 6l-1-2M15 6l1-2M8 12H4M20 12h-4M8 16l-3 2M16 16l3 2" />
    </>
  ),
  chat: (
    <>
      <path d="M4 5h16v11H9l-4 3v-3H4z" />
      <path d="M8 9h8M8 12h5" opacity="0.5" />
    </>
  ),
  compare: (
    <>
      <rect x="3" y="5" width="7" height="14" rx="1.5" />
      <rect x="14" y="5" width="7" height="14" rx="1.5" />
      <path d="M12 3v18" opacity="0.4" />
    </>
  ),
  clipboard: (
    <>
      <rect x="6" y="4" width="12" height="17" rx="2" />
      <path d="M9 4a3 3 0 0 1 6 0" />
      <path d="M9 11l2 2 4-4" opacity="0.6" />
    </>
  ),
  upload: (
    <>
      <path d="M12 16V4M8 8l4-4 4 4" />
      <path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
    </>
  ),
  copy: (
    <>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h8" />
    </>
  ),
  check: <path d="M4 12l5 5L20 6" />,
  trash: (
    <>
      <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  x: <path d="M6 6l12 12M18 6 6 18" />,
  bolt: <path d="M13 2 4 14h6l-1 8 9-12h-6z" />,
  eye: (
    <>
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  camera: (
    <>
      <path d="M4 8h3l2-2h6l2 2h3v11H4z" />
      <circle cx="12" cy="13" r="3.5" />
    </>
  ),
  note: (
    <>
      <path d="M5 3h14v18l-4-3-3 3-3-3-4 3z" />
      <path d="M8 8h8M8 12h6" opacity="0.5" />
    </>
  ),
  paste: (
    <>
      <path d="M9 3h6v3H9z" />
      <path d="M7 5H5v16h14V5h-2" />
    </>
  ),
};

export function Icon({ name, size = 20, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {PATHS[name] ?? PATHS.bolt}
    </svg>
  );
}
