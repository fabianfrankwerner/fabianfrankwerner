// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html"],
  theme: {
    extend: {
      colors: {
        google: {
          bg: "#1f1f1f",
          footer: "#171717",
          element: "#303134",
          elementHover: "#3c4043",
          textMain: "#e8eaed",
          textGray: "#bdc1c6",
          link: "#8ab4f8",
          border: "#5f6368",
          icon: "#9aa0a6",
        },
      },
    },
  },
  plugins: [],
};
