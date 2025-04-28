import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
		extend: {
			animation: {
				'pulse-mic': 'pulseMic 2s infinite',
			  },
			  keyframes: {
				pulseMic: {
				  '0%, 100%': { transform: 'scale(1)', opacity: '1' },
				  '50%': { transform: 'scale(1.1)', opacity: '0.8' },
				},
			  },
			colors: {
				primary: {
					"100": "#178AB8",
					DEFAULT: "#178AB8",
				},
				secondary: "#6E5EE5",
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
				worksans: ['Work Sans', 'sans-serif'],
			},
		},
	},
  plugins: [],
} satisfies Config;
