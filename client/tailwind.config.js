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
          DEFAULT: "#0071e3",
          hover: "#0077ed",
          light: "#e8f2fd",
          muted: "#147ce5",
          subtle: "#f5f9fe",
        },
        ink: {
          DEFAULT: "#1d1d1f",
          muted: "#6e6e73",
        },
      },
      fontSize: {
        "nav": ["0.75rem", { lineHeight: "1rem", letterSpacing: "0.02em" }],
        "section": ["2.25rem", { lineHeight: "2.5rem", letterSpacing: "-0.03em" }],
        "hero": ["clamp(2.75rem, 6vw, 5.5rem)", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        "display": ["clamp(1.5rem, 3vw, 2.25rem)", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
