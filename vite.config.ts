import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
	server: {
		hmr: true,
		port: 2002,
	},
	base: "./",
	plugins: [vue({})],
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: '@import "./src/assets/scss/all.scss";',
			},
		},
	},
});
