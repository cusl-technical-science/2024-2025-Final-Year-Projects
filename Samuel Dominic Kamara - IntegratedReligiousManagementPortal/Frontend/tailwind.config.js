module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1D4ED8", // Blue for primary elements
        secondary: "#10B981", // Green for secondary elements
        accent: "#F59E0B", // Orange for accents
        background: "#F3F4F6", // Light gray background
      },
      spacing: {
        128: "32rem", // Custom spacing value
      },
    },
  },
  plugins: [],
};
