/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'sans-serif'],
      },
      colors: {
        // Carbon Design Gray 100 Theme
        'brand-bg': '#161616',
        'brand-surface': '#262626',
        'brand-primary': '#0f62fe', // Blue 60 (Primary Action)
        'brand-secondary': '#42be65', // Green 50 (Progress)
        'brand-text-primary': '#f4f4f4', // Gray 10
        'brand-text-secondary': '#8d8d8d', // Gray 50
        'brand-border': '#393939',      // Gray 80
        'brand-interactive-primary': '#0353e9', // Blue 60 Hover
        'brand-interactive-spotify': '#1db954', // Official Spotify Green
        'brand-interactive-spotify-hover': '#1aa34a', // Darker Spotify Green for hover
      }
    },
  },
  plugins: [],
}