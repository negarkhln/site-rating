/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#F5F0E8",
        navy: "#1A2A4A",
        gold: "#C9A84C",
      },
    },
  },
  plugins: [],
};
