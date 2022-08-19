/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "custom-blue": "#363EB0",
        "custom-gray-light": "#F4F4F4",
        "custom-gray-dark": "#DDDDDD",
        "custom-red-light": "#FF5659",
        "custom-green": "#24BD51",
      },
      fontFamily: {
        cambria: ["Cambria"],
      },
    },
  },
  plugins: [],
};
