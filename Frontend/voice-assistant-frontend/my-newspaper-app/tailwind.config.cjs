/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'], // Add Roboto font
        playfair: ['Playfair Display', 'serif'], // Add Playfair Display font
      },
      colors: {
        'background-color': '#f5f5f5', // Light beige background
        'primary-color': '#2c3e50', // Dark blue for primary elements
        'secondary-color': '#16a085', // Green for accents
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        spinSlow: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        lift: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-3px)" },
        },
      },
      animation: {
        fadeInUp: "fadeInUp 0.5s ease forwards",
        float: "float 2.5s ease-in-out infinite",
        spinSlow: "spinSlow 10s linear infinite",
        lift: "lift 0.2s ease-in-out forwards",
      },
      textShadow: {
        md: '1px 1px 0px rgba(0, 0, 0, 0.1)', // Add subtle text shadow
      },
    },
  },
  plugins: [],
};
