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
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        accent: "var(--accent)",
      },
      fontSize: {
        xxs: "0.25rem", // 4px
        xs: "0.5rem", // 8px
        sm: "0.75rem", // 12px
        base: "1rem", // 16px
        lg: "1.25rem", // 20px
        xl: "1.5rem", // 24px
        "2xl": "1.75rem", // 28px
        "3xl": "2rem", // 32px
        "4xl": "2.25rem", // 36px
        "5xl": "2.5rem", // 40px
        "6xl": "2.75rem", // 48px
      },
    },
  },
  plugins: [],
};

export default config;