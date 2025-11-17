import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
	content: [
		"./src/**/*.{ts,tsx}",
		"./src/**/*.module.css"
	],
	plugins: [tailwindcssAnimate],
} satisfies Config;
