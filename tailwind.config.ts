import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "#F6F7FA",
        ink: "#020203",
        panel: "#FFFFFF",
        line: "#E2E4EA",
        accent: "#5B5FEF",
        accent2: "#FFB454",
        muted: "#6B7080",
        bloom: {
          recordar: "#93C5FD",
          comprender: "#60A5FA",
          aplicar: "#34D399",
          analizar: "#10B981",
          evaluar: "#A78BFA",
          crear: "#7C3AED",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        cell: "6px",
      },
    },
  },
  plugins: [],
};
export default config;
