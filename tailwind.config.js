/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      blue: {
        200: `#4878D9`,
        300: `#3F6ABF`,
        400: "#325599",
        500: `#2E4E8C`,
        600: "#263F73",
        700: `#192A4D`,
        800: "#1D3159",
        900: "#152340",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
