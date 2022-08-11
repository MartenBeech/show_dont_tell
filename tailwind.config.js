/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "custom-blue": "#363EB0",
        "custom-gray": "#F4F4F4",
      },
      fontFamily: {
        cambria: ["Cambria"],
      },
    },
  },
  plugins: [],
};
