/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "custom-blue-dark": "#363EB0",
        "custom-blue-light": "#4A55F2",
        "custom-gray-light": "#F4F4F4",
        "custom-gray-dark": "#DDDDDD",
        "custom-red-light": "#FF5659",
        "custom-green": "#24BD51",
        "custom-white": "#FCFCFC",
      },
      fontFamily: {
        cambria: ["Cambria"],
      },
      backgroundImage: {
        "background-image": "url('./images/backgroundImg.jpg')",
      },
    },
  },
  plugins: [],
};
