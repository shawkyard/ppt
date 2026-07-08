/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // HawkTech-style: white-first, black text, orange accent.
        // Token names kept stable so every screen restyles from here.
        // ink = app canvas (soft off-white), charcoal/panel = white cards,
        // stone = black text, fog = secondary, mist = muted.
        ink: '#F7F7F4',        // soft off-white canvas
        offwhite: '#F8F8F5',   // inset panels
        charcoal: '#FFFFFF',   // card surface
        panel: '#FFFFFF',
        coal: '#181818',       // optional dark section
        line: '#E5E7EB',       // light gray border
        stone: '#111111',      // black text
        fog: '#4B4B4B',        // secondary text
        mist: '#8A8A8A',       // muted text
        softgray: '#EFEFEC',
        // Accent system
        gold: '#F97316',       // orange (primary)
        goldsoft: '#EA580C',   // deep orange
        softorange: '#FFF3E8',
        grape: '#F97316',      // alias → orange (legacy usages)
        grapesoft: '#EA580C',
        green: '#16A34A',
        greenbright: '#15A34A',
        turq: '#0D9488',       // pre-emerging teal (readable)
        yellow: '#CA8A04',     // readable amber-yellow for text
        red: '#DC2626',
        sky: '#2563EB',
        pink: '#F97316',
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        serif: ['ui-serif', 'Georgia', 'Cambria', '"Times New Roman"', 'serif'],
      },
      borderRadius: { '4xl': '1.75rem' },
      boxShadow: {
        panel: '0 1px 2px rgba(17,17,17,0.04), 0 8px 24px -14px rgba(17,17,17,0.18)',
        soft: '0 1px 2px rgba(17,17,17,0.04), 0 6px 18px -12px rgba(17,17,17,0.20)',
        pop: '0 8px 22px -8px rgba(249,115,22,0.45)',
        glow: '0 8px 22px -8px rgba(249,115,22,0.35)',
      },
      keyframes: {
        floaty: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
        pop: { '0%': { transform: 'scale(0.97)', opacity: '0' }, '100%': { transform: 'scale(1)', opacity: '1' } },
      },
      animation: { floaty: 'floaty 6s ease-in-out infinite', pop: 'pop 0.25s ease-out' },
    },
  },
  plugins: [],
}
