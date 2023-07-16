export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        smCT: "720px",
        // => @media (min-width: 720px) { ... }
      },
    },
  },
  plugins: [],
};
