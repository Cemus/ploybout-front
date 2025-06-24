/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      fontFamily: {
        normal: ["Poppins", "serif"],
        title: ["Alfa Slab One", "serif"],
        logo: ["Bangers", "serif"],
      },
    },
  },
  plugins: [],
};
