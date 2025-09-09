/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",           // Scans all HTML files in root
    "./src/**/*.{html,js}" // Scans all HTML/JS files in src folder
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
