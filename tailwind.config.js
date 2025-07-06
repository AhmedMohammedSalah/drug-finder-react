module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", 
  ],
  theme: {
    extend: {
      screens: {
        bp598: "598px",   // ≥ 598px → 2 cols
        bp893: "893px",   // ≥ 893px → 3 cols
        bp1410: "1410px", // ≥ 1410px → 4 cols
      },
    },
  },
  plugins: [],
};
