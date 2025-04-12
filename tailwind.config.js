/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"], // update based on your structure
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")], // DaisyUI plugin
  daisyui: {
    themes: ["light", "dark", "cupcake"], // You can add more themes here
  },
};
