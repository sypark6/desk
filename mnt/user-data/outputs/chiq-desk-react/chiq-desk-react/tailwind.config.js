/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Clash Display"', 'sans-serif'],
        body: ['"Cabinet Grotesk"', 'sans-serif'],
      },
      colors: {
        ink: {
          DEFAULT: '#0f0f0d',
          2: '#3a3935',
          3: '#7a7870',
        },
        off: {
          DEFAULT: '#f7f7f5',
          2: '#f0eeeb',
        },
        border: {
          DEFAULT: '#e4e2de',
          2: '#d4d1cc',
        },
        accent: {
          DEFAULT: '#1a1aff',
          light: '#ebebff',
          mid: 'rgba(26,26,255,0.12)',
        },
        status: {
          green: '#16a34a',
          'green-bg': '#f0fdf4',
          'green-border': '#bbf7d0',
          amber: '#b45309',
          'amber-bg': '#fffbeb',
          'amber-border': '#fde68a',
          red: '#dc2626',
          'red-bg': '#fef2f2',
          'red-border': '#fecaca',
          blue: '#1d4ed8',
          'blue-bg': '#eff6ff',
          'blue-border': '#bfdbfe',
        },
      },
      borderRadius: {
        xl2: '14px',
        xl3: '18px',
      },
      boxShadow: {
        modal: '0 30px 80px rgba(0,0,0,0.2)',
        card: '0 4px 20px rgba(26,26,255,0.08)',
      },
    },
  },
  plugins: [],
}
