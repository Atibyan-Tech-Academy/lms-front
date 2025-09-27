/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite/**/*.js", // 👈 Add this
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("daisyui"),      // 👈 DaisyUI
    require("flowbite/plugin") // 👈 Flowbite
  ],
}
