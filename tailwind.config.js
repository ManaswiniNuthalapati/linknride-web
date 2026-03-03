/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0057B8",
        accent: "#FF8C00",
        background: "#F5F5F5",
        dark: "#333333",
      },
    },
  },
  plugins: [],
};
