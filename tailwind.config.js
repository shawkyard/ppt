/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Premium institutional palette
        ink: '#0b0d0f', // near-black
        charcoal: '#16191d',
        graphite: '#22262c',
        slateline: '#2e343c',
        mist: '#8b929c', // soft gray text
        fog: '#c7ccd3',
        gold: '#c8a95a', // muted gold accent
        goldsoft: '#a4894a',
        approve: '#4f9d69', // green accent
        approvesoft: '#3c7d52',
        warn: '#c9a227',
        danger: '#b4544b',
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        serif: ['ui-serif', 'Georgia', 'Cambria', 'Times New Roman', 'serif'],
      },
      boxShadow: {
        panel: '0 1px 0 0 rgba(255,255,255,0.03) inset, 0 8px 24px -12px rgba(0,0,0,0.6)',
      },
    },
  },
  plugins: [],
}
