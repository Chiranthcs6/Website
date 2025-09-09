/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",                  // Root level files (index.html)
    "./loginPage/*.html",        // Login page folder
    "./signUp/*.html",           // SignUp page folder  
    "./mainPage/*.html",         // Main page folder
    "./**/*.js",                 // All JavaScript files
    "!./node_modules/**"         // Exclude node_modules
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
