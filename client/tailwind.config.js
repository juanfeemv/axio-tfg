/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // <--- ¡ESTA LÍNEA ES LA CLAVE!
  theme: {
    extend: {},
  },
  plugins: [],
}