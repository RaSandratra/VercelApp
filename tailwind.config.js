/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#10B981',
          background: '#111827',
          surface: '#1F2937',
          foreground: '#F9FAFB',
          muted: '#9CA3AF',
        },
      },
      boxShadow: {
        glow: '0 14px 32px rgba(16, 185, 129, 0.22)',
        'dark-sm': '0 1px 3px rgba(0, 0, 0, 0.26)',
        'dark-md': '0 8px 24px rgba(0, 0, 0, 0.34)',
      },
    },
  },
  plugins: [],
}
