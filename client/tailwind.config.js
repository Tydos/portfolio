/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: "#b45309",
          hover: "#92400e",
          light: "#fef3c7",
          muted: "#d97706",
          subtle: "#fffbeb",
        },
        ink: {
          DEFAULT: "#0f172a",
          muted: "#475569",
        },
      },
      fontSize: {
        "nav": ["0.75rem", { lineHeight: "1rem", letterSpacing: "0.08em" }],
        "section": ["1.875rem", { lineHeight: "2.25rem", letterSpacing: "-0.02em" }],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
