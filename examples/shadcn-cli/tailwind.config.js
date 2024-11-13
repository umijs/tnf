import tailwindcssAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["src/pages/**/*.{ts,tsx}", "src/components/**/*.{ts,tsx}"],
  plugins: [tailwindcssAnimate],
  prefix: "tnf-tw-"
}
