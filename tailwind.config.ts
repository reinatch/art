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
            'xs': {'max': '599px'},    // Under 600px
            'sm': '600px',             // 600px and up (default sm)
            'md': '768px',             // 768px and up (default md)
            'lg': '1024px',            // 1024px and up (default lg)
            'xl': '1200px',            // 1200px and up
            '2xl': '1400px',           // 1400px and up
            '3xl': '1600px',           // 1600px and up
            '4xl': '1920px',           // 1920px and up
            '5xl': '2000px',           // 2000px and up
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
          intl: ["var(--C)"],
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
          'teams': ['min(max(0.5vw, 10px), 1.0rem)', { lineHeight: 'min(max(0.8vw, 13px), 1.4rem)' }],
  
          // Small screen adjustments (using larger vw values and still controlling with min/max)
          'rodape-sm': ['min(max(1vw, 12px), 1.6rem)', { lineHeight: 'min(max(1.6vw, 18px), 2rem)' }],
          'corpo-b-sm': ['min(max(2vw, 14px), 2.2rem)', { lineHeight: 'min(max(2.2vw, 18px), 2.5rem)' }],
          'corpo-a-sm': ['min(max(2.2vw, 16px), 2.4rem)', { lineHeight: 'min(max(2.4vw, 20px), 2.75rem)' }],
          'destaque-sm': ['min(max(3.2vw, 18px), 3.5rem)', { lineHeight: 'min(max(3.5vw, 24px), 4rem)' }],
          'teams-sm': ['min(max(0.9vw, 12px), 1.2rem)', { lineHeight: 'min(max(0.9vw, 13px), 1.5rem)' }],
  
          // Medium screen adjustments
          'rodape-md': ['min(max(1.2vw, 12px), 1.8rem)', { lineHeight: 'min(max(1.8vw, 18px), 2.25rem)' }],
          'corpo-b-md': ['min(max(2.2vw, 14px), 2.4rem)', { lineHeight: 'min(max(2.4vw, 18px), 2.75rem)' }],
          'corpo-a-md': ['min(max(2.5vw, 16px), 2.75rem)', { lineHeight: 'min(max(2.75vw, 20px), 3rem)' }],
          'destaque-md': ['min(max(3.5vw, 18px), 3.75rem)', { lineHeight: 'min(max(3.75vw, 24px), 4.25rem)' }],
          'teams-md': ['min(max(0.9vw, 10px), 1.2rem)', { lineHeight: 'min(max(1.0vw, 14px), 1.6rem)' }],
  
          // Large screen adjustments
          'rodape-lg': ['min(max(1.5vw, 14px), 2rem)', { lineHeight: 'min(max(2vw, 20px), 2.5rem)' }],
          'corpo-b-lg': ['min(max(2.5vw, 16px), 2.75rem)', { lineHeight: 'min(max(2.75vw, 20px), 3rem)' }],
          'corpo-a-lg': ['min(max(3vw, 18px), 3.25rem)', { lineHeight: 'min(max(3.25vw, 24px), 3.5rem)' }],
          'destaque-lg': ['min(max(4vw, 20px), 4.25rem)', { lineHeight: 'min(max(4.25vw, 28px), 4.5rem)' }],
          'teams-lg': ['min(max(1.0vw, 11px), 1.4rem)', { lineHeight: 'min(max(1.2vw, 16px), 1.7rem)' }],
  
          // Extra large screen adjustments (1200px)
          'rodape-xl': ['min(max(1.8vw, 16px), 2.2rem)', { lineHeight: 'min(max(2.2vw, 22px), 2.5rem)' }],
          'corpo-b-xl': ['min(max(3vw, 18px), 3.25rem)', { lineHeight: 'min(max(3.25vw, 24px), 3.5rem)' }],
          'corpo-a-xl': ['min(max(3.5vw, 20px), 3.75rem)', { lineHeight: 'min(max(3.75vw, 26px), 4rem)' }],
          'destaque-xl': ['min(max(4.5vw, 22px), 4.75rem)', { lineHeight: 'min(max(4.75vw, 30px), 5rem)' }],
          'teams-1200': ['min(max(1.0vw, 15px), 1.5rem)', { lineHeight: 'min(max(1.3vw, 17px), 1.95rem)' }],
          
          // 2XL screen adjustments (1400px)
          'rodape-2xl': ['min(max(2vw, 17px), 2.4rem)', { lineHeight: 'min(max(2.4vw, 23px), 2.75rem)' }],
          'corpo-b-2xl': ['min(max(3.2vw, 19px), 3.5rem)', { lineHeight: 'min(max(3.5vw, 25px), 3.75rem)' }],
          'corpo-a-2xl': ['min(max(3.7vw, 21px), 4rem)', { lineHeight: 'min(max(4vw, 27px), 4.25rem)' }],
          'destaque-2xl': ['min(max(5vw, 24px), 5.75rem)', { lineHeight: 'min(max(5.25vw, 35px), 5.5rem)' }],
          'teams-1400': ['min(max(1.0vw, 13px), 1.5rem)', { lineHeight: 'min(max(1.35vw, 17px), 1.95rem)' }],
          
          // 3XL screen adjustments (1600px)
          'rodape-3xl': ['min(max(2.2vw, 18px), 2.6rem)', { lineHeight: 'min(max(2.6vw, 24px), 3rem)' }],
          'corpo-b-3xl': ['min(max(3.4vw, 20px), 3.75rem)', { lineHeight: 'min(max(3.75vw, 26px), 4rem)' }],
          'corpo-a-3xl': ['min(max(3.9vw, 22px), 4.25rem)', { lineHeight: 'min(max(4.25vw, 28px), 4.5rem)' }],
          'destaque-3xl': ['min(max(5.2vw, 25px), 6rem)', { lineHeight: 'min(max(5.5vw, 36px), 6.25rem)' }],
          'teams-1600': ['min(max(1.0vw, 13px), 1.5rem)', { lineHeight: 'min(max(1.3vw, 17px), 1.9rem)' }],
          
          // 4XL screen adjustments (1920px)
          'rodape-4xl': ['min(max(2.4vw, 19px), 2.8rem)', { lineHeight: 'min(max(2.8vw, 25px), 3.25rem)' }],
          'corpo-b-4xl': ['min(max(3.6vw, 21px), 4rem)', { lineHeight: 'min(max(4vw, 27px), 4.25rem)' }],
          'corpo-a-4xl': ['min(max(4.1vw, 23px), 4.5rem)', { lineHeight: 'min(max(4.5vw, 29px), 4.75rem)' }],
          'destaque-4xl': ['min(max(5.4vw, 26px), 6.25rem)', { lineHeight: 'min(max(5.75vw, 37px), 6.5rem)' }],
          'teams-1920': ['min(max(1.0vw, 14px), 1.5rem)', { lineHeight: 'min(max(1.3vw, 18px), 1.9rem)' }],
        
          // 5XL screen adjustments (2000px)
          'rodape-5xl': ['min(max(2.5vw, 20px), 3rem)', { lineHeight: 'min(max(3vw, 26px), 3.5rem)' }],
          'corpo-b-5xl': ['min(max(3.8vw, 22px), 4.25rem)', { lineHeight: 'min(max(4.25vw, 28px), 4.5rem)' }],
          'corpo-a-5xl': ['min(max(4.3vw, 24px), 4.75rem)', { lineHeight: 'min(max(4.75vw, 30px), 5rem)' }],
          'destaque-5xl': ['min(max(5.5vw, 27px), 6.5rem)', { lineHeight: 'min(max(6vw, 38px), 6.75rem)' }],
          'teams-2000': ['min(max(0.9vw, 14px), 1.5rem)', { lineHeight: 'min(max(1.15vw, 16px), 1.9rem)' }],
        },
    },
},
  plugins: [tailwindcssAnimate],
};
export default config;
