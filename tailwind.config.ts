import type { Config } from "tailwindcss";
import daisyui from "daisyui";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        clanlight: {
          primary: "#d97706",
          "primary-content": "#1f1300",
          secondary: "#0f766e",
          "secondary-content": "#ecfeff",
          accent: "#6d28d9",
          "accent-content": "#f5f3ff",
          neutral: "#1f2937",
          "neutral-content": "#f9fafb",
          "base-100": "#f8f5f0",
          "base-200": "#eee7dd",
          "base-300": "#e5dacb",
          "base-content": "#1f2937",
          info: "#0ea5e9",
          success: "#16a34a",
          warning: "#f59e0b",
          error: "#dc2626",
        },
      },
    ],
  },
} satisfies Config;
