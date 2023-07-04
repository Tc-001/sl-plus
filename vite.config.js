import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import lightningcss from "vite-plugin-lightningcss";

export default defineConfig({
	plugins: [
		solidPlugin(),
		lightningcss({
			browserslist: ">= 0.25%",
		}),
	],
	server: {
		port: 3000,
	},
	build: {
		target: "esnext",
		sourcemap: true,
	},
	resolve: {
		conditions: ["development", "browser"],
	},
});
