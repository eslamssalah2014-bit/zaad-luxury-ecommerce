import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Deep Heritage Green (Primary)
        zaad: {
          50: "#F2F7F4",
          100: "#E3EFE8",
          200: "#C4DEC4",
          300: "#9EBE9E",
          400: "#5D8A5E",
          500: "#366B40",
          600: "#22532B",
          700: "#1A4423",
          800: "#163E23", // Primary Brand Green from Logo
          900: "#0E2917",
          950: "#07160C",
        },
        // Luxury Gold (Accent)
        gold: {
          50: "#FDFBF7",
          100: "#FAF4E6",
          200: "#F2E4C2",
          300: "#E8D097",
          400: "#DDB86C",
          500: "#C59B27", // Rich Luxury Gold from Logo
          600: "#AA821C",
          700: "#886515",
          800: "#694D12",
          900: "#4D380E",
          950: "#2B1E05",
        },
        // Olive Green (Secondary)
        olive: {
          50: "#F6F8F5",
          100: "#EBEEE7",
          200: "#D7DECFC",
          300: "#BBC9B1",
          400: "#98AC8A",
          500: "#758E66",
          600: "#5B714E",
          700: "#47573E",
          800: "#3A4633",
          900: "#2F382A",
        },
        // Warm Alabaster & Luxury Neutrals
        ivory: {
          50: "#FCFAF7",
          100: "#FAF8F5", // Warm Ivory Background
          200: "#F4EFE8",
          300: "#ECE3D6",
          400: "#DFCFC0",
          500: "#C8B5A2",
          600: "#A6927E",
          700: "#7F6E5E",
          800: "#53483D",
          900: "#2C2620",
        },
        sand: {
          50: "#FBF9F5",
          100: "#F5F0E6",
          200: "#EBE0CC",
          300: "#DFCDAE",
          400: "#CFB68C",
          500: "#B89B6C",
          600: "#9B7D4E",
          700: "#785E39",
          800: "#554228",
          900: "#362919",
        },
        charcoal: {
          800: "#1A221E",
          900: "#121814", // Obsidian Charcoal
          950: "#0A0E0C",
        }
      },
      fontFamily: {
        arabic: ["var(--font-ibm-plex-arabic)", "Alexandria", "Noto Sans Arabic", "sans-serif"],
        display: ["var(--font-alexandria)", "var(--font-ibm-plex-arabic)", "sans-serif"],
        serif: ["var(--font-amiri)", "Playfair Display", "serif"],
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(22, 62, 35, 0.08)',
        'luxury-hover': '0 25px 50px -12px rgba(22, 62, 35, 0.16)',
        'gold-glow': '0 0 25px rgba(197, 155, 39, 0.25)',
        'gold-glow-lg': '0 0 40px rgba(197, 155, 39, 0.35)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-up': 'fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'shimmer': 'shimmer 2.5s infinite linear',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
} satisfies Config;
