import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        water: {
          50: "var(--water-50)",
          500: "var(--water-500)",
          900: "var(--water-900)",
        },
        green: {
          50: "var(--green-50)",
          500: "var(--green-500)",
          900: "var(--green-900)",
        },
        gold: {
          50: "var(--gold-50)",
          100: "var(--gold-100)",
          500: "var(--gold-500)",
        },
        tan: { 700: "var(--tan-700)" },
        terracotta: { 500: "var(--terracotta-500)" },
        brown: { 900: "var(--brown-900)" },
        ink: "var(--ink)",
        page: "var(--page-bg)",
        status: {
          aktif: "var(--status-aktif)",
          berkembang: "var(--status-berkembang)",
          persiapan: "var(--status-persiapan)",
        },
      },
      fontFamily: {
        gontserrat: ["var(--font-gontserrat)", "sans-serif"],
        beautique: ["var(--font-beautique)", "sans-serif"],
        "beautique-condensed": ["var(--font-beautique-condensed)", "sans-serif"],
      },
      maxWidth: {
        content: "1200px",
      },
    },
  },
  plugins: [],
};
export default config;