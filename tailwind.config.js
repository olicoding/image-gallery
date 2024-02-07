module.exports = {
  future: {
    hoverOnlyWhenSupported: true,
  },
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        highlight: "inset 0 0 0 1px rgba(255, 255, 255, 0.05)",
      },
      screens: {
        "taller-than-854": { raw: "(min-height: 854px)" },
        "shorter-than-1000": { raw: "(max-height: 1000px)" },
      },
    },
  },
  plugins: [],
};
