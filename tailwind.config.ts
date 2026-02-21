import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

export default {
	content: [
		"./src/**/*.{ts,tsx}",
		"./src/**/*.module.css",
		"./src/**/*.html",
	],
	plugins: [typography],
} satisfies Config;
