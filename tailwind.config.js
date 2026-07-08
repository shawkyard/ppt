/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Stonebrook institutional command-center palette
        ink: '#05070A',       // near black
        charcoal: '#111827',
        panel: '#0d131e',     // slightly lifted panel
        line: '#1e293b',      // hairline borders
        stone: '#F5F1E8',     // warm stone (primary light text on dark)
        mist: '#94A3B8',      // soft gray text
        fog: '#CBD5E1',
        gold: '#C9A45C',      // muted gold accent
        goldsoft: '#a98a48',
        green: '#2E7D5B',     // trust green / continuing emerging
        greenbright: '#3fa876',
        turq: '#4DD6D0',      // pre-emerging
        yellow: '#DFFF00',    // new emerging
        red: '#C94848',       // risk
        softgray: '#E5E7EB',
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        serif: ['ui-serif', 'Georgia', 'Cambria', 'Times New Roman', 'serif'],
      },
      boxShadow: {
        panel: '0 1px 0 0 rgba(255,255,255,0.03) inset, 0 10px 30px -14px rgba(0,0,0,0.7)',
        glow: '0 0 0 1px rgba(201,164,92,0.25), 0 0 24px -6px rgba(201,164,92,0.35)',
      },
    },
  },
  plugins: [],
}
