/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: update this to include the paths to all ofyour files with Tailwind classes
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};

