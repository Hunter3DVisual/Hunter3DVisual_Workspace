import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Hunter3D cinematic palette
        hunter: {
          bg: "#050508",
          surface: "#0c0e14",
          elevated: "#111420",
          card: "#0f1219",
          border: "#1a1f2e",
          "border-bright": "#252d42",
          muted: "#2a3147",
        },
        gold: {
          DEFAULT: "#f59e0b",
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
        neon: {
          blue: "#3b82f6",
          indigo: "#E8521A",
          violet: "#f07840",
          cyan: "#06b6d4",
          green: "#10b981",
        },
        // Override indigo → Hunter orange #E8521A
        indigo: {
          50: "#fef4ef",
          100: "#fde3d3",
          200: "#fac4a3",
          300: "#f59c6b",
          400: "#f07840",
          500: "#e8521a",
          600: "#c94018",
          700: "#a83014",
          800: "#862412",
          900: "#6e1d10",
          950: "#3d0f09",
        },
        // Override violet → lighter orange for chart secondary / gradients
        violet: {
          50: "#fff8f4",
          100: "#ffeedd",
          200: "#ffd8bb",
          300: "#ffbb8a",
          400: "#f5a87a",
          500: "#f07840",
          600: "#e8521a",
          700: "#c94018",
          800: "#a83014",
          900: "#8a2510",
          950: "#4a1208",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
        mono: ["var(--font-geist-mono)", ...fontFamily.mono],
        display: ["var(--font-display)", ...fontFamily.sans],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "hunter-grid":
          "linear-gradient(rgba(232,82,26,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(232,82,26,0.03) 1px, transparent 1px)",
        "glow-indigo": "radial-gradient(ellipse at center, rgba(232,82,26,0.15) 0%, transparent 70%)",
        "glow-gold": "radial-gradient(ellipse at center, rgba(245,158,11,0.12) 0%, transparent 70%)",
      },
      backgroundSize: {
        grid: "40px 40px",
      },
      boxShadow: {
        "glow-sm": "0 0 10px rgba(232,82,26,0.2)",
        glow: "0 0 20px rgba(232,82,26,0.3)",
        "glow-lg": "0 0 40px rgba(232,82,26,0.4)",
        "glow-gold": "0 0 20px rgba(245,158,11,0.3)",
        "card-hunter": "0 1px 3px rgba(0,0,0,0.5), 0 0 0 1px rgba(26,31,46,0.8)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-left": {
          from: { opacity: "0", transform: "translateX(-16px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "border-flow": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "fade-in-left": "fade-in-left 0.3s ease-out",
        shimmer: "shimmer 2s linear infinite",
        "border-flow": "border-flow 3s ease infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
