import type { Config } from "tailwindcss";

/**
 * NOTA: Este proyecto usa Tailwind CSS v4, donde la mayoría de la configuración
 * del tema vive en CSS (src/app/globals.css) mediante @theme inline.
 * Este archivo se mantiene como referencia/documentación de los tokens.
 */
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        "primary-hover": "var(--primary-hover)",
        "primary-light": "var(--primary-light)",
        secondary: "var(--secondary)",
        "secondary-elevated": "var(--secondary-elevated)",
        "accent-gold": "var(--accent-gold)",
        dark: "var(--dark)",
        body: "var(--body)",
        muted: "var(--muted)",
        "bg-light": "var(--bg-light)",
        "bg-warm": "var(--bg-warm)",
        "text-on-dark": "var(--text-on-dark)",
        "text-on-dark-muted": "var(--text-on-dark-muted)",
        whatsapp: "var(--whatsapp)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        heading: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "16px",
        xl: "24px",
        "2xl": "32px",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(0,0,0,0.04)",
        md: "0 4px 6px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.04)",
        lg: "0 10px 15px rgba(0,0,0,0.07), 0 4px 6px rgba(0,0,0,0.04)",
        xl: "0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)",
        focus: "0 0 0 3px rgba(255,107,53,0.3)",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
    },
  },
  plugins: [],
};

export default config;
