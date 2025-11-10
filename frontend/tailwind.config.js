/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // omogućava dark mode preko klase 'dark'
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "custom-gradient": "linear-gradient(90deg, #DADAF3 47%, #6364BF 100%)",
      },
      colors: {
        mainDarkBG: "#282828", // tvoja glavna crna pozadina
        cardBGText: "#1d1d1d", // tamna boja teksta
        cardBg: "#5b5b5b", // primer dodatne boje
        darkText: "#bcbcbc", // primer dodatne boje
        goldBg: "#FFBF00", // primer dodatne boje
        blueBg: "#2563eb", // primer dodatne boje
      },
    },
  },
  plugins: [],
};
