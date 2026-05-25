/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1d1c1a",
        paper: "#f5f1e8",
        mist: "#e7dfd1",
        sage: "#9ca88f",
        sand: "#cdbda3",
        rust: "#8e5f4d",
        pine: "#3f5a4b",
        night: "#252524"
      },
      boxShadow: {
        atlas: "0 10px 30px rgba(40, 35, 28, 0.08)"
      },
      borderRadius: {
        atlas: "1.5rem"
      },
      fontFamily: {
        serif: ["Iowan Old Style", "Palatino Linotype", "Book Antiqua", "Georgia", "serif"],
        sans: ["Avenir Next", "Segoe UI", "Helvetica Neue", "Arial", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
