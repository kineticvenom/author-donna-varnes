/** @type {import('tailwindcss').Config} */
const typography = require('@tailwindcss/typography');
const aspectRatio = require('@tailwindcss/aspect-ratio');

module.exports= {
  content: ["./app/**/*.{ts,tsx}", "./sanity/**/*.{ts,tsx}","./components/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
    },
    extend: {
      boxShadow: {
        layer: "0 35px 60px -15px rgba(0, 0, 0, 0.3)",
      },
      colors: {
        // Warm earth tone palette inspired by literary/author sites
        gold: {
          50: "#fdf8f0",
          100: "#f9edd9",
          200: "#f3dbb3",
          300: "#e9c080",
          400: "#d9a55c",
          500: "#be9261", // Primary gold accent
          600: "#a67b4b",
          700: "#8a6340",
          800: "#6d4e35",
          900: "#5a4023",
          950: "#3d2a17",
        },
        brown: {
          50: "#faf6f3",
          100: "#f0e8e0",
          200: "#e0d0c0",
          300: "#c9b199",
          400: "#b08f70",
          500: "#8b6f52",
          600: "#6b5642",
          700: "#554840", // Primary text brown
          800: "#453a34",
          900: "#3d3c3c", // Hover brown
          950: "#2a2523",
        },
        cream: {
          50: "#fffef9",
          100: "#fefcf3",
          200: "#fdf8e8",
          300: "#faf3dc",
          400: "#f5eacc",
          500: "#f0e1bc",
          600: "#e5d4a8",
          700: "#d4c090",
          800: "#bfa770",
          900: "#a08a55",
        },
        accent: "var(--accent)",
        "accent-foreground": "var(--accent-fg)",
        muted: "var(--muted)",
        black: "#2a2523",
        white: "#fffef9",
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
        serif: ["var(--font-serif)", "Georgia", "Cambria", "serif"],
      },
      fontSize: {
        base: ["16px", "1.7"],
        h1: ["48px", "1.1"],
        h2: ["32px", "1.2"],
        h3: ["24px", "1.3"],
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [typography,aspectRatio],
};