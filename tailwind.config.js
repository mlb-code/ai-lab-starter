/** @type {import('tailwindcss').Config} */
// Design tokens shared with starter.ai-lab.co.il (2026): two colours, ivory type,
// Hebrew serif display, hairlines, no glow. Square on desktop, rounded "sheets" on mobile
// (the mobile radius override lives at the end of src/index.css).
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Noto Sans Hebrew"', 'system-ui', 'sans-serif'],
        display: ['"Noto Serif Hebrew"', 'Georgia', 'serif'],
        mono: ['"Space Mono"', '"Noto Sans Hebrew"', 'ui-monospace', 'monospace']
      },
      colors: {
        bg: {
          DEFAULT: '#050605',
          elev: '#0B0E0D',
          card: '#0F1211',
          side: '#050605',
          ink: '#141817'
        },
        ink: {
          100: '#F1EEE5',
          200: '#D9D6CD',
          300: 'rgba(241,238,229,0.72)',
          500: 'rgba(241,238,229,0.5)',
          700: 'rgba(241,238,229,0.34)',
          900: 'rgba(241,238,229,0.18)'
        },
        brand: {
          DEFAULT: '#10E593',
          glow: '#10E593',
          dim: 'rgba(16,229,147,0.08)',
          dim2: 'rgba(16,229,147,0.16)'
        },
        line: {
          DEFAULT: 'rgba(241,238,229,0.14)',
          strong: 'rgba(241,238,229,0.3)'
        },
        warn: '#FF7849',
        gold: '#F5C842'
      },
      boxShadow: {
        'brand': 'none',
        'brand-lg': 'none'
      },
      letterSpacing: {
        'kicker': '0.06em',
        'mono': '0.04em'
      },
      maxWidth: {
        'slide': '960px'
      },
      borderRadius: {
        none: '0',
        sm: '0',
        DEFAULT: '0',
        md: '0',
        lg: '0',
        xl: '0',
        '2xl': '0',
        '3xl': '0',
        full: '9999px'
      }
    }
  },
  plugins: []
}
