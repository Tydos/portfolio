/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("@portfolio/theme/tailwind.preset")],
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wired: {
          black: "#000000",
          yellow: "#fcee0a",
          gray: "#757575",
          paper: "#ffffff",
        },
      },
      fontFamily: {
        display: [
          "var(--font-display)",
          "Anton",
          "Impact",
          "sans-serif",
        ],
      },
      letterSpacing: {
        wired: "-0.05em",
      },
    },
  },
};
