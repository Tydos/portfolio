/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("@portfolio/theme/tailwind.preset")],
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
};
