import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'brand': {
          '50': '#EFF6FF',
          '100': '#DBEAFE',
          'primary': '#2563EB',
          'hover': '#1D4ED8',
        }
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulse: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
        float: 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'scale-in': 'scale-in 0.2s ease-out',
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        "MeetFlow-pro": {
          primary: "#2563EB",
          secondary: "#60A5FA",
          accent: "#DBEAFE",
          neutral: "#0F172A",
          "base-100": "#F8FAFC",
          "base-200": "#FFFFFF",
          "base-300": "#E2E8F0",
          "base-content": "#0F172A",
          success: "#22C55E",
          warning: "#F59E0B",
          error: "#EF4444",
        },
      },
      {
        "MeetFlow-dark": {
          primary: "#3B82F6",
          secondary: "#60A5FA",
          accent: "#1E3A8A",
          neutral: "#F8FAFC",
          "base-100": "#0F172A",
          "base-200": "#1E293B",
          "base-300": "#334155",
          "base-content": "#F8FAFC",
          success: "#10B981",
          warning: "#F59E0B",
          error: "#EF4444",
        },
      },
      "light",
      "dark",
      "cupcake",
      "bumblebee",
      "emerald",
      "corporate",
      "synthwave",
      "retro",
      "cyberpunk",
      "valentine",
      "halloween",
      "garden",
      "forest",
      "aqua",
      "lofi",
      "pastel",
      "fantasy",
      "wireframe",
      "black",
      "luxury",
      "dracula",
      "cmyk",
      "autumn",
      "business",
      "acid",
      "lemonade",
      "night",
      "coffee",
      "winter",
      "dim",
      "nord",
      "sunset",
    ],
  },
};
