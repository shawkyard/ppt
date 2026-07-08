/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Bright, friendly "beautiful app" palette. Token names kept stable so
        // every screen restyles from here. (ink = app background, charcoal = cards,
        // stone = primary text, fog = secondary, mist = muted.)
        ink: '#F5F3FF',       // soft lavender-white app background
        charcoal: '#FFFFFF',  // card surface
        panel: '#FFFFFF',
        line: '#E9E4F5',      // soft hairline
        stone: '#2A2350',     // primary text (deep grape)
        fog: '#544C74',       // secondary text
        mist: '#8B84A8',      // muted text
        softgray: '#EAE6F4',
        // Candy accents (readable on white)
        gold: '#F5981E',      // warm amber (primary CTA)
        goldsoft: '#E08205',
        green: '#1FAE6B',
        greenbright: '#149C5B',
        turq: '#12B5A6',
        yellow: '#E0A100',    // readable goldenrod
        red: '#EF5D6B',
        grape: '#7A5AF5',     // playful purple
        grapesoft: '#6845E0',
        pink: '#FF6FB3',
        sky: '#3AB6FF',
      },
      fontFamily: {
        sans: ['ui-rounded', '"SF Pro Rounded"', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        serif: ['ui-serif', 'Georgia', 'Cambria', 'Times New Roman', 'serif'],
      },
      borderRadius: {
        '4xl': '1.75rem',
      },
      boxShadow: {
        panel: '0 12px 34px -16px rgba(90,60,180,0.28), 0 2px 8px -4px rgba(90,60,180,0.10)',
        soft: '0 10px 24px -12px rgba(90,60,180,0.30)',
        glow: '0 8px 24px -6px rgba(122,90,245,0.45)',
        pop: '0 14px 30px -10px rgba(245,152,30,0.45)',
      },
      keyframes: {
        floaty: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
        pop: { '0%': { transform: 'scale(0.96)', opacity: '0' }, '100%': { transform: 'scale(1)', opacity: '1' } },
      },
      animation: {
        floaty: 'floaty 6s ease-in-out infinite',
        pop: 'pop 0.25s ease-out',
      },
    },
  },
  plugins: [],
}
