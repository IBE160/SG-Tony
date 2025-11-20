import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Playful Nordic Color Theme - Norwegian flag-inspired colors
      colors: {
        // Primary Colors
        primary: "#E94560",     // Coral-red - Main actions, CTAs, brand identity
        secondary: "#0F3460",   // Navy - Supporting actions, headers, text
        accent: "#FFC93C",      // Yellow - Highlights, attention, playful accents

        // Semantic Colors
        success: "#06D6A0",     // Green - Positive feedback, completion states
        error: "#EF476F",       // Red - Errors, destructive actions, alerts
        info: "#3B82F6",        // Blue - Informational messages, tooltips

        // Neutral Palette
        background: "#F8F9FA",  // Light gray - App background
        surface: "#FFFFFF",     // White - Cards, modals, containers
        "text-primary": "#1F2937",     // Near-black - Main body text
        "text-secondary": "#6B7280",   // Medium gray - Captions, labels
        border: "#E5E7EB",      // Light gray - Dividers, input borders
      },

      // Custom Spacing Scale (4px base unit)
      spacing: {
        'xs': '4px',    // Extra small
        'sm': '8px',    // Small
        'md': '16px',   // Medium
        'lg': '24px',   // Large
        'xl': '32px',   // Extra large
        '2xl': '48px',  // 2X large
      },

      // Mobile-First Breakpoints (matching UX spec)
      screens: {
        'sm': '640px',    // Tablet
        'lg': '1024px',   // Desktop
        // Mobile is default (<640px, no prefix needed)
      },

      // Typography - Inter font family with system defaults
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },

      // Border Radius - 12px default (friendly, modern)
      borderRadius: {
        DEFAULT: '12px',
      },
    },
  },
  plugins: [],
};
export default config;
