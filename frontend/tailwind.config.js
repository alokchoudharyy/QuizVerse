/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          voidSpace: '#070A13',
          glassFill: 'rgba(15, 23, 42, 0.65)',
          indigoGlow: '#5356FF',
          neonCyan: '#00F2FE'
        }
      }
    },
  },
  plugins: [],
}