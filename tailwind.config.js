/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          deep: '#07111F',
          DEFAULT: '#0B1626',
          surface: '#0E1D31',
        },
        card: {
          DEFAULT: '#111D2E',
          hover: '#162438',
          border: 'rgba(255, 255, 255, 0.08)',
        },
        accent: {
          primary: '#7C5CFF',
          secondary: '#19C3FF',
        },
        status: {
          success: '#25D695',
          warning: '#F5B942',
          danger: '#FF5D73',
          neutral: '#8795A8',
        },
        text: {
          primary: '#F5F7FA',
          muted: '#8795A8',
          subtle: '#52627A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flow-particle': 'particle 2s linear infinite',
      },
      keyframes: {
        particle: {
          '0%': { offsetDistance: '0%' },
          '100%': { offsetDistance: '100%' },
        },
      },
    },
  },
  plugins: [],
};
