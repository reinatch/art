import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
// import tailwindTypography from "@tailwindcss/typography";
const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  mode: 'jit',
  theme: {
    extend: {
        screens: {
            xs: "475px",
        },
        colors: {
            primary: {
                "100": "#FFE8F0",
                DEFAULT: "#EE2B69",
            },
            secondary: "#FBE843",
            black: {
                "100": "#333333",
                "200": "#141413",
                "300": "#7D8087",
                DEFAULT: "#000000",
            },
            white: {
                "100": "#F7F7F7",
                DEFAULT: "#FFFFFF",
            },
        },
        fontFamily: {
          intl: ["var(--suisse_intl)"],
          works: ["var(--suisse_works)"],
          mono: ["var(--suisse_mono)"],
        },
        // borderRadius: {
        //     lg: "var(--radius)",
        //     md: "calc(var(--radius) - 2px)",
        //     sm: "calc(var(--radius) - 4px)",
        // },
        fontSize: {
          // Default font size using vw and max/min for better control
          'rodape': ['min(max(0.85vw, 12px), 1.5rem)', { lineHeight: 'min(max(1.5vw, 18px), 2rem)' }],
          'corpo-b': ['min(max(1.75vw, 14px), 2rem)', { lineHeight: 'min(max(2vw, 18px), 2.5rem)' }],
          'corpo-a': ['min(max(2vw, 16px), 2.25rem)', { lineHeight: 'min(max(2.25vw, 20px), 2.75rem)' }],
          'destaque': ['min(max(3vw, 18px), 3.5rem)', { lineHeight: 'min(max(3.25vw, 24px), 4rem)' }],
  
          // Small screen adjustments (using larger vw values and still controlling with min/max)
          'rodape-sm': ['min(max(1vw, 12px), 1.6rem)', { lineHeight: 'min(max(1.6vw, 18px), 2rem)' }],
          'corpo-b-sm': ['min(max(2vw, 14px), 2.2rem)', { lineHeight: 'min(max(2.2vw, 18px), 2.5rem)' }],
          'corpo-a-sm': ['min(max(2.2vw, 16px), 2.4rem)', { lineHeight: 'min(max(2.4vw, 20px), 2.75rem)' }],
          'destaque-sm': ['min(max(3.2vw, 18px), 3.5rem)', { lineHeight: 'min(max(3.5vw, 24px), 4rem)' }],
  
          // Medium screen adjustments
          'rodape-md': ['min(max(1.2vw, 12px), 1.8rem)', { lineHeight: 'min(max(1.8vw, 18px), 2.25rem)' }],
          'corpo-b-md': ['min(max(2.2vw, 14px), 2.4rem)', { lineHeight: 'min(max(2.4vw, 18px), 2.75rem)' }],
          'corpo-a-md': ['min(max(2.5vw, 16px), 2.75rem)', { lineHeight: 'min(max(2.75vw, 20px), 3rem)' }],
          'destaque-md': ['min(max(3.5vw, 18px), 3.75rem)', { lineHeight: 'min(max(3.75vw, 24px), 4.25rem)' }],
  
          // Large screen adjustments
          'rodape-lg': ['min(max(1.5vw, 14px), 2rem)', { lineHeight: 'min(max(2vw, 20px), 2.5rem)' }],
          'corpo-b-lg': ['min(max(2.5vw, 16px), 2.75rem)', { lineHeight: 'min(max(2.75vw, 20px), 3rem)' }],
          'corpo-a-lg': ['min(max(3vw, 18px), 3.25rem)', { lineHeight: 'min(max(3.25vw, 24px), 3.5rem)' }],
          'destaque-lg': ['min(max(4vw, 20px), 4.25rem)', { lineHeight: 'min(max(4.25vw, 28px), 4.5rem)' }],
  
          // Extra large screen adjustments
          'rodape-xl': ['min(max(1.8vw, 16px), 2.2rem)', { lineHeight: 'min(max(2.2vw, 22px), 2.5rem)' }],
          'corpo-b-xl': ['min(max(3vw, 18px), 3.25rem)', { lineHeight: 'min(max(3.25vw, 24px), 3.5rem)' }],
          'corpo-a-xl': ['min(max(3.5vw, 20px), 3.75rem)', { lineHeight: 'min(max(3.75vw, 26px), 4rem)' }],
          'destaque-xl': ['min(max(4.5vw, 22px), 4.75rem)', { lineHeight: 'min(max(4.75vw, 30px), 5rem)' }],
          'destaque-2xl': ['min(max(5vw, 24px), 5.75rem)', { lineHeight: 'min(max(5.25vw, 35px), 5.5rem)' }],
        },
    },
},
  plugins: [tailwindcssAnimate],
};
export default config;
