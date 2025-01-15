/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        jersey: ['"Jersey 15"', "sans-serif"], // Jersey 15 font
        montserrat: ["Montserrat", "sans-serif"], // Montserrat font
        roboto: ["Roboto", "sans-serif"], // Roboto font
      },
    },
  },
  plugins: [],
};
