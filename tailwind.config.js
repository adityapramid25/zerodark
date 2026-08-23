/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cosmic: {
          darkest: '#070A11',
          night: '#0B0F19',
          card: '#111827',
          slate: '#151D2A',
          border: 'rgba(255, 255, 255, 0.08)',
        },
        clay: {
          lime: '#DCFD8B',
          limeDark: '#1c2b20',
          purple: '#BC84EE',
          purpleDark: '#251c33',
          orange: '#FF823A',
          orangeDark: '#2b1d18',
          slate: '#151D2A',
          textDark: '#0B0F19',
        }
      },
      borderRadius: {
        'clay-sm': '16px',
        'clay-md': '22px',
        'clay-lg': '28px',
        'clay-xl': '36px',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '0.9', transform: 'scale(1)' },
          '50%': { opacity: '0.4', transform: 'scale(1.05)' },
        },
        'scan-line': {
          '0%': { top: '0%' },
          '50%': { top: '90%' },
          '100%': { top: '0%' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      },
      animation: {
        'pulse-glow': 'pulse-glow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan-line': 'scan-line 2.5s ease-in-out infinite',
        'float': 'float 4s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
