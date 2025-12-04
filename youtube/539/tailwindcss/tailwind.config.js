// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./*.html"],
    theme: {
      extend: {
        colors: {
          // Defining custom Google Dark Mode colors
          google: {
            bg: '#202124',       // Main background
            footer: '#171717',   // Footer background
            element: '#303134',  // Search bar/button background
            textMain: '#e8eaed', // Bright text
            textGray: '#bdc1c6', // Muted text
            link: '#8ab4f8',     // Blue links
            blue: '#4285f4',
            red: '#ea4335',
            yellow: '#fbbc05',
            green: '#34a853',
          }
        }
      },
    },
    plugins: [],
  }