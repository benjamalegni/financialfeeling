import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'], // Set Inter as the default sans-serif font
      },
      colors: {
        // Define a color palette inspired by n8n.io's sober and professional look
        // These are example colors, you might need to adjust them by inspecting n8n.io
        'n8n-dark': '#0D0D0D', // Very dark (almost black) for backgrounds
        'n8n-surface': '#1A1A1A', // Slightly lighter dark for cards, input fields
        'n8n-border': '#333333', // For borders
        'n8n-text-primary': '#E0E0E0', // Light gray for primary text
        'n8n-text-secondary': '#A0A0A0', // Medium gray for secondary text
        'n8n-accent': '#569CD6', // A calm blue for accents, links, and highlights
        'n8n-accent-hover': '#6BAEFD', // Lighter blue for hover states
        'n8n-button': '#333333',
        'n8n-button-hover': '#454545',
        // You can add more specific colors as needed, e.g., for success, error, warning states
        'n8n-success': '#38A169', // Green
        'n8n-error': '#E53E3E',   // Red
        'n8n-warning': '#DD6B20', // Orange
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
