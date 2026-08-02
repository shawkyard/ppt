/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Warm near-black darks
        ink: '#1b1410',
        ink2: '#241a14',
        ink3: '#2e2219',
        // Warm light backgrounds
        ivory: '#f7efe2',
        cream: '#efe4d2',
        cream2: '#f2e9da',
        // Burnt orange accent
        orange: '#dd6a2b',
        orangebright: '#ee7d3c',
        // Supporting neutrals
        sand: '#c8b79c',
        brownline: '#785c40',
        // Text
        ondark: '#f4ecdd',
        ondarkmuted: '#c3b4a0',
        ondarkdim: '#8f8271',
        onlight: '#2a201a',
        onlightmuted: '#6d6053',
      },
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'Cambria', 'Times New Roman', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      maxWidth: {
        wrap: '1180px',
      },
      boxShadow: {
        warm: '0 30px 60px -30px rgba(40,22,8,0.55)',
        warmsm: '0 12px 30px -18px rgba(40,22,8,0.5)',
      },
    },
  },
  plugins: [],
}
