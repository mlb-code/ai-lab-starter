/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Heebo', 'system-ui', 'sans-serif'],
        display: ['Heebo', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'ui-monospace', 'monospace']
      },
      colors: {
        bg: {
          DEFAULT: '#080808',
          elev: '#101010',
          card: '#141414',
          side: '#0c0c0c',
          ink: '#1a1a1a'
        },
        ink: {
          100: '#f4f4f4',
          300: '#c8c8c8',
          500: '#888888',
          700: '#555555',
          900: '#333333'
        },
        brand: {
          DEFAULT: '#10E593',
          glow: '#c1f0c1',
          dim: 'rgba(16,229,147,0.08)',
          dim2: 'rgba(16,229,147,0.16)'
        },
        line: {
          DEFAULT: 'rgba(255,255,255,0.08)',
          strong: 'rgba(255,255,255,0.16)'
        },
        warn: '#FF7849',
        gold: '#F5C842'
      },
      boxShadow: {
        'brand': '0 8px 24px rgba(16,229,147,0.25)',
        'brand-lg': '0 12px 32px rgba(16,229,147,0.35)'
      },
      letterSpacing: {
        'kicker': '0.22em',
        'mono': '0.06em'
      },
      maxWidth: {
        'slide': '960px'
      }
    }
  },
  plugins: []
}
