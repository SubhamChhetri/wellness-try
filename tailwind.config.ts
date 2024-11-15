import type { Config } from "tailwindcss";

const config: Config = {
	darkMode: ["class"],
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				"primary": '#95A0EF',
				"primary-50": '#E6E8FB',
				"primary-100": '#DDE1FA',
				"primary-200": '#D2D7F8',
				"primary-300": '#C3C9F6',
				"primary-400": '#B0B7F3',
				"primary-600": '#6272E7',
				"primary-700": '#374BE1',
				"primary-800": '#1F34CF',
				"primary-900": '#1B2CB0',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
};
export default config;
