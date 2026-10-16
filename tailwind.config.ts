import type { Config } from "tailwindcss";

const config: Config = {
  // lib/ is scanned too: colour classes stored in lib/data.ts must not be purged
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Baloo 2'", "'Trebuchet MS'", "system-ui", "sans-serif"],
        body: ["'Nunito'", "system-ui", "sans-serif"],
      },
      colors: {
        sky: { 50: "#eef8ff", 100: "#d6efff", 400: "#4cb4ff", 600: "#1b84d9" },
        sun: { 300: "#ffe27a", 400: "#ffd23f", 500: "#ffb800" },
        leaf: { 400: "#5ecb6b", 600: "#2f9e44" },
        berry: { 400: "#ff6b9d", 600: "#d6336c" },
        grape: { 400: "#a78bfa", 600: "#7048e8" },
        orange: { 400: "#ff9f43", 600: "#e8590c" },
      },
      keyframes: {
        floaty: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        wiggle: {
          "0%,100%": { transform: "rotate(-4deg)" },
          "50%": { transform: "rotate(4deg)" },
        },
      },
      animation: {
        floaty: "floaty 3.5s ease-in-out infinite",
        wiggle: "wiggle 0.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
