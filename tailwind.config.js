/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        diaryPink: "#ffd6e7",
        diaryPinkSoft: "#ffe6f0",
        diaryText: "#7b3b6a",
      },
      fontFamily: {
        rounded: ["system-ui", "sans-serif"],
      },
      boxShadow: {
        diary: "0 10px 30px rgba(255, 105, 180, 0.35)",
      },
      keyframes: {
        crownFall: {
          "0%": { transform: "translate(-50%, -120%)" },
          "80%": { transform: "translate(-50%, 0)" },
          "100%": { transform: "translate(-50%, -6%)" },
        },
      },
      animation: {
        crownFall: "crownFall 800ms ease-out forwards",
      },
    },
  },
  plugins: [],
}
